'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, ChevronLeft, ChevronRight, Search, MessageSquare, Phone, Calendar, CheckCheck } from 'lucide-react'

interface Message {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  createdAt: string
  adminReply?: string | null
  repliedAt?: string | null
}

interface Pagination { page: number; limit: number; total: number; totalPages: number }

/** Normalise semua format nomor WA menjadi format internasional tanpa '+' */
function normalizePhone(raw: string): string {
  // Hapus semua karakter non-digit kecuali '+' di awal
  let num = raw.trim()
  // Hapus semua non-digit
  num = num.replace(/[^\d]/g, '')
  // Tangani berbagai awalan
  if (num.startsWith('0')) {
    // 08xxxxxxxx ? 628xxxxxxxx
    num = '62' + num.substring(1)
  } else if (num.startsWith('62')) {
    // sudah benar
  } else if (num.startsWith('8')) {
    // 8xxxxxxxx ? 628xxxxxxxx
    num = '62' + num
  }
  return num
}

export default function MessagesPage() {
  const [data, setData] = useState<Message[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Message | null>(null)
  const [monthFilter, setMonthFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const monthOptions = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ]

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)
      if (monthFilter) params.set('month', monthFilter)
      if (yearFilter) params.set('year', yearFilter)
      const res = await fetch('/api/messages?' + params.toString())
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setPagination(json.pagination)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [pagination.page, statusFilter, search, monthFilter, yearFilter])

  // Fetch total unread count (tanpa filter)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch('/api/messages?status=unread&limit=1')
      const json = await res.json()
      if (json.success) setUnreadCount(json.pagination?.total ?? 0)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchUnreadCount() }, [fetchUnreadCount])

  const markAsRead = async (msg: Message) => {
    setSelected(msg)
    if (msg.status === 'unread') {
      await fetch('/api/messages/' + msg.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })
      // Update local state immediately
      setData(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m))
      setSelected({ ...msg, status: 'read' })
      setUnreadCount(c => Math.max(0, c - 1))
    }
  }

  /** Tandai pesan sebagai 'replied' di database */
  const markAsReplied = async (msgId: number) => {
    try {
      await fetch('/api/messages/' + msgId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'replied' }),
      })
      // Update local state immediately — pindahkan ke bawah dengan sort
      setData(prev => prev.map(m => m.id === msgId ? { ...m, status: 'replied' } : m))
      setSelected(prev => prev?.id === msgId ? { ...prev, status: 'replied' } : prev)
    } catch (err) { console.error(err) }
  }

  /** Buka WhatsApp lalu tandai pesan sebagai replied */
  const openWhatsApp = (phone: string, name: string, subject?: string | null, message?: string, msgId?: number) => {
    const formattedPhone = normalizePhone(phone)
    const wa = `Halo *${name}*,

Perkenalkan, kami dari *Admin SMK Negeri 1 Ciamis*. Kami hendak menyampaikan balasan atas pesan yang telah Anda kirimkan melalui website sekolah kami.

*Pertanyaan Anda :*${subject ? `\n_${subject}_` : ''}
"${message || ''}"

*Jawaban kami:*
[ Ketik jawaban Anda di sini ]

Demikian balasan dari kami. Apabila ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami kembali. Terima kasih atas perhatian dan kepercayaan Anda kepada *SMK Negeri 1 Ciamis*.`

    const url = 'https://wa.me/' + formattedPhone + '?text=' + encodeURIComponent(wa)
    window.open(url, '_blank')
    // Langsung tandai sebagai dibalas setelah WA dibuka
    if (msgId) markAsReplied(msgId)
  }

  const getTimeAgo = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 60) return diffMins + ' menit lalu'
    if (diffHours < 24) return diffHours + ' jam lalu'
    if (diffDays < 7) return diffDays + ' hari lalu'
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="p-6 h-[calc(100vh-100px)]">
      <div className="mb-4 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesan Masuk</h1>
          <p className="text-sm text-gray-500">Kelola pesan dari pengunjung website</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-36 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Status</option>
            <option value="unread">Belum Dibaca</option>
            <option value="read">Sudah Dibaca</option>
            <option value="replied">Sudah Dibalas</option>
          </select>
          <select
            value={monthFilter}
            onChange={e => { setMonthFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-28 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Bulan</option>
            {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select
            value={yearFilter}
            onChange={e => { setYearFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tahun</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Chat Layout */}
      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100%-180px)]">
        {/* -- Message List -- */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{pagination.total} pesan</p>
            {unreadCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                {unreadCount} belum dibaca
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 flex-1">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 flex-1">
              <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-gray-400 text-sm">Tidak ada pesan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
              {[...data]
                .sort((a, b) => {
                  // unread → read → replied
                  const order: Record<string, number> = { unread: 0, read: 1, replied: 2 }
                  return (order[a.status] ?? 1) - (order[b.status] ?? 1)
                })
                .map(msg => {
                const isUnread = msg.status === 'unread'
                const isReplied = msg.status === 'replied'
                const isSelected = selected?.id === msg.id
                return (
                  <button
                    key={msg.id}
                    onClick={() => markAsRead(msg)}
                    className={
                      'w-full text-left p-4 hover:bg-gray-50 transition-all ' +
                      (isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : '') +
                      (isReplied && !isSelected ? 'opacity-60' : '')
                    }
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ' + (isUnread ? 'bg-linear-to-br from-blue-500 to-blue-700' : isReplied ? 'bg-linear-to-br from-green-400 to-green-600' : 'bg-linear-to-br from-gray-400 to-gray-500')}>
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={'text-sm truncate ' + (isUnread ? 'font-bold text-gray-900' : isReplied ? 'font-medium text-gray-400' : 'font-medium text-gray-600')}>
                            {msg.name}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={'text-xs ' + (isUnread ? 'text-blue-500 font-semibold' : 'text-gray-400')}>
                              {getTimeAgo(msg.createdAt)}
                            </span>
                            {/* Status indicator dot */}
                            {isUnread && (
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" title="Belum dibaca" />
                            )}
                            {isReplied && (
                              <svg className="w-3.5 h-3.5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="Sudah dibalas">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                        </div>
                        {msg.subject && (
                          <p className={'text-xs truncate mt-0.5 ' + (isUnread ? 'font-semibold text-gray-700' : 'text-gray-500')}>
                            {msg.subject}
                          </p>
                        )}
                        <p className={'text-xs truncate mt-0.5 ' + (isUnread ? 'text-gray-600' : 'text-gray-400')}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-3 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500">{pagination.page} / {pagination.totalPages}</span>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* -- Message Detail -- */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          {selected ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {selected.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{selected.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status badge */}
                    {selected.status === 'unread' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Belum Dibaca</span>
                    )}
                    {selected.status === 'read' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        <CheckCheck className="w-3 h-3" /> Dibaca
                      </span>
                    )}
                    {selected.status === 'replied' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCheck className="w-3 h-3" /> Dibalas
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                <div className="max-w-2xl mx-auto">
                  {/* Date indicator */}
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                      <Calendar className="w-3 h-3" />
                      {new Date(selected.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  {/* User Message bubble */}
                  <div className="flex justify-start mb-4">
                    <div className="max-w-[80%]">
                      <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm">
                        {selected.subject && (
                          <p className="font-semibold text-gray-900 mb-2 pb-2 border-b border-gray-100">{selected.subject}</p>
                        )}
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-2">
                        {new Date(selected.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Phone & WA info */}
                  {selected.phone ? (
                    <div className="mt-4 p-4 bg-white rounded-xl shadow-sm flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Nomor WhatsApp</p>
                        <p className="font-mono text-gray-900 font-medium">{selected.phone}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Jawaban akan dikirim ke : <span className="font-mono text-blue-600">+{normalizePhone(selected.phone)}</span></p>
                      </div>
                      <button
                        onClick={() => openWhatsApp(selected.phone!, selected.name, selected.subject, selected.message, selected.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors shadow"
                      >
                        <WhatsAppIcon />
                        Balas di WhatsApp
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                      <Phone className="w-4 h-4 inline mr-1.5" />
                      Pengirim tidak menyertakan nomor WhatsApp. Balas melalui email: <span className="font-semibold">{selected.email}</span>
                    </div>
                  )}

                  {/* Preview format WA */}
                  {selected.phone && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 select-none">
                        Lihat preview format pesan WhatsApp
                      </summary>
                      <div className="mt-2 p-4 bg-[#dcf8c6] rounded-xl text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed shadow-sm border border-green-200">
                        {`Halo *${selected.name}*,\n\nPerkenalkan, kami dari *Admin SMK Negeri 1 Ciamis*. Kami hendak menyampaikan balasan atas pesan yang telah Anda kirimkan melalui website sekolah kami.\n\n*Pertanyaan Anda :*${selected.subject ? `\n_${selected.subject}_` : ''}\n"${selected.message}"\n\n*Jawaban kami :*\n[ Ketik jawaban Anda di sini ]\n\nDemikian balasan dari kami. Apabila ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami kembali. Terima kasih atas perhatian dan kepercayaan Anda kepada *SMK Negeri 1 Ciamis*.`}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-400 text-sm">Pilih pesan untuk membaca</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
