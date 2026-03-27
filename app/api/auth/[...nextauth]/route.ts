export const dynamic = 'force-dynamic'

import NextAuth from 'next-auth'
import type { Account, Profile, Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

const providers = [
  // Google is optional — only register when env vars are present to avoid runtime JSON errors
  ...(googleClientId && googleClientSecret
    ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ]
    : []),
  CredentialsProvider({
    name: 'Email & Password',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined
      const password = credentials?.password as string | undefined

      if (!email || !password) return null

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) throw new Error('Email belum terdaftar. Silakan daftar atau login dengan Google.')
      if (user.status !== 'active') throw new Error('Akun belum aktif atau dinonaktifkan.')

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) throw new Error('Email atau password salah')

      return {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      }
    },
  }),
]

if (!googleClientId || !googleClientSecret) {
  console.warn('Google OAuth tidak diaktifkan: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET belum di-set')
}

export const authOptions = {
  providers,
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Tangani /api/auth/error agar dikirim ke login/register dengan pesan error
      const errorParam = (() => {
        try {
          const u = new URL(url, baseUrl)
          return u.pathname.startsWith('/api/auth/error') ? u.searchParams.get('error') : null
        } catch {
          return null
        }
      })()

      if (errorParam) {
        return `${baseUrl}/login?error=${encodeURIComponent(errorParam)}`
      }

      // default: allow NextAuth defaults (same-origin only), preserve relative URLs with query
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
    async signIn({ user, account, profile }: { user: User; account?: Account | null; profile?: Profile | null }) {
      if (account?.provider === 'google') {
        try {
          const email = user.email
          if (!email) return false

          const existing = await prisma.user.findUnique({ where: { email } })
          const picture = (profile as { picture?: string } | null)?.picture || null

          if (!existing) {
            // User baru via Google -> otomatis aktif sebagai user biasa
            await prisma.user.create({
              data: {
                name: user.name || 'Pengguna Google',
                email,
                password: await bcrypt.hash('google-oauth', 10),
                role: 'user',
                status: 'active',
                avatar: picture,
              },
            })
          } else {
            // Jika sebelumnya non-aktif, aktifkan kembali saat login via Google
            const ensureActive = existing.status !== 'active'
            await prisma.user.update({
              where: { id: existing.id },
              data: {
                avatar: picture ?? existing.avatar,
                lastSeenAt: new Date(),
                ...(ensureActive ? { status: 'active' } : {}),
              },
            })
          }

          return true
        } catch (err) {
          console.error('Google sign-in error', err)
          return false
        }
      }

      return true
    },
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      try {
        // Saat login, paksa pakai ID user di database (bukan sub Google yang panjang)
        if (user?.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
          if (dbUser) {
            token.sub = String(dbUser.id)
            token.role = dbUser.role
          }
        } else if (user?.id) {
          // fallback: credentials login sudah mengirim id numerik sebagai string
          token.sub = user.id
          token.role = (user as { role?: string }).role || token.role
        }
      } catch (err) {
        console.error('JWT callback error', err)
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        const userRole = (token as { role?: string }).role || 'user'
        const sessionUser = session.user || {}

        return {
          ...session,
          user: {
            ...sessionUser,
            id: token.sub || '',
            role: userRole,
          } as typeof session.user & { id: string; role: string },
        }
      } catch (error) {
        console.error('Session callback error', error)
        return session
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-me',
  trustHost: true,
  logger: {
    error(error: unknown) {
      console.error('NextAuth error', error)
    },
  },
}

const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

export const GET = handlers.GET
export const POST = handlers.POST
export { auth, signIn, signOut }
