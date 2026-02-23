import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  // Clear lastSeenAt so user shows Offline immediately
  try {
    const session = await getSession()
    if (session) {
      await prisma.user.update({
        where: { id: session.id },
        data: { lastSeenAt: null },
      })
    }
  } catch {
    // ignore, proceed with logout anyway
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logout berhasil',
  })

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
