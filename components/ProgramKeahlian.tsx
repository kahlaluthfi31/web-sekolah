'use client'

import Image from 'next/image'

import React, { useEffect, useState } from 'react'
import {
  Building2, DollarSign, ShoppingCart, HandCoins,
  Monitor, Tv, Sprout, BookOpen, Cpu, Wrench,
  GraduationCap, ArrowUpRight, Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Icon mapping — berdasarkan kode jurusan                             */
/* ------------------------------------------------------------------ */
const ICON_BY_CODE: Record<string, LucideIcon> = {
  AP: Building2,    // Administrasi Perkantoran
  OTP: Building2,    // Otomatisasi & Tata Kelola Perkantoran
  AK: DollarSign,   // Akuntansi
  AKKL: DollarSign,   // Akuntansi & Keuangan Lembaga
  PM: ShoppingCart, // Pemasaran
  BDP: ShoppingCart, // Bisnis Daring & Pemasaran
  UPW: HandCoins,    // Usaha Perjalanan Wisata
  PHT: HandCoins,    // Perhotelan
  TKJ: Monitor,      // Teknik Komputer & Jaringan
  RPL: Cpu,          // Rekayasa Perangkat Lunak
  TAV: Tv,           // Teknik Audio Video
  TE: Wrench,       // Teknik Elektronika
  ATR: Sprout,       // Agribisnis Tanaman
  ATPH: Sprout,       // Agribisnis Tanaman Pangan & Hortikultura
  AGB: Sprout,       // Agrobisnis
}

function getIcon(code: string | null, name: string): LucideIcon {
  if (code) {
    const match = ICON_BY_CODE[code.toUpperCase()]
    if (match) return match
  }
  // Fallback berdasarkan kata kunci nama
  const n = name.toLowerCase()
  if (n.includes('komputer') || n.includes('jaringan')) return Monitor
  if (n.includes('perangkat lunak') || n.includes('rpl')) return Cpu
  if (n.includes('akuntansi')) return DollarSign
  if (n.includes('administrasi') || n.includes('perkantoran')) return Building2
  if (n.includes('pemasaran') || n.includes('bisnis')) return ShoppingCart
  if (n.includes('wisata') || n.includes('pariwisata')) return HandCoins
  if (n.includes('audio') || n.includes('video')) return Tv
  if (n.includes('elektronika') || n.includes('teknik')) return Wrench
  if (n.includes('agro') || n.includes('pertanian') || n.includes('tani')) return Sprout
  return GraduationCap
}

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface Major {
  id: number
  name: string
  code: string | null
  description: string | null
  image: string | null
  icon: string | null
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
const ProgramKeahlian: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/majors/list')
      .then(r => r.json())
      .then(json => { if (json.success) setMajors(json.data) })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Kompetensi Keahlian</span>
          <span className="text-xs text-gray-400">02 / 04</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0268ab] animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && majors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <BookOpen className="w-10 h-10 opacity-30" />
            <p className="text-sm">Data program keahlian belum tersedia.</p>
          </div>
        )}

        {/* Programs Grid */}
        {!loading && majors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {majors.map((major) => {
              const IconComponent = getIcon(major.code, major.name)
              return (
                <div key={major.id} className="flex gap-4 group">

                  {/* Logo / Icon */}
                  <div className="shrink-0">
                    {(major.icon || major.image) ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={major.icon || major.image!}
                          alt={major.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#0268ab] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7" strokeWidth={2} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#0268ab] mb-3 leading-tight">
                      {major.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {major.description ?? ''}
                    </p>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}

export default ProgramKeahlian
