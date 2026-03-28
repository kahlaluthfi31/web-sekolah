'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Plus, Search, MoreVertical, Edit2, Trash2, Eye,
  Loader2, AlertTriangle, ExternalLink, Globe, BookOpen,
  ChevronLeft, ChevronRight, X, Save, Upload, ImageIcon, Images,
  CheckCircle2,
} from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Major {
  id: number
  name: string
  code: string | null
  description: string | null
  headOfMajor: string | null
  image: string | null
  icon: string | null
  studentImage: string | null
  headerBgColor: string | null
  activeStudents: number | null
  alumniCount: number | null
  industryPartners: number | null
  detailType: 'PAGE' | 'EXTERNAL'
  externalUrl: string | null
  isActive: boolean
  createdAt: string
  _count: { competencies: number }
}
interface Teacher {
  id: number
  name: string
  photo: string | null
  position: string | null
}
interface CompetencyForm {
  id?: number
  name: string
  description: string
  detailType: 'PAGE' | 'EXTERNAL'
  externalUrl: string
  isActive: boolean
}
type FormState = {
  name: string; code: string; description: string; headOfMajor: string
  headOfMajorId: number | null
  image: string; icon: string; studentImage: string; headerBgColor: string
  activeStudents: string; alumniCount: string; industryPartners: string
  detailType: 'PAGE' | 'EXTERNAL'
  externalUrl: string; isActive: boolean
}
interface GalleryItem { id: number; imageUrl: string; caption: string | null; orderPosition: number }
interface CompetencyDetail {
  id: number
  name: string
  description: string | null
  detailType: string
  externalUrl: string | null
  isActive: boolean
  gallery: { id: number; imageUrl: string; caption: string | null }[]
}
interface MajorDetail extends Major {
  competencies: CompetencyDetail[]
}

const BLANK_FORM: FormState = {
  name: '', code: '', description: '', headOfMajor: '', headOfMajorId: null,
  image: '', icon: '', studentImage: '', headerBgColor: '',
  activeStudents: '', alumniCount: '', industryPartners: '',
  detailType: 'PAGE', externalUrl: '', isActive: true,
}
const BLANK_COMP: CompetencyForm = {
  name: '', description: '', detailType: 'PAGE', externalUrl: '', isActive: true,
}
const PLACEHOLDER_IMAGE = 'https://placehold.co/800x400/e2e8f0/94a3b8?text=No+Image'

// ─── PhotoUpload ──────────────────────────────────────────────────────────────
function PhotoUpload({
  label, value, onChange, hint, square = false,
}: {
  label: string; value: string; onChange: (url: string) => void
  hint?: string; square?: boolean
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
    } finally { setUploading(false) }
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

// ─── TeacherSelect ────────────────────────────────────────────────────────────
function TeacherSelect({ value, onChange }: {
  value: string
  onChange: (name: string, id: number | null) => void
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [loadingT, setLoadingT] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    setLoadingT(true)
    fetch('/api/teachers?all=true')
      .then(r => r.json())
      .then(j => setTeachers(j.data || []))
      .finally(() => setLoadingT(false))
  }, [])

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Kepala Program Keahlian</label>
      <div className="relative">
        <input type="text" value={query} onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); setOpen(true); onChange(e.target.value, null) }}
          placeholder={loadingT ? 'Memuat daftar guru...' : 'Ketik nama guru...'}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8" />
        {query && (
          <button type="button" onClick={() => { setQuery(''); onChange('', null); setOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
          {filtered.map(t => (
            <button key={t.id} type="button"
              onClick={() => { setQuery(t.name); onChange(t.name, t.id); setOpen(false) }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors">
              <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                {t.photo
                  ? <Image src={t.photo} alt={t.name} width={24} height={24} className="w-full h-full object-cover" unoptimized />
                  : <span className="text-xs font-bold text-gray-400">{t.name[0]}</span>}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{t.name}</p>
                {t.position && <p className="text-xs text-gray-400 truncate">{t.position}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ActionDropdown ───────────────────────────────────────────────────────────
function ActionDropdown({ onDetail, onEdit, onDelete }: {
  onDetail: () => void; onEdit: () => void; onDelete: () => void
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(150)
  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} onClick={toggle}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }} className="w-36 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          <button onClick={() => { close(); onDetail() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
            <Eye className="w-3.5 h-3.5" /> Detail
          </button>
          <div className="border-t border-gray-100" />
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
            <h3 className="text-lg font-bold text-gray-900">Hapus Program Keahlian</h3>
            <p className="text-sm text-gray-500">
              Yakin ingin menghapus <span className="font-semibold text-gray-700">{name}</span>?
            </p>
            <p className="text-xs text-gray-400">Semua konsentrasi dan galeri terkait juga akan terhapus. Tindakan ini tidak dapat dibatalkan.</p>
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

// ─── CompetencyGallerySection ─────────────────────────────────────────────────
function CompetencyGallerySection({ competencyId, label }: { competencyId: number; label: string }) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchGallery = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true)
    try {
      const res = await fetch(`/api/competencies/${competencyId}/gallery`)
      const json = await res.json()
      if (json.success) setItems(json.data || [])
    } finally { setLoading(false) }
  }, [competencyId])

  useEffect(() => { fetchGallery(true) }, [fetchGallery])

  const handleFile = async (file: File) => {
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData(); fd.append('file', file)
      const up = await fetch('/api/upload', { method: 'POST', body: fd })
      const upJson = await up.json()
      const url = upJson.data?.url || upJson.url
      if (!url) { setUploadError(upJson.message || 'Gagal mengupload foto'); return }
      const res = await fetch(`/api/competencies/${competencyId}/gallery`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      })
      const json = await res.json()
      if (json.success) {
        await fetchGallery(false)
      } else {
        setUploadError(json.message || 'Gagal menyimpan foto ke galeri')
      }
    } catch {
      setUploadError('Terjadi kesalahan saat mengupload')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (galleryId: number) => {
    try {
      const res = await fetch(`/api/competencies/${competencyId}/gallery/${galleryId}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) setItems(prev => prev.filter(i => i.id !== galleryId))
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Images className="w-4 h-4 text-blue-500 shrink-0" />
          {label}
        </p>
        <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${uploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? 'Mengupload...' : 'Upload Foto'}
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} disabled={uploading} />
        </label>
      </div>
      {uploadError && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {uploadError}
          <button onClick={() => setUploadError('')} className="ml-auto text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-blue-400" /></div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl py-6 text-center">
          <ImageIcon className="w-7 h-7 mx-auto mb-2 text-gray-300" />
          <p className="text-xs text-gray-400">Belum ada foto. Klik &quot;Upload Foto&quot; untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {items.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <Image src={item.imageUrl} alt={item.caption || ''} fill className="object-cover" unoptimized />
              <button type="button" onClick={() => handleDelete(item.id)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── GalleryTabContent ────────────────────────────────────────────────────────
// Rule: 1 competency → single gallery; 2+ → per-competency galleries
function GalleryTabContent({ competencies }: { competencies: CompetencyForm[] }) {
  const saved = competencies.filter(c => c.id)
  const unsaved = competencies.filter(c => !c.id)

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Images className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-500">Simpan data program keahlian terlebih dahulu</p>
        <p className="text-xs text-gray-400 mt-1">Konsentrasi keahlian harus tersimpan sebelum dapat mengupload foto galeri</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
        {saved.length === 1
          ? 'Program Keahlian ini memiliki 1 konsentrasi — galeri di bawah adalah galeri untuk konsentrasi tersebut.'
          : `Program Keahlian ini memiliki ${saved.length} konsentrasi. Setiap konsentrasi memiliki galeri foto masing-masing.`}
      </p>
      {unsaved.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {unsaved.length} konsentrasi baru belum tersimpan — simpan data terlebih dahulu agar galerinya muncul di sini.
        </div>
      )}
      {saved.map((comp) => (
        <CompetencyGallerySection
          key={comp.id}
          competencyId={comp.id!}
          label={saved.length === 1 ? 'Galeri Konsentrasi' : comp.name || `Konsentrasi ${comp.id}`}
        />
      ))}
    </div>
  )
}

// ─── CompetencyRows ───────────────────────────────────────────────────────────
function CompetencyRows({ competencies, onChange }: {
  competencies: CompetencyForm[]
  onChange: (updated: CompetencyForm[]) => void
}) {
  const add = () => onChange([...competencies, { ...BLANK_COMP }])
  const remove = (i: number) => {
    if (competencies.length <= 1) return
    onChange(competencies.filter((_, idx) => idx !== i))
  }
  const update = (i: number, field: keyof CompetencyForm, val: string | boolean) =>
    onChange(competencies.map((c, idx) => idx === i ? { ...c, [field]: val } : c))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Konsentrasi Keahlian <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Minimal 1 konsentrasi wajib diisi</p>
        </div>
        <button type="button" onClick={add}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-all">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>
      {competencies.length === 0 && (
        <p className="text-sm text-red-400 text-center py-5 border border-dashed border-red-200 rounded-xl bg-red-50/50">
          Tambahkan minimal 1 konsentrasi keahlian
        </p>
      )}
      {competencies.map((comp, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-xl space-y-2.5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Konsentrasi {i + 1}</span>
              {comp.id && (
                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md font-medium">
                  Tersimpan
                </span>
              )}
            </div>
            <button type="button" onClick={() => remove(i)}
              disabled={competencies.length <= 1}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input type="text" value={comp.name} placeholder="Nama konsentrasi *"
              onChange={e => update(i, 'name', e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" value={comp.description} placeholder="Deskripsi (opsional)"
              onChange={e => update(i, 'description', e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Aktif</span>
              <button type="button" onClick={() => update(i, 'isActive', !comp.isActive)}
                className={`w-8 h-4 rounded-full transition-all relative ${comp.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${comp.isActive ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── MajorDataForm ────────────────────────────────────────────────────────────
function MajorDataForm({ form, setForm, competencies, setCompetencies, error }: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  competencies: CompetencyForm[]
  setCompetencies: React.Dispatch<React.SetStateAction<CompetencyForm[]>>
  error: string
}) {
  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Informasi Program Keahlian</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Program Keahlian <span className="text-red-500">*</span></label>
            <input type="text" required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Rekayasa Perangkat Lunak"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode Program Keahlian</label>
            <input type="text" value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="RPL"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
          <textarea rows={2} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Deskripsi singkat program keahlian..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>

        <TeacherSelect
          value={form.headOfMajor}
          onChange={(name, id) => setForm(f => ({ ...f, headOfMajor: name, headOfMajorId: id }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <PhotoUpload label="Gambar Cover" value={form.image}
            onChange={url => setForm(f => ({ ...f, image: url }))} hint="Banner/cover program keahlian" />
          <PhotoUpload label="Logo / Icon" value={form.icon}
            onChange={url => setForm(f => ({ ...f, icon: url }))} hint="Logo Program Keahlian" square />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipe Halaman Detail</p>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setForm(f => ({ ...f, detailType: 'PAGE' }))}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${form.detailType === 'PAGE' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${form.detailType === 'PAGE' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              <Globe className={`w-3.5 h-3.5 ${form.detailType === 'PAGE' ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className={`text-xs font-semibold ${form.detailType === 'PAGE' ? 'text-blue-700' : 'text-gray-700'}`}>Halaman Website</p>
              <p className="text-xs text-gray-400">Tampilkan di website</p>
            </div>
          </button>
          <button type="button" onClick={() => setForm(f => ({ ...f, detailType: 'EXTERNAL' }))}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${form.detailType === 'EXTERNAL' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${form.detailType === 'EXTERNAL' ? 'bg-orange-100' : 'bg-gray-200'}`}>
              <ExternalLink className={`w-3.5 h-3.5 ${form.detailType === 'EXTERNAL' ? 'text-orange-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className={`text-xs font-semibold ${form.detailType === 'EXTERNAL' ? 'text-orange-700' : 'text-gray-700'}`}>Redirect Eksternal</p>
              <p className="text-xs text-gray-400">Instagram, website, dll</p>
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

      <CompetencyRows competencies={competencies} onChange={setCompetencies} />
    </div>
  )
}

// ─── MajorPageSettingsForm ─────────────────────────────────────────────────
function MajorPageSettingsForm({ form, setForm }: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
}) {
  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pengaturan Halaman</p>
      <PhotoUpload
        label="Student Image (PNG tanpa background)"
        value={form.studentImage}
        onChange={url => setForm(f => ({ ...f, studentImage: url }))}
        hint="Gambar PNG transparan untuk area kanan header"
        square
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Siswa Aktif</label>
          <input
            type="number"
            value={form.activeStudents}
            onChange={e => setForm(f => ({ ...f, activeStudents: e.target.value }))}
            placeholder="1200"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Alumni</label>
          <input
            type="number"
            value={form.alumniCount}
            onChange={e => setForm(f => ({ ...f, alumniCount: e.target.value }))}
            placeholder="3500"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Industri Partner</label>
          <input
            type="number"
            value={form.industryPartners}
            onChange={e => setForm(f => ({ ...f, industryPartners: e.target.value }))}
            placeholder="50"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center text-xs text-gray-400">
          Total prestasi otomatis dari menu Prestasi Siswa.
        </div>
      </div>
    </div>
  )
}

// ─── ModalShell ───────────────────────────────────────────────────────────────
function ModalShell({
  title, subtitle, tab, onTabChange, onClose, disabled, children,
}: {
  title: string; subtitle: string
  tab: 'data' | 'settings' | 'gallery'
  onTabChange: (t: 'data' | 'settings' | 'gallery') => void
  onClose: () => void; disabled: boolean
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={!disabled ? onClose : undefined} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-8">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              </div>
              <button onClick={onClose} disabled={disabled}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Tab Bar */}
            <div className="px-6 pt-3 pb-0 border-b border-gray-100">
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
                <button type="button" onClick={() => onTabChange('data')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${tab === 'data' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  Data Program
                </button>
                <button type="button" onClick={() => onTabChange('settings')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${tab === 'settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  Pengaturan Halaman
                </button>
                <button type="button" onClick={() => onTabChange('gallery')}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${tab === 'gallery' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Images className="w-3.5 h-3.5" /> Galeri
                </button>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AddModal ─────────────────────────────────────────────────────────────────
function AddModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [tab, setTab] = useState<'data' | 'settings' | 'gallery'>('data')
  const [form, setForm] = useState<FormState>({ ...BLANK_FORM })
  const [competencies, setCompetencies] = useState<CompetencyForm[]>([{ ...BLANK_COMP }])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [savedCompetencies, setSavedCompetencies] = useState<CompetencyForm[]>([])

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Nama program keahlian wajib diisi'); setTab('data'); return }
    const validComps = competencies.filter(c => c.name.trim())
    if (validComps.length === 0) { setError('Minimal 1 konsentrasi keahlian wajib diisi'); setTab('data'); return }
    if (form.detailType === 'EXTERNAL' && !form.externalUrl.trim()) {
      setError('URL eksternal wajib diisi'); setTab('data'); return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        name: form.name.trim(), code: form.code.trim() || null,
        description: form.description.trim() || null,
        headOfMajor: form.headOfMajor.trim() || null,
        image: form.image || null, icon: form.icon || null,
  studentImage: form.studentImage || null,
  headerBgColor: form.headerBgColor.trim() || null,
  activeStudents: form.activeStudents ? parseInt(form.activeStudents) : null,
  alumniCount: form.alumniCount ? parseInt(form.alumniCount) : null,
  industryPartners: form.industryPartners ? parseInt(form.industryPartners) : null,
        detailType: form.detailType,
        externalUrl: form.detailType === 'EXTERNAL' ? form.externalUrl.trim() : null,
        isActive: form.isActive,
        competencies: validComps.map(c => ({
          name: c.name.trim(), description: c.description.trim() || null,
          detailType: c.detailType,
          externalUrl: c.detailType === 'EXTERNAL' ? c.externalUrl.trim() : null,
          isActive: c.isActive,
        })),
      }
      const res = await fetch('/api/majors', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        const sc: CompetencyForm[] = (json.data.competencies || []).map((c: {
          id: number; name: string; description?: string
          detailType?: string; externalUrl?: string; isActive?: boolean
        }) => ({
          id: c.id, name: c.name, description: c.description || '',
          detailType: c.detailType || 'PAGE', externalUrl: c.externalUrl || '', isActive: c.isActive ?? true,
        }))
        setSavedCompetencies(sc)
        setSaved(true)
        onSaved()
        setTab('gallery')
      } else { setError(json.message || 'Gagal menyimpan') }
    } catch { setError('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  return (
    <ModalShell
      title="Tambah Program keahlian" subtitle="Tambah program keahlian baru"
      tab={tab} onTabChange={setTab} onClose={onClose} disabled={saving}
    >
      <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
        {tab === 'data' ? (
          <MajorDataForm form={form} setForm={setForm}
            competencies={competencies} setCompetencies={setCompetencies} error={error} />
        ) : tab === 'settings' ? (
          <MajorPageSettingsForm form={form} setForm={setForm} />
        ) : !saved ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Save className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">Simpan data program keahlian terlebih dahulu</p>
            <p className="text-xs text-gray-400 mt-1">Klik tombol &quot;Simpan Program &quot; di tab Data Program Keahlian, lalu kembali ke sini untuk upload galeri</p>
            <button type="button" onClick={() => setTab('data')}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all">
              Kembali ke Data Program
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700">Data Program Keahlian berhasil disimpan. Silakan upload foto galeri untuk setiap konsentrasi.</p>
            </div>
            <GalleryTabContent competencies={savedCompetencies} />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        {tab !== 'gallery' ? (
          <>
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all">
              {saved ? 'Tutup' : 'Batal'}
            </button>
            {!saved && (
              <button type="button" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Menyimpan...' : 'Simpan Program'}
              </button>
            )}
            {saved && (
              <button type="button" onClick={() => setTab('gallery')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all">
                <Images className="w-4 h-4" /> Upload Galeri
              </button>
            )}
          </>
        ) : (
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            Selesai
          </button>
        )}
      </div>
    </ModalShell>
  )
}

// ─── EditModal ────────────────────────────────────────────────────────────────
function EditModal({ majorId, onClose, onSaved }: {
  majorId: number; onClose: () => void; onSaved: () => void
}) {
  const [tab, setTab] = useState<'data' | 'settings' | 'gallery'>('data')
  const [form, setForm] = useState<FormState>({ ...BLANK_FORM })
  const [competencies, setCompetencies] = useState<CompetencyForm[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadMajor = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/majors/${majorId}`)
      const json = await res.json()
      if (json.success) {
        const d = json.data
        setForm({
          name: d.name || '', code: d.code || '',
          description: d.description || '',
          headOfMajor: d.headOfMajor || '', headOfMajorId: null,
          image: d.image || '', icon: d.icon || '',
          studentImage: d.studentImage || '',
          headerBgColor: d.headerBgColor || '',
          activeStudents: d.activeStudents?.toString() || '',
          alumniCount: d.alumniCount?.toString() || '',
          industryPartners: d.industryPartners?.toString() || '',
          detailType: d.detailType || 'PAGE',
          externalUrl: d.externalUrl || '',
          isActive: d.isActive ?? true,
        })
        setCompetencies((d.competencies || []).map((c: {
          id?: number; name: string; description?: string
          detailType?: string; externalUrl?: string; isActive?: boolean
        }) => ({
          id: c.id, name: c.name || '', description: c.description || '',
          detailType: c.detailType || 'PAGE',
          externalUrl: c.externalUrl || '', isActive: c.isActive ?? true,
        })))
      } else { setError('Gagal memuat data') }
    } catch { setError('Gagal memuat data') }
    finally { setLoading(false) }
  }, [majorId])

  useEffect(() => { loadMajor() }, [loadMajor])

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Nama program keahlian wajib diisi'); setTab('data'); return }
    const validComps = competencies.filter(c => c.name.trim())
    if (validComps.length === 0) { setError('Minimal 1 konsentrasi keahlian wajib diisi'); setTab('data'); return }
    if (form.detailType === 'EXTERNAL' && !form.externalUrl.trim()) {
      setError('URL eksternal wajib diisi'); setTab('data'); return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        name: form.name.trim(), code: form.code.trim() || null,
        description: form.description.trim() || null,
        headOfMajor: form.headOfMajor.trim() || null,
        image: form.image || null, icon: form.icon || null,
  studentImage: form.studentImage || null,
  headerBgColor: form.headerBgColor.trim() || null,
  activeStudents: form.activeStudents ? parseInt(form.activeStudents) : null,
  alumniCount: form.alumniCount ? parseInt(form.alumniCount) : null,
  industryPartners: form.industryPartners ? parseInt(form.industryPartners) : null,
        detailType: form.detailType,
        externalUrl: form.detailType === 'EXTERNAL' ? form.externalUrl.trim() : null,
        isActive: form.isActive,
        competencies: validComps.map(c => ({
          id: c.id,
          name: c.name.trim(), description: c.description.trim() || null,
          detailType: c.detailType,
          externalUrl: c.detailType === 'EXTERNAL' ? c.externalUrl.trim() : null,
          isActive: c.isActive,
        })),
      }
      const res = await fetch(`/api/majors/${majorId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        onSaved()
        // Reload to get real IDs for any newly created competencies
        await loadMajor()
        setTab('gallery')
      } else { setError(json.message || 'Gagal menyimpan') }
    } catch { setError('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  return (
    <ModalShell
      title="Edit Program Keahlian" subtitle="Ubah data program dan konsentrasi"
      tab={tab} onTabChange={setTab} onClose={onClose} disabled={saving}
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
            {tab === 'data' ? (
              <MajorDataForm form={form} setForm={setForm}
                competencies={competencies} setCompetencies={setCompetencies} error={error} />
            ) : tab === 'settings' ? (
              <MajorPageSettingsForm form={form} setForm={setForm} />
            ) : (
              <GalleryTabContent competencies={competencies} />
            )}
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all">
              {tab === 'gallery' ? 'Selesai' : 'Batal'}
            </button>
            {tab !== 'gallery' && (
              <button type="button" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Menyimpan...' : 'Simpan & Lanjut ke Galeri'}
              </button>
            )}
          </div>
        </>
      )}
    </ModalShell>
  )
}

// ─── DetailModal ──────────────────────────────────────────────────────────────
function DetailModal({ major, onClose }: { major: Major; onClose: () => void }) {
  const [detail, setDetail] = useState<MajorDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/majors/${major.id}`)
        const json = await res.json()
        if (json.success) {
          const d = json.data
          const compsWithGallery: CompetencyDetail[] = await Promise.all(
            (d.competencies || []).map(async (c: CompetencyDetail) => {
              try {
                const gRes = await fetch(`/api/competencies/${c.id}/gallery`)
                const gJson = await gRes.json()
                return { ...c, gallery: gJson.success ? (gJson.data || []) : [] }
              } catch { return { ...c, gallery: [] } }
            })
          )
          setDetail({ ...d, competencies: compsWithGallery })
        }
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [major.id])

  const hasMultipleComps = (detail?.competencies?.length ?? 0) > 1

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-8">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Detail Program Keahlian</h3>
              <button onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="px-6 py-5 space-y-5">
                {/* Cover */}
                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gray-100">
                  <Image src={detail?.image || major.image || PLACEHOLDER_IMAGE}
                    alt={major.name} fill className="object-cover" unoptimized />
                </div>

                {/* Name + icon */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                    {major.icon
                      ? <Image src={major.icon} alt={major.name} width={56} height={56} className="w-full h-full object-contain p-1" unoptimized />
                      : <BookOpen className="w-7 h-7 text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{major.name}</p>
                    {major.code && <p className="text-xs font-mono text-gray-500 mt-0.5">{major.code}</p>}
                  </div>
                </div>

                {(detail?.description || major.description) && (
                  <p className="text-sm text-gray-600 leading-relaxed">{detail?.description || major.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Kepala Program</p>
                    <p className="font-medium text-gray-800 mt-0.5">{detail?.headOfMajor || major.headOfMajor || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Konsentrasi</p>
                    <p className="font-medium text-gray-800 mt-0.5">{major._count.competencies} konsentrasi</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tipe</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium mt-0.5 ${major.detailType === 'EXTERNAL' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                      {major.detailType === 'EXTERNAL' ? <><ExternalLink className="w-3 h-3" /> Eksternal</> : <><Globe className="w-3 h-3" /> Halaman</>}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium mt-0.5 ${major.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {major.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>

                {major.detailType === 'EXTERNAL' && major.externalUrl && (
                  <a href={major.externalUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline break-all">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> {major.externalUrl}
                  </a>
                )}

                {/* Competencies + galleries */}
                {detail && detail.competencies.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Konsentrasi Keahlian</p>
                    {detail.competencies.map((comp) => (
                      <div key={comp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{comp.name}</p>
                            {comp.description && <p className="text-xs text-gray-500 mt-0.5">{comp.description}</p>}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${comp.detailType === 'EXTERNAL' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                              {comp.detailType === 'EXTERNAL' ? <ExternalLink className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                              {comp.detailType === 'EXTERNAL' ? 'Eksternal' : 'Halaman'}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${comp.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {comp.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                        </div>
                        {comp.detailType === 'EXTERNAL' && comp.externalUrl && (
                          <a href={comp.externalUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline break-all">
                            <ExternalLink className="w-3 h-3 shrink-0" /> {comp.externalUrl}
                          </a>
                        )}
                        {/* Gallery */}
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                            <Images className="w-3 h-3" />
                            {hasMultipleComps ? `Galeri — ${comp.name}` : 'Galeri'} ({comp.gallery.length} foto)
                          </p>
                          {comp.gallery.length > 0 ? (
                            <div className="grid grid-cols-4 gap-1.5">
                              {comp.gallery.map(g => (
                                <div key={g.id} className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                                  <Image src={g.imageUrl} alt={g.caption || ''} fill className="object-cover" unoptimized />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-300">Belum ada foto galeri</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MajorsPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<number | null>(null)
  const [detailModal, setDetailModal] = useState<Major | null>(null)
  const [deleteModal, setDeleteModal] = useState<Major | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchMajors = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (search) params.set('search', search)
      const res = await fetch(`/api/majors?${params}`)
      const json = await res.json()
      if (json.success) {
        setMajors(json.data)
        setTotal(json.pagination?.total ?? 0)
        setTotalPages(json.pagination?.totalPages ?? 1)
      }
    } finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchMajors() }, [fetchMajors])

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/majors/${deleteModal.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteModal(null)
        fetchMajors()
      }
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Program Keahlian</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kelola data program keahlian dan konsentrasi keahlian</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari program keahlian..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1) }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button onClick={() => setAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" /> Tambah Program
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : majors.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data program'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Program Keahlian</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Kode</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Konsentrasi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Tipe</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {majors.map((major) => (
                  <tr key={major.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                          {major.icon
                            ? <Image src={major.icon} alt={major.name} width={40} height={40} className="w-full h-full object-contain p-1" unoptimized />
                            : <BookOpen className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{major.name}</p>
                          {major.headOfMajor && <p className="text-xs text-gray-400 mt-0.5">{major.headOfMajor}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {major.code
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-mono font-medium">{major.code}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {major._count.competencies > 0
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-medium">{major._count.competencies} konsentrasi</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {major.detailType === 'EXTERNAL'
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium"><ExternalLink className="w-3 h-3" /> Eksternal</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium"><Globe className="w-3 h-3" /> Halaman</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${major.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {major.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionDropdown
                        onDetail={() => setDetailModal(major)}
                        onEdit={() => setEditModal(major.id)}
                        onDelete={() => setDeleteModal(major)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Menampilkan {majors.length} dari {total} program keahlian</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 font-medium px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addModal && <AddModal onClose={() => setAddModal(false)} onSaved={fetchMajors} />}
      {editModal !== null && <EditModal majorId={editModal} onClose={() => setEditModal(null)} onSaved={fetchMajors} />}
      {detailModal && <DetailModal major={detailModal} onClose={() => setDetailModal(null)} />}
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
