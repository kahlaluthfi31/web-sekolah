import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Tidak terautentikasi' },
      { status: 401 }
    )
  }

  // Refresh lastSeenAt as a heartbeat for online status
  await prisma.user.update({
    where: { id: session.id },
    data: { lastSeenAt: new Date() },
  })

  return NextResponse.json({
    success: true,
    user: session,
  })
}
