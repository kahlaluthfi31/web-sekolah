'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, CalendarDays, Loader2 } from 'lucide-react'

interface AgendaCategory {
  id: number
  name: string
  color: string | null
}

interface Agenda {
  id: number
  title: string
  description: string | null
  eventDate: string | null
  eventTime: string | null
  timeEnd: string | null
  timeEndText: string | null
  location: string | null
  organizer: string | null
  image: string | null
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isPublished: boolean
  category: AgendaCategory | null
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  upcoming:  { label: 'Akan Datang',   color: 'bg-[#0268ab]' },
  ongoing:   { label: 'Berlangsung',   color: 'bg-emerald-500' },
  completed: { label: 'Telah Selesai', color: 'bg-gray-400' },
  cancelled: { label: 'Dibatalkan',    color: 'bg-red-400' },
}

// Urutan prioritas status: ongoing paling atas, lalu upcoming, lalu completed/cancelled
const STATUS_ORDER: Record<string, number> = {
  ongoing: 0,
  upcoming: 1,
  completed: 2,
  cancelled: 3,
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=900'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  // Parse tanpa timezone shift
  const raw = dateStr.substring(0, 10)
  const [y, m, d] = raw.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function parseTime(t: string): string {
  if (t.includes('T')) {
    const d = new Date(t)
    const h = d.getUTCHours().toString().padStart(2, '0')
    const m = d.getUTCMinutes().toString().padStart(2, '0')
    return `${h}.${m}`
  }
  const [h, m] = t.split(':')
  return `${h}.${m}`
}

function formatTime(
  start: string | null,
  end: string | null,
  endText: string | null,
): string {
  if (!start) return '-'
  const s = parseTime(start)
  if (endText) return `${s} s/d ${endText}`
  if (end)     return `${s} - ${parseTime(end)} WIB`
  return `${s} s/d Selesai`
}

// Konversi eventDate + eventTime ke timestamp untuk sorting
function toTimestamp(agenda: Agenda): number {
  if (!agenda.eventDate) return Infinity
  const raw = agenda.eventDate.substring(0, 10)
  const [y, m, d] = raw.split('-').map(Number)
  let h = 0, min = 0
  if (agenda.eventTime) {
    if (agenda.eventTime.includes('T')) {
      const dt = new Date(agenda.eventTime)
      h = dt.getUTCHours()
      min = dt.getUTCMinutes()
    } else {
      const parts = agenda.eventTime.split(':')
      h = parseInt(parts[0]) || 0
      min = parseInt(parts[1]) || 0
    }
  }
  return new Date(y, m - 1, d, h, min).getTime()
}

// Sort: ongoing → (terdekat dari sekarang ke atas), upcoming → (terdekat ke atas), completed → (terbaru ke atas)
function sortAgendas(list: Agenda[]): Agenda[] {
  const now = Date.now()
  return [...list].sort((a, b) => {
    const orderA = STATUS_ORDER[a.status] ?? 99
    const orderB = STATUS_ORDER[b.status] ?? 99
    if (orderA !== orderB) return orderA - orderB
    const tsA = toTimestamp(a)
    const tsB = toTimestamp(b)
    // ongoing & upcoming: yang paling dekat ke sekarang paling atas
    if (a.status === 'ongoing' || a.status === 'upcoming') {
      return Math.abs(tsA - now) - Math.abs(tsB - now)
    }
    // completed: yang paling baru paling atas
    return tsB - tsA
  })
}

const UpcomingEvents: React.FC = () => {
  const todayObj = new Date()
  const todayStr = todayObj.toISOString().substring(0, 10) // YYYY-MM-DD

  const [activeDay, setActiveDay] = useState<string>(todayStr)
  const [calMonth, setCalMonth] = useState<Date>(new Date(todayObj.getFullYear(), todayObj.getMonth(), 1))
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agendas?limit=50&page=1&isPublished=true')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          const sorted = sortAgendas(j.data as Agenda[])
          setAgendas(sorted)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Set of tanggal yang ada agenda (YYYY-MM-DD) untuk dot indicator
  const agendaDates = new Set(
    agendas
      .filter(a => a.eventDate)
      .map(a => a.eventDate!.substring(0, 10))
  )

  // Featured: prioritas ongoing, kalau tidak ada ambil pertama dari sorted list
  const ongoingAgenda = agendas.find(a => a.status === 'ongoing')
  const featured = ongoingAgenda ?? agendas[0] ?? null
  // List: 3 agenda berikutnya (tidak termasuk featured)
  const listEvents = agendas.filter(a => a.id !== featured?.id).slice(0, 3)

  // Agenda untuk tanggal yang dipilih di kalender
  const selectedDayAgendas = agendas.filter(
    a => a.eventDate && a.eventDate.substring(0, 10) === activeDay
  )

  // Kalender: tampilkan semua hari dalam bulan calMonth
  const year  = calMonth.getFullYear()
  const month = calMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay() // 0=Min
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  // Baris kalender: mulai dari Minggu, isi blank untuk hari sebelum tanggal 1
  const calCells: Array<{ dateStr: string; day: number; isRed: boolean } | null> = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const d = new Date(year, month, day)
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return { dateStr, day, isRed: d.getDay() === 0 }
    }),
  ]

  const prevMonth = () => setCalMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCalMonth(new Date(year, month + 1, 1))

  const currentMonthLabel = calMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const selectedDayLabel = (() => {
    const [y, m, d] = activeDay.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
  })()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Agenda Sekolah</span>
          <span className="text-xs text-gray-400">03 / 08</span>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Featured + list */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {loading ? (
              <div className="flex items-center justify-center h-80 rounded-2xl bg-gray-50">
                <Loader2 className="w-6 h-6 animate-spin text-[#0268ab]" />
              </div>
            ) : !featured ? (
              <div className="flex flex-col items-center justify-center h-80 rounded-2xl bg-gray-50 text-center gap-2">
                <CalendarDays className="w-10 h-10 text-gray-300" />
                <p className="text-sm text-gray-400">Belum ada agenda yang tersedia.</p>
              </div>
            ) : (
              <>
                {/* Featured event card */}
                <div className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image || FALLBACK_IMAGE}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`${STATUS_MAP[featured.status]?.color ?? 'bg-gray-500'} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
                      {STATUS_MAP[featured.status]?.label ?? featured.status}
                    </span>
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/60 text-xs mb-2">
                      {formatTime(featured.eventTime, featured.timeEnd, featured.timeEndText)}
                      &nbsp;|&nbsp;
                      {formatDate(featured.eventDate)}
                    </p>
                    <h3 className="text-white text-xl font-bold leading-snug mb-2 line-clamp-2">
                      {featured.title}
                    </h3>
                    {featured.description && (
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-2">
                        {featured.description}
                      </p>
                    )}
                    {(featured.category || featured.organizer) && (
                      <p className="text-white/50 text-xs">
                        {featured.category?.name}
                        {featured.category && featured.organizer && ' · '}
                        {featured.organizer}
                      </p>
                    )}
                  </div>
                </div>

                {/* List events */}
                {listEvents.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {listEvents.map((event) => {
                      const st = STATUS_MAP[event.status] ?? { label: event.status, color: 'bg-gray-400' }
                      const isCompleted = event.status === 'completed' || event.status === 'cancelled'
                      return (
                        <div
                          key={event.id}
                          className={`flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                            isCompleted ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={event.image || FALLBACK_IMAGE}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">
                              {formatTime(event.eventTime, event.timeEnd, event.timeEndText)}
                              &nbsp;·&nbsp;
                              {formatDate(event.eventDate)}
                            </p>
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</h4>
                            {(event.category || event.organizer || event.location) && (
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {event.category && (
                                  <span className="text-xs text-gray-400">{event.category.name}</span>
                                )}
                                {event.category && event.organizer && (
                                  <span className="text-gray-300">·</span>
                                )}
                                {event.organizer && (
                                  <span className="text-xs text-gray-400">{event.organizer}</span>
                                )}
                                {event.location && (
                                  <>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-xs text-gray-400 truncate max-w-[120px]">{event.location}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Status badge */}
                          <span className={`shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full text-white ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Calendar sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sticky top-6">
              <h3 className="text-base font-bold text-[#0268ab] mb-1">Agenda Sekolah</h3>
              <p className="text-xs text-gray-400 mb-5">Dapatkan informasi terkait semua kegiatan SMKN 1 Ciamis.</p>

              {/* Mini Calendar */}
              <div className="mb-4">
                {/* Header bulan */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={prevMonth}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700 capitalize">{currentMonthLabel}</span>
                  <button
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Header hari */}
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {dayNames.map(n => (
                    <div key={n} className={`text-center text-[10px] font-semibold uppercase py-1 ${n === 'Min' ? 'text-red-400' : 'text-gray-400'}`}>
                      {n}
                    </div>
                  ))}
                </div>

                {/* Grid hari */}
                <div className="grid grid-cols-7 gap-0.5">
                  {calCells.map((cell, idx) => {
                    if (!cell) return <div key={`blank-${idx}`} />
                    const hasAgenda = agendaDates.has(cell.dateStr)
                    const isActive  = activeDay === cell.dateStr
                    const isToday   = cell.dateStr === todayStr
                    return (
                      <div key={cell.dateStr} className="flex flex-col items-center">
                        <button
                          onClick={() => setActiveDay(cell.dateStr)}
                          className={`relative w-8 h-8 rounded-full text-xs font-semibold transition-colors duration-200 ${
                            isActive
                              ? 'bg-[#0268ab] text-white'
                              : isToday
                              ? 'ring-2 ring-[#0268ab] text-[#0268ab] hover:bg-blue-50'
                              : cell.isRed
                              ? 'text-red-400 hover:bg-red-50'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {cell.day}
                          {/* Dot indicator jika ada agenda */}
                          {hasAgenda && !isActive && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0268ab]" />
                          )}
                          {hasAgenda && isActive && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/70" />
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Agenda list untuk hari yang dipilih */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-3 capitalize">{selectedDayLabel}</p>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0268ab]" />
                  </div>
                ) : selectedDayAgendas.length === 0 ? (
                  <div className="flex flex-col items-center py-5 text-center">
                    <CalendarDays className="w-8 h-8 text-gray-200 mb-2" />
                    <p className="text-xs font-semibold text-[#0268ab] mb-0.5">Tidak ada agenda</p>
                    <p className="text-xs text-gray-400">Belum ada kegiatan di hari ini</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {selectedDayAgendas.map(a => {
                      const st = STATUS_MAP[a.status] ?? { label: a.status, color: 'bg-gray-400' }
                      return (
                        <div key={a.id} className="flex items-start gap-2.5 rounded-xl p-2.5 bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer">
                          {/* Warna status */}
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${st.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{a.title}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {formatTime(a.eventTime, a.timeEnd, a.timeEndText)}
                              {a.location && ` · ${a.location}`}
                            </p>
                          </div>
                          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* See all */}
              <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200 border-t border-gray-100 pt-4">
                Lihat Semua Agenda
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents