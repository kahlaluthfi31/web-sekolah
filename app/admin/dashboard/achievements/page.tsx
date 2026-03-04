'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Plus, Search, MoreVertical, Edit2, Trash2,
  ChevronLeft, ChevronRight, Loader2, X, Save,
  ArrowLeft, AlertTriangle, Trophy, Upload,
  Calendar, ImageIcon, Eye,
} from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

/* -- types -- */
interface Achievement {
  id: number
  studentName: string
  class: string | null
  achievementName: string
  competitionName: string | null
  level: string
  position: string | null
  year: number | null
  competitionDate: string | null
  photo: string | null
  certificateImage: string | null
  status: string
  createdAt: string
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }
interface MajorItem { id: number; name: string; code: string | null }

/* -- constants -- */
const levelColors: Record<string, string> = {
  sekolah: 'bg-gray-100 text-gray-600',
  kecamatan: 'bg-blue-100 text-blue-700',
  kabupaten: 'bg-cyan-100 text-cyan-700',
  provinsi: 'bg-purple-100 text-purple-700',
  nasional: 'bg-orange-100 text-orange-700',
  internasional: 'bg-red-100 text-red-700',
}
const LEVELS = [
  { value: 'sekolah', label: 'Sekolah' },
  { value: 'kecamatan', label: 'Kecamatan' },
  { value: 'kabupaten', label: 'Kabupaten/Kota' },
  { value: 'provinsi', label: 'Provinsi' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' },
  { value: '_lainnya', label: 'Lainnya...' },
]
const LEVEL_VALUES = LEVELS.filter(l => l.value !== '_lainnya').map(l => l.value)
const CLASSES = ['10', '11', '12']

/* ----------- ActionDropdown (3-dot) ----------- */
function ActionDropdown({ onDetail, onEdit, onDelete }: {
  onDetail: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(200)
  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} onClick={toggle} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }} className="w-44 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          <button onClick={() => { close(); onDetail() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
            <Eye className="w-3.5 h-3.5" /> Detail
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { close(); onEdit() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { close(); onDelete() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

/* ----------- DeleteModal ----------- */
function DeleteModal({ name, onConfirm, onCancel, deleting }: {
  name: string
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  const t = name.length > 50 ? name.substring(0, 50) + '...' : name
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
            <h3 className="text-lg font-bold text-gray-900">Hapus Prestasi</h3>
            <p className="text-sm text-gray-500">
              Yakin ingin menghapus prestasi <span className="font-semibold text-gray-700">&lsquo;{t}&rsquo;</span>?
            </p>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50">
              Batal
            </button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------- ImageUploadBlock ----------- */
function ImageUploadBlock({ label, preview, inputRef, uploading, onUpload, onClear }: {
  label: string
  preview: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <Image src={preview} alt="Preview" width={400} height={120} className="w-full h-28 object-cover" unoptimized />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow">
              Ganti
            </button>
          </div>
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50">
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-1.5 hover:border-blue-400 hover:bg-blue-50/30 transition-all disabled:opacity-50">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Upload className="w-5 h-5 text-gray-400" />}
          <span className="text-xs text-gray-500">{uploading ? 'Mengupload...' : 'Klik untuk upload'}</span>
          <span className="text-[10px] text-gray-400">JPG, PNG, WEBP (maks 5MB)</span>
        </button>
      )}
    </div>
  )
}

/* ----------- AchievementFormModal ----------- */
function AchievementFormModal({ achievement, majors, onClose, onSaved }: {
  achievement: Achievement | null
  majors: MajorItem[]
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!achievement
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Jurusan search
  const [majorDropOpen, setMajorDropOpen] = useState(false)
  const majorRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    studentName: '',
    classGrade: '10',
    major: '',
    achievementName: '',
    competitionName: '',
    level: 'sekolah',
    customLevel: '',
    position: '',
    year: new Date().getFullYear(),
    competitionDate: '',
    photo: '',
  })

  useEffect(() => {
    if (achievement) {
      let grade = '10'
      let major = ''
      if (achievement.class) {
        const parts = achievement.class.split(' ')
        if (parts[0] && CLASSES.includes(parts[0])) {
          grade = parts[0]
          major = parts.slice(1).join(' ')
        } else {
          major = achievement.class
        }
      }
      const existingLevel = achievement.level || 'sekolah'
      const isCustom = !LEVEL_VALUES.includes(existingLevel)
      setForm({
        studentName: achievement.studentName || '',
        classGrade: grade,
        major,
        achievementName: achievement.achievementName || '',
        competitionName: achievement.competitionName || '',
        level: isCustom ? '_lainnya' : existingLevel,
        customLevel: isCustom ? existingLevel : '',
        position: achievement.position || '',
        year: achievement.year || new Date().getFullYear(),
        competitionDate: achievement.competitionDate ? achievement.competitionDate.substring(0, 10) : '',
        photo: achievement.photo || '',
      })
      if (achievement.photo) setPhotoPreview(achievement.photo)
    }
  }, [achievement])

  // Click outside major dropdown
  useEffect(() => {
    function h(e: MouseEvent) {
      if (majorRef.current && !majorRef.current.contains(e.target as Node)) setMajorDropOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const filteredMajors = majors.filter(m =>
    m.name.toLowerCase().includes(form.major.toLowerCase()) ||
    (m.code && m.code.toLowerCase().includes(form.major.toLowerCase()))
  )

  // Upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingField('photo')
    try {
      const reader = new FileReader()
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) {
        setForm(f => ({ ...f, photo: json.data.url }))
      } else {
        setError(json.message || 'Gagal upload')
        setPhotoPreview(null)
      }
    } catch {
      setError('Gagal upload')
      setPhotoPreview(null)
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const classValue = `${form.classGrade} ${form.major}`.trim()
    const finalLevel = form.level === '_lainnya' ? form.customLevel.trim() : form.level
    if (!finalLevel) {
      setError('Mohon isi tingkat perlombaan')
      setSaving(false)
      return
    }
    if (form.year > new Date().getFullYear()) {
      setError('Tahun tidak boleh melebihi tahun saat ini')
      setSaving(false)
      return
    }
    if (form.competitionDate && form.competitionDate > new Date().toISOString().split('T')[0]) {
      setError('Tanggal kompetisi tidak boleh melebihi hari ini')
      setSaving(false)
      return
    }
    if (!form.photo) {
      setError('Mohon upload foto bukti prestasi')
      setSaving(false)
      return
    }
    const payload: Record<string, unknown> = {
      studentName: form.studentName,
      class: classValue || null,
      achievementName: form.achievementName,
      competitionName: form.competitionName || null,
      level: finalLevel,
      position: form.position || null,
      year: form.year,
      competitionDate: form.competitionDate || null,
      photo: form.photo || null,
    }
    if (isEdit) {
      payload.status = achievement!.status
    }
    try {
      const url = isEdit ? `/api/achievements/${achievement!.id}` : '/api/achievements'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        onSaved()
      } else {
        setError(json.message || 'Gagal menyimpan')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}</h2>
                  <p className="text-xs text-gray-500">{isEdit ? 'Perbarui data prestasi siswa' : 'Catat prestasi siswa baru'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left col */}
                <div className="lg:col-span-2 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Siswa <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.studentName}
                      onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama lengkap siswa" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Kelas <span className="text-red-500">*</span></label>
                      <select value={form.classGrade}
                        onChange={e => setForm(f => ({ ...f, classGrade: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {CLASSES.map(c => <option key={c} value={c}>Kelas {c}</option>)}
                      </select>
                    </div>
                    <div ref={majorRef} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Program Keahlian</label>
                      <input type="text" value={form.major}
                        onChange={e => {
                          setForm(f => ({ ...f, major: e.target.value }))
                          setMajorDropOpen(true)
                        }}
                        onFocus={() => setMajorDropOpen(true)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ketik atau pilih program keahlian..." />
                      {majorDropOpen && filteredMajors.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredMajors.map(m => (
                            <button key={m.id} type="button"
                              onClick={() => { setForm(f => ({ ...f, major: m.code || m.name })); setMajorDropOpen(false) }}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors">
                              <span className="font-medium">{m.code || m.name}</span>
                              {m.code && <span className="text-gray-400 ml-1.5">{m.name}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cabang Lomba / Prestasi <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.achievementName}
                      onChange={e => setForm(f => ({ ...f, achievementName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Web Development, Pidato Bahasa Inggris, Futsal" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kompetisi</label>
                    <input type="text" value={form.competitionName}
                      onChange={e => setForm(f => ({ ...f, competitionName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="LKS tingkat Provinsi" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tingkat <span className="text-red-500">*</span></label>
                      <select value={form.level}
                        onChange={e => setForm(f => ({ ...f, level: e.target.value, customLevel: e.target.value === '_lainnya' ? f.customLevel : '' }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Posisi / Peringkat</label>
                      <input type="text" value={form.position}
                        onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Juara 1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun</label>
                      <input type="number" value={form.year}
                        max={new Date().getFullYear()}
                        onChange={e => {
                          const val = parseInt(e.target.value) || new Date().getFullYear()
                          setForm(f => ({ ...f, year: Math.min(val, new Date().getFullYear()) }))
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>

                  {form.level === '_lainnya' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tingkat Kustom <span className="text-red-500">*</span></label>
                      <input type="text" value={form.customLevel}
                        onChange={e => setForm(f => ({ ...f, customLevel: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ketik tingkat perlombaan, mis: Regional, Asia Tenggara, Dunia" />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Kompetisi</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input type="date" value={form.competitionDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={e => setForm(f => ({ ...f, competitionDate: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>

                {/* Right col */}
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-500" /> Foto Bukti Prestasi <span className="text-red-500">*</span>
                    </h3>
                    <ImageUploadBlock
                      label="Upload bukti prestasi (menerima hadiah/piagam)"
                      preview={photoPreview}
                      inputRef={photoInputRef}
                      uploading={uploadingField === 'photo'}
                      onUpload={e => handleUpload(e)}
                      onClear={() => { setPhotoPreview(null); setForm(f => ({ ...f, photo: '' })); if (photoInputRef.current) photoInputRef.current.value = '' }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                      Batal
                    </button>
                    <button type="submit" disabled={saving || !!uploadingField}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------- MAIN PAGE --------------------------- */
export default function AchievementsPage() {
  const [data, setData] = useState<Achievement[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [majorFilter, setMajorFilter] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Achievement | null>(null)
  const [deleteItem, setDeleteItem] = useState<Achievement | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const [detailTarget, setDetailTarget] = useState<Achievement | null>(null)

  const [majors, setMajors] = useState<MajorItem[]>([])

  useEffect(() => {
    fetch('/api/majors/list')
      .then(r => r.json())
      .then(j => { if (j.success) setMajors(j.data) })
      .catch(() => { })
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      p.set('page', String(pagination.page))
      p.set('limit', '10')
      if (search) p.set('search', search)
      if (level) p.set('level', level)
      if (classFilter) p.set('class', classFilter)
      if (yearFilter) p.set('year', yearFilter)
      if (majorFilter) p.set('major', majorFilter)

      const res = await fetch(`/api/achievements?${p}`)
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setPagination(json.pagination)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, search, level, classFilter, yearFilter, majorFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteItem) return
    setDeleting(true)
    try {
      await fetch(`/api/achievements/${deleteItem.id}`, { method: 'DELETE' })
      setDeleteItem(null)
      fetchData()
    } catch {
      alert('Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  const openCreate = () => { setEditItem(null); setShowForm(true) }
  const openEdit = (item: Achievement) => { setEditItem(item); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditItem(null) }
  const onSaved = () => { closeForm(); fetchData() }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Prestasi Siswa</h2>
          <p className="text-sm text-gray-500">Kelola data prestasi dan kejuaraan siswa</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari prestasi..." value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <select value={level}
          onChange={e => { setLevel(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Tingkatan</option>
          {LEVELS.filter(l => l.value !== '_lainnya').map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          <option value="_lainnya">Lainnya</option>
        </select>
        <select value={majorFilter}
          onChange={e => { setMajorFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Program</option>
          {majors.map(m => <option key={m.id} value={m.code || m.name}>{m.code || m.name}</option>)}
        </select>
        <select value={classFilter}
          onChange={e => { setClassFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Kelas</option>
          {CLASSES.map(c => <option key={c} value={c}>Kelas {c}</option>)}
        </select>
        <select value={yearFilter}
          onChange={e => { setYearFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Tahun</option>
          {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
        </select>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Prestasi
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-400">Belum ada data prestasi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Siswa</th>
                  <th className="px-6 py-4">Prestasi</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Tahun</th>
                  <th className="px-6 py-4">Foto</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{item.studentName}</p>
                      {item.class && <p className="text-xs text-gray-400">Kelas {item.class}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-50">{item.achievementName}</p>
                      {item.competitionName && <p className="text-xs text-gray-400 truncate max-w-50">{item.competitionName}</p>}
                      {item.position && <p className="text-xs font-semibold text-blue-600">{item.position}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${levelColors[item.level] || 'bg-gray-100 text-gray-600'}`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.year || '-'}</td>
                    <td className="px-6 py-4">
                      {item.photo ? (
                        <button type="button" onClick={() => setPreviewPhoto(item.photo)}
                          className="focus:outline-none group">
                          <Image src={item.photo} alt="Foto" width={48} height={48}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-blue-400 group-hover:scale-105 transition-all cursor-pointer" unoptimized />
                        </button>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          onDetail={() => setDetailTarget(item)}
                          onEdit={() => openEdit(item)}
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
            <p className="text-sm text-gray-500">
              {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">{pagination.page} / {pagination.totalPages}</span>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <AchievementFormModal
          achievement={editItem}
          majors={majors}
          onClose={closeForm}
          onSaved={onSaved}
        />
      )}
      {deleteItem && (
        <DeleteModal
          name={deleteItem.achievementName}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          deleting={deleting}
        />
      )}
      {detailTarget && (
        <div className="fixed inset-0 z-60 overflow-hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailTarget(null)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Detail Prestasi</h3>
                <button onClick={() => setDetailTarget(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="overflow-y-auto p-6 space-y-4">
                {detailTarget.photo && (
                  <div className="flex justify-center">
                    <Image src={detailTarget.photo} alt="Foto" width={200} height={200} className="w-32 h-32 rounded-2xl object-cover border border-gray-200" unoptimized />
                  </div>
                )}
                <div className="divide-y divide-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Nama Siswa</span>
                    <span className="text-sm text-gray-900 flex-1">{detailTarget.studentName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Kelas</span>
                    <span className="text-sm text-gray-900 flex-1">{detailTarget.class || <span className="text-gray-300">-</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Nama Prestasi</span>
                    <span className="text-sm text-gray-900 flex-1 font-medium">{detailTarget.achievementName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Nama Kompetisi</span>
                    <span className="text-sm text-gray-900 flex-1">{detailTarget.competitionName || <span className="text-gray-300">-</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Level</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${levelColors[detailTarget.level] || 'bg-gray-100 text-gray-600'}`}>{detailTarget.level}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Posisi/Peringkat</span>
                    <span className="text-sm text-gray-900 flex-1">{detailTarget.position || <span className="text-gray-300">-</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Tahun</span>
                    <span className="text-sm text-gray-900 flex-1">{detailTarget.year || <span className="text-gray-300">-</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Tanggal Kompetisi</span>
                    <span className="text-sm text-gray-900 flex-1">{detailTarget.competitionDate ? new Date(detailTarget.competitionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : <span className="text-gray-300">-</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Status</span>
                    <span className="text-sm text-gray-900 flex-1">{detailTarget.status}</span>
                  </div>
                  {detailTarget.certificateImage && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                      <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Sertifikat</span>
                      <Image src={detailTarget.certificateImage} alt="Sertifikat" width={200} height={150} className="rounded-lg object-cover border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all" onClick={() => { setDetailTarget(null); setPreviewPhoto(detailTarget.certificateImage) }} unoptimized />
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">Terdaftar</span>
                    <span className="text-sm text-gray-900 flex-1">{new Date(detailTarget.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {previewPhoto && (
        <div className="fixed inset-0 z-70 flex items-center justify-center"
          onClick={() => setPreviewPhoto(null)}>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative max-w-3xl max-h-[85vh] p-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewPhoto(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <Image src={previewPhoto} alt="Preview" width={800} height={600}
              className="rounded-2xl object-contain max-h-[80vh] w-auto shadow-2xl" unoptimized />
          </div>
        </div>
      )}
    </div>
  )
}