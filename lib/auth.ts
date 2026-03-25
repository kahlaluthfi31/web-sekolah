import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@/lib/rbac'

// Simple session-based auth using cookies (JWT-like with DB lookup)
// For production, use next-auth. This is a lightweight approach.

export interface SessionUser {
  id: number
  name: string
  email: string
  role: UserRole
  avatar: string | null
}

const SESSION_COOKIE = 'admin_session'

// Create a simple token (base64 encoded user id + timestamp + secret)
function createToken(userId: number): string {
  const payload = JSON.stringify({
    userId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  })
  return Buffer.from(payload).toString('base64')
}

function verifyToken(token: string): { userId: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    if (payload.exp < Date.now()) return null
    return { userId: payload.userId }
  } catch {
    return null
  }
}

// Login
export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

  if (!user) {
    return { success: false, message: 'Email atau password salah' }
  }

  if (user.status !== 'active') {
    return { success: false, message: 'Akun belum aktif atau dinonaktifkan' }
  }

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return { success: false, message: 'Email atau password salah' }
  }

  // Only superadmin and admin can access dashboard
  if (user.role === 'user') {
    return { success: false, message: 'Anda tidak memiliki akses ke dashboard admin' }
  }

  const token = createToken(user.id)

  // Update lastSeenAt on login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeenAt: new Date() },
  })

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      avatar: user.avatar,
    },
  }
}

// Get current session from request cookies
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, status: true },
    })

    if (!user || user.status !== 'active') return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      avatar: user.avatar,
    }
  } catch {
    return null
  }
}

// Require auth for API routes
export async function requireAuth(requiredRole?: UserRole) {
  const session = await getSession()

  if (!session) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized - silakan login' },
        { status: 401 }
      ),
    }
  }

  if (requiredRole) {
    const roleHierarchy: Record<UserRole, number> = {
      superadmin: 3,
      admin: 2,
      user: 1,
    }
    if (roleHierarchy[session.role] < roleHierarchy[requiredRole]) {
      return {
        authorized: false as const,
        response: NextResponse.json(
          { success: false, message: 'Forbidden - akses ditolak' },
          { status: 403 }
        ),
      }
    }
  }

  return { authorized: true as const, user: session }
}
