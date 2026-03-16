export const dynamic = 'force-dynamic'

import NextAuth from 'next-auth'
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
      if (!user) throw new Error('Email atau password salah')
      if (user.status !== 'active') throw new Error('Akun belum aktif')

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

const handler = NextAuth({
  providers,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
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
          if (existing.status !== 'active') return false
          await prisma.user.update({
            where: { id: existing.id },
            data: { avatar: picture ?? existing.avatar, lastSeenAt: new Date() },
          })
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'user'
      }
      return token
    },
    async session({ session, token }) {
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
    error(error) {
      console.error('NextAuth error', error)
    },
  },
})

export { handler as GET, handler as POST }
