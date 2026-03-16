'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function UserLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setMessage('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      // Keep callbackUrl home for now
      callbackUrl: '/',
    })

    if (result?.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setMessage('Login berhasil, mengarahkan...')
      setToast('Login berhasil')
      setTimeout(() => setToast(null), 3000)
      setTimeout(() => {
        window.location.href = result?.url || '/'
      }, 500)
    }

    setLoading(false)
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
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
        {/* Left illustration */}
        <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden">
          <Image
            src="/images/web/image_vector.jpg"
            alt="Login illustration"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        {/* Right form */}
        <div className="w-full lg:w-1/2 px-8 sm:px-12 py-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
            <p className="text-sm text-gray-600 mt-2">Selamat datang di website resmi SMKN 1 CIAMIS</p>
          </div>

          <div className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-blue-50 text-gray-800 border border-blue-100 hover:border-blue-200 hover:bg-blue-100/80 rounded-xl py-3 font-semibold transition-colors"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#4285F4] font-black text-sm shadow-sm">G</span>
              Login with Google
            </button>

            <div className="flex items-center gap-3 text-gray-400 text-xs">
              <div className="h-px flex-1 bg-gray-200" />
              <span>or</span>
              <div className="h-px flex-1 bg-gray-200" />
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
                <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukan Alamat Email Anda"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-gray-600 hover:text-blue-600">Lupa password ?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#2F9BE9] text-white rounded-xl py-3 font-semibold hover:bg-[#1f7cc3] transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Belum memiliki akun ?{' '}
              <Link href="/register" className="text-[#2F9BE9] hover:underline">Daftar disini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
