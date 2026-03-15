'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

const categories = [
  { value: 'gedung', label: 'Gedung' },
  { value: 'kelas', label: 'Ruang Kelas' },
  { value: 'lab', label: 'Laboratorium' },
  { value: 'perpustakaan', label: 'Perpustakaan' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'lainnya', label: 'Lainnya' },
]

const conditions = [
  { value: 'baik', label: 'Baik' },
  { value: 'rusak', label: 'Rusak' },
  { value: 'perlu_perbaikan', label: 'Perlu Perbaikan' },
]

export default function EditFacilityPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    category: 'kelas',
    description: '',
    image: '',
    quantity: 1,
    quantityType: 'jumlah' as 'jumlah' | 'kapasitas',
    condition: 'baik',
    orderPosition: 0,
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/facilities/${id}`)
        const json = await res.json()
        if (json.success) {
          const d = json.data
          setForm({
            name: d.name || '',
            category: d.category || 'kelas',
            description: d.description || '',
            image: d.image || '',
            quantity: d.quantity || 1,
            quantityType: d.quantityType === 'kapasitas' ? 'kapasitas' : 'jumlah',
            condition: d.condition || 'baik',
            orderPosition: d.orderPosition || 0,
          })
        }
      } catch { setError('Gagal memuat data') }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/facilities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        router.push('/admin/dashboard/facilities')
      } else {
        setError(json.message || 'Gagal menyimpan')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/facilities" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Edit Fasilitas</h2>
          <p className="text-sm text-gray-500">Ubah data fasilitas sekolah</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Fasilitas <span className="text-red-500">*</span></label>
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori <span className="text-red-500">*</span></label>
            <select value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kondisi <span className="text-red-500">*</span></label>
            <select value={form.condition}
              onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
          <textarea rows={3} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan Tampil</label>
            <input type="number" value={form.orderPosition}
              onChange={e => setForm(f => ({ ...f, orderPosition: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Gambar</label>
          <input type="text" value={form.image}
            onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
          <Link href="/admin/dashboard/facilities" className="px-6 py-2.5 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all">
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}
