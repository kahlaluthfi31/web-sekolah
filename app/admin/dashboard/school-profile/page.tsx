'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Building, Plus, Edit2, Trash2, Save, X,
  Loader2, BookOpen, Target, Award,
} from 'lucide-react'

interface Profile {
  id: number
  section: 'sejarah' | 'visi_misi' | 'keunggulan'
  title: string | null
  content: string | null
  videoUrl: string | null
  image: string | null
  orderPosition: number
}

const SECTION_LABELS: Record<string, { label: string; icon: typeof BookOpen; color: string }> = {
  sejarah: { label: 'Sejarah', icon: BookOpen, color: 'blue' },
  visi_misi: { label: 'Visi & Misi', icon: Target, color: 'purple' },
  keunggulan: { label: 'Keunggulan', icon: Award, color: 'green' },
}

const emptyForm = {
  section: 'sejarah' as Profile['section'],
  title: '',
  content: '',
  videoUrl: '',
  image: '',
  orderPosition: 0,
}

export default function SchoolProfilePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<string>('all')

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/school-profile')
      const json = await res.json()
      if (json.success) setProfiles(json.data)
    } catch (err) {
      console.error('Failed to fetch profiles', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  const handleSave = async () => {
    if (!form.title?.trim()) return
    setSaving(true)
    try {
      const url = editId ? `/api/school-profile/${editId}` : '/api/school-profile'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setEditId(null)
        setForm(emptyForm)
        fetchProfiles()
      } else {
        const json = await res.json()
        alert(json.message || 'Gagal menyimpan')
      }
    } catch { alert('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  const handleEdit = (p: Profile) => {
    setForm({
      section: p.section,
      title: p.title || '',
      content: p.content || '',
      videoUrl: p.videoUrl || '',
      image: p.image || '',
      orderPosition: p.orderPosition,
    })
    setEditId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus section profil ini?')) return
    setDeleting(id)
    try {
      await fetch(`/api/school-profile/${id}`, { method: 'DELETE' })
      fetchProfiles()
    } catch { alert('Gagal') }
    finally { setDeleting(null) }
  }

  const filtered = activeSection === 'all'
    ? profiles
    : profiles.filter(p => p.section === activeSection)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            Profil Sekolah
          </h2>
          <p className="text-sm text-gray-500 mt-1">Kelola sejarah, visi-misi, dan keunggulan sekolah</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Section
        </button>
      </div>

      {/* Section filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
            activeSection === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Semua ({profiles.length})
        </button>
        {Object.entries(SECTION_LABELS).map(([key, val]) => {
          const count = profiles.filter(p => p.section === key).length
          return (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                activeSection === key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {val.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editId ? 'Edit Section' : 'Tambah Section Baru'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Section *</label>
              <select
                value={form.section}
                onChange={e => setForm({ ...form, section: e.target.value as Profile['section'] })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sejarah">Sejarah</option>
                <option value="visi_misi">Visi & Misi</option>
                <option value="keunggulan">Keunggulan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sejarah Sekolah Kami"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten *</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Isi konten profil..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Gambar</label>
              <input
                type="text"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/images/sejarah.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Video URL</label>
              <input
                type="text"
                value={form.videoUrl}
                onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
              <input
                type="number"
                value={form.orderPosition}
                onChange={e => setForm({ ...form, orderPosition: parseInt(e.target.value) || 0 })}
                className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving || !form.title.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editId ? 'Update' : 'Simpan'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </div>
      )}

      {/* Profile Cards */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Belum ada data profil sekolah.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.sort((a, b) => a.orderPosition - b.orderPosition).map(profile => {
              const sec = SECTION_LABELS[profile.section]
              const Icon = sec?.icon || BookOpen
              return (
                <div key={profile.id} className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    sec?.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    sec?.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        sec?.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        sec?.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {sec?.label || profile.section}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">{profile.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{profile.content}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEdit(profile)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(profile.id)} disabled={deleting === profile.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50" title="Hapus">
                      {deleting === profile.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
