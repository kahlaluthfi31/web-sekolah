import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { extractClientInfo, lookupGeo } from '@/lib/resolve-ip'

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
