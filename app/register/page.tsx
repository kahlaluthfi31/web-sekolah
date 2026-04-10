'use client'

import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

const MAX_PASSWORD_LENGTH = 30

function RegisterContent() {
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const err = searchParams.get('error')
    if (!err) return

    const map: Record<string, string> = {
      AccessDenied: 'Akses Google ditolak. Pastikan Anda memilih akun dan izinkan akses.',
      GoogleNotRegistered: 'Email belum terdaftar. Silakan daftar menggunakan tombol Google di halaman ini.',
      OAuthAccountNotLinked: 'Email ini sudah terdaftar manual. Login dengan email & password.',
      OAuthError: 'Login Google gagal. Coba lagi atau daftar manual.',
      GoogleMissingEmail: 'Google tidak mengembalikan email. Gunakan akun lain atau daftar manual.',
    }

    const friendly = map[err] || 'Autentikasi Google gagal. Coba lagi atau daftar manual.'
    setStatus('error')
    setMessage(friendly)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length > MAX_PASSWORD_LENGTH || confirmPassword.length > MAX_PASSWORD_LENGTH) {
      setStatus('error')
      setMessage(`Password maksimal ${MAX_PASSWORD_LENGTH} karakter`)
      return
    }

    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Konfirmasi password tidak cocok')
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message || 'Registrasi berhasil.')
        setToast('Registrasi berhasil')
        setTimeout(() => setToast(null), 3000)

        // langsung login setelah register
        await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/',
        })

        setTimeout(() => {
          window.location.href = '/'
        }, 500)
      } else {
        setStatus('error')
        setMessage(data.message || 'Registrasi gagal')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('Terjadi kesalahan. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5] flex items-center justify-center py-12 px-4">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            {toast}
          </div>
        </div>
      )}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
        <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden">
          <Image
            src="/images/web/image_vector.jpg"
            alt="Register illustration"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        <div className="w-full lg:w-1/2 px-8 sm:px-12 py-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Daftar Akun</h1>
            <p className="text-sm text-gray-600 mt-2">Buat akun untuk menggunakan layanan</p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch('/api/auth/google-intent?mode=register', {
                    method: 'POST',
                    cache: 'no-store',
                    credentials: 'include',
                  })
                  if (!res.ok) {
                    throw new Error('Gagal menyimpan intent Google')
                  }
                } catch {
                  setStatus('error')
                  setMessage('Gagal menyiapkan login Google. Coba lagi atau daftar manual.')
                  return
                }

                signIn('google', { callbackUrl: '/?welcome=new' })
              }}
              className="w-full flex items-center justify-center gap-3 bg-blue-50 text-gray-800 border border-blue-100 hover:border-blue-200 hover:bg-blue-100/80 rounded-xl py-3 font-semibold transition-colors"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#4285F4] font-black text-sm shadow-sm">G</span>
              Daftar dengan Google
            </button>

            <div className="flex items-center gap-3 text-gray-400 text-xs">
              <div className="h-px flex-1 bg-gray-200" />
              <span>atau daftar manual</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {status !== 'idle' && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  status === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Nama lengkap</label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <User className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Email</label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Mail className="w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Lock className="w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  minLength={6}
                  maxLength={MAX_PASSWORD_LENGTH}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Konfirmasi Password</label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Lock className="w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  minLength={6}
                  maxLength={MAX_PASSWORD_LENGTH}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2F9BE9] text-white rounded-xl py-3 font-semibold hover:bg-[#1f7cc3] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#2F9BE9] hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f2f3f5] text-gray-600">Memuat formulir...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
