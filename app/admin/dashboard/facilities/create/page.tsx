'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Loader2, ImageIcon, X } from 'lucide-react'

const CATEGORIES = [
  { value: 'gedung', label: 'Gedung' },
  { value: 'kelas', label: 'Ruang Kelas' },
  { value: 'lab', label: 'Laboratorium' },
  { value: 'perpustakaan', label: 'Perpustakaan' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'lainnya', label: 'Lainnya' },
]

const CONDITIONS = [
  { value: 'baik_sekali', label: 'Baik Sekali' },
  { value: 'baik', label: 'Baik' },
  { value: 'cukup', label: 'Cukup' },
  { value: 'perlu_perbaikan', label: 'Perlu Perbaikan' },
  { value: 'rusak', label: 'Rusak' },
]

export default function CreateFacilityPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    category: 'kelas',
    customCategory: '',
    description: '',
    image: '',
    quantity: 1,
    quantityType: 'jumlah' as 'jumlah' | 'kapasitas',
    condition: 'baik',
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      const url = json.data?.url || json.url
      if (url) setForm(f => ({ ...f, image: url }))
      else setError('Gagal upload gambar')
    } catch { setError('Gagal upload gambar') }
    finally { setUploading(false); e.target.value = '' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nama fasilitas wajib diisi'); return }
    if (form.category === 'lainnya' && !form.customCategory.trim()) {
      setError('Nama kategori lainnya wajib diisi'); return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category === 'lainnya' ? form.customCategory.trim() : form.category,
        description: form.description.trim() || null,
        image: form.image || null,
        quantity: form.quantity,
        quantityType: form.quantityType,
        condition: form.condition,
      }
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) router.push('/admin/dashboard/facilities')
      else setError(json.message || 'Gagal menyimpan')
    } catch { setError('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/facilities"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tambah Fasilitas</h2>
          <p className="text-sm text-gray-500 mt-0.5">Tambah data fasilitas sekolah</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Fasilitas <span className="text-red-500">*</span></label>
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Contoh: Lab Komputer 1"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        {/* Kategori + Kondisi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori <span className="text-red-500">*</span></label>
            <select value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value, customCategory: '' }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {form.category === 'lainnya' && (
              <input type="text" value={form.customCategory}
                onChange={e => setForm(f => ({ ...f, customCategory: e.target.value }))}
                placeholder="Tuliskan kategori..."
                className="w-full mt-2 px-4 py-2.5 bg-gray-50 border border-orange-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kondisi</label>
            <select value={form.condition}
              onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
          <textarea rows={3} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Detail fasilitas..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>

        {/* Jumlah */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah / Kapasitas</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex bg-gray-100 rounded-xl p-1 w-fit">
              {(['jumlah', 'kapasitas'] as const).map(mode => (
                <button key={mode} type="button" onClick={() => setForm(f => ({ ...f, quantityType: mode }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${form.quantityType === mode ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}>
                  {mode === 'jumlah' ? 'Kuantitas' : 'Kapasitas'}
                </button>
              ))}
            </div>
            <input type="number" min={1} value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Pilih jenis angka lalu isi nilai sesuai kebutuhan.</p>
        </div>

        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Fasilitas</label>
          {form.image ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <Image src={form.image} alt="Preview" fill className="object-cover" unoptimized />
              <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all disabled:opacity-50">
              {uploading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-xs">Mengupload...</span></>
              ) : (
                <><ImageIcon className="w-6 h-6" /><span className="text-xs">Klik untuk upload foto</span>
                <span className="text-xs text-gray-300">JPG, PNG, WebP</span></>
              )}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link href="/admin/dashboard/facilities"
            className="px-6 py-2.5 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all">
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}

