'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  Plus, Search, MoreVertical, Edit2, Trash2,
  ChevronLeft, ChevronRight, Loader2, X, Save,
  ArrowLeft, AlertTriangle, Eye, Upload, MessageCircle, Newspaper,
} from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'
import CommentsPage from '../comments/page'

interface News {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featuredImage: string | null
  category: string
  isPublished: boolean
  views: number
  shares?: number
  creatorName: string | null
  creatorCategory: string | null
  authorName?: string | null
  createdAt: string
  author: { id: number; name: string } | null
  tags: { id: number; tagName: string }[]
}

interface Pagination { page: number; limit: number; total: number; totalPages: number }
interface UserSession { id: number; name: string; role: string }

const CATEGORY_COLORS: Record<string, string> = {
  berita: 'bg-blue-50 text-blue-700 border border-blue-200',
  kejuaraan: 'bg-amber-50 text-amber-700 border border-amber-200',
  pengumuman: 'bg-purple-50 text-purple-700 border border-purple-200',
  event: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const CREATOR_CATEGORIES = ['Guru','Siswa Piket Kelas 10','Siswa Piket Kelas 11','Siswa Piket Kelas 12','Tim Medsos']

class NewsImageUploadAdapter {
  loader: { file: Promise<File | null> }
  abortController: AbortController | null = null

  constructor(loader: { file: Promise<File | null> }) {
    this.loader = loader
  }

  upload() {
    return this.loader.file.then(async (file) => {
      if (!file) {
        throw new Error('File tidak ditemukan')
      }
      this.abortController = new AbortController()
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: this.abortController.signal,
      })
      const json = await res.json()
      if (!json?.success || !json?.data?.url) {
        throw new Error(json?.message || 'Gagal upload gambar')
      }
      return { default: json.data.url as string }
    })
  }

  abort() {
    if (this.abortController) this.abortController.abort()
  }
}

const CkEditor = dynamic(async () => {
  const { CKEditor } = await import('@ckeditor/ckeditor5-react')
  const ClassicModule = await import('@ckeditor/ckeditor5-build-classic')
  const Classic = ((ClassicModule as { default?: unknown; ClassicEditor?: unknown }).default
    ?? (ClassicModule as { ClassicEditor?: unknown }).ClassicEditor
    ?? ClassicModule) as unknown
  type CKProps = Omit<React.ComponentProps<typeof CKEditor>, 'editor'>
  return function CkEditorWrapper(props: CKProps) {
    return <CKEditor editor={Classic as never} {...props} />
  }
}, { ssr: false })

function ActionDropdown({ onDetail, onEdit, onDelete }: { onDetail?: () => void; onEdit: () => void; onDelete: () => void }) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(160)
  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} onClick={toggle} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div
          style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }}
          className="w-36 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
        >
          {onDetail && <><button onClick={() => { close(); onDetail() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
            <Eye className="w-3.5 h-3.5" /> Detail
          </button><div className="border-t border-gray-100" /></>}
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

function DeleteModal({ news, onConfirm, onCancel, deleting }: { news: News; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  const t = news.title.length > 50 ? news.title.substring(0, 50) + '...' : news.title
  return (
    <div className="fixed inset-0 z-60 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex justify-center"><div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center"><AlertTriangle className="w-7 h-7 text-red-600" /></div></div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-900">Hapus Berita</h3>
            <p className="text-sm text-gray-500">Yakin ingin menghapus berita dengan judul <span className="font-semibold text-gray-700">&lsquo;{t}&rsquo;</span> ini?</p>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={deleting} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50">Batal</button>
            <button onClick={onConfirm} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsFormModal({ news, userSession, onClose, onSaved }: { news: News | null; userSession: UserSession | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!news
  const [isClient, setIsClient] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', category: 'berita', isPublished: false, tags: '', creatorName: '', creatorCategory: '', authorName: '' })

  useEffect(() => {
    if (news) {
      setForm({ title: news.title || '', slug: news.slug || '', excerpt: news.excerpt || '', content: news.content || '', featuredImage: news.featuredImage || '', category: news.category || 'berita', isPublished: news.isPublished || false, tags: news.tags?.map(t => t.tagName).join(' ') || '', creatorName: news.creatorName || '', creatorCategory: news.creatorCategory || '', authorName: news.authorName || '' })
      if (news.featuredImage) setImagePreview(news.featuredImage)
    }
  }, [news])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-generate slug from title (both create & edit)
  useEffect(() => {
    const s = form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    setForm(f => ({ ...f, slug: s }))
  }, [form.title])

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      // Preview
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
      // Upload
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (json.success) {
        setForm(f => ({ ...f, featuredImage: json.data.url }))
      } else {
        setError(json.message || 'Gagal upload gambar')
        setImagePreview(null)
      }
    } catch {
      setError('Gagal upload gambar')
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(/\s+/).map(t => t.trim()).filter(Boolean) : [] }
      const url = isEdit ? `/api/news/${news!.id}` : '/api/news'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json.success) { onSaved() } else { setError(json.message || 'Gagal menyimpan berita') }
    } catch { setError('Terjadi kesalahan') } finally { setSaving(false) }
  }

  const showCreatorFields = userSession?.role === 'admin'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><ArrowLeft className="w-4 h-4" /></button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Berita' : 'Tulis Berita Baru'}</h2>
                  <p className="text-xs text-gray-500">{isEdit ? 'Perbarui berita yang sudah ada' : 'Buat berita atau pengumuman baru'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><X className="w-4 h-4" /></button>
            </div>
            {error && <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Judul <span className="text-red-500">*</span></label><input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Masukkan judul berita..." required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL) <span className="text-xs text-gray-400 font-normal">— otomatis dari judul</span></label><input type="text" value={form.slug} readOnly className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-100 text-gray-500 cursor-not-allowed" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Ringkasan</label><textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows={3} placeholder="Ringkasan singkat berita..." /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Penulis <span className="text-xs text-gray-400 font-normal">(opsional)</span></label><input type="text" value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="cth: Kahla Luthfiyah Halim" /></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten <span className="text-red-500">*</span></label>
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                      {isClient ? (
                        <CkEditor
                          data={form.content}
                          onReady={(editor) => {
                            editor.plugins.get('FileRepository').createUploadAdapter = (loader: { file: Promise<File | null> }) => new NewsImageUploadAdapter(loader)
                          }}
                          onChange={(_event, editor) => {
                            const html = editor.getData()
                            setForm(f => ({ ...f, content: html }))
                          }}
                          config={{
                            toolbar: [
                              'heading', '|',
                              'bold', 'italic', '|',
                              'bulletedList', 'numberedList', '|',
                              'link', 'insertTable', 'blockQuote', 'undo', 'redo', '|',
                              'imageUpload'
                            ],
                            image: {
                              toolbar: [
                                'imageTextAlternative', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'
                              ]
                            },
                          }}
                        />
                      ) : (
                        <div className="p-4 text-xs text-gray-400">Memuat editor...</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Konten disimpan sebagai HTML. Anda bisa menambah gambar di antara paragraf.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  {showCreatorFields && (
                    <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5 space-y-4">
                      <h3 className="font-semibold text-blue-900 text-sm">Pembuat Berita</h3>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Pembuat <span className="text-red-500">*</span></label><input type="text" value={form.creatorName} onChange={e => setForm(f => ({ ...f, creatorName: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" placeholder="cth: Kahla Luthfiyah" required /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Pembuat <span className="text-red-500">*</span></label><select value={form.creatorCategory} onChange={e => setForm(f => ({ ...f, creatorCategory: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required><option value="">Pilih kategori...</option>{CREATOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm">Pengaturan Publikasi</h3>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori <span className="text-red-500">*</span></label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="berita">Berita</option><option value="kejuaraan">Kejuaraan</option><option value="pengumuman">Pengumuman</option><option value="event">Event</option></select></div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Status Publikasi</label>
                          <p className="text-xs text-gray-400 mt-0.5">{form.isPublished ? 'Berita akan langsung tampil di website' : 'Berita disimpan sebagai draft, belum tampil di website'}</p>
                        </div>
                        <button type="button" onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))} className={`relative w-11 h-6 rounded-full transition-all shrink-0 ml-3 ${form.isPublished ? 'bg-blue-600' : 'bg-gray-200'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} /></button>
                      </div>
                      <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${form.isPublished ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>{form.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {form.tags.split(/\s+/).filter(Boolean).map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                            {tag}
                            <button type="button" onClick={() => { const tags = form.tags.split(/\s+/).filter(Boolean); tags.splice(i, 1); setForm(f => ({ ...f, tags: tags.join(' ') })) }} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                      <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="ketik tag lalu spasi..." />
                      <p className="text-xs text-gray-400 mt-1">Pisahkan dengan spasi</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm">Gambar Utama</h3>
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200">
                          <Image src={imagePreview} alt="Preview" width={400} height={160} className="w-full h-40 object-cover" unoptimized />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow">Ganti Gambar</button>
                          </div>
                          <button type="button" onClick={() => { setImagePreview(null); setForm(f => ({ ...f, featuredImage: '' })); if (fileInputRef.current) fileInputRef.current.value = '' }} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50">
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/30 transition-all disabled:opacity-50">
                          {uploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> : <Upload className="w-6 h-6 text-gray-400" />}
                          <span className="text-xs text-gray-500">{uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}</span>
                          <span className="text-[10px] text-gray-400">JPG, PNG, GIF, WEBP (maks 5MB)</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">Batal</button>
                    <button type="submit" disabled={saving || uploading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <style jsx global>{`
              /* Extra space inside CKEditor editable area */
              .ck-editor__editable:not(.ck-editor__nested-editable) {
                min-height: 320px;
                padding: 16px;
              }
              .ck-editor__main > .ck-editor__editable {
                border-radius: 0 0 12px 12px;
              }
              .ck-content ul {
                list-style-type: disc;
                padding-left: 1.5rem;
              }
              .ck-content ol {
                list-style-type: decimal;
                padding-left: 1.5rem;
              }
              .ck-content li {
                margin: 0.25rem 0;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ─── Main Page ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
export default function NewsListPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'comments'>('news')
  const [news, setNews] = useState<News[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [published, setPublished] = useState('')
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null)
  const [detailNews, setDetailNews] = useState<News | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me')
        const json = await res.json()
        if (json.success) setUserSession(json.user)
      } catch { /* ignore */ }
    }
    fetchUser()
  }, [])

  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      params.set('limit', '10')
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (published) params.set('published', published)
      const res = await fetch(`/api/news?${params}`)
      const json = await res.json()
      if (json.success) {
        setNews(json.data)
        setPagination(json.pagination)
      }
    } catch (err) {
      console.error('Failed to fetch news', err)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, search, category, published])

  useEffect(() => { fetchNews() }, [fetchNews])

  const handleCreate = () => { setEditingNews(null); setShowFormModal(true) }

  const handleEdit = async (item: News) => {
    setLoadingEdit(true)
    try {
      const res = await fetch(`/api/news/${item.id}`)
      const json = await res.json()
      if (json.success) { setEditingNews(json.data); setShowFormModal(true) }
    } catch { /* ignore */ }
    finally { setLoadingEdit(false) }
  }

  const handleSaved = () => { setShowFormModal(false); setEditingNews(null); fetchNews() }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/news/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) { setDeleteTarget(null); fetchNews() }
    } catch { /* ignore */ }
    finally { setDeleting(false) }
  }

  const getEmptyMessage = () => {
    const parts: string[] = []
    if (published === 'true') parts.push('berstatus Published')
    if (published === 'false') parts.push('berstatus Draft')
    if (category) {
      const cl: Record<string, string> = { berita: 'Berita', kejuaraan: 'Kejuaraan', pengumuman: 'Pengumuman', event: 'Event' }
      parts.push(`berkategori ${cl[category] || category}`)
    }
    if (search) parts.push(`dengan kata kunci "${search}"`)
    if (parts.length > 0) return `Tidak ada berita yang ${parts.join(' dan ')}`
    return 'Belum ada berita.'
  }

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = { berita: 'Berita', kejuaraan: 'Kejuaraan', pengumuman: 'Pengumuman', event: 'Event' }
    return labels[cat] || cat
  }

  return (
    <div className="space-y-6">
      {loadingEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Memuat data berita...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Berita &amp; Pengumuman</h2>
          <p className="text-sm text-gray-500">Kelola berita, pengumuman, dan informasi sekolah</p>
        </div>
        
      </div>

      <div className='flex gap-1 p-1 bg-gray-100 rounded-xl w-fit'>
        <button
          onClick={() => setActiveTab('news')}
          className={'px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ' + (activeTab === 'news' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          <Newspaper className='w-4 h-4' /> Daftar Berita
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={'px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ' + (activeTab === 'comments' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          <MessageCircle className='w-4 h-4' /> Komentar
        </button>
      </div>

      {activeTab === 'news' && (
      <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari berita..." value={search} onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPagination(p => ({ ...p, page: 1 })) }} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Kategori</option>
          <option value="berita">Berita</option>
          <option value="kejuaraan">Kejuaraan</option>
          <option value="pengumuman">Pengumuman</option>
          <option value="event">Event</option>
        </select>
        <select value={published} onChange={e => { setPublished(e.target.value); setPagination(p => ({ ...p, page: 1 })) }} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Tulis Berita
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Search className="w-5 h-5 text-gray-400" /></div>
            <p className="text-sm text-gray-500">{getEmptyMessage()}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Judul</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {news.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        {item.author ? (
                          <p className="text-xs text-gray-400 mt-0.5">
                            oleh {item.author.name}
                            {item.creatorName && item.creatorName !== item.author.name && <span> — {item.creatorName}</span>}
                            {item.creatorCategory && <span className="ml-1 text-blue-500 font-medium">({item.creatorCategory})</span>}
                          </p>
                        ) : item.creatorName ? (
                          <p className="text-xs text-gray-400 mt-0.5">
                            oleh {item.creatorName}
                            {item.creatorCategory && <span className="ml-1 text-blue-500 font-medium">({item.creatorCategory})</span>}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${CATEGORY_COLORS[item.category] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.isPublished ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500"><Eye className="w-3.5 h-3.5" />{item.views}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <ActionDropdown onDetail={() => {
                          fetch(`/api/news/${item.id}`).then(r => r.json()).then(j => { if (j.success) setDetailNews(j.data) })
                        }} onEdit={() => handleEdit(item)} onDelete={() => setDeleteTarget(item)} />
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
              Menampilkan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">{pagination.page} / {pagination.totalPages}</span>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

  </>
  )}

  {activeTab === 'comments' && <CommentsPage embedded />}

      {showFormModal && (
        <NewsFormModal news={editingNews} userSession={userSession} onClose={() => { setShowFormModal(false); setEditingNews(null) }} onSaved={handleSaved} />
      )}

      {deleteTarget && (
        <DeleteModal news={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} deleting={deleting} />
      )}

      {detailNews && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailNews(null)} />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 py-10">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Detail Berita</h2>
                  <button onClick={() => setDetailNews(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                </div>
                <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
                  {detailNews.featuredImage && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <Image src={detailNews.featuredImage} alt={detailNews.title} width={700} height={400} className="w-full h-full object-cover" unoptimized />
                    </div>
                  )}
                  <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                    <span className="text-gray-500">Judul</span><span className="font-medium text-gray-900">{detailNews.title}</span>
                    <span className="text-gray-500">Slug</span><span className="text-gray-700 font-mono text-xs break-all">{detailNews.slug}</span>
                    <span className="text-gray-500">Kategori</span><span><span className={`text-xs px-2.5 py-1 rounded-full capitalize ${CATEGORY_COLORS[detailNews.category] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>{getCategoryLabel(detailNews.category)}</span></span>
                    <span className="text-gray-500">Status</span><span><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${detailNews.isPublished ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>{detailNews.isPublished ? 'Published' : 'Draft'}</span></span>
                    <span className="text-gray-500">Views</span><span className="text-gray-700 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {detailNews.views}</span>
                    {detailNews.tags && detailNews.tags.length > 0 && <><span className="text-gray-500">Tags</span><span className="flex flex-wrap gap-1">{detailNews.tags.map(t => <span key={t.id} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">{t.tagName}</span>)}</span></>}
                    <span className="text-gray-500">Pembuat</span><span className="text-gray-700">{detailNews.creatorName || '-'}{detailNews.creatorCategory && <span className="ml-1 text-blue-500 text-xs">({detailNews.creatorCategory})</span>}</span>
                    {detailNews.author && <><span className="text-gray-500">Author</span><span className="text-gray-700">{detailNews.author.name}</span></>}
                    <span className="text-gray-500">Dibuat</span><span className="text-gray-700">{new Date(detailNews.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    {detailNews.excerpt && <><span className="text-gray-500">Ringkasan</span><span className="text-gray-700 whitespace-pre-wrap">{detailNews.excerpt}</span></>}
                  </div>
                  {detailNews.content && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-500 mb-2">Konten</p>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">{detailNews.content}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
