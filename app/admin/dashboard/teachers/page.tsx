'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Plus, Search, MoreVertical, Edit2, Trash2,
  ChevronLeft, ChevronRight, Loader2, X, Save,
  ArrowLeft, AlertTriangle, Users, BookOpen, Award, Camera,
} from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

interface Teacher {
  id: number; nip: string | null; name: string; email: string | null
  phone: string | null; photo: string | null; position: string | null
  education: string | null; subjects: string | null
  status: 'ACTIVE' | 'RETIRED' | 'RESIGNED' | 'TRANSFERRED'
  joinDate: string | null; orderPosition: number; isActive: boolean; createdAt: string
}
interface PrincipalHistory {
  id: number; teacherId: number; role: 'KEPALA_SEKOLAH' | 'WAKIL_KEPALA_SEKOLAH'
  startYear: number; endYear: number | null; note: string | null; createdAt: string
  teacher: { id: number; name: string; photo: string | null }
}
interface Position {
  id: number; name: string; description: string | null
  orderPosition: number; isActive: boolean; createdAt: string; updatedAt: string
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE:      { label: 'Aktif',             color: 'bg-green-100 text-green-700' },
  RETIRED:     { label: 'Pensiun',           color: 'bg-gray-100 text-gray-600' },
  RESIGNED:    { label: 'Mengundurkan Diri', color: 'bg-red-100 text-red-700' },
  TRANSFERRED: { label: 'Pindah',            color: 'bg-yellow-100 text-yellow-700' },
}
const ROLE_MAP: Record<string, { label: string; color: string }> = {
  KEPALA_SEKOLAH:       { label: 'Kepala Sekolah',       color: 'bg-blue-100 text-blue-700' },
  WAKIL_KEPALA_SEKOLAH: { label: 'Wakil Kepala Sekolah', color: 'bg-purple-100 text-purple-700' },
}
const EDUCATION_OPTIONS = [
  'SMA / SMK / MA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'Profesi', 'Spesialis',
]
function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── Action Dropdown ───────────────────────────────────────────────────────────
function ActionDropdown({
  onDetail, onEdit, onDelete,
}: {
  onDetail?: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(150)
  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} onClick={toggle} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }} className="w-36 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          {onDetail && (
            <>
              <button onClick={() => { close(); onDetail() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
                <Search className="w-3.5 h-3.5" /> Detail
              </button>
              <div className="border-t border-gray-100" />
            </>
          )}
          <button onClick={() => { close(); onEdit() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { close(); onDelete() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({
  title, name, errorMsg, onConfirm, onCancel, deleting,
}: {
  title: string
  name: string
  errorMsg?: string
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-60 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={!deleting ? onCancel : undefined} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-1.5">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">
              Yakin ingin menghapus <span className="font-semibold text-gray-700">{name}</span>?
            </p>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
            {errorMsg && (
              <p className="text-xs text-red-600 font-medium pt-2 leading-relaxed">{errorMsg}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting || !!errorMsg}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Modal (minimalist) ────────────────────────────────────────────────
function DetailModal({
  title, onClose, children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  const isEmpty = value === null || value === undefined || value === ''
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-gray-50 last:border-0">
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-medium text-gray-800">
        {isEmpty
          ? <span className="text-gray-300 font-normal italic">Tidak ada data</span>
          : value}
      </span>
    </div>
  )
}

// ─── Photo Upload ──────────────────────────────────────────────────────────────
function PhotoUpload({
  currentPhoto, name, onUploaded,
}: {
  currentPhoto: string
  name: string
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) {
        onUploaded(json.data?.url ?? json.url)
      } else {
        alert(json.message || 'Gagal upload foto')
      }
    } catch {
      alert('Terjadi kesalahan saat upload foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {currentPhoto ? (
          <Image
            src={currentPhoto}
            alt={name || 'Foto'}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            unoptimized
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Camera className="w-3.5 h-3.5" />}
        </button>
      </div>
      <p className="text-xs text-gray-400">Klik ikon kamera untuk ganti foto</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) handleFile(e.target.files[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

// ─── Searchable Select ────────────────────────────────────────────────────────
function SearchableSelect({
  value, onChange, options, placeholder = '-- Pilih --', disabled,
}: {
  value: string
  onChange: (val: string) => void
  options: { id: number; label: string; photo?: string | null }[]
  placeholder?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
  const selected = options.find(o => String(o.id) === value)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setQuery(''); setOpen(v => !v) }}
        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-left"
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0">
            {selected.photo ? (
              <Image src={selected.photo} alt={selected.label} width={24} height={24} className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0" unoptimized />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-blue-600">{selected.label.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span className="truncate text-gray-800">{selected.label}</span>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cari nama guru..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
            >
              {placeholder}
            </button>
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-400 text-center">Tidak ada hasil</p>
            ) : filtered.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => { onChange(String(o.id)); setOpen(false) }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left ${String(o.id) === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
              >
                {o.photo ? (
                  <Image src={o.photo} alt={o.label} width={24} height={24} className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0" unoptimized />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-blue-600">{o.label.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// TAB 1 – GURU & STAFF
// =============================================================================
function TeachersTab() {
  const [data, setData] = useState<Teacher[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [educationFilter, setEducationFilter] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [positions, setPositions] = useState<Position[]>([])
  const [existingSpecial, setExistingSpecial] = useState({ hasKepsek: false, hasWakepsek: false })
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Teacher | null>(null)
  const [detailItem, setDetailItem] = useState<Teacher | null>(null)
  const [deleteItem, setDeleteItem] = useState<Teacher | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/positions?all=true')
      .then(r => r.json())
      .then(j => { if (j.success) setPositions(j.data) })
      .catch(() => {})
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      p.set('page', String(pagination.page))
      if (search) p.set('search', search)
      if (statusFilter) p.set('status', statusFilter)
      const res = await fetch('/api/teachers?' + p)
      const json = await res.json()
      if (json.success) {
        const all = json.data as Teacher[]
        const filtered = [
          educationFilter ? (t: Teacher) => t.education === educationFilter : null,
          positionFilter  ? (t: Teacher) => t.position  === positionFilter  : null,
        ].filter(Boolean).reduce((arr, fn) => arr.filter(fn!), all)
        setData(filtered)
        const hasLocalFilter = !!(educationFilter || positionFilter)
        setPagination(hasLocalFilter
          ? { ...json.pagination, total: filtered.length, totalPages: Math.ceil(filtered.length / json.pagination.limit) }
          : json.pagination)
        setExistingSpecial({
          hasKepsek: !!all.find(t => t.position === 'Kepala Sekolah'),
          hasWakepsek: !!all.find(t => t.position === 'Wakil Kepala Sekolah'),
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, search, statusFilter, educationFilter, positionFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteItem) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/teachers/${deleteItem.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) { setDeleteItem(null); fetchData() }
      else alert(json.message || 'Gagal menghapus')
    } catch {
      alert('Terjadi kesalahan')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama / NIP / jabatan..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={educationFilter}
          onChange={e => { setEducationFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Pendidikan</option>
          {EDUCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          value={positionFilter}
          onChange={e => { setPositionFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Jabatan</option>
          {positions.map(pos => <option key={pos.id} value={pos.name}>{pos.name}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Status</option>
          {Object.entries(STATUS_MAP).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
        </select>
        <button
          onClick={() => { setEditItem(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Guru
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : data.length === 0 ? (
          <div className="text-center py-20"><Users className="w-10 h-10 mx-auto text-gray-300 mb-2" /><p className="text-gray-400">Belum ada data guru.</p></div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Jabatan</th>
                  <th className="px-6 py-4">Pendidikan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.photo ? (
                          <Image src={item.photo} alt={item.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0" unoptimized />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-600">{item.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          {item.nip && <p className="text-xs text-gray-400">NIP: {item.nip}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.position || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.education || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_MAP[item.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_MAP[item.status]?.label || item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          onDetail={() => setDetailItem(item)}
                          onEdit={() => { setEditItem(item); setShowForm(true) }}
                          onDelete={() => setDeleteItem(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Halaman {pagination.page} dari {pagination.totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <TeacherFormModal
          teacher={editItem}
          positions={positions}
          existingSpecial={existingSpecial}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          onSaved={() => { setShowForm(false); setEditItem(null); fetchData() }}
        />
      )}

      {detailItem && (
        <DetailModal title="Detail Guru & Staff" onClose={() => setDetailItem(null)}>
          <div className="flex flex-col items-center gap-2 mb-5 pb-5 border-b border-gray-100">
            {detailItem.photo ? (
              <Image src={detailItem.photo} alt={detailItem.name} width={72} height={72} className="w-18 h-18 rounded-full object-cover border border-gray-200" unoptimized />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">{detailItem.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900">{detailItem.name}</p>
              {detailItem.nip && <p className="text-xs text-gray-400 mt-0.5">NIP: {detailItem.nip}</p>}
              {detailItem.position && (
                <span className="inline-block mt-1.5 text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{detailItem.position}</span>
              )}
            </div>
          </div>
          <DetailRow label="Email" value={detailItem.email} />
          <DetailRow label="No. Telepon" value={detailItem.phone} />
          <DetailRow label="Pendidikan" value={detailItem.education} />
          <DetailRow label="Status Kepegawaian" value={
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_MAP[detailItem.status]?.color}`}>
              {STATUS_MAP[detailItem.status]?.label}
            </span>
          } />
          <DetailRow label="Tanggal Masuk" value={
            detailItem.joinDate
              ? new Date(detailItem.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : null
          } />
          <DetailRow label="Ditampilkan di Website" value={
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${detailItem.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {detailItem.isActive ? 'Ditampilkan' : 'Disembunyikan'}
            </span>
          } />
          <DetailRow label="Terdaftar Sejak" value={new Date(detailItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
        </DetailModal>
      )}

      {deleteItem && (
        <DeleteModal
          title="Hapus Data Guru"
          name={deleteItem.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          deleting={deleting}
        />
      )}
    </>
  )
}

// ─── Teacher Form Modal ────────────────────────────────────────────────────────
function TeacherFormModal({
  teacher, positions, existingSpecial, onClose, onSaved,
}: {
  teacher: Teacher | null
  positions: Position[]
  existingSpecial: { hasKepsek: boolean; hasWakepsek: boolean }
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!teacher
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '', nip: '', email: '', phone: '',
    photo: '', position: '', education: '',
    status: 'ACTIVE', joinDate: todayStr(),
    orderPosition: 0, isActive: true,
  })

  useEffect(() => {
    if (teacher) {
      setForm({
        name: teacher.name || '',
        nip: teacher.nip || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        photo: teacher.photo || '',
        position: teacher.position || '',
        education: teacher.education || '',
        status: teacher.status || 'ACTIVE',
        joinDate: teacher.joinDate ? teacher.joinDate.substring(0, 10) : todayStr(),
        orderPosition: teacher.orderPosition ?? 0,
        isActive: teacher.isActive,
      })
    }
  }, [teacher])

  const validateField = (name: string, value: string) => {
    const errs = { ...fieldErrors }
    if (name === 'name') { if (!value.trim()) errs.name = 'Nama wajib diisi'; else delete errs.name }
    if (name === 'email') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errs.email = 'Format email tidak valid'
      else delete errs.email
    }
    if (name === 'position') { if (!value) errs.position = 'Jabatan wajib dipilih'; else delete errs.position }
    setFieldErrors(errs)
  }

  const setField = (name: string, value: string | number | boolean) => {
    setForm(f => ({ ...f, [name]: value }))
    if (typeof value === 'string') validateField(name, value)
  }

  const availablePositions = positions.filter(p => {
    if (p.name === 'Kepala Sekolah' && existingSpecial.hasKepsek && teacher?.position !== 'Kepala Sekolah') return false
    if (p.name === 'Wakil Kepala Sekolah' && existingSpecial.hasWakepsek && teacher?.position !== 'Wakil Kepala Sekolah') return false
    return true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.position) errs.position = 'Jabatan wajib dipilih'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid'
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }
    setSaving(true); setError('')
    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(), nip: form.nip || null, email: form.email || null,
        phone: form.phone || null, photo: form.photo || null, position: form.position,
        education: form.education || null, status: form.status,
        joinDate: form.joinDate || null, isActive: form.isActive,
      }
      if (isEdit) body.orderPosition = form.orderPosition
      const res = await fetch(
        isEdit ? `/api/teachers/${teacher!.id}` : '/api/teachers',
        { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
      )
      const json = await res.json()
      if (json.success) onSaved(); else setError(json.message || 'Gagal menyimpan data')
    } catch { setError('Terjadi kesalahan. Coba lagi.') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-4 h-4" /></button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Data Guru' : 'Tambah Guru & Staff'}</h2>
                  <p className="text-xs text-gray-500">{isEdit ? 'Perbarui informasi guru atau staf' : 'Tambahkan data guru atau staf baru'}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            {error && <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex justify-center pb-2">
                <PhotoUpload currentPhoto={form.photo} name={form.name} onUploaded={url => setForm(f => ({ ...f, photo: url }))} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={e => setField('name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="Contoh: Budi Santoso, S.Pd." />
                  {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">NIP</label>
                  <input type="text" inputMode="numeric" value={form.nip} onChange={e => setField('nip', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nomor Induk Pegawai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Jabatan <span className="text-red-500">*</span></label>
                  <select value={form.position} onChange={e => setField('position', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.position ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    <option value="">-- Pilih Jabatan --</option>
                    {availablePositions.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  {fieldErrors.position && <p className="text-xs text-red-500 mt-1">{fieldErrors.position}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="text" value={form.email} onChange={e => setField('email', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="contoh@email.com" />
                  {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
                  <input type="text" inputMode="numeric" value={form.phone}
                    onChange={e => { let v = e.target.value.replace(/\D/g, ''); if (v.length > 0 && !v.startsWith('0')) v = '0' + v; setField('phone', v) }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pendidikan</label>
                  <select value={form.education} onChange={e => setField('education', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Pilih Pendidikan --</option>
                    {EDUCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Masuk</label>
                  <input type="date" value={form.joinDate} onChange={e => setField('joinDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setField('status', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {Object.entries(STATUS_MAP).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-3 pt-1">
                    <button type="button" onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-gray-700">Tampilkan di website</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// TAB 2 – RIWAYAT JABATAN
// =============================================================================
function HistoryTab() {
  const [data, setData] = useState<PrincipalHistory[]>([])
  const [allData, setAllData] = useState<PrincipalHistory[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [teacherList, setTeacherList] = useState<{ id: number; name: string; photo: string | null }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<PrincipalHistory | null>(null)
  const [deleteItem, setDeleteItem] = useState<PrincipalHistory | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/teachers?all=true')
      .then(r => r.json())
      .then(j => { if (j.success) setTeacherList((j.data as Teacher[]).map(t => ({ id: t.id, name: t.name, photo: t.photo }))) })
      .catch(() => {})
  }, [])

  const refreshAllData = async () => {
    try {
      const res = await fetch('/api/teachers/principal-history?limit=1000')
      const json = await res.json()
      if (json.success) { setAllData(json.data) }
    } catch { /* ignore */ }
  }

  useEffect(() => { refreshAllData() }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      p.set('page', String(pagination.page))
      if (search) p.set('search', search)
      if (roleFilter) p.set('role', roleFilter)
      const res = await fetch('/api/teachers/principal-history?' + p)
      const json = await res.json()
      if (json.success) {
        setData(json.data as PrincipalHistory[])
        setPagination(json.pagination)
      }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [pagination.page, search, roleFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteItem) return; setDeleting(true)
    try {
      const res = await fetch(`/api/teachers/principal-history/${deleteItem.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) { setDeleteItem(null); fetchData(); refreshAllData() }
      else alert(json.message || 'Gagal menghapus')
    } catch { alert('Terjadi kesalahan') } finally { setDeleting(false) }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari nama guru..." value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Jabatan</option>
          {Object.entries(ROLE_MAP).map(([v, r]) => <option key={v} value={v}>{r.label}</option>)}
        </select>
        <button onClick={() => { setEditItem(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shrink-0">
          <Plus className="w-4 h-4" /> Tambah Riwayat
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : data.length === 0 ? (
          <div className="text-center py-20"><BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-2" /><p className="text-gray-400">Belum ada riwayat jabatan.</p></div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Guru</th>
                  <th className="px-6 py-4">Jabatan</th>
                  <th className="px-6 py-4">Periode</th>
                  <th className="px-6 py-4">Catatan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.teacher?.photo ? (
                          <Image src={item.teacher.photo} alt={item.teacher.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" unoptimized />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-600">{item.teacher?.name?.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">{item.teacher?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${ROLE_MAP[item.role]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {ROLE_MAP[item.role]?.label || item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {item.startYear} &ndash; {item.endYear ?? 'Sekarang'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.note || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          onEdit={() => { setEditItem(item); setShowForm(true) }}
                          onDelete={() => setDeleteItem(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Halaman {pagination.page} dari {pagination.totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <HistoryFormModal
          history={editItem}
          teacherList={teacherList}
          allData={allData}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          onSaved={() => { setShowForm(false); setEditItem(null); fetchData(); refreshAllData() }}
        />
      )}
      {deleteItem && (
        <DeleteModal
          title="Hapus Riwayat Jabatan"
          name={`${ROLE_MAP[deleteItem.role]?.label} \u2013 ${deleteItem.teacher?.name}`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          deleting={deleting}
        />
      )}
    </>
  )
}

// ─── History Form Modal ────────────────────────────────────────────────────────
function HistoryFormModal({
  history, teacherList, allData, onClose, onSaved,
}: {
  history: PrincipalHistory | null
  teacherList: { id: number; name: string; photo: string | null }[]
  allData: PrincipalHistory[]
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!history
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const currentYear = new Date().getFullYear()
  const [form, setForm] = useState({ teacherId: '', role: 'KEPALA_SEKOLAH', startYear: String(currentYear), endYear: '', note: '' })

  useEffect(() => {
    if (history) setForm({
      teacherId: String(history.teacherId), role: history.role,
      startYear: String(history.startYear), endYear: history.endYear ? String(history.endYear) : '',
      note: history.note || '',
    })
  }, [history])

  const validateConflict = (): string => {
    const start = parseInt(form.startYear)
    const end = form.endYear ? parseInt(form.endYear) : null
    if (isNaN(start)) return 'Tahun mulai tidak valid'
    if (end !== null && end < start) return 'Tahun selesai tidak boleh lebih kecil dari tahun mulai'
    if (end !== null && end > currentYear) return `Tahun selesai tidak boleh melebihi tahun ini (${currentYear})`
    for (const h of allData) {
      if (isEdit && h.id === history!.id) continue
      if (h.role !== form.role) continue
      const hEnd = h.endYear ?? 9999
      const newEnd = end ?? 9999
      if (start <= hEnd && newEnd >= h.startYear) {
        if (h.endYear === null) {
          return `${ROLE_MAP[form.role]?.label} "${h.teacher?.name}" masih aktif menjabat (${h.startYear} \u2013 Sekarang). Edit data tersebut terlebih dahulu untuk mengisi tahun selesai sebelum menambah penerus baru.`
        }
        return `Periode bertabrakan dengan ${ROLE_MAP[form.role]?.label} "${h.teacher?.name}" (${h.startYear} \u2013 ${h.endYear}). Edit masa akhir periode jabatan sebelumnya untuk menghindari duplika data.`
      }
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.teacherId) { setError('Pilih guru terlebih dahulu'); return }
    const conflict = validateConflict()
    if (conflict) { setError(conflict); return }
    setSaving(true); setError('')
    try {
      const res = await fetch(
        isEdit ? `/api/teachers/principal-history/${history!.id}` : '/api/teachers/principal-history',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherId: parseInt(form.teacherId), role: form.role,
            startYear: parseInt(form.startYear), endYear: form.endYear ? parseInt(form.endYear) : null,
            note: form.note || null,
          }),
        },
      )
      const json = await res.json()
      if (json.success) onSaved(); else setError(json.message || 'Gagal menyimpan')
    } catch { setError('Terjadi kesalahan') } finally { setSaving(false) }
  }

  const selectedTeacher = teacherList.find(t => String(t.id) === form.teacherId)

  // IDs guru yang sedang aktif menjabat (endYear === null) di jabatan apapun.
  // Saat mode Edit: guru yang sedang diedit (teacher + role sama) tetap boleh tampil.
  const activeTeacherIds = new Set(
    allData
      .filter(h => {
        if (h.endYear !== null) return false                        // sudah selesai, boleh dipilih
        if (isEdit && h.teacherId === history!.teacherId) return false  // guru yg sedang diedit: tetap tampil
        return true
      })
      .map(h => h.teacherId)
  )
  const availableTeachers = teacherList.filter(t => !activeTeacherIds.has(t.id))

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-4 h-4" /></button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Riwayat Jabatan' : 'Tambah Riwayat Jabatan'}</h2>
                  <p className="text-xs text-gray-500">{isEdit ? 'Perbarui data riwayat jabatan' : 'Tambahkan riwayat jabatan pimpinan'}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            {error && <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 leading-relaxed">{error}</div>}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {selectedTeacher && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {selectedTeacher.photo ? (
                    <Image src={selectedTeacher.photo} alt={selectedTeacher.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" unoptimized />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-blue-600">{selectedTeacher.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{selectedTeacher.name}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Guru <span className="text-red-500">*</span></label>
                <SearchableSelect
                  value={form.teacherId}
                  onChange={val => { setForm(f => ({ ...f, teacherId: val })); setError('') }}
                  options={availableTeachers.map(t => ({ id: t.id, label: t.name, photo: t.photo }))}
                  placeholder="-- Pilih Guru --"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jabatan <span className="text-red-500">*</span></label>
                <select value={form.role} onChange={e => {
                  const newRole = e.target.value
                  setForm(f => ({
                    ...f,
                    role: newRole,
                    teacherId: activeTeacherIds.has(Number(f.teacherId)) ? '' : f.teacherId,
                  }))
                  setError('')
                }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                  <option value="WAKIL_KEPALA_SEKOLAH">Wakil Kepala Sekolah</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun Mulai <span className="text-red-500">*</span></label>
                  <input type="number" min={1900} max={2100} value={form.startYear}
                    onChange={e => { setForm(f => ({ ...f, startYear: e.target.value })); setError('') }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun Selesai</label>
                  <input
                    type="number"
                    min={1900}
                    max={currentYear}
                    value={form.endYear}
                    onChange={e => {
                      const val = e.target.value
                      const num = parseInt(val)
                      if (val !== '' && !isNaN(num) && num > currentYear) return
                      setForm(f => ({ ...f, endYear: val }))
                      setError('')
                    }}
                    placeholder="Kosong = Sekarang"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Maksimal tahun {currentYear} kosongkan jika masih menjabat. </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan</label>
                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Catatan tambahan (opsional)" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// TAB 3 – KELOLA JABATAN
// =============================================================================
function PositionsTab() {
  const [data, setData] = useState<Position[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Position | null>(null)
  const [deleteItem, setDeleteItem] = useState<Position | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [maxOrder, setMaxOrder] = useState(0)

  const fetchGlobalMax = () => {
    fetch('/api/positions?all=true').then(r => r.json()).then(j => {
      if (j.success && j.data.length > 0)
        setMaxOrder(Math.max(...(j.data as Position[]).map(x => x.orderPosition)))
    }).catch(() => {})
  }
  useEffect(() => { fetchGlobalMax() }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams(); p.set('page', String(pagination.page)); if (search) p.set('search', search)
      const res = await fetch('/api/positions?' + p); const json = await res.json()
      if (json.success) { setData(json.data); setPagination(json.pagination) }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [pagination.page, search])
  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteItem) return; setDeleting(true); setDeleteError('')
    try {
      const res = await fetch(`/api/positions/${deleteItem.id}`, { method: 'DELETE' }); const json = await res.json()
      if (json.success) { setDeleteItem(null); setDeleteError(''); fetchData(); fetchGlobalMax() }
      else setDeleteError(json.message || 'Gagal menghapus jabatan')
    } catch { setDeleteError('Terjadi kesalahan saat menghapus') } finally { setDeleting(false) }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari nama jabatan..." value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shrink-0">
          <Plus className="w-4 h-4" /> Tambah Jabatan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : data.length === 0 ? (
          <div className="text-center py-20"><Award className="w-10 h-10 mx-auto text-gray-300 mb-2" /><p className="text-gray-400">Belum ada data jabatan.</p></div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 w-24 text-center">Urutan</th>
                  <th className="px-6 py-4">Nama Jabatan</th>
                  <th className="px-6 py-4">Deskripsi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">{item.orderPosition}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          onEdit={() => { setEditItem(item); setShowForm(true) }}
                          onDelete={() => { setDeleteItem(item); setDeleteError('') }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Halaman {pagination.page} dari {pagination.totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <PositionFormModal
          position={editItem}
          nextOrder={maxOrder + 1}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          onSaved={() => { setShowForm(false); setEditItem(null); fetchData(); fetchGlobalMax() }}
        />
      )}
      {deleteItem && (
        <DeleteModal
          title="Hapus Jabatan"
          name={deleteItem.name}
          errorMsg={deleteError}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteItem(null); setDeleteError('') }}
          deleting={deleting}
        />
      )}
    </>
  )
}

// ─── Position Form Modal ────────────────────────────────────────────────────────
function PositionFormModal({
  position, nextOrder, onClose, onSaved,
}: {
  position: Position | null
  nextOrder: number
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!position
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', orderPosition: nextOrder, isActive: true })

  useEffect(() => {
    if (position) {
      setForm({ name: position.name || '', description: position.description || '', orderPosition: position.orderPosition, isActive: position.isActive })
    } else {
      setForm(f => ({ ...f, orderPosition: nextOrder }))
    }
  }, [position, nextOrder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nama jabatan wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const checkRes = await fetch('/api/positions?all=true')
      const checkJson = await checkRes.json()
      if (checkJson.success) {
        const others = (checkJson.data as Position[]).filter(p => !isEdit || p.id !== position!.id)
        if (others.some(p => p.orderPosition === form.orderPosition)) {
          setError(`Urutan tampil ${form.orderPosition} sudah digunakan oleh jabatan lain. Gunakan urutan yang berbeda.`)
          setSaving(false); return
        }
      }
      const res = await fetch(isEdit ? `/api/positions/${position!.id}` : '/api/positions', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), description: form.description || null, orderPosition: Number(form.orderPosition), isActive: form.isActive }),
      })
      const json = await res.json()
      if (json.success) onSaved(); else setError(json.message || 'Gagal menyimpan')
    } catch { setError('Terjadi kesalahan') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-4 h-4" /></button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Jabatan' : 'Tambah Jabatan'}</h2>
                  <p className="text-xs text-gray-500">{isEdit ? 'Perbarui data jabatan' : 'Tambahkan jabatan baru'}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            {error && <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Jabatan <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Guru Mata Pelajaran" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Deskripsi singkat jabatan (opsional)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan Tampil</label>
                <input type="number" min={1} value={form.orderPosition} onChange={e => setForm(f => ({ ...f, orderPosition: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {!isEdit && <p className="text-xs text-gray-400 mt-1.5">Diisi otomatis dengan urutan selanjutnya ({nextOrder}). Urutan harus unik.</p>}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status Jabatan</label>
                  <p className="text-xs text-gray-400 mt-0.5">Jabatan aktif dapat dipilih saat tambah guru</p>
                </div>
                <button type="button" onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// PAGE ROOT
// =============================================================================
export default function TeachersPage() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'history' | 'positions'>('teachers')
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Guru &amp; Staff</h2>
          <p className="text-sm text-gray-500">Kelola data guru, staf, riwayat jabatan pimpinan, dan jabatan</p>
        </div>
      </div>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'teachers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          <Users className="w-4 h-4" /> Guru &amp; Staff
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          <BookOpen className="w-4 h-4" /> Riwayat Jabatan
        </button>
        <button onClick={() => setActiveTab('positions')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'positions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          <Award className="w-4 h-4" /> Kelola Jabatan
        </button>
      </div>
      {activeTab === 'teachers' && <TeachersTab />}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'positions' && <PositionsTab />}
    </div>
  )
}
