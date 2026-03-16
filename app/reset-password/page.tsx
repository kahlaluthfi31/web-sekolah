'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, Loader2, Mail, KeyRound } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) setEmail(emailParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Konfirmasi password tidak cocok')
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage('Password berhasil direset. Silakan login kembali.')
        setTimeout(() => router.push('/login'), 1200)
      } else {
        setStatus('error')
        setMessage(data.message || 'Gagal reset password')
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
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
        <div className="relative hidden lg:flex lg:w-1/2 bg-[#2F9BE9] items-center justify-center">
          <div className="absolute inset-0 bg-white/5" />
          <div className="relative w-full h-full min-h-155 flex items-center justify-center p-10">
            <Image
              src="/assets/login-illustration.svg"
              alt="Reset password illustration"
              fill
              className="object-contain drop-shadow-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 px-8 sm:px-12 py-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-sm text-gray-600 mt-2">Masukkan password baru kamu</p>
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
              <label className="text-xs font-semibold text-gray-700">Email</label>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Mail className="w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@contoh.com"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Kode (6 digit)</label>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <KeyRound className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\\d{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Password baru</label>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Lock className="w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Konfirmasi password</label>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Lock className="w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
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
              {loading ? 'Memproses...' : 'Reset password'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Kembali ke{' '}
            <Link href="/login" className="text-[#2F9BE9] hover:underline">halaman login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
