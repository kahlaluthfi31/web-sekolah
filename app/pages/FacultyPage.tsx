'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { GraduationCap, UserCircle2, ChevronLeft, ChevronRight, Users, Award } from 'lucide-react'

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
      <div className="w-20 h-24 rounded-xl overflow-hidden border border-gray-200 bg-[#0268ab]/10 shrink-0">
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
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#0268ab]">
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
  const [zoomLevel, setZoomLevel] = useState(1)
  const viewportRef = useRef<HTMLDivElement>(null)
  const pinchStateRef = useRef<{ startDistance: number; startZoom: number } | null>(null)
  const zoomLevelRef = useRef(1)

  // keep ref in sync
  useEffect(() => { zoomLevelRef.current = zoomLevel }, [zoomLevel])

  const MIN_ZOOM = 0.7
  const MAX_ZOOM = 1.7
  const ZOOM_STEP = 0.05

  useEffect(() => {
    if (loading || groups.length === 0) return
    const el = viewportRef.current
    if (!el) return

    // ── Desktop: trackpad pinch (ctrlKey) atau Alt+wheel ──
    const onWheel = (event: WheelEvent) => {
      if (!event.altKey && !event.ctrlKey) return
      event.preventDefault()
      const direction = event.deltaY > 0 ? -1 : 1
      setZoomLevel((prev) => {
        const next = prev + direction * ZOOM_STEP
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(next.toFixed(2))))
      })
    }

    // ── Mobile: pinch dua jari ──
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return
      const a = event.touches[0]
      const b = event.touches[1]
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
      pinchStateRef.current = { startDistance: dist, startZoom: zoomLevelRef.current }
    }

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !pinchStateRef.current) return
      event.preventDefault()
      const a = event.touches[0]
      const b = event.touches[1]
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
      if (dist <= 0 || pinchStateRef.current.startDistance <= 0) return
      const ratio = dist / pinchStateRef.current.startDistance
      const next = pinchStateRef.current.startZoom * ratio
      setZoomLevel(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(next.toFixed(2)))))
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) pinchStateRef.current = null
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [loading, groups.length])

  useEffect(() => {
    fetch('/api/school-structure')
      .then(r => r.json())
      .then(j => { if (j.success) setGroups(j.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Organisasi Sekolah</span>
          <span className="text-xs text-gray-400">01 / 02</span>
        </div>

        <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-12">
          Susunan organisasi tenaga pendidik dan kependidikan SMK Negeri 1 Ciamis.
        </p>
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
          <>
            <div className="flex justify-end mb-3">
              <span className="text-xs font-semibold text-gray-500">Zoom: {Math.round(zoomLevel * 100)}%</span>
            </div>

            <div
              ref={viewportRef}
              className="relative h-[68vh] min-h-115 max-h-190 rounded-2xl border border-gray-200 bg-[#f8fbfe] overflow-auto"

            >
              <div className="min-w-max min-h-max p-6">
                <div
                  className="origin-top"
                  style={{
                    width: 'max(100%, 1100px)',
                    transform: `scale(${zoomLevel})`,
                    transition: 'transform 120ms ease-out',
                  }}
                >
                  <div className="flex flex-col items-center">
                  {groups.map((group, gIdx) => {
              const isLast = gIdx === groups.length - 1
              const memberCount = group.members.length

                    return (
                      <div key={group.positionName} className="flex flex-col items-center w-full">

                  {/* Garis dari member level atas ke badge — hanya jika bukan level pertama */}
                  {gIdx > 0 && <div className="w-px h-8 bg-[#0268ab]/30" />}

                  {/* Badge label posisi */}
                  <div className="px-5 py-1.5 bg-blue-50 border border-[#0268ab]/25 rounded-full text-[11px] font-bold text-[#0268ab] uppercase tracking-wider">
                    {group.positionName}
                  </div>

                  {/* Garis dari badge ke member — selalu ada */}
                  <div className="w-px h-6 bg-[#0268ab]/30" />

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
                              <div className={`flex-1 h-px ${isFirstMember ? 'invisible' : 'bg-[#0268ab]/30'}`} />
                              {/* Titik tengah — garis vertikal pendek ke bawah saja */}
                              <div className="w-px h-4 bg-[#0268ab]/30" />
                              {/* Garis kanan — invisible di member terakhir */}
                              <div className={`flex-1 h-px ${isLastMember ? 'invisible' : 'bg-[#0268ab]/30'}`} />
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
                        {!isLast && <div className="w-px h-8 bg-[#0268ab]/30 mt-2" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-3">
              Desktop: gunakan pinch trackpad atau Alt + scroll untuk zoom. Mobile: gunakan pinch dua jari untuk zoom in/out.
            </p>
          </>
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
    <section className="py-16 lg:py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Riwayat Kepemimpinan</span>
          <span className="text-xs text-gray-400">02 / 02</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="text-xs font-semibold text-gray-500">{histories.length} Periode</div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:border-[#0268ab] hover:text-[#0268ab] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:border-[#0268ab] hover:text-[#0268ab] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

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
            <div ref={scrollRef} className="flex gap-5 sm:gap-6 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {histories.map((h) => {
                const isActive = h.endYear === null
                const roleLabel = h.role === 'KEPALA_SEKOLAH' ? 'Kepala Sekolah' : 'Wakil Kepala Sekolah'

                return (
                  <div
                    key={h.id}
                    className="w-full shrink-0 group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{ width: '280px' }}
                  >
                    <div className="aspect-video overflow-hidden relative">
                      {h.teacher?.photo ? (
                        <Image
                          src={h.teacher.photo}
                          alt={h.teacher.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          sizes="(min-width: 1024px) 280px, 100vw"
                          unoptimized
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${isActive ? 'bg-[#0268ab]/10 text-[#0268ab]' : 'bg-gray-100 text-gray-300'}`}>
                          {h.teacher?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0268ab]">
                          {roleLabel}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] text-gray-400">
                          {isActive ? 'Aktif' : 'Selesai'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#0268ab] transition-colors duration-200 line-clamp-2 mb-2">
                        {h.teacher?.name}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>
                          Periode: <span className="font-semibold text-gray-800">{h.startYear} - {isActive ? 'Sekarang' : h.endYear}</span>
                        </span>
                      </div>
                      {h.bidang && (
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">
                          Bidang: {h.bidang}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {h.note || (isActive ? 'Aktif Menjabat' : (h.endReason ? h.endReason : 'Pindah Tugas'))}
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
  <div className="min-h-screen bg-gray-50">
    <section className="pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>

      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

      <div className="absolute top-20 left-10 text-white/10">
        <Users className="w-16 h-16" strokeWidth={1} />
      </div>
      <div className="absolute top-32 right-16 text-white/10">
        <GraduationCap className="w-12 h-12" strokeWidth={1} />
      </div>
      <div className="absolute bottom-20 left-32 text-white/10">
        <Award className="w-14 h-14" strokeWidth={1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Struktur
            <span className="block text-5xl md:text-6xl lg:text-7xl font-light mt-2">Sekolah</span>
          </h1>
          <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
            Mengenal lebih dekat tenaga pendidik dan pimpinan yang mendedikasikan diri untuk kemajuan sekolah.
          </p>
        </div>
      </div>
    </section>
    <StrukturSection />
    <RiwayatKepsekSection />
  </div>
)

export default FacultyPage
