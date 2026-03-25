import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function makeHash(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { email, code, password } = await request.json()

    if (!email || !code || !password) {
      return NextResponse.json(
        { success: false, message: 'Email, kode, dan password wajib diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    const tokenHash = makeHash(code)
    const now = new Date()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 400 }
      )
    }

    const reset = await prisma.passwordResetToken.findFirst({ where: { userId: user.id, tokenHash } })

    if (!reset || reset.usedAt || reset.expiresAt < now) {
      return NextResponse.json(
        { success: false, message: 'Kode tidak valid atau kedaluwarsa' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, status: 'active' },
    })

    await prisma.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: now },
    })

    // Invalidate other tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null, id: { not: reset.id } },
    })

    return NextResponse.json({ success: true, message: 'Password berhasil direset' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
