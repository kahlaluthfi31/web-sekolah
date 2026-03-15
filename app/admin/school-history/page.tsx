'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ArrowLeft, GripVertical, Save, X } from 'lucide-react'
import Link from 'next/link'

interface HistoryItem {
  id: number
  year: string
  title: string
  description: string
  sortOrder: number
}

interface FormData {
  year: string
  title: string
  description: string
  sortOrder: number
}

const EMPTY_FORM: FormData = { year: '', title: '', description: '', sortOrder: 0 }

export default function SchoolHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [error, setError] = useState('')

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/school-history')
      const json = await res.json()
      if (json.success) setItems(json.data ?? [])
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, sortOrder: items.length })
    setError('')
    setShowModal(true)
  }

  const openEdit = (item: HistoryItem) => {
    setEditingId(item.id)
    setForm({ year: item.year, title: item.title, description: item.description, sortOrder: item.sortOrder })
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.year.trim() || !form.title.trim() || !form.description.trim()) {
      setError('Tahun, judul, dan deskripsi wajib diisi.')
      return
    }
    setSaving(true)
    try {
      const url = editingId ? `/api/school-history/${editingId}` : '/api/school-history'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!json.success) { setError(json.message || 'Gagal menyimpan'); return }
      closeModal()
      fetchItems()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data sejarah ini?')) return
    try {
      await fetch(`/api/school-history/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(i => i.id !== id))
    } catch {
      alert('Gagal menghapus')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sejarah Sekolah</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola data perjalanan sejarah sekolah yang ditampilkan di halaman Tentang.</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0077BB] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Sejarah
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 animate-pulse">
                <div className="w-16 h-8 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0092DD]/10 flex items-center justify-center mx-auto mb-4">
              <GripVertical className="w-7 h-7 text-[#0092DD]" />
            </div>
            <p className="text-gray-500 text-sm">Belum ada data sejarah.</p>
            <button onClick={openCreate} className="mt-4 text-[#0092DD] text-sm font-semibold hover:underline">
              + Tambah sejarah pertama
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider w-[8%]">Urutan</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider w-[17%]">Tahun</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Judul &amp; Deskripsi</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider w-[17%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">{item.sortOrder}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center w-12 h-8 rounded-lg bg-[#0092DD] text-white text-xs font-bold">
                      {item.year}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900 mb-0.5">{item.title}</p>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#0092DD] hover:bg-[#0092DD]/10 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Sejarah' : 'Tambah Sejarah Baru'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tahun / Periode <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                    placeholder="Contoh: 1964 atau ke-5"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Urutan Tampil</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Contoh: Berdirinya SMK Negeri 1 Ciamis"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi <span className="text-red-500">*</span></label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Tuliskan penjelasan singkat tentang peristiwa bersejarah ini..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0077BB] disabled:opacity-60 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Sejarah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
