'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [devCode, setDevCode] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setMessage('')
  setDevCode(null)

    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message || 'Jika email terdaftar, kode reset sudah dikirim.')
        if (data.code) setDevCode(data.code as string)
        // Arahkan ke halaman input kode dengan email terisi
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        }, 600)
      } else {
        setStatus('error')
        setMessage(data.message || 'Gagal mengirim tautan reset.')
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
              alt="Forgot password illustration"
              fill
              className="object-contain drop-shadow-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 px-8 sm:px-12 py-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Lupa Password</h1>
              <p className="text-sm text-gray-600 mt-2">Masukkan email untuk menerima kode reset</p>
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@contoh.com"
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
              {loading ? 'Memproses...' : 'Kirim tautan reset'}
            </button>
          </form>

          {devCode && (
            <div className="mt-6 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-1">Kode reset (mode dev):</p>
              <p className="text-lg font-mono tracking-widest text-gray-800">{devCode}</p>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Sudah ada kode?{' '}
            <Link href={`/reset-password?email=${encodeURIComponent(email)}`} className="text-[#2F9BE9] hover:underline">Masukkan kode</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
