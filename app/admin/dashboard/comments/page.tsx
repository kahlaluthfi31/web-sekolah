'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, Search, MoreVertical, Eye, Check, X, Loader2, User, Clock, Newspaper } from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

interface Comment {
  id: number
  commentText: string
  contentType: string
  contentId: number
  contentTitle: string
  contentSlug: string | null
  status: string
  createdAt: string
  user?: { id: number; name: string; email: string }
}

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status', color: '' },
  { value: 'pending', label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'approved', label: 'Disetujui', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Ditolak', color: 'bg-red-100 text-red-700' },
]

function getStatusStyle(s: string) {
  return STATUS_OPTIONS.find(o => o.value === s)?.color || 'bg-gray-100 text-gray-700'
}
function getStatusLabel(s: string) {
  return STATUS_OPTIONS.find(o => o.value === s)?.label || s
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function ActionDropdown({
  onView, onApprove, onReject, status, loading
}: {
  onView: () => void
  onApprove: () => void
  onReject: () => void
  status: string
  loading: boolean
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(160)

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        onClick={toggle}
        disabled={loading}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
      </button>
      {open && (
        <div
          style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }}
          className="w-44 bg-white rounded-xl border border-gray-200 shadow-xl py-1"
        >
          <button
            onClick={() => { close(); onView() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition"
          >
            <Eye className="w-3.5 h-3.5" /> Lihat Berita
          </button>
          {status !== 'approved' && (
            <>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => { close(); onApprove() }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition"
              >
                <Check className="w-3.5 h-3.5" /> Setujui
              </button>
            </>
          )}
          {status !== 'rejected' && (
            <>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => { close(); onReject() }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <X className="w-3.5 h-3.5" /> Tolak
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', '200')
      const res = await fetch('/api/comments?' + params.toString())
      const json = await res.json()
      setComments(json.data || [])
    } catch {
      setComments([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/comments/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchComments()
      } else {
        alert('Gagal mengubah status')
      }
    } catch {
      alert('Terjadi kesalahan')
    }
    setUpdating(null)
  }

  const handleViewNews = (slug?: string | null) => {
    if (slug) window.open('/berita/' + slug, '_blank')
    else alert('Berita tidak ditemukan atau tidak memiliki slug.')
  }

  const filteredComments = comments
    .filter(c => {
      const s = search.toLowerCase()
      const matchSearch =
        !search ||
        c.commentText.toLowerCase().includes(s) ||
        c.user?.name?.toLowerCase().includes(s) ||
        c.contentTitle?.toLowerCase().includes(s)
      return matchSearch && (!statusFilter || c.status === statusFilter)
    })
    .sort((a, b) => {
      const order: Record<string, number> = { pending: 0, approved: 1, rejected: 2 }
      return (order[a.status] ?? 3) - (order[b.status] ?? 3)
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen Komentar</h2>
        <p className="text-sm text-gray-500">Moderasi komentar pada berita</p>
      </div>

      {/* Filters — same style as alumni */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari komentar, nama, atau judul berita..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400">Tidak ada komentar ditemukan.</p>
        </div>
      ) : (
        <>
          {/* 2-column card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComments.map(c => (
              <div
                key={c.id}
                className={
                  'bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-all ' +
                  (updating === c.id ? 'opacity-50 pointer-events-none' : '')
                }
              >
                {/* Top row: status + time + action */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={'px-2.5 py-1 rounded-full text-xs font-medium ' + getStatusStyle(c.status)}>
                      {getStatusLabel(c.status)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <div className="relative shrink-0">
                    <ActionDropdown
                      status={c.status}
                      loading={updating === c.id}
                      onView={() => handleViewNews(c.contentSlug)}
                      onApprove={() => handleUpdateStatus(c.id, 'approved')}
                      onReject={() => handleUpdateStatus(c.id, 'rejected')}
                    />
                  </div>
                </div>

                {/* Commenter name */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.user?.name || 'Anonim'}</p>
                    {c.user?.email && <p className="text-xs text-gray-400">{c.user.email}</p>}
                  </div>
                </div>

                {/* Comment text */}
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{c.commentText}</p>
                </div>

                {/* Related article snippet */}
                {c.contentTitle && (
                  <div className="flex items-start gap-2 border-t border-gray-100 pt-3">
                    <Newspaper className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">
                        {c.contentType === 'news' ? 'Berita' : c.contentType === 'agenda' ? 'Agenda' : 'Fasilitas'}
                      </p>
                      {c.contentSlug ? (
                        <button
                          onClick={() => handleViewNews(c.contentSlug)}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left line-clamp-1 transition"
                        >
                          {c.contentTitle}
                        </button>
                      ) : (
                        <p className="text-sm text-gray-600 line-clamp-1">{c.contentTitle}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            Menampilkan {filteredComments.length} dari {comments.length} komentar
          </div>
        </>
      )}
    </div>
  )
}