'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Edit2, Trash2, Loader2, Link as LinkIcon, Building2, Search, Upload, X, MoreVertical, Eye } from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

interface Partner {
  id: number
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  orderPosition: number
  isActive: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function PartnersPage() {
  const [data, setData] = useState<Partner[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const [form, setForm] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    orderPosition: 0,
    isActive: true,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      params.set('limit', String(pagination.limit))
      if (search) params.set('search', search)
      const res = await fetch('/api/partners?' + params.toString())
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setPagination(json.pagination)
      }
    } catch (err) {
      console.error(err)
      setError('Gagal memuat data mitra')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    const nextOrder =
      data.length > 0 ? Math.max(...data.map(p => p.orderPosition ?? 0)) + 1 : 1

    setEditing(null)
    setForm({
      name: '',
      logoUrl: '',
      websiteUrl: '',
      orderPosition: nextOrder,
      isActive: true,
    })
    setModalOpen(true)
  }

  const openEdit = (partner: Partner) => {
    setEditing(partner)
    setForm({
      name: partner.name,
      logoUrl: partner.logoUrl ?? '',
      websiteUrl: partner.websiteUrl ?? '',
      orderPosition: partner.orderPosition,
      isActive: partner.isActive,
    })
    setModalOpen(true)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        setForm(f => ({ ...f, logoUrl: json.data.url }))
      } else {
        setError(json.message || 'Gagal upload logo')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan saat upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() || null,
        websiteUrl: form.websiteUrl.trim() || null,
        orderPosition: form.orderPosition,
        isActive: form.isActive,
      }
      const url = editing ? '/api/partners/' + editing.id : '/api/partners'
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

  const handleDelete = async (partner: Partner) => {
    if (!confirm(`Hapus mitra "${partner.name}"?`)) return
    try {
      const res = await fetch('/api/partners/' + partner.id, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) {
        alert(json.message || 'Gagal menghapus data')
      } else {
        fetchData()
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Mitra Kerja Sama</h1>
          <p className="text-sm text-gray-500">Kelola logo dan informasi mitra kerja sama sekolah</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama mitra..."
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
          Tambah Mitra
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                Belum ada data mitra. Gunakan tombol <span className="font-semibold">Tambah Mitra</span> untuk menambahkan kerja sama baru.
              </p>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Mitra</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Urutan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map(partner => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {partner.logoUrl ? (
                        <div className="w-20 h-12 rounded-lg bg-white border border-gray-100 overflow-hidden flex items-center justify-center">
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="max-h-10 max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-12 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                          Tidak ada logo
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{partner.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      {partner.websiteUrl ? (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <LinkIcon className="w-3 h-3" />
                          {partner.websiteUrl}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {partner.orderPosition}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${partner.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {partner.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionDropdown
                        onEdit={() => openEdit(partner)}
                        onDelete={() => handleDelete(partner)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {editing ? 'Edit Mitra' : 'Tambah Mitra'}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Isi nama mitra, URL logo, dan alamat website mitra.
            </p>

            {error && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nama Mitra <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: PT Indo Karya"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Logo Mitra
                </label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {form.logoUrl ? (
                  <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                    <div className="w-full h-28 flex items-center justify-center bg-white">
                      <img
                        src={form.logoUrl}
                        alt={form.name || 'Logo mitra'}
                        className="max-h-20 max-w-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow"
                      >
                        Ganti Logo
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(f => ({ ...f, logoUrl: '' }))
                        if (logoInputRef.current) logoInputRef.current.value = ''
                      }}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50"
                    >
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/30 transition-all disabled:opacity-50"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">
                      {uploadingLogo ? 'Mengupload logo...' : 'Klik untuk upload logo mitra'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      PNG, JPG, GIF, WEBP (maks 5MB)
                    </span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  URL Website
                </label>
                <input
                  type="text"
                  value={form.websiteUrl}
                  onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={form.orderPosition}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        orderPosition: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        Status Mitra
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {form.isActive
                          ? 'Ditampilkan di halaman utama'
                          : 'Disimpan sebagai draft, belum tampil'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm(f => ({ ...f, isActive: !f.isActive }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-all shrink-0 ml-3 ${form.isActive ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : ''
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setError(null) }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  disabled={saving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionDropdown({ onEdit, onDelete }: {
  onEdit: () => void; onDelete: () => void
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(140)
  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        ref={btnRef}
        onClick={toggle}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            top: dropUp ? 'auto' : pos.top,
            bottom: dropUp ? window.innerHeight - pos.top : 'auto',
            right: pos.right,
            zIndex: 9999,
          }}
          className="w-40 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
        >
          <button
            onClick={() => { close(); onEdit() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => { close(); onDelete() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}
