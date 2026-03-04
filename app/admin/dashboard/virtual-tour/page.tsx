'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus, Pencil, Trash2, Loader2, AlertTriangle, CheckCircle2,
  Upload, MapPin, ChevronDown, ChevronUp, Star, X, Eye, MoreVertical,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

const VirtualTourViewer = dynamic(() => import('@/components/VirtualTourViewer'), { ssr: false })

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */
function isValidImageUrl(url: string): boolean {
  if (!url) return true // empty is ok (handled by required check)
  try {
    const u = new URL(url)
    // Must be http/https
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
    // Pathname must end with an image extension (before any query string)
    return /\.(jpe?g|png|webp|gif|tiff?|bmp)(\?.*)?$/i.test(u.pathname)
  } catch {
    // Relative paths (e.g. /assets/360/image.jpg) — check extension only
    return /\.(jpe?g|png|webp|gif|tiff?|bmp)(\?.*)?$/i.test(url)
  }
}

/**
 * Compress an image client-side using Canvas API.
 * - Resizes to max 4096px wide (maintains aspect ratio)
 * - Converts to WebP at 80% quality
 * Returns a new File object ready for upload.
 */
async function compressTo360WebP(file: File): Promise<File> {
  const MAX_WIDTH = 4096
  const QUALITY = 0.80

  return new Promise((resolve, reject) => {
    // Timeout safety — kalau canvas.toBlob tidak merespons dalam 30 detik, fallback ke file asli
    const timeout = setTimeout(() => {
      resolve(file) // fallback: kirim file asli tanpa kompresi
    }, 30_000)

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      // Calculate target dimensions
      let { width, height } = img
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        clearTimeout(timeout)
        resolve(file) // fallback: tidak ada canvas
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          clearTimeout(timeout)
          if (!blob) {
            resolve(file) // fallback: blob null (browser tidak support WebP)
            return
          }
          const baseName = file.name.replace(/\.[^.]+$/, '')
          resolve(new File([blob], `${baseName}.webp`, { type: 'image/webp' }))
        },
        'image/webp',
        QUALITY,
      )
    }

    img.onerror = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = objectUrl
  })
}

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------ */
interface Hotspot {
  id: number
  sceneId: number
  pitch: number
  yaw: number
  text: string
  targetSceneId: number | null
}

interface Scene {
  id: number
  sceneKey: string
  title: string
  imagePath: string
  sortOrder: number
  isDefault: boolean
  hotspots: Hotspot[]
}

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */
function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {children}
    </span>
  )
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/* ------------------------------------------------------------------
   Action Menu (titik tiga )   overflow:visible agar tidak terpotong card
------------------------------------------------------------------ */
function ActionMenu({ onEdit, onDelete, deleting, small }: {
  onEdit: () => void
  onDelete: () => void
  deleting?: boolean
  small?: boolean
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(120)

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        onClick={toggle}
        className={`${small ? 'p-1.5' : 'p-2'} text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors`}
      >
        {deleting ? <Loader2 className={`${small ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-spin`} /> : <MoreVertical className={`${small ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
      </button>
      {open && (
        <div
          style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }}
          className="w-36 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          <button
            onClick={() => { close(); onEdit() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => { close(); onDelete() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------
   Confirm Delete Modal
------------------------------------------------------------------ */
function ConfirmDeleteModal({
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string
  message: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}) {
  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{message}</p>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Add / Edit Scene Modal
------------------------------------------------------------------ */
function SceneModal({
  scene,
  scenes,
  onClose,
  onSaved,
}: {
  scene: Scene | null
  scenes: Scene[]
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const isEdit = !!scene
  const fileRef = useRef<HTMLInputElement>(null)
  const hasDefault = scenes.some(s => s.isDefault && (!isEdit || s.id !== scene?.id))
  const nextOrder = isEdit ? (scene?.sortOrder ?? 1) : (scenes.length > 0 ? Math.max(...scenes.map(s => s.sortOrder)) + 1 : 1)

  const [form, setForm] = useState({
    sceneKey: scene?.sceneKey ?? '',
    title: scene?.title ?? '',
    imagePath: scene?.imagePath ?? '',
    sortOrder: nextOrder,
    isDefault: scene?.isDefault ?? false,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) {
      setForm(f => ({ ...f, sceneKey: slugify(f.title) }))
    }
  }, [form.title, isEdit])

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadStatus('compressing')
    setError('')
    try {
      // Step 1: client-side compress → WebP max 4096px @80%
      const compressed = await compressTo360WebP(file)

      // Step 2: upload compressed file
      setUploadStatus('uploading')
      const fd = new FormData()
      fd.append('file', compressed)
      const res = await fetch('/api/upload/360', { method: 'POST', credentials: 'include', body: fd })

      let json: { success: boolean; message?: string; data?: { url: string } }
      try { json = await res.json() } catch { throw new Error(`Upload error: ${res.status}`) }

      if (!json.success) { setError(json.message ?? 'Upload gagal'); return }
      setForm(f => ({ ...f, imagePath: json.data!.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal')
    } finally {
      setUploading(false)
      setUploadStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving || uploading) return   // guard double-submit
    setSaving(true)
    setError('')
    try {
      const url = isEdit ? `/api/virtual-tour/scenes/${scene!.id}` : '/api/virtual-tour/scenes'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })

      let json: { success: boolean; message?: string }
      try {
        json = await res.json()
      } catch {
        throw new Error(`Server error: ${res.status} ${res.statusText}`)
      }

      if (!json.success) {
        setError(json.message || `Gagal menyimpan (HTTP ${res.status})`)
        return
      }

      // Refresh data lalu tutup modal
      await onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Scene' : 'Tambah Scene Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Scene *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Gerbang Utama"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scene Key <span className="text-gray-400 font-normal text-xs">(otomatis)</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
              value={form.sceneKey}
              readOnly
              tabIndex={-1}
            />
            <p className="text-xs text-gray-400 mt-1">Dibuat otomatis dari judul. Contoh: &quot;Gerbang Sekolah AB&quot;  <code className="bg-gray-100 px-1 rounded">gerbang-sekolah-ab</code></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto 360</label>
            <div className="space-y-2">
              {form.imagePath && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{form.imagePath}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadStatus === 'compressing' ? 'Mengkompresi ke WebP...' : uploadStatus === 'uploading' ? 'Mengupload...' : 'Upload Foto 360'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]) }}
              />
              <p className="text-xs text-gray-400">Atau masukkan URL gambar online / path lokal secara manual</p>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.imagePath}
                onChange={e => setForm(f => ({ ...f, imagePath: e.target.value }))}
                placeholder="https://... atau /assets/360/gerbang.jpg"
              />
              {form.imagePath && !isValidImageUrl(form.imagePath) && (
                <p className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>URL harus berupa file gambar langsung (.jpg, .png, .webp, dll), bukan halaman website. Contoh: <code className="bg-red-100 px-1 rounded">https://example.com/foto.jpg</code></span>
                </p>
              )}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 space-y-1.5">
                <p className="text-xs font-medium text-amber-700">Tidak semua URL online bisa dipakai (CORS)</p>
                <p className="text-xs text-amber-700 font-medium mt-1">URL contoh untuk test (klik untuk pakai):</p>
                <div className="space-y-1">
                  {[
                    { label: 'Hutan (pannellum.org)', url: 'https://pannellum.org/images/cerro-toco-0.jpg' },
                    { label: 'Gunung (polyhaven.com)', url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/kloofendal_48d_partly_cloudy_puresky.jpg' },
                    { label: 'Mall (pannellum.org)', url: 'https://pannellum.org/images/jfk.jpg' },
                    { label: 'Alma (pannellum.org)', url: 'https://pannellum.org/images/alma.jpg' },
                  ].map(sample => (
                    <button
                      key={sample.url}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, imagePath: sample.url }))}
                      className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.sortOrder}
                onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 1 }))}
              />
              <p className="text-xs text-gray-400 mt-1">Otomatis diisi urutan berikutnya</p>
            </div>
            {!hasDefault ? (
              <div className="flex items-end pb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-blue-600"
                    checked={form.isDefault}
                    onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-700">Scene pertama</span>
                </label>
              </div>
            ) : (
              <div className="flex items-end pb-5">
                <p className="text-xs text-gray-400 italic">Scene pertama sudah ditentukan ()</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || uploading || !form.imagePath || !isValidImageUrl(form.imagePath)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              title={uploadStatus === 'compressing' ? 'Tunggu kompresi selesai...' : undefined}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Scene'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Add / Edit Hotspot Modal
------------------------------------------------------------------ */
function HotspotModal({
  sceneId,
  scenes,
  hotspot,
  onClose,
  onSaved,
}: {
  sceneId: number
  scenes: Scene[]
  hotspot: Hotspot | null
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const isEdit = !!hotspot
  const [hotspotType, setHotspotType] = useState<'info' | 'scene'>(
    hotspot?.targetSceneId ? 'scene' : 'info'
  )
  const [form, setForm] = useState({
    pitch: hotspot?.pitch ?? 0,
    yaw: hotspot?.yaw ?? 0,
    text: hotspot?.text ?? '',
    targetSceneId: hotspot?.targetSceneId ?? null as number | null,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleTypeChange = (type: 'info' | 'scene') => {
    setHotspotType(type)
    if (type === 'info') setForm(f => ({ ...f, targetSceneId: null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hotspotType === 'scene' && !form.targetSceneId) {
      setError('Pilih scene tujuan untuk tipe Pindah Scene')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = isEdit ? `/api/virtual-tour/hotspots/${hotspot!.id}` : '/api/virtual-tour/hotspots'
      const method = isEdit ? 'PUT' : 'POST'
      const payload = {
        pitch: form.pitch,
        yaw: form.yaw,
        text: form.text,
        targetSceneId: hotspotType === 'info' ? null : form.targetSceneId,
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? payload : { sceneId, ...payload }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.message || 'Gagal menyimpan'); return }
      await onSaved()
      onClose()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Hotspot' : 'Tambah Hotspot'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Hotspot</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleTypeChange('info')}
                className={`border-2 rounded-xl p-3 text-center transition-all ${hotspotType === 'info' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="text-lg mb-0.5"></div>
                <div className="text-xs font-medium text-gray-700">Info / Deskripsi</div>
                <div className="text-xs text-gray-400 mt-0.5">Tampilkan teks di titik ini</div>
              </button>
              <button type="button" onClick={() => handleTypeChange('scene')}
                className={`border-2 rounded-xl p-3 text-center transition-all ${hotspotType === 'scene' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="text-lg mb-0.5"></div>
                <div className="text-xs font-medium text-gray-700">Pindah Scene</div>
                <div className="text-xs text-gray-400 mt-0.5">Link ke ruang lain</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Teks *</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              placeholder={hotspotType === 'scene' ? 'Masuk ke Lobi' : 'Ruangan ini adalah Lab Komputer dengan 40 unit PC...'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pitch <span className="text-gray-400 font-normal">(-90~90)</span></label>
              <input type="number" step="0.01" min={-90} max={90}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.pitch}
                onChange={e => setForm(f => ({ ...f, pitch: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yaw <span className="text-gray-400 font-normal">(-180~180)</span></label>
              <input type="number" step="0.01" min={-180} max={180}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.yaw}
                onChange={e => setForm(f => ({ ...f, yaw: parseFloat(e.target.value) || 0 }))} />
            </div>
          </div>
          <p className="text-xs text-gray-400 -mt-2">Gunakan nilai desimal penuh (misal: -25.08) agar posisi akurat.</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Scene</label>
            {hotspotType === 'info' ? (
              <div className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed">
                Tidak Berpindah (tipe Info)
              </div>
            ) : (
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.targetSceneId ?? ''}
                onChange={e => setForm(f => ({ ...f, targetSceneId: e.target.value ? parseInt(e.target.value) : null }))}
                required
              >
                <option value=""> Pilih scene tujuan </option>
                {scenes.filter(s => s.id !== sceneId).map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.sceneKey})</option>
                ))}
              </select>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-blue-600 leading-relaxed space-y-1">
            <p><strong>Cara dapat Pitch/Yaw yang akurat:</strong></p>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-500">
              <li>Buka <strong>Preview Tour</strong> di halaman ini</li>
              <li>Arahkan objek yang ingin diberi hotspot ke <strong>tengah-tengah</strong> layar preview</li>
              <li>Lihat koordinat di pojok <strong>kanan bawah</strong> viewer, klik untuk copy</li>
              <li>Paste nilai Pitch &amp; Yaw di sini</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah Hotspot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Main Page
------------------------------------------------------------------ */
export default function VirtualTourAdminPage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedScene, setExpandedScene] = useState<number | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [sceneModal, setSceneModal] = useState<{ open: boolean; scene: Scene | null }>({ open: false, scene: null })
  const [hotspotModal, setHotspotModal] = useState<{ open: boolean; sceneId: number; hotspot: Hotspot | null }>({
    open: false, sceneId: 0, hotspot: null,
  })

  // Confirm delete state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    type: 'scene' | 'hotspot'
    id: number
    name: string
    loading: boolean
  }>({ open: false, type: 'scene', id: 0, name: '', loading: false })

  const [previewConfig, setPreviewConfig] = useState<null | {
    default: { firstScene: string }
    scenes: Record<string, unknown>
  }>(null)
  const prevConfigRef = useRef<string>('')

  const fetchScenes = useCallback(async () => {
    try {
      const res = await fetch(`/api/virtual-tour/scenes?t=${Date.now()}`, { cache: 'no-store' })
      const json = await res.json()
      if (json.success) setScenes(json.data)
      else setError('Gagal memuat data scenes')
    } catch {
      setError('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchScenes() }, [fetchScenes])

  useEffect(() => {
    if (scenes.length === 0) { setPreviewConfig(null); return }
    const defaultScene = scenes.find(s => s.isDefault) ?? scenes[0]
    const sceneKeyById = new Map(scenes.map(s => [s.id, s.sceneKey]))
    const scenesMap: Record<string, unknown> = {}
    for (const scene of scenes) {
      scenesMap[scene.sceneKey] = {
        title: scene.title,
        panorama: scene.imagePath,
        hotSpots: scene.hotspots.map(h => {
          if (h.targetSceneId) {
            // Pindah scene
            return {
              pitch: h.pitch,
              yaw: h.yaw,
              type: 'scene',
              text: h.text,
              sceneId: sceneKeyById.get(h.targetSceneId) ?? '',
            }
          } else {
            // Info  TIDAK pakai cssClass, biarkan Pannellum handle type:'info' murni
            return {
              pitch: h.pitch,
              yaw: h.yaw,
              type: 'info',
              text: h.text,
            }
          }
        }),
      }
    }
    const newConfig = { default: { firstScene: defaultScene.sceneKey }, scenes: scenesMap }
    const newConfigStr = JSON.stringify(newConfig)
    if (prevConfigRef.current !== newConfigStr) {
      prevConfigRef.current = newConfigStr
      setPreviewConfig(newConfig)
    }
  }, [scenes])

  const confirmDeleteScene = (scene: Scene) => {
    setDeleteConfirm({ open: true, type: 'scene', id: scene.id, name: scene.title, loading: false })
  }

  const confirmDeleteHotspot = (h: Hotspot) => {
    setDeleteConfirm({ open: true, type: 'hotspot', id: h.id, name: h.text, loading: false })
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirm(d => ({ ...d, loading: true }))
    try {
      if (deleteConfirm.type === 'scene') {
        const res = await fetch(`/api/virtual-tour/scenes/${deleteConfirm.id}`, { method: 'DELETE' })
        const json = await res.json()
        if (!json.success) { alert(json.message || 'Gagal menghapus'); return }
      } else {
        const res = await fetch(`/api/virtual-tour/hotspots/${deleteConfirm.id}`, { method: 'DELETE' })
        const json = await res.json()
        if (!json.success) { alert(json.message || 'Gagal menghapus'); return }
      }
      await fetchScenes()
      setDeleteConfirm(d => ({ ...d, open: false }))
    } catch {
      alert('Gagal menghapus')
    } finally {
      setDeleteConfirm(d => ({ ...d, loading: false }))
    }
  }

  const handleSetDefault = async (scene: Scene) => {
    await fetch(`/api/virtual-tour/scenes/${scene.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    })
    await fetchScenes()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Virtual Tour Sekolah</h2>
          <p className="text-sm text-gray-500">Kelola scene dan hotspot untuk tur virtual 360</p>
        </div>
        <div className="flex items-center gap-2">
          {scenes.length > 0 && (
            <button
              onClick={() => setPreviewOpen(p => !p)}
              className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {previewOpen ? 'Tutup Preview' : 'Preview Tour'}
            </button>
          )}
          <button
            onClick={() => setSceneModal({ open: true, scene: null })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Scene
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Preview */}
      {previewOpen && previewConfig && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preview Virtual Tour</p>
          <VirtualTourViewer
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config={previewConfig as any}
            height="500px"
            showCoords={true}
          />
          <p className="text-xs text-gray-400 text-center">
            Untuk copy koordinat hotspot: arahkan objek ke <strong>tengah layar</strong> preview, lalu klik koordinat di pojok kanan bawah.
            Jika gambar terus loading, refresh halaman.
          </p>
        </div>
      )}

      {/* Scenes list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : scenes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <MapPin className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Belum ada scene.</p>
          <p className="text-gray-400 text-xs mt-1">Klik <strong>Tambah Scene</strong> untuk mulai membuat Virtual Tour.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scenes.map(scene => {
            const expanded = expandedScene === scene.id
            return (
              <div key={scene.id} className="bg-white rounded-2xl border border-gray-100 overflow-visible">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {scene.imagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={scene.imagePath} alt={scene.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <MapPin className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">{scene.title}</p>
                      {scene.isDefault && (
                        <Badge color="bg-yellow-100 text-yellow-700">
                          <Star className="w-3 h-3" /> Scene Pertama
                        </Badge>
                      )}
                      <Badge color="bg-gray-100 text-gray-500">
                        {scene.hotspots.length} hotspot
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{scene.sceneKey}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!scene.isDefault && (
                      <button
                        onClick={() => handleSetDefault(scene)}
                        title="Jadikan scene pertama"
                        className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-colors"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <ActionMenu
                      onEdit={() => setSceneModal({ open: true, scene })}
                      onDelete={() => confirmDeleteScene(scene)}
                    />
                    <button
                      onClick={() => setExpandedScene(expanded ? null : scene.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-gray-50 px-5 py-4 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotspots</p>
                      <button
                        onClick={() => setHotspotModal({ open: true, sceneId: scene.id, hotspot: null })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Hotspot
                      </button>
                    </div>

                    {scene.hotspots.length === 0 ? (
                      <p className="text-sm text-gray-400 py-3 text-center">Belum ada hotspot.</p>
                    ) : (
                      <div className="space-y-2">
                        {scene.hotspots.map(h => {
                          const targetScene = scenes.find(s => s.id === h.targetSceneId)
                          return (
                            <div key={h.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 overflow-visible">
                              <span className={`text-base shrink-0 ${h.targetSceneId ? 'text-blue-500' : 'text-gray-400'}`}>
                                {h.targetSceneId ? '' : ''}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{h.text}</p>
                                <p className="text-xs text-gray-400">
                                  pitch: {h.pitch}  yaw: {h.yaw}
                                  {targetScene && <>   <span className="text-blue-500">{targetScene.title}</span></>}
                                  {!h.targetSceneId && <>  <span className="text-gray-400">info</span></>}
                                </p>
                              </div>
                              <ActionMenu
                                small
                                onEdit={() => setHotspotModal({ open: true, sceneId: scene.id, hotspot: h })}
                                onDelete={() => confirmDeleteHotspot(h)}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
        <p className="font-medium mb-1">Cara penggunaan:</p>
        <ul className="space-y-0.5 text-blue-500">
          <li>1. Upload foto 360 (format equirectangular, rosolusi minimal 8000x6000px atau sama dengan 50MP untuk kualitas terbaik)</li>
          <li>2. Buka Preview Tour, arahkan objek ke <strong>tengah layar</strong>, copy koordinat dari pojok kanan bawah</li>
          <li>3. Paste Pitch &amp; Yaw ke form Tambah Hotspot agar posisi akurat</li>
          <li>4. Tandai satu scene sebagai <strong>Scene Pertama</strong></li>
        </ul>
      </div>

      {/* Modals */}
      {sceneModal.open && (
        <SceneModal
          scene={sceneModal.scene}
          scenes={scenes}
          onClose={() => setSceneModal({ open: false, scene: null })}
          onSaved={fetchScenes}
        />
      )}
      {hotspotModal.open && (
        <HotspotModal
          sceneId={hotspotModal.sceneId}
          scenes={scenes}
          hotspot={hotspotModal.hotspot}
          onClose={() => setHotspotModal({ open: false, sceneId: 0, hotspot: null })}
          onSaved={fetchScenes}
        />
      )}
      {deleteConfirm.open && (
        <ConfirmDeleteModal
          title={deleteConfirm.type === 'scene' ? 'Hapus Scene' : 'Hapus Hotspot'}
          message={
            deleteConfirm.type === 'scene'
              ? <>Yakin ingin menghapus scene <span className="font-semibold text-gray-700">&quot;{deleteConfirm.name}&quot;</span>? Semua hotspot di dalamnya juga akan terhapus.</>
              : <>Yakin ingin menghapus hotspot <span className="font-semibold text-gray-700">&quot;{deleteConfirm.name}&quot;</span>?</>
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(d => ({ ...d, open: false }))}
          loading={deleteConfirm.loading}
        />
      )}
    </div>
  )
}
