'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight,
  Loader2, Building2, MoreVertical, AlertTriangle,
  X, Upload, ImageIcon, Save, Tag, Palette, Filter,
} from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Facility {
  id: number
  name: string
  description: string | null
  category: string
  image: string | null
  quantity: number
  condition: string
  orderPosition: number
  createdAt: string
}

interface FacilityCat {
  id: number
  name: string
  color: string
  isActive: boolean
  sortOrder: number
}

interface Pagination { page: number; limit: number; total: number; totalPages: number }

const CONDITION_COLORS: Record<string, string> = {
  baik: 'bg-green-50 text-green-700',
  rusak: 'bg-red-50 text-red-700',
  perlu_perbaikan: 'bg-yellow-50 text-yellow-700',
}
const CONDITION_LABELS: Record<string, string> = {
  baik: 'Baik',
  rusak: 'Rusak',
  perlu_perbaikan: 'Perlu Perbaikan',
}

const COLOR_OPTIONS = [
  { label: 'Biru',   value: 'bg-blue-50 text-blue-700' },
  { label: 'Ungu',   value: 'bg-purple-50 text-purple-700' },
  { label: 'Hijau',  value: 'bg-green-50 text-green-700' },
  { label: 'Kuning', value: 'bg-amber-50 text-amber-700' },
  { label: 'Indigo', value: 'bg-indigo-50 text-indigo-700' },
  { label: 'Merah',  value: 'bg-red-50 text-red-700' },
  { label: 'Abu',    value: 'bg-gray-100 text-gray-600' },
]

// ─── ActionDropdown ───────────────────────────────────────────────────────────
function ActionDropdown({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(120)
  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} onClick={toggle}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }} className="w-32 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          <button onClick={() => { close(); onEdit() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { close(); onDelete() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

// ─── DeleteModal ──────────────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel, deleting }: {
  name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean
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
            <h3 className="text-lg font-bold text-gray-900">Hapus Fasilitas</h3>
            <p className="text-sm text-gray-500">
              Yakin ingin menghapus <span className="font-semibold text-gray-700">{name}</span>?
            </p>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50">
              Batal
            </button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      const url = json?.data?.url || json?.url || ''
      if (url) onChange(url)
    } finally { setUploading(false) }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar</label>
      <div className="flex items-start gap-3">
        <div className="relative w-24 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <>
              <Image src={value} alt="preview" fill className="object-cover" unoptimized />
              <button type="button" onClick={() => onChange('')}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Mengunggah...' : 'Pilih File'}
          </button>
          {value && <p className="text-xs text-gray-400 mt-1.5 truncate max-w-40">{value.split('/').pop()}</p>}
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP. Maks 5MB.</p>
        </div>
      </div>
    </div>
  )
}

// ─── FacilityFormFields ───────────────────────────────────────────────────────
function FacilityFormFields({
  form, setForm, categories, error,
}: {
  form: { name: string; description: string; category: string; image: string; quantity: number; condition: string }
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; category: string; image: string; quantity: number; condition: string }>>
  categories: FacilityCat[]
  error: string
}) {
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Fasilitas *</label>
        <input type="text" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Contoh: Lab Komputer 1"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
        <textarea rows={2} value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Deskripsi singkat fasilitas..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
          <select required value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">-- Pilih Kategori --</option>
            {categories.filter(c => c.isActive).map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kondisi *</label>
          <select required value={form.condition}
            onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="baik">Baik</option>
            <option value="perlu_perbaikan">Perlu Perbaikan</option>
            <option value="rusak">Rusak</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah / Kapasitas</label>
        <input type="number" min={1} value={form.quantity}
          onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <ImageUpload value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} />
    </div>
  )
}

// ─── AddModal ─────────────────────────────────────────────────────────────────
const BLANK_FORM = { name: '', description: '', category: '', image: '', quantity: 1, condition: 'baik' }

function AddModal({ categories, onClose, onSaved }: {
  categories: FacilityCat[]; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({ ...BLANK_FORM })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nama fasilitas wajib diisi'); return }
    if (!form.category) { setError('Kategori wajib dipilih'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          category: form.category,
          image: form.image || null,
          quantity: form.quantity,
          condition: form.condition,
        }),
      })
      const json = await res.json()
      if (json.success) { onSaved(); onClose() }
      else setError(json.message || 'Gagal menyimpan')
    } catch { setError('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={!saving ? onClose : undefined} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-8">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Tambah Fasilitas</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tambah data fasilitas baru</p>
              </div>
              <button onClick={onClose} disabled={saving}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5">
                <FacilityFormFields form={form} setForm={setForm} categories={categories} error={error} />
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <button type="button" onClick={onClose} disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── EditModal ────────────────────────────────────────────────────────────────
function EditModal({ facilityId, categories, onClose, onSaved }: {
  facilityId: number; categories: FacilityCat[]; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({ ...BLANK_FORM })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/facilities/${facilityId}`)
        const json = await res.json()
        if (json.success) {
          const d = json.data
          setForm({
            name: d.name || '',
            description: d.description || '',
            category: d.category || '',
            image: d.image || '',
            quantity: d.quantity || 1,
            condition: d.condition || 'baik',
          })
        } else { setError('Gagal memuat data') }
      } catch { setError('Gagal memuat data') }
      finally { setLoading(false) }
    }
    load()
  }, [facilityId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nama fasilitas wajib diisi'); return }
    if (!form.category) { setError('Kategori wajib dipilih'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/facilities/${facilityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          category: form.category,
          image: form.image || null,
          quantity: form.quantity,
          condition: form.condition,
        }),
      })
      const json = await res.json()
      if (json.success) { onSaved(); onClose() }
      else setError(json.message || 'Gagal menyimpan')
    } catch { setError('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={!saving ? onClose : undefined} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-8">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Edit Fasilitas</h3>
                <p className="text-xs text-gray-500 mt-0.5">Ubah data fasilitas</p>
              </div>
              <button onClick={onClose} disabled={saving}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-5">
                  <FacilityFormFields form={form} setForm={setForm} categories={categories} error={error} />
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  <button type="button" onClick={onClose} disabled={saving}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all">
                    Batal
                  </button>
                  <button type="submit" disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CategoryFormModal ────────────────────────────────────────────────────────
function CategoryFormModal({
  mode, initial, onClose, onSaved,
}: {
  mode: 'add' | 'edit'
  initial?: FacilityCat
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    color: initial?.color ?? 'bg-gray-100 text-gray-600',
    isActive: initial?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nama kategori wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const url = mode === 'add' ? '/api/facility-categories' : `/api/facility-categories/${initial!.id}`
      const method = mode === 'add' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), color: form.color, isActive: form.isActive }),
      })
      const json = await res.json()
      if (json.success) { onSaved(); onClose() }
      else setError(json.message || 'Gagal menyimpan')
    } catch { setError('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  const previewColor = COLOR_OPTIONS.find(c => c.value === form.color)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={!saving ? onClose : undefined} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {mode === 'add' ? 'Tambah Kategori' : 'Edit Kategori'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {mode === 'add' ? 'Tambah kategori fasilitas baru' : 'Ubah data kategori fasilitas'}
                </p>
              </div>
              <button onClick={onClose} disabled={saving}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-5 py-5 space-y-4">
                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kategori *</label>
                  <input type="text" required value={form.name} placeholder="Contoh: Ruang Serbaguna"
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <Palette className="w-3.5 h-3.5" /> Warna Badge
                  </label>
                  <div className="flex items-center gap-3">
                    <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${form.color}`}>
                      {previewColor?.label ?? 'Preview'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status Aktif</p>
                    <p className="text-xs text-gray-400 mt-0.5">Kategori aktif muncul di pilihan saat tambah fasilitas</p>
                  </div>
                  <button type="button" onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                    className={`relative w-10 h-5 rounded-full transition-all ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <button type="button" onClick={onClose} disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── DeleteCategoryModal ──────────────────────────────────────────────────────
function DeleteCategoryModal({ name, onConfirm, onCancel, deleting }: {
  name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean
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
            <h3 className="text-lg font-bold text-gray-900">Hapus Kategori</h3>
            <p className="text-sm text-gray-500">
              Yakin ingin menghapus kategori <span className="font-semibold text-gray-700">{name}</span>?
            </p>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50">
              Batal
            </button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CategoriesTab ────────────────────────────────────────────────────────────
function CategoriesTab() {
  const [cats, setCats] = useState<FacilityCat[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<FacilityCat | null>(null)
  const [deleteModal, setDeleteModal] = useState<FacilityCat | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/facility-categories')
      const json = await res.json()
      if (json.success) setCats(json.data || [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchCats() }, [fetchCats])

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/facility-categories/${deleteModal.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) { setDeleteModal(null); fetchCats() }
    } finally { setDeleting(false) }
  }

  const filtered = cats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari kategori..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <button onClick={() => setAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Tag className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada kategori'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${cat.color}`}>
                        {cat.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {cat.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionDropdown
                        onEdit={() => setEditModal(cat)}
                        onDelete={() => setDeleteModal(cat)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {addModal && (
        <CategoryFormModal mode="add" onClose={() => setAddModal(false)} onSaved={fetchCats} />
      )}
      {editModal && (
        <CategoryFormModal mode="edit" initial={editModal} onClose={() => setEditModal(null)} onSaved={fetchCats} />
      )}
      {deleteModal && (
        <DeleteCategoryModal
          name={deleteModal.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}

// ─── FacilitiesTab ────────────────────────────────────────────────────────────
function FacilitiesTab({ categories }: { categories: FacilityCat[] }) {
  const [data, setData] = useState<Facility[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<number | null>(null)
  const [deleteModal, setDeleteModal] = useState<Facility | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(pagination.page), limit: '10' })
      if (search) params.set('search', search)
      if (categoryFilter) params.set('category', categoryFilter)
      const res = await fetch(`/api/facilities?${params}`)
      const json = await res.json()
      if (json.success) { setData(json.data); setPagination(json.pagination) }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [pagination.page, search, categoryFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/facilities/${deleteModal.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) { setDeleteModal(null); fetchData() }
    } catch (err) { console.error(err) }
    finally { setDeleting(false) }
  }

  const activeFilters = (search ? 1 : 0) + (categoryFilter ? 1 : 0)

  // Map category name to color
  const catColor = (name: string) => {
    const found = categories.find(c => c.name === name)
    return found?.color || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar — same style as Guru & Staff */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari fasilitas..." value={search}
              onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-40">
              <option value="">Semua Kategori</option>
              {categories.filter(c => c.isActive).map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" /> Tambah Fasilitas
          </button>
          {/* {activeFilters > 0 && (
            <button onClick={() => { setSearch(''); setCategoryFilter(''); setPagination(p => ({ ...p, page: 1 })) }}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 transition-all whitespace-nowrap">
              <X className="w-3.5 h-3.5" /> Reset ({activeFilters})
            </button>
          )} */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">{search || categoryFilter ? 'Tidak ada hasil yang sesuai filter' : 'Belum ada data fasilitas'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fasilitas</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Kategori</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Jumlah</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kondisi</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(item => {
                  const condLabel = CONDITION_LABELS[item.condition] || item.condition
                  const condColor = CONDITION_COLORS[item.condition] || 'bg-gray-100 text-gray-600'
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                            {item.image
                              ? <Image src={item.image} alt={item.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                              : <Building2 className="w-5 h-5 text-blue-400" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-50">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${catColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-600">{item.quantity}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${condColor}`}>
                          {condLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ActionDropdown
                          onEdit={() => setEditModal(item.id)}
                          onDelete={() => setDeleteModal(item)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Menampilkan {data.length} dari {pagination.total} fasilitas</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 font-medium px-2">{pagination.page} / {pagination.totalPages}</span>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addModal && <AddModal categories={categories} onClose={() => setAddModal(false)} onSaved={fetchData} />}
      {editModal !== null && (
        <EditModal facilityId={editModal} categories={categories} onClose={() => setEditModal(null)} onSaved={fetchData} />
      )}
      {deleteModal && (
        <DeleteModal
          name={deleteModal.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<'facilities' | 'categories'>('facilities')
  const [categories, setCategories] = useState<FacilityCat[]>([])

  useEffect(() => {
    fetch('/api/facility-categories')
      .then(r => r.json())
      .then(j => { if (j.success) setCategories(j.data || []) })
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Fasilitas</h2>
          <p className="text-sm text-gray-500 mt-0.5">Kelola data fasilitas dan kategori fasilitas sekolah</p>
        </div>
      </div>

      {/* Tabs — same pattern as Guru & Staff */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'facilities' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          <Building2 className="w-4 h-4" /> Fasilitas
        </button>
        <button onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          <Tag className="w-4 h-4" /> Kelola Kategori
        </button>
      </div>

      {activeTab === 'facilities' && <FacilitiesTab categories={categories} />}
      {activeTab === 'categories' && <CategoriesTab />}
    </div>
  )
}
