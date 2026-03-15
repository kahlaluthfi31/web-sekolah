'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { GraduationCap, UserCircle2, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react'

//  Types 
interface StructureGroup {
  positionName: string
  groupOrder: number
  members: {
    id: number
    name: string
    photo: string | null
    education: string | null
    nip: string | null
    orderPosition: number
  }[]
}

interface PrincipalHistory {
  id: number
  teacherId: number
  role: 'KEPALA_SEKOLAH' | 'WAKIL_KEPALA_SEKOLAH'
  bidang: string | null
  startYear: number
  endYear: number | null
  note: string | null
  endReason: string | null
  teacher: { id: number; name: string; photo: string | null }
}

//  SectionHeader 
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block">{eyebrow}</span>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
      {subtitle && <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed text-sm">{subtitle}</p>}
    </div>
  )
}

//  Skeleton 
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className ?? ''}`} />
}

//  OrgNode — foto portrait kotak, tanpa mahkota
function OrgNode({ name, photo }: { name: string; photo: string | null }) {
  const [broken, setBroken] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Foto portrait kotak rounded */}
      <div className="w-20 h-24 rounded-xl overflow-hidden border border-gray-200 bg-[#0092DD]/10 shrink-0">
        {photo && !broken ? (
          <Image
            src={photo}
            alt={name}
            width={80}
            height={96}
            className="w-full h-full object-cover object-top"
            unoptimized
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#0092DD]">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {/* Nama saja */}
      <p className="text-xs font-semibold text-gray-900 leading-snug text-center max-w-28 line-clamp-2">{name}</p>
    </div>
  )
}

//  Section 1: Struktur Organisasi 
function StrukturSection() {
  const [groups, setGroups] = useState<StructureGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/school-structure')
      .then(r => r.json())
      .then(j => { if (j.success) setGroups(j.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Organisasi Sekolah"
          title="Struktur Organisasi"
          subtitle="Susunan organisasi tenaga pendidik dan kependidikan SMK Negeri 1 Ciamis."
        />
        {loading ? (
          <div className="flex flex-col items-center gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex flex-col items-center gap-3 w-full">
                <Skeleton className="h-7 w-36 rounded-full" />
                <div className="flex gap-6 justify-center">
                  {Array.from({ length: i }).map((_, j) => (
                    <div key={j} className="flex flex-col items-center gap-2">
                      <Skeleton className="w-20 h-24 rounded-xl" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16">
            <UserCircle2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Belum ada data struktur sekolah.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {groups.map((group, gIdx) => {
              const isLast = gIdx === groups.length - 1
              const memberCount = group.members.length

              return (
                <div key={group.positionName} className="flex flex-col items-center w-full">

                  {/* Garis dari member level atas ke badge — hanya jika bukan level pertama */}
                  {gIdx > 0 && <div className="w-px h-8 bg-[#0092DD]/30" />}

                  {/* Badge label posisi */}
                  <div className="px-5 py-1.5 bg-blue-50 border border-[#0092DD]/25 rounded-full text-[11px] font-bold text-[#0092DD] uppercase tracking-wider">
                    {group.positionName}
                  </div>

                  {/* Garis dari badge ke member — selalu ada */}
                  <div className="w-px h-6 bg-[#0092DD]/30" />

                  {/* Row anggota */}
                  {memberCount === 1 ? (
                    /* Single member — langsung tanpa garis horizontal */
                    <OrgNode
                      name={group.members[0].name}
                      photo={group.members[0].photo}
                    />
                  ) : (
                    /* Multiple members — T-junction connector yang benar */
                    <div className="flex flex-col items-center w-full">
                      {/* Baris garis horizontal — satu baris penuh lebar anggota */}
                      <div className="flex items-center w-full justify-center">
                        {group.members.map((m, mIdx) => {
                          const isFirstMember = mIdx === 0
                          const isLastMember = mIdx === memberCount - 1
                          return (
                            <div key={m.id} className="flex items-center flex-1 justify-center min-w-0">
                              {/* Garis kiri — invisible di member pertama */}
                              <div className={`flex-1 h-px ${isFirstMember ? 'invisible' : 'bg-[#0092DD]/30'}`} />
                              {/* Titik tengah — garis vertikal pendek ke bawah saja */}
                              <div className="w-px h-4 bg-[#0092DD]/30" />
                              {/* Garis kanan — invisible di member terakhir */}
                              <div className={`flex-1 h-px ${isLastMember ? 'invisible' : 'bg-[#0092DD]/30'}`} />
                            </div>
                          )
                        })}
                      </div>
                      {/* Row foto & nama */}
                      <div className="flex justify-center gap-0 w-full">
                        {group.members.map((m) => (
                          <div key={m.id} className="flex flex-col items-center px-3 flex-1">
                            <OrgNode name={m.name} photo={m.photo} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Garis ke level berikutnya — hanya jika bukan level terakhir */}
                  {!isLast && <div className="w-px h-8 bg-[#0092DD]/30 mt-2" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

//  Section 2: Riwayat Kepala Sekolah 
function RiwayatKepsekSection() {
  const [histories, setHistories] = useState<PrincipalHistory[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    fetch('/api/teachers/principal-history?role=KEPALA_SEKOLAH&limit=100')
      .then(r => r.json())
      .then(j => { if (j.success) setHistories(j.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [histories])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header: judul kiri, nav kanan */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Daftar Kepala Sekolah</h2>
            <div className="mt-1.5 w-12 h-1 bg-[#0092DD] rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#0092DD] hover:text-[#0092DD] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#0092DD] hover:text-[#0092DD] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-8" />

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-64 rounded-2xl border border-gray-100 overflow-hidden bg-white">
                <Skeleton className="w-full h-60 rounded-none rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : histories.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Belum ada data riwayat kepala sekolah.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-7 overflow-x-auto pb-3"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {histories.map((h) => {
                const isActive = h.endYear === null

                return (
                  <div
                    key={h.id}
                    className={`shrink-0 w-72 rounded-3xl overflow-hidden flex flex-col bg-white/90 backdrop-blur border transition-all duration-200 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_-18px_rgba(0,0,0,0.3)] hover:scale-[1.01] ${
                      isActive ? 'border-[#0092DD]/30' : 'border-gray-200'
                    }`}
                  >
                    {/* Foto portrait */}
                    <div className="relative w-full bg-linear-to-b from-gray-100 to-white" style={{ aspectRatio: '3/4' }}>
                      {h.teacher?.photo ? (
                        <Image
                          src={h.teacher.photo}
                          alt={h.teacher.name}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${isActive ? 'bg-[#0092DD]/8 text-[#0092DD]' : 'bg-gray-100 text-gray-300'}`}>
                          {h.teacher?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info bawah foto */}
                    <div className="flex flex-col gap-2.5 p-4 flex-1 bg-white text-center">
                      {/* Nama */}
                      <p className="font-semibold text-gray-900 text-base leading-snug whitespace-nowrap overflow-hidden text-ellipsis" title={h.teacher?.name ?? ''}>
                        {h.teacher?.name}
                      </p>

                      {/* Periode — soft bg + border + rounded-full */}
                      <div className="flex items-center justify-center gap-2">
                        {/* Tahun mulai — biru */}
                        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 shadow-[0_6px_16px_-12px_rgba(37,99,235,0.6)]">
                          {h.startYear}
                        </span>
                        {/* Tanda pemisah */}
                        <span className="text-gray-300 text-xs font-bold">-</span>
                        {/* Tahun selesai */}
                        {isActive ? (
                          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 shadow-[0_6px_16px_-12px_rgba(22,163,74,0.6)]">
                            Sekarang
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-red-50 text-red-500 border border-red-200 shadow-[0_6px_16px_-12px_rgba(239,68,68,0.6)]">
                            {h.endYear}
                          </span>
                        )}
                      </div>

                      {/* Tipe keluar / status */}
                      <p className="text-[11px] text-gray-500 leading-snug">
                        {isActive ? 'Aktif Menjabat' : (h.endReason ? h.endReason : 'Pindah Tugas')}
                      </p>

                      {/* Note / catatan */}
                      <p className="text-[11px] text-gray-400 leading-snug line-clamp-2 italic">
                        {h.note ?? 'Keterangan atau catatan'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Fade edge kiri */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-2 w-16 bg-linear-to-r from-white to-transparent pointer-events-none" />
            )}
            {/* Fade edge kanan */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-2 w-16 bg-linear-to-l from-white to-transparent pointer-events-none" />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

//  Page Root 
const FacultyPage: React.FC = () => (
  <div className="pt-20">
    <section className="bg-[#0092DD] text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold mb-3">Struktur Sekolah</h1>
        <p className="max-w-xl mx-auto text-white/80 text-sm leading-relaxed">
          Mengenal lebih dekat tenaga pendidik dan pimpinan yang mendedikasikan diri untuk kemajuan sekolah.
        </p>
      </div>
    </section>
    <div className="bg-gray-100 py-3 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-xs font-medium text-gray-500">
        <span className="text-[#0092DD] hover:underline cursor-pointer">Home</span>
        <ChevronRight className="w-3 h-3" />
        <span>Struktur Sekolah</span>
      </div>
    </div>
    <StrukturSection />
    <RiwayatKepsekSection />
  </div>
)

export default FacultyPage
