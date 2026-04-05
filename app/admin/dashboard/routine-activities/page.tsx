'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CalendarDays,
  Clock3,
  Sparkles,
  Users,
  Heart,
  GraduationCap,
  Activity,
  Music2,
  Dumbbell,
  BookOpen,
  Flame,
  Palette,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Search,
  MoreVertical,
  X,
  AlertTriangle,
} from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

interface RoutineActivity {
  id: number
  name?: string | null
  days?: string | null
  time?: string | null
  description?: string | null
  icon?: string | null
  orderPosition: number
  isActive: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const ICON_OPTIONS = [
  { value: 'CalendarDays', label: 'Calendar' },
  { value: 'Clock3', label: 'Clock' },
  { value: 'Heart', label: 'Heart' },
  { value: 'GraduationCap', label: 'Graduation Cap' },
  { value: 'Users', label: 'Users' },
  { value: 'Sparkles', label: 'Sparkles' },
  { value: 'Activity', label: 'Olahraga' },
  { value: 'Music2', label: 'Musik' },
  { value: 'Dumbbell', label: 'Kebugaran' },
  { value: 'BookOpen', label: 'Literasi' },
  { value: 'Flame', label: 'Semangat' },
  { value: 'Palette', label: 'Seni' },
  { value: 'Gamepad2', label: 'E-Sport' },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CalendarDays,
  Clock3,
  Heart,
  GraduationCap,
  Users,
  Sparkles,
  Activity,
  Music2,
  Dumbbell,
  BookOpen,
  Flame,
  Palette,
  Gamepad2,
}

function ActionDropdown({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(120)

  return (
    <div ref={ref} className="relative inline-block">
      <button ref={btnRef} onClick={toggle} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div
          style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }}
          className="w-36 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
        >
          <button
            onClick={() => {
              close()
              onEdit()
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => {
              close()
              onDelete()
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

function DeleteModal({ title, name, onConfirm, onCancel, deleting }: { title: string; name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  return (
    <div className="fixed inset-0 z-60 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">
              Yakin ingin menghapus <span className="font-semibold text-gray-700">{name}</span>?
            </p>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
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
              disabled={deleting}
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

export default function RoutineActivitiesPage() {
  const [data, setData] = useState<RoutineActivity[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<RoutineActivity | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RoutineActivity | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    days: '',
    time: '',
    description: '',
    icon: 'CalendarDays',
    orderPosition: 1,
    isActive: true,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      params.set('limit', String(pagination.limit))
      if (search) params.set('search', search)
      const res = await fetch('/api/routine-activities?' + params.toString())
      const json = await res.json()
      if (json.success) {
        setData(json.data as RoutineActivity[])
        setPagination(json.pagination as Pagination)
      }
    } catch (err) {
      console.error(err)
      setError('Gagal memuat kegiatan rutin')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    const nextOrder = data.length > 0 ? Math.max(...data.map(item => item.orderPosition ?? 0)) + 1 : 1
    setEditing(null)
    setForm({
      name: '',
      days: '',
      time: '',
      description: '',
      icon: 'CalendarDays',
      orderPosition: nextOrder,
      isActive: true,
    })
    setModalOpen(true)
  }

  const openEdit = (item: RoutineActivity) => {
    setEditing(item)
    setForm({
      name: item.name ?? '',
      days: item.days ?? '',
      time: item.time ?? '',
      description: item.description ?? '',
      icon: item.icon ?? 'CalendarDays',
      orderPosition: item.orderPosition,
      isActive: item.isActive,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const normalizedOrder = Math.max(1, Number(form.orderPosition) || 1)
      const duplicateInCurrentPage = data.some((item) =>
        item.orderPosition === normalizedOrder && (!editing || item.id !== editing.id),
      )
      if (duplicateInCurrentPage) {
        setError('Urutan tampil sudah dipakai pada data lain. Gunakan angka yang berbeda.')
        setSaving(false)
        return
      }

      const payload = {
        name: form.name.trim(),
        days: form.days.trim() || null,
        time: form.time.trim() || null,
        description: form.description.trim() || null,
        icon: form.icon || null,
        orderPosition: normalizedOrder,
        isActive: form.isActive,
      }
      const url = editing ? '/api/routine-activities/' + editing.id : '/api/routine-activities'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.message || 'Gagal menyimpan data')
      } else {
        setModalOpen(false)
        fetchData()
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan saat menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch('/api/routine-activities/' + deleteTarget.id, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) {
        alert(json.message || 'Gagal menghapus data')
      } else {
        setDeleteTarget(null)
        fetchData()
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus')
    } finally {
      setDeleting(false)
    }
  }

  const IconPreview = useMemo(() => iconMap[form.icon] ?? CalendarDays, [form.icon])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Kegiatan Rutin</h1>
          <p className="text-sm text-gray-500">Kelola daftar kegiatan terjadwal yang muncul di halaman Student Life</p>
        </div>
        
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama / hari / deskripsi"
            value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Kegiatan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {loading && (
            <div className="p-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Memuat data...
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="p-6 text-sm text-gray-500 text-center">
              Belum ada data kegiatan rutin.
            </div>
          )}

          {!loading && data.length > 0 && data.map(item => {
            const Icon = iconMap[item.icon ?? ''] ?? CalendarDays
            return (
              <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Nonaktif
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {item.days && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                          <CalendarDays className="w-3.5 h-3.5" /> {item.days}
                        </span>
                      )}
                      {item.time && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                          <Clock3 className="w-3.5 h-3.5" /> {item.time}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <ActionDropdown onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Kegiatan Rutin' : 'Tambah Kegiatan Rutin'}</h3>
                <p className="text-sm text-gray-500">Isi detail kegiatan yang akan tampil di halaman siswa</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nama Kegiatan</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Misal: Senam Pagi"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hari</label>
                  <input
                    value={form.days}
                    onChange={e => setForm(f => ({ ...f, days: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Misal: Setiap Hari / Senin & Kamis"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Waktu</label>
                  <input
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Misal: 06:30 - 07:00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ikon</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <IconPreview className="w-6 h-6" />
                    </div>
                    <select
                      value={form.icon}
                      onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ICON_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ringkasan kegiatan"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Urutan Tampil</label>
                  <input
                    type="number"
                    min="1"
                    value={form.orderPosition}
                    onChange={e => setForm(f => ({ ...f, orderPosition: Math.max(1, Number(e.target.value) || 1) }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Aktifkan
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          title="Hapus Kegiatan"
          name={deleteTarget.name ?? 'Kegiatan'}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}

