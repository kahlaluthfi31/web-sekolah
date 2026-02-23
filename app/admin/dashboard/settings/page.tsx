'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Settings, Plus, Save, Trash2, X,
  Loader2, Type, ImageIcon, Link2, ToggleLeft,
  Search, AlertCircle,
} from 'lucide-react'

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

  // Custom settings (not in DEFAULT_SETTINGS)
  const defaultKeys = DEFAULT_SETTINGS.map(d => d.key)
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Key *</label>
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
