'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Link2, ListOrdered, List, Save, Bold, Italic, Underline, Eraser } from 'lucide-react'

export default function CreateNewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    category: 'PENGUMUMAN',
    status: 'DRAFT',
    isPinned: false,
    tags: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Berita berhasil dibuat')
        router.push('/admin/news')
      } else {
        alert(data.message || 'Gagal membuat berita')
      }
    } catch (error) {
      console.error('Error creating news:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // Sync content state to editor when existing data is present (e.g. edit modal reuse)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== formData.content) {
      editorRef.current.innerHTML = formData.content
    }
  }, [formData.content])

  // Avoid hydration mismatch by rendering editor only on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContentInput = () => {
    const html = editorRef.current?.innerHTML ?? ''
    setFormData(prev => ({ ...prev, content: html }))
  }

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    // after formatting, update state
    handleContentInput()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/news"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Berita Baru</h1>
              <p className="mt-1 text-sm text-gray-600">Buat berita atau pengumuman baru</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Berita</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan judul berita"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Ringkasan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  required
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ringkasan singkat berita (akan ditampilkan di daftar berita)"
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Konten <span className="text-red-500">*</span>
                </label>

                {mounted ? (
                  <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
                    <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                      <button
                        type="button"
                        onClick={() => applyFormat('bold')}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormat('italic')}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormat('underline')}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        title="Underline"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <span className="h-5 w-px bg-gray-200" />
                      <button
                        type="button"
                        onClick={() => applyFormat('insertUnorderedList')}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        title="Bullet list"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormat('insertOrderedList')}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        title="Numbered list"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Masukkan URL tautan:')?.trim()
                          if (url) applyFormat('createLink', url)
                        }}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        title="Sisipkan tautan"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                      <span className="h-5 w-px bg-gray-200" />
                      <button
                        type="button"
                        onClick={() => applyFormat('removeFormat')}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        title="Bersihkan format"
                      >
                        <Eraser className="w-4 h-4" />
                      </button>
                    </div>
                    <div
                      id="content"
                      ref={editorRef}
                      className="min-h-60 px-4 py-3 focus:outline-none prose prose-sm max-w-none"
                      contentEditable
                      role="textbox"
                      aria-multiline
                      onInput={handleContentInput}
                      suppressContentEditableWarning
                      data-placeholder="Tulis konten berita lengkap di sini..."
                    ></div>
                  </div>
                ) : (
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    readOnly
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    placeholder="Memuat editor..."
                  />
                )}
                <p className="mt-1 text-xs text-gray-500">Gunakan toolbar untuk format dasar. Konten akan disimpan sebagai HTML.</p>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Thumbnail
                </label>
                <input
                  type="url"
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Masukkan URL gambar thumbnail (opsional)
                </p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="pisahkan dengan koma, contoh: teknologi, pendidikan, prestasi"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Pisahkan tag dengan koma
                </p>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENGUMUMAN">Pengumuman</option>
                  <option value="PRESTASI">Prestasi</option>
                  <option value="KEGIATAN">Kegiatan</option>
                  <option value="INFO">Info</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            {/* Is Pinned */}
            <div className="mt-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPinned"
                  checked={formData.isPinned}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Pin berita ini di bagian atas
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/news"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Berita'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
