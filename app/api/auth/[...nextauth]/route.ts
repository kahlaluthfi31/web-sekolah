export const dynamic = 'force-dynamic'

import NextAuth, { type NextAuthConfig } from 'next-auth'
import type { Account, Profile, Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

const providers = [
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

const authConfig: NextAuthConfig = {
  providers,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      try {
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

        if (url.startsWith('/')) return `${baseUrl}${url}`
        if (url.startsWith(baseUrl)) return url
        return baseUrl
      } catch (error) {
        console.error('Redirect callback error', error)
        return baseUrl
      }
    },
    async signIn({ user, account, profile }: { user: User; account?: Account | null; profile?: Profile | null }) {
      if (account?.provider === 'google') {
        try {
          const email = user.email
          if (!email) return false

          const existing = await prisma.user.findUnique({ where: { email } })
          const picture = (profile as { picture?: string } | null)?.picture || null

          if (!existing) {
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
        if (user?.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
          if (dbUser) {
            token.sub = String(dbUser.id)
            token.role = dbUser.role
            token.email = dbUser.email
          }
        } else if (user?.id) {
          token.sub = user.id
          token.role = (user as { role?: string }).role || token.role || 'user'
          token.email = user.email
        }
      } catch (err) {
        console.error('JWT callback error', err)
        if (user?.email) {
          token.email = user.email
          token.role = 'user'
        }
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        const userRole = (token as { role?: string }).role || 'user'
        const userEmail = (token as { email?: string }).email || ''
        const userId = token.sub || ''

        type SessionUser = Session['user'] & { id: string; role?: string }

        const buildUser = (base?: Session['user'] | null): SessionUser => ({
          id: userId,
          email: userEmail,
          name: base?.name ?? (token as { name?: string }).name ?? 'User',
          image: base?.image ?? null,
          role: userRole,
        })

        session.user = session.user ? buildUser(session.user) : buildUser()

        return session
      } catch (error) {
        console.error('Session callback error', error)
        return {
          ...session,
          user: {
            ...(session.user || {}),
            id: token.sub || '',
            email: (token as { email?: string }).email || '',
          },
        }
      }
    },
    async signOut() {
      try {
        return true
      } catch (error) {
        console.error('Sign out error', error)
        return true
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

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig)

export { authConfig as authOptions }
