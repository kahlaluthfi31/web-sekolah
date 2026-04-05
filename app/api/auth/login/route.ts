import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isPrivateIp(ip: string | null): boolean {
  if (!ip) return true
  return (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.20.') ||
    ip.startsWith('172.21.') ||
    ip.startsWith('172.22.') ||
    ip.startsWith('172.23.') ||
    ip.startsWith('172.24.') ||
    ip.startsWith('172.25.') ||
    ip.startsWith('172.26.') ||
    ip.startsWith('172.27.') ||
    ip.startsWith('172.28.') ||
    ip.startsWith('172.29.') ||
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    ip.startsWith('169.254.') ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('fe80:') ||
    ip === '127.0.0.1' ||
    ip === '::1'
  )
}

function normalizeIp(raw: string | null | undefined): string | null {
  if (!raw) return null
  let ip = raw.trim()
  if (!ip) return null

  // x-forwarded-for entry might include port (e.g. 1.2.3.4:1234)
  if (ip.includes(':') && ip.includes('.') && !ip.startsWith('::ffff:')) {
    const parts = ip.split(':')
    if (parts.length === 2) ip = parts[0]
  }

  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }

  return ip || null
}

function firstForwardedIp(headerValue: string | null): string | null {
  if (!headerValue) return null
  const entries = headerValue.split(',').map((entry) => normalizeIp(entry)).filter(Boolean) as string[]
  if (entries.length === 0) return null
  return entries.find((candidate) => !isPrivateIp(candidate) && candidate.toLowerCase() !== 'unknown') || entries[0]
}

async function resolveClientIp(request: NextRequest): Promise<string> {
  // 1) Try forwarded headers (proxy/CDN aware)
  const forwardedFor = firstForwardedIp(request.headers.get('x-forwarded-for'))
  const cfConnecting = normalizeIp(request.headers.get('cf-connecting-ip'))
  const trueClientIp = normalizeIp(request.headers.get('true-client-ip'))
  const xRealIp = normalizeIp(request.headers.get('x-real-ip'))
  const xClientIp = normalizeIp(request.headers.get('x-client-ip'))

  // 2) Fallback to runtime fields (dev/serverless node request)
  const runtimeIp = normalizeIp((request as unknown as { ip?: string }).ip)
  const socketIp = normalizeIp((request as unknown as { socket?: { remoteAddress?: string } }).socket?.remoteAddress)

  const candidates = [cfConnecting, trueClientIp, xRealIp, xClientIp, forwardedFor, runtimeIp, socketIp].filter(Boolean) as string[]

  let ip =
    candidates.find((candidate) => !isPrivateIp(candidate) && candidate.toLowerCase() !== 'unknown') ||
    candidates[0] ||
    'unknown'

  // 3) Dev fallback only (do not overwrite real client IP logic in production)
  if (process.env.NODE_ENV !== 'production' && (isPrivateIp(ip) || ip === 'unknown')) {
    try {
      const res = await fetch('https://api.ipify.org?format=json', { next: { revalidate: 60 } })
      if (res.ok) {
        const data = (await res.json()) as { ip?: string }
        if (data.ip) ip = data.ip
      }
    } catch (err) {
      console.warn('Failed to fetch public IP for localhost', err)
    }
  }

  return ip
}

async function lookupGeo(ip: string | null) {
  try {
    if (!ip || isPrivateIp(ip)) return { latitude: null as number | null, longitude: null as number | null }

    // primary: ipapi
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { next: { revalidate: 60 * 60 } })
    if (res.ok) {
      const data = (await res.json()) as { latitude?: number; longitude?: number }
      const latitude = typeof data.latitude === 'number' ? data.latitude : null
      const longitude = typeof data.longitude === 'number' ? data.longitude : null
      if (latitude !== null && longitude !== null) return { latitude, longitude }
    }

  // fallback: ip-api (https to avoid blocked mixed content)
  const res2 = await fetch(`https://ip-api.com/json/${ip}?fields=status,lat,lon`, { next: { revalidate: 60 * 60 } })
    if (!res2.ok) return { latitude: null as number | null, longitude: null as number | null }
    const data2 = (await res2.json()) as { status?: string; lat?: number; lon?: number }
    return {
      latitude: typeof data2.lat === 'number' ? data2.lat : null,
      longitude: typeof data2.lon === 'number' ? data2.lon : null,
    }
  } catch (err) {
    console.warn('Geo lookup failed', err)
    return { latitude: null as number | null, longitude: null as number | null }
  }
}

async function extractClientInfo(request: NextRequest) {
  const ip = await resolveClientIp(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  const device = (() => {
    if (!userAgent || userAgent === 'unknown') return null
    if (/mobile/i.test(userAgent)) return 'Mobile'
    if (/tablet/i.test(userAgent)) return 'Tablet'
    if (/windows/i.test(userAgent)) return 'Windows'
    if (/macintosh|mac os x/i.test(userAgent)) return 'Mac'
    if (/linux/i.test(userAgent)) return 'Linux'
    return userAgent.slice(0, 120)
  })()

  return { ip, userAgent, device }
}

type ClientInfo = {
  userAgent?: string
  device?: string
  os?: string
  browser?: string
  latitude?: number | null
  longitude?: number | null
  chromeEmail?: string | null
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, clientInfo }: { email: string; password: string; clientInfo?: ClientInfo } =
      await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password wajib diisi' },
        { status: 400 }
      )
    }

  const result = await loginUser(email, password)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      )
    }

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: result.user,
    })

    response.cookies.set('admin_session', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    const loggedInUser = result.user

    // Catat aktivitas login (khusus admin & superadmin)
    if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin')) {
    const { ip, userAgent: serverUA, device: serverDevice } = await extractClientInfo(request)

      const userAgent = clientInfo?.userAgent || serverUA
      const device = clientInfo
        ? [clientInfo.device, clientInfo.os, clientInfo.browser]
            .filter(Boolean)
            .join(' | ')
        : serverDevice
  const latitude = clientInfo?.latitude ?? null
  const longitude = clientInfo?.longitude ?? null

  const geo = latitude !== null && longitude !== null ? { latitude, longitude } : await lookupGeo(ip)

      // Tidak perlu menunggu (fire and forget) tapi tetap await agar error terlihat di log
      await prisma.loginActivity.create({
        data: {
          userId: loggedInUser.id,
          role: loggedInUser.role,
          loginEmail: email,
          chromeEmail: clientInfo?.chromeEmail ?? null,
          ipAddress: ip,
          userAgent,
          device,
          latitude: geo.latitude,
          longitude: geo.longitude,
        },
      })
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
