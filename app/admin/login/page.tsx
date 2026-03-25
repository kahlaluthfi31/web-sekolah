"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from 'next/link'
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center space-y-3 mb-15">
            <div className="mx-auto w-16 h-16 relative">
              <Image
                src="/images/web/logo-smkn1-ciamis.png"
                alt="SMKN 1 Ciamis"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
              <p className="text-sm text-gray-500">
                Masuk untuk mengelola website sekolah
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700"
              >
                Email
              </label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Mail className="w-4 h-4 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                  placeholder="Masukan alamat email anda"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F9BE9]">
                <Lock className="w-4 h-4 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              <span>{loading ? "Memproses..." : "Masuk"}</span>
            </button>
            <Link
              href="/"
              className="text-gray-600 text-center text-sm hover:text-blue-600"
            >
              Kembali ke beranda
            </Link>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SMK Negeri 1 Ciamis
        </p>
      </div>
    </div>
  );
}
