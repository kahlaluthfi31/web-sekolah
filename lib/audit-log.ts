import { prisma } from './prisma'
import { NextRequest } from 'next/server'
import type { Prisma } from '@prisma/client'

export type AuditAction = 'CREATE' | 'EDIT' | 'DELETE'

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
    ip === '127.0.0.1' ||
    ip === '::1'
  )
}

async function resolveClientIp(request: NextRequest): Promise<string> {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const cfConnecting = request.headers.get('cf-connecting-ip')?.trim()
  const xRealIp = request.headers.get('x-real-ip')?.trim()
  const runtimeIp = (request as unknown as { ip?: string }).ip?.trim()
  const socketIp = (request as unknown as { socket?: { remoteAddress?: string } }).socket?.remoteAddress?.trim()

  let ip = forwardedFor || cfConnecting || xRealIp || runtimeIp || socketIp || 'unknown'

  if (isPrivateIp(ip) || ip === 'unknown') {
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
    if (!ip || ip === 'unknown' || isPrivateIp(ip)) {
      return { latitude: null as number | null, longitude: null as number | null }
    }

    const res = await fetch(`https://ipapi.co/${ip}/json/`, { next: { revalidate: 60 * 60 } })
    if (res.ok) {
      const data = (await res.json()) as { latitude?: number; longitude?: number }
      const latitude = typeof data.latitude === 'number' ? data.latitude : null
      const longitude = typeof data.longitude === 'number' ? data.longitude : null
      if (latitude !== null && longitude !== null) return { latitude, longitude }
    }

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

export async function recordActivityLog({
  request,
  adminEmail,
  userId,
  action,
  targetTable,
  oldData,
  newData,
}: {
  request: NextRequest
  adminEmail: string
  userId?: number
  action: AuditAction
  targetTable: string
  oldData: unknown | null
  newData: unknown | null
}) {
  try {
    // Prefer latest login activity for this user to reuse accurate IP/coords
    let ip: string | null = null
    let latitude: number | null = null
    let longitude: number | null = null

    if (userId) {
      const latestLogin = await prisma.loginActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { ipAddress: true, latitude: true, longitude: true },
      })
      ip = latestLogin?.ipAddress ?? null
      latitude = latestLogin?.latitude ?? null
      longitude = latestLogin?.longitude ?? null
    }

    if (!ip) {
      ip = await resolveClientIp(request)
    }

    if (latitude === null || longitude === null) {
      const geo = await lookupGeo(ip)
      latitude = geo.latitude
      longitude = geo.longitude
    }

  const latRounded = latitude !== null ? Number(latitude.toFixed(4)) : null
  const lonRounded = longitude !== null ? Number(longitude.toFixed(4)) : null
  const locationCoords = latRounded !== null && lonRounded !== null ? `${latRounded},${lonRounded}` : null

    await prisma.activityLog.create({
      data: {
        adminEmail,
        action,
        targetTable,
        oldData: oldData as Prisma.InputJsonValue,
        newData: newData as Prisma.InputJsonValue,
        ipAddress: ip,
        locationCoords,
      },
    })
  } catch (err) {
    console.error('Failed to record activity log', err)
  }
}
