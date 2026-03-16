import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendResetCodeEmail } from '@/lib/mail'
import crypto from 'crypto'

function makeHash(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function generateSixDigitCode() {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email wajib diisi' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always respond success to avoid email enumeration
  const genericMessage = 'Jika email terdaftar, kode reset password sudah dikirim.'

    if (!user) {
      return NextResponse.json({ success: true, message: genericMessage })
    }

  const code = generateSixDigitCode()
  const tokenHash = makeHash(code)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 menit

    // One active token per user
    // @ts-expect-error Prisma client needs regenerate after schema change
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
    // @ts-expect-error Prisma client needs regenerate after schema change
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    })

    // Send email if SMTP config available
    let emailSent = false
    try {
      const res = await sendResetCodeEmail(user.email, code)
      emailSent = res.sent
    } catch (err) {
      console.error('Failed to send reset code email:', err)
    }

    return NextResponse.json({
      success: true,
      message: genericMessage,
      emailSent,
      // kembalikan kode hanya saat development untuk memudahkan testing
      ...(process.env.NODE_ENV !== 'production' ? { code } : {}),
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
