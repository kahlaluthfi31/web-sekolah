'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Loader2, Plus, X, Upload, Globe, ExternalLink, ImageIcon } from 'lucide-react'

interface CompetencyForm {
  id?: number
  name: string
  description: string
  detailType: 'PAGE' | 'EXTERNAL'
  externalUrl: string
  isActive: boolean
}

function PhotoUpload({
  label,
  value,
  onChange,
  hint,
  square = false,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  square?: boolean
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
      const url = json?.data?.url || json?.url || ''
      if (url) onChange(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex items-start gap-3">
        <div className={`relative bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${square ? 'w-20 h-20' : 'w-24 h-16'}`}>
          {value ? (
            <>
              <Image src={value} alt="preview" fill className="object-contain p-1" unoptimized />
              <button type="button" onClick={() => onChange('')}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Mengunggah...' : 'Pilih File'}
          </button>
          {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
          {value && <p className="text-xs text-gray-400 mt-1 truncate max-w-45">{value.split('/').pop()}</p>}
        </div>
      </div>
    </div>
  )
}

export default function EditMajorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    headOfMajor: '',
    image: '',
    icon: '',
    studentImage: '',
    headerBgColor: '',
    detailType: 'PAGE' as 'PAGE' | 'EXTERNAL',
    externalUrl: '',
    isActive: true,
  })
  const [competencies, setCompetencies] = useState<CompetencyForm[]>([])
  const [activeTab, setActiveTab] = useState<'info' | 'settings' | 'competencies'>('info')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/majors/${id}`)
        const json = await res.json()
        if (json.success) {
          const d = json.data
          setForm({
            name: d.name || '',
            code: d.code || '',
            description: d.description || '',
            headOfMajor: d.headOfMajor || '',
            image: d.image || '',
            icon: d.icon || '',
            studentImage: d.studentImage || '',
            headerBgColor: d.headerBgColor || '',
            detailType: d.detailType || 'PAGE',
            externalUrl: d.externalUrl || '',
            isActive: d.isActive ?? true,
          })
          if (d.competencies) {
            setCompetencies(d.competencies.map((c: {
              id?: number; name: string; description?: string
              detailType?: string; externalUrl?: string; isActive?: boolean
            }) => ({
              id: c.id,
              name: c.name || '',
              description: c.description || '',
              detailType: c.detailType || 'PAGE',
              externalUrl: c.externalUrl || '',
              isActive: c.isActive ?? true,
            })))
          }
        }
      } catch { setError('Gagal memuat data') }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const addCompetency = () => setCompetencies(c => [
    ...c,
    { name: '', description: '', detailType: 'PAGE', externalUrl: '', isActive: true },
  ])
  const removeCompetency = (i: number) => setCompetencies(c => c.filter((_, idx) => idx !== i))
  const updateCompetency = (i: number, field: keyof CompetencyForm, val: string | boolean) => {
    setCompetencies(c => c.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.detailType === 'EXTERNAL' && !form.externalUrl.trim()) {
      setError('URL eksternal wajib diisi jika tipe Redirect Eksternal'); return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim() || null,
        description: form.description.trim() || null,
        headOfMajor: form.headOfMajor.trim() || null,
        image: form.image || null,
        icon: form.icon || null,
  studentImage: form.studentImage || null,
  headerBgColor: form.headerBgColor.trim() || null,
        detailType: form.detailType,
        externalUrl: form.detailType === 'EXTERNAL' ? form.externalUrl.trim() : null,
        isActive: form.isActive,
        competencies: competencies
          .filter(c => c.name.trim())
          .map(c => ({
            name: c.name.trim(),
            description: c.description.trim() || null,
            detailType: c.detailType,
            externalUrl: c.detailType === 'EXTERNAL' ? c.externalUrl.trim() : null,
            isActive: c.isActive,
          })),
      }
      const res = await fetch(`/api/majors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        router.push('/admin/dashboard/majors')
      } else {
        setError(json.message || 'Gagal menyimpan')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/majors" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Edit Program Keahlian</h2>
          <p className="text-sm text-gray-500">Ubah data Program dan konsentrasi</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'info', label: 'Informasi Program' },
            { key: 'settings', label: 'Pengaturan Halaman' },
            { key: 'competencies', label: 'Konsentrasi Keahlian' },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <>
            {/* Informasi Dasar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-900">Informasi Program Keahlian</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Program Keahlian <span className="text-red-500">*</span></label>
              <input type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode Program Keahlian</label>
              <input type="text" value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
            <textarea rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kepala Program Keahlian</label>
            <input type="text" value={form.headOfMajor}
              onChange={e => setForm(f => ({ ...f, headOfMajor: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            <PhotoUpload
              label="Gambar Cover"
              value={form.image}
              onChange={url => setForm(f => ({ ...f, image: url }))}
              hint="Gambar banner/cover jurusan"
            />
            <PhotoUpload
              label="Logo / Icon"
              value={form.icon}
              onChange={url => setForm(f => ({ ...f, icon: url }))}
              hint="Logo jurusan"
              square
            />
          </div>
      </div>

      {/* Tipe Halaman */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Tipe Halaman Detail</h3>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, detailType: 'PAGE' }))}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                form.detailType === 'PAGE' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.detailType === 'PAGE' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                <Globe className={`w-4 h-4 ${form.detailType === 'PAGE' ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${form.detailType === 'PAGE' ? 'text-blue-700' : 'text-gray-700'}`}>Halaman Website</p>
                <p className="text-xs text-gray-400 mt-0.5">Tampilkan di website</p>
              </div>
            </button>
            <button type="button" onClick={() => setForm(f => ({ ...f, detailType: 'EXTERNAL' }))}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                form.detailType === 'EXTERNAL' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.detailType === 'EXTERNAL' ? 'bg-orange-100' : 'bg-gray-200'}`}>
                <ExternalLink className={`w-4 h-4 ${form.detailType === 'EXTERNAL' ? 'text-orange-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${form.detailType === 'EXTERNAL' ? 'text-orange-700' : 'text-gray-700'}`}>Redirect Eksternal</p>
                <p className="text-xs text-gray-400 mt-0.5">Instagram, website, dll</p>
              </div>
            </button>
          </div>

          {form.detailType === 'EXTERNAL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Tujuan <span className="text-red-500">*</span></label>
              <input type="url" value={form.externalUrl}
                onChange={e => setForm(f => ({ ...f, externalUrl: e.target.value }))}
                placeholder="https://instagram.com/jurusan_tkj"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select value={form.isActive ? 'active' : 'inactive'}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'active' }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Pengaturan Halaman</h3>

            <PhotoUpload
              label="Student Image (PNG tanpa background)"
              value={form.studentImage}
              onChange={url => setForm(f => ({ ...f, studentImage: url }))}
              hint="Gunakan PNG transparan untuk area kanan header"
              square
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Warna Background Header</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.headerBgColor || '#111827'}
                  onChange={e => setForm(f => ({ ...f, headerBgColor: e.target.value }))}
                  className="h-10 w-16 rounded-lg border border-gray-200 bg-white"
                />
                <input
                  type="text"
                  value={form.headerBgColor}
                  onChange={e => setForm(f => ({ ...f, headerBgColor: e.target.value }))}
                  placeholder="#111827"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Opsional. Kosongkan untuk memakai warna default.</p>
            </div>
          </div>
        )}

        {activeTab === 'competencies' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          {/* Konsentrasi Keahlian */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Konsentrasi Keahlian</h3>
              <p className="text-xs text-gray-400 mt-0.5">Simpan untuk menyimpan perubahan konsentrasi</p>
            </div>
            <button type="button" onClick={addCompetency}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-medium transition-all">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {competencies.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
              Belum ada konsentrasi.
            </p>
          )}

          <div className="space-y-3">
            {competencies.map((comp, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">Konsentrasi {i + 1}</span>
                  <button type="button" onClick={() => removeCompetency(i)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={comp.name} placeholder="Nama konsentrasi *"
                    onChange={e => updateCompetency(i, 'name', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" value={comp.description} placeholder="Deskripsi (opsional)"
                    onChange={e => updateCompetency(i, 'description', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Tipe:</span>
                  <button type="button" onClick={() => updateCompetency(i, 'detailType', 'PAGE')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      comp.detailType === 'PAGE' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500'
                    }`}>
                    <Globe className="w-3 h-3" /> Halaman
                  </button>
                  <button type="button" onClick={() => updateCompetency(i, 'detailType', 'EXTERNAL')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      comp.detailType === 'EXTERNAL' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-200 text-gray-500'
                    }`}>
                    <ExternalLink className="w-3 h-3" /> Eksternal
                  </button>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Aktif</span>
                    <button type="button" onClick={() => updateCompetency(i, 'isActive', !comp.isActive)}
                      className={`w-8 h-4 rounded-full transition-all relative ${comp.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${comp.isActive ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
                {comp.detailType === 'EXTERNAL' && (
                  <input type="url" value={comp.externalUrl}
                    placeholder="https://... (URL redirect konsentrasi)"
                    onChange={e => updateCompetency(i, 'externalUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                )}
              </div>
            ))}
          </div>
        </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
          <Link href="/admin/dashboard/majors" className="px-6 py-2.5 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all">
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}