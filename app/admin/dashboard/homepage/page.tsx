'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Save, X, Loader2, UserCircle } from 'lucide-react'

/* ---------- Types ---------- */
interface Greeting {
  id: number
  title: string | null
  content: string | null
  principalName: string | null
  principalPhoto: string | null
  signature: string | null
  isActive: boolean
}

/* ---------- Component ---------- */
export default function HomepagePage() {
  const [greeting, setGreeting] = useState<Greeting | null>(null)
  const [loading, setLoading] = useState(true)

  // Greeting form
  const [greetingForm, setGreetingForm] = useState(false)
  const [greetingData, setGreetingData] = useState({
    title: '', content: '', principalName: '', principalPhoto: '', signature: '', isActive: true,
  })
  const [greetingSaving, setGreetingSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const homeRes = await fetch('/api/homepage')
      const homeJson = await homeRes.json()

      if (homeJson.success) {
        setGreeting(homeJson.data.greeting || null)
      }
    } catch (err) {
      console.error('Failed to fetch homepage data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  /* ====== GREETING CRUD ====== */
  const openGreetingForm = () => {
    if (greeting) {
      setGreetingData({
        title: greeting.title || '', content: greeting.content || '',
        principalName: greeting.principalName || '', principalPhoto: greeting.principalPhoto || '',
        signature: greeting.signature || '', isActive: greeting.isActive,
      })
    } else {
      setGreetingData({ title: 'Sambutan Kepala Sekolah', content: '', principalName: '', principalPhoto: '', signature: '', isActive: true })
    }
    setGreetingForm(true)
  }

  const saveGreeting = async () => {
    setGreetingSaving(true)
    try {
      const url = greeting ? `/api/homepage/${greeting.id}` : '/api/homepage'
      const method = greeting ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'greeting', ...greetingData }),
      })
      if (res.ok) { setGreetingForm(false); fetchData() }
      else { const j = await res.json(); alert(j.message || 'Gagal') }
    } catch { alert('Terjadi kesalahan') }
    finally { setGreetingSaving(false) }
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
      <div>
        <h2 className="text-xl font-bold text-gray-900">Sambutan Kepala Sekolah</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola konten sambutan untuk halaman utama</p>
      </div>

      <div className="space-y-4">
        {/* Greeting Form */}
        {greetingForm ? (
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {greeting ? 'Edit Sambutan Kepsek' : 'Tambah Sambutan Kepsek'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul</label>
                <input type="text" value={greetingData.title} onChange={e => setGreetingData({ ...greetingData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sambutan Kepala Sekolah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kepala Sekolah</label>
                <input type="text" value={greetingData.principalName} onChange={e => setGreetingData({ ...greetingData, principalName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Drs. ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto URL</label>
                <input type="text" value={greetingData.principalPhoto} onChange={e => setGreetingData({ ...greetingData, principalPhoto: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/kepsek.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Isi Sambutan</label>
                <textarea value={greetingData.content} onChange={e => setGreetingData({ ...greetingData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dengan memanjatkan puji syukur..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanda Tangan (URL gambar)</label>
                <input type="text" value={greetingData.signature} onChange={e => setGreetingData({ ...greetingData, signature: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={greetingData.isActive} onChange={e => setGreetingData({ ...greetingData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveGreeting} disabled={greetingSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                {greetingSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan
              </button>
              <button onClick={() => setGreetingForm(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                <X className="w-4 h-4" /> Batal
              </button>
            </div>
          </div>
        ) : (
          /* Greeting Display */
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {greeting ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-40 bg-gray-100 rounded-xl shrink-0 overflow-hidden flex items-center justify-center">
                  {greeting.principalPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={greeting.principalPhoto} alt={greeting.principalName || 'Principal'} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-16 h-16 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{greeting.title || 'Sambutan'}</h3>
                  <p className="text-sm text-blue-600 font-medium mt-1">{greeting.principalName || '-'}</p>
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap line-clamp-4">{greeting.content || '-'}</p>
                  <button onClick={openGreetingForm}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all">
                    <Edit2 className="w-4 h-4" /> Edit Sambutan
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">Belum ada sambutan kepala sekolah.</p>
                <button onClick={openGreetingForm}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all">
                  <Plus className="w-4 h-4" /> Tambah Sambutan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
