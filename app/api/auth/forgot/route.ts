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
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail) {
      return NextResponse.json(
        { success: false, message: 'Email wajib diisi' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email tidak terdaftar' },
        { status: 404 }
      )
    }

    const successMessage = 'Kode reset password sudah dikirim ke email Anda.'

  const code = generateSixDigitCode()
  const tokenHash = makeHash(code)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 menit

    // One active token per user
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
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
      message: successMessage,
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
