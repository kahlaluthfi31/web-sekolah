'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Settings, Plus, Save, Trash2, X,
  Loader2, Type, ImageIcon, Link2, ToggleLeft,
  Search, AlertCircle, Megaphone, Upload, ExternalLink,
} from 'lucide-react'
import Image from 'next/image'

interface Setting {
  id: number
  settingKey: string
  settingValue: string | null
  settingType: 'text' | 'image' | 'url' | 'boolean'
  updatedAt: string
}

const DEFAULT_SETTINGS = [
  { key: 'site_name', label: 'Nama Website', type: 'text' as const, placeholder: 'SMK Negeri 1 ...' },
  { key: 'site_description', label: 'Deskripsi Website', type: 'text' as const, placeholder: 'Website resmi SMK ...' },
  { key: 'site_logo', label: 'Logo', type: 'image' as const, placeholder: '/images/logo.png' },
  { key: 'site_favicon', label: 'Favicon', type: 'image' as const, placeholder: '/favicon.ico' },
  { key: 'contact_email', label: 'Email Kontak', type: 'text' as const, placeholder: 'info@sekolah.sch.id' },
  { key: 'contact_phone', label: 'Telepon', type: 'text' as const, placeholder: '(021) 123-4567' },
  { key: 'contact_address', label: 'Alamat', type: 'text' as const, placeholder: 'Jl. ...' },
  { key: 'social_instagram', label: 'Instagram', type: 'url' as const, placeholder: 'https://instagram.com/...' },
  { key: 'social_facebook', label: 'Facebook', type: 'url' as const, placeholder: 'https://facebook.com/...' },
  { key: 'social_youtube', label: 'YouTube', type: 'url' as const, placeholder: 'https://youtube.com/...' },
  { key: 'social_tiktok', label: 'TikTok', type: 'url' as const, placeholder: 'https://tiktok.com/...' },
  { key: 'footer_text', label: 'Teks Footer', type: 'text' as const, placeholder: '© 2025 SMK ...' },
  { key: 'google_maps_embed', label: 'Google Maps Embed URL', type: 'url' as const, placeholder: 'https://www.google.com/maps/embed?...' },
  { key: 'maintenance_mode', label: 'Mode Maintenance', type: 'boolean' as const, placeholder: '' },
  { key: 'registration_open', label: 'Pendaftaran Dibuka', type: 'boolean' as const, placeholder: '' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [customKey, setCustomKey] = useState('')
  const [customValue, setCustomValue] = useState('')
  const [customType, setCustomType] = useState<Setting['settingType']>('text')
  const [deleting, setDeleting] = useState<number | null>(null)

  // Popup state
  const [popupActive, setPopupActive] = useState(false)
  const [popupImage, setPopupImage] = useState('')
  const [popupTitle, setPopupTitle] = useState('')
  const [popupButtonLabel, setPopupButtonLabel] = useState('Cek Selengkapnya')
  const [popupButtonUrl, setPopupButtonUrl] = useState('')
  const [popupButtonType, setPopupButtonType] = useState<'external' | 'internal'>('external')
  const [popupImgPreview, setPopupImgPreview] = useState<string | null>(null)
  const [popupImgError, setPopupImgError] = useState(false)
  const [savingPopup, setSavingPopup] = useState(false)
  const [popupSaved, setPopupSaved] = useState(false)
  const [uploadingPopup, setUploadingPopup] = useState(false)
  const popupFileRef = useRef<HTMLInputElement>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const json = await res.json()
      if (json.success) setSettings(json.data)
    } catch (err) {
      console.error('Failed to fetch settings', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  // Sync popup fields whenever settings change
  useEffect(() => {
    const get = (key: string) => settings.find(s => s.settingKey === key)?.settingValue ?? ''
    setPopupActive(get('popup_active') === 'true')
    setPopupTitle(get('popup_title'))
    setPopupButtonLabel(get('popup_button_label') || 'Cek Selengkapnya')
    setPopupButtonUrl(get('popup_button_url'))
    setPopupButtonType((get('popup_button_type') as 'external' | 'internal') || 'external')
    const img = get('popup_image')
    setPopupImage(img)
    setPopupImgPreview(img || null)
    setPopupImgError(false)
  }, [settings])

  // Get value for a setting key
  const getValue = (key: string) => {
    const s = settings.find(s => s.settingKey === key)
    return s?.settingValue || ''
  }

  // Save a single setting
  const saveSetting = async (key: string, value: string, type: Setting['settingType']) => {
    setSaving(key)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingKey: key, settingValue: value, settingType: type }),
      })
      if (res.ok) {
        fetchSettings()
      } else {
        const json = await res.json()
        alert(json.message || 'Gagal menyimpan')
      }
    } catch {
      alert('Terjadi kesalahan')
    } finally {
      setSaving(null)
    }
  }

  // Save custom setting
  const saveCustom = async () => {
    if (!customKey.trim()) return
    await saveSetting(customKey.trim(), customValue, customType)
    setShowCustom(false)
    setCustomKey('')
    setCustomValue('')
    setCustomType('text')
  }

  // Delete a setting
  const deleteSetting = async (id: number, key: string) => {
    if (!confirm(`Hapus setting "${key}"?`)) return
    setDeleting(id)
    try {
      // Delete by upserting with empty value (or custom delete endpoint)
      await saveSetting(key, '', 'text')
      fetchSettings()
    } catch {
      alert('Gagal')
    } finally {
      setDeleting(null)
    }
  }

  // Upload gambar popup
  const handlePopupImageUpload = async (file: File) => {
    setUploadingPopup(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const j = await res.json()
      if (j.success) {
        setPopupImage(j.data.url)
        setPopupImgPreview(j.data.url)
        setPopupImgError(false)
      } else {
        alert('Gagal upload gambar: ' + (j.message ?? ''))
      }
    } catch { alert('Terjadi kesalahan saat upload.') }
    finally { setUploadingPopup(false) }
  }

  // Simpan semua setting popup sekaligus
  const saveAllPopup = async () => {
    setSavingPopup(true)
    try {
      const pairs: [string, string, Setting['settingType']][] = [
        ['popup_active', popupActive ? 'true' : 'false', 'boolean'],
        ['popup_image', popupImage, 'image'],
        ['popup_title', popupTitle, 'text'],
        ['popup_button_label', popupButtonLabel, 'text'],
        ['popup_button_url', popupButtonUrl, 'url'],
        ['popup_button_type', popupButtonType, 'text'],
      ]
      await Promise.all(pairs.map(([k, v, t]) =>
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settingKey: k, settingValue: v, settingType: t }),
        })
      ))
      setPopupSaved(true)
      setTimeout(() => setPopupSaved(false), 2500)
      fetchSettings()
    } catch { alert('Terjadi kesalahan.') }
    finally { setSavingPopup(false) }
  }

  // Custom settings (not in DEFAULT_SETTINGS)
  const popupKeys = ['popup_active', 'popup_image', 'popup_title', 'popup_button_label', 'popup_button_url', 'popup_button_type']
  const defaultKeys = [...DEFAULT_SETTINGS.map(d => d.key), ...popupKeys]
  const customSettings = settings.filter(s => !defaultKeys.includes(s.settingKey))

  // Filter
  const filteredDefaults = DEFAULT_SETTINGS.filter(d =>
    d.label.toLowerCase().includes(search.toLowerCase()) ||
    d.key.toLowerCase().includes(search.toLowerCase())
  )

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'image') return <ImageIcon className="w-4 h-4 text-purple-500" />
    if (type === 'url') return <Link2 className="w-4 h-4 text-blue-500" />
    if (type === 'boolean') return <ToggleLeft className="w-4 h-4 text-green-500" />
    return <Type className="w-4 h-4 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Pengaturan Website
          </h2>
          <p className="text-sm text-gray-500 mt-1">Konfigurasi umum, kontak, media sosial, dan lainnya</p>
        </div>
        <button
          onClick={() => setShowCustom(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Custom Setting
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari pengaturan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Custom setting form */}
      {showCustom && (
        <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah Custom Setting</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Key <span className="text-red-500">*</span></label>
              <input type="text" value={customKey} onChange={e => setCustomKey(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="custom_key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Value</label>
              <input type="text" value={customValue} onChange={e => setCustomValue(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nilai..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe</label>
              <select value={customType} onChange={e => setCustomType(e.target.value as Setting['settingType'])}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="text">Text</option>
                <option value="image">Image URL</option>
                <option value="url">URL</option>
                <option value="boolean">Boolean</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={saveCustom} disabled={!customKey.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
              <Save className="w-4 h-4" /> Simpan
            </button>
            <button onClick={() => { setShowCustom(false); setCustomKey(''); setCustomValue('') }}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </div>
      )}

      {/* Settings List */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {filteredDefaults.map(def => {
          const currentValue = getValue(def.key)
          return (
            <SettingRow
              key={def.key}
              settingKey={def.key}
              label={def.label}
              type={def.type}
              placeholder={def.placeholder}
              value={currentValue}
              saving={saving === def.key}
              onSave={(val) => saveSetting(def.key, val, def.type)}
            />
          )
        })}
      </div>

      {/* Custom Settings */}
      {customSettings.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-8">Custom Settings</h3>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {customSettings.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-6 py-4">
                <TypeIcon type={s.settingType} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{s.settingKey}</p>
                  <p className="text-xs text-gray-400 truncate">{s.settingValue || '(kosong)'}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(s.updatedAt).toLocaleDateString('id-ID')}
                </span>
                <button onClick={() => deleteSetting(s.id, s.settingKey)} disabled={deleting === s.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                  {deleting === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Section: Popup Pengumuman ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Popup Pengumuman</h3>
              <p className="text-xs text-gray-400">Tampilkan popup saat pengunjung pertama membuka website</p>
            </div>
          </div>
          {/* Toggle aktif */}
          <button
            onClick={() => setPopupActive(v => !v)}
            className={`relative inline-flex h-7 w-12 rounded-full transition-colors ${popupActive ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-1 ${popupActive ? 'translate-x-6 ml-0.5' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className={`px-6 py-6 space-y-5 transition-opacity ${popupActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

          {/* ── Baris atas: Gambar (kiri) + Judul & Tombol (kanan) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Kolom kiri — Gambar */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-600">
                Gambar Popup <span className="text-gray-400 font-normal">(JPG/PNG/WEBP)</span>
              </label>
              <input ref={popupFileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setPopupImgPreview(URL.createObjectURL(f)); handlePopupImageUpload(f) } }} />

              {popupImgPreview && !popupImgError ? (
                <div className="relative rounded-xl overflow-hidden bg-gray-100 h-48 group w-full">
                  <Image src={popupImgPreview} alt="popup preview" fill unoptimized className="object-cover"
                    onError={() => setPopupImgError(true)} />
                  {uploadingPopup && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button type="button" onClick={() => popupFileRef.current?.click()}
                      className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-50 transition">Ganti</button>
                    <button type="button" onClick={() => { setPopupImage(''); setPopupImgPreview(null) }}
                      className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition">Hapus</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => popupFileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-[#0092DD] hover:text-[#0092DD] transition-colors group h-48">
                  {uploadingPopup ? <Loader2 className="w-7 h-7 animate-spin" /> : <Upload className="w-7 h-7 group-hover:scale-110 transition-transform" />}
                  <span className="text-xs font-medium">{uploadingPopup ? 'Mengunggah...' : 'Klik untuk pilih gambar'}</span>
                </button>
              )}

              <div>
                <p className="text-[11px] text-gray-400 mb-1.5">Atau masukkan URL gambar langsung:</p>
                <input type="text" value={popupImage}
                  onChange={e => { setPopupImage(e.target.value); setPopupImgPreview(e.target.value); setPopupImgError(false) }}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition" />
              </div>
            </div>

            {/* Kolom kanan — Judul + Label + URL + Tipe */}
            <div className="space-y-4">
              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Judul <span className="text-gray-400 font-normal">(opsional — tampil jika tidak ada gambar)</span>
                </label>
                <input type="text" value={popupTitle} onChange={e => setPopupTitle(e.target.value)}
                  placeholder="cth: Informasi Penting!"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition" />
              </div>

              {/* Label Tombol */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Label Tombol</label>
                <input type="text" value={popupButtonLabel} onChange={e => setPopupButtonLabel(e.target.value)}
                  placeholder="Cek Selengkapnya"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition" />
              </div>

              {/* URL Tujuan */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL Tujuan</label>
                <input type="text" value={popupButtonUrl} onChange={e => setPopupButtonUrl(e.target.value)}
                  placeholder="https://... atau news"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition" />
              </div>

              {/* Tipe Tombol */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipe Tombol</label>
                <div className="flex items-center gap-2">
                  <button type="button"
                    onClick={() => setPopupButtonType('external')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${popupButtonType === 'external' ? 'border-[#0092DD] bg-[#0092DD]/10 text-[#0092DD]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <ExternalLink className="w-3.5 h-3.5" /> External
                  </button>
                  <button type="button"
                    onClick={() => setPopupButtonType('internal')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${popupButtonType === 'internal' ? 'border-[#0092DD] bg-[#0092DD]/10 text-[#0092DD]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    Internal
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {popupButtonType === 'internal' ? '💡 Isi URL dengan nama page: news, about-us, dll.' : '💡 Buka URL di tab baru (link eksternal).'}
                </p>
              </div>
            </div>
          </div>

          {/* Simpan Popup */}
          <div className="pt-2 border-t border-gray-50">
            <button onClick={saveAllPopup} disabled={savingPopup}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                popupSaved ? 'bg-green-500 text-white' : 'bg-[#0092DD] hover:bg-[#0077BB] text-white'
              } disabled:opacity-60`}>
              {savingPopup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {popupSaved ? 'Tersimpan ✓' : savingPopup ? 'Menyimpan...' : 'Simpan Pengaturan Popup'}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Penting!</p>
          <p className="text-amber-600 mt-0.5">Perubahan setting akan langsung berlaku di website publik. Pastikan data sudah benar sebelum menyimpan.</p>
        </div>
      </div>
    </div>
  )
}

/* ====== Setting Row Component ====== */
function SettingRow({
  settingKey, label, type, placeholder, value, saving, onSave,
}: {
  settingKey: string
  label: string
  type: Setting['settingType']
  placeholder: string
  value: string
  saving: boolean
  onSave: (val: string) => void
}) {
  const [localValue, setLocalValue] = useState(value)
  const [editing, setEditing] = useState(false)

  useEffect(() => { setLocalValue(value) }, [value])

  const changed = localValue !== value

  const handleSave = () => {
    onSave(localValue)
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
      <div className="w-40 shrink-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 font-mono">{settingKey}</p>
      </div>
      <div className="flex-1">
        {type === 'boolean' ? (
          <button
            onClick={() => {
              const newVal = localValue === 'true' ? 'false' : 'true'
              setLocalValue(newVal)
              onSave(newVal)
            }}
            className={`relative inline-flex h-7 w-12 rounded-full transition-colors ${
              localValue === 'true' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-1 ${
              localValue === 'true' ? 'translate-x-6 ml-0.5' : 'translate-x-1'
            }`} />
          </button>
        ) : editing || !value ? (
          <input
            type="text"
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            onFocus={() => setEditing(true)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all truncate"
          >
            {value || <span className="text-gray-300">Belum diisi</span>}
          </button>
        )}
      </div>
      {type !== 'boolean' && changed && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shrink-0"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Simpan
        </button>
      )}
    </div>
  )
}
