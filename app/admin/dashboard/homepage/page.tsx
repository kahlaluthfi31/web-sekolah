'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Home, Plus, Edit2, Trash2, Save, X,
  ImageIcon, Video, Loader2, Eye, EyeOff,
  UserCircle, ArrowUp, ArrowDown,
} from 'lucide-react'

/* ---------- Types ---------- */
interface Hero {
  id: number
  title: string | null
  subtitle: string | null
  description: string | null
  image: string | null
  videoUrl: string | null
  buttonText: string | null
  buttonUrl: string | null
  orderPosition: number
  isActive: boolean
}

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
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [greeting, setGreeting] = useState<Greeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'hero' | 'greeting'>('hero')

  // Hero form
  const [heroForm, setHeroForm] = useState(false)
  const [heroEditId, setHeroEditId] = useState<number | null>(null)
  const [heroData, setHeroData] = useState({
    title: '', subtitle: '', description: '', image: '', videoUrl: '',
    buttonText: '', buttonUrl: '', orderPosition: 0, isActive: true,
  })
  const [heroSaving, setHeroSaving] = useState(false)

  // Greeting form
  const [greetingForm, setGreetingForm] = useState(false)
  const [greetingData, setGreetingData] = useState({
    title: '', content: '', principalName: '', principalPhoto: '', signature: '', isActive: true,
  })
  const [greetingSaving, setGreetingSaving] = useState(false)

  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/homepage')
      const json = await res.json()
      if (json.success) {
        setHeroes(json.data.heroes || [])
        setGreeting(json.data.greeting || null)
      }
    } catch (err) {
      console.error('Failed to fetch homepage data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  /* ====== HERO CRUD ====== */
  const openHeroForm = (hero?: Hero) => {
    if (hero) {
      setHeroEditId(hero.id)
      setHeroData({
        title: hero.title || '', subtitle: hero.subtitle || '', description: hero.description || '',
        image: hero.image || '', videoUrl: hero.videoUrl || '',
        buttonText: hero.buttonText || '', buttonUrl: hero.buttonUrl || '',
        orderPosition: hero.orderPosition, isActive: hero.isActive,
      })
    } else {
      setHeroEditId(null)
      setHeroData({ title: '', subtitle: '', description: '', image: '', videoUrl: '', buttonText: '', buttonUrl: '', orderPosition: heroes.length, isActive: true })
    }
    setHeroForm(true)
  }

  const saveHero = async () => {
    if (!heroData.title?.trim()) return
    setHeroSaving(true)
    try {
      const url = heroEditId ? `/api/homepage/${heroEditId}` : '/api/homepage'
      const method = heroEditId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hero', ...heroData }),
      })
      if (res.ok) { setHeroForm(false); fetchData() }
      else { const j = await res.json(); alert(j.message || 'Gagal') }
    } catch { alert('Terjadi kesalahan') }
    finally { setHeroSaving(false) }
  }

  const deleteHero = async (id: number) => {
    if (!confirm('Hapus hero slide ini?')) return
    setDeleting(id)
    try {
      await fetch(`/api/homepage/${id}?type=hero`, { method: 'DELETE' })
      fetchData()
    } catch { alert('Gagal') }
    finally { setDeleting(null) }
  }

  const toggleHeroActive = async (hero: Hero) => {
    await fetch(`/api/homepage/${hero.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'hero', ...hero, isActive: !hero.isActive }),
    })
    fetchData()
  }

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
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Home className="w-6 h-6 text-blue-600" />
          Pengaturan Homepage
        </h2>
        <p className="text-sm text-gray-500 mt-1">Kelola hero banner dan sambutan kepala sekolah</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('hero')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'hero' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ImageIcon className="w-4 h-4 inline mr-1.5" />
          Hero Banner ({heroes.length})
        </button>
        <button
          onClick={() => setTab('greeting')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'greeting' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <UserCircle className="w-4 h-4 inline mr-1.5" />
          Sambutan Kepsek
        </button>
      </div>

      {/* ===== HERO TAB ===== */}
      {tab === 'hero' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => openHeroForm()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Slide
            </button>
          </div>

          {/* Hero Form */}
          {heroForm && (
            <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {heroEditId ? 'Edit Hero Slide' : 'Tambah Hero Slide'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul <span className="text-red-500">*</span></label>
                  <input type="text" value={heroData.title} onChange={e => setHeroData({ ...heroData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Selamat Datang di SMK ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                  <input type="text" value={heroData.subtitle} onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mencetak Generasi ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Gambar</label>
                  <input type="text" value={heroData.image} onChange={e => setHeroData({ ...heroData, image: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/images/hero.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                  <textarea value={heroData.description} onChange={e => setHeroData({ ...heroData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Video URL</label>
                  <input type="text" value={heroData.videoUrl} onChange={e => setHeroData({ ...heroData, videoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Teks Tombol</label>
                  <input type="text" value={heroData.buttonText} onChange={e => setHeroData({ ...heroData, buttonText: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Daftar Sekarang"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Tombol</label>
                  <input type="text" value={heroData.buttonUrl} onChange={e => setHeroData({ ...heroData, buttonUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/admissions"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
                    <input type="number" value={heroData.orderPosition} onChange={e => setHeroData({ ...heroData, orderPosition: parseInt(e.target.value) || 0 })}
                      className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-6">
                    <input type="checkbox" checked={heroData.isActive} onChange={e => setHeroData({ ...heroData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={saveHero} disabled={heroSaving || !heroData.title.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                  {heroSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {heroEditId ? 'Update' : 'Simpan'}
                </button>
                <button onClick={() => setHeroForm(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <X className="w-4 h-4" /> Batal
                </button>
              </div>
            </div>
          )}

          {/* Hero List */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {heroes.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Belum ada hero slide.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {heroes.sort((a, b) => a.orderPosition - b.orderPosition).map((hero, idx) => (
                  <div key={hero.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    {/* Preview */}
                    <div className="w-24 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                      {hero.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={hero.image} alt={hero.title || 'Hero'} className="w-full h-full object-cover" />
                      ) : hero.videoUrl ? (
                        <Video className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{hero.title || '(tanpa judul)'}</span>
                        {!hero.isActive && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">hidden</span>}
                      </div>
                      {hero.subtitle && <p className="text-xs text-gray-500 mt-0.5">{hero.subtitle}</p>}
                      {hero.buttonText && (
                        <p className="text-xs text-blue-500 mt-0.5">🔗 {hero.buttonText} → {hero.buttonUrl}</p>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => moveHeroOrder(hero, 'up', idx)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => moveHeroOrder(hero, 'down', idx)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowDown className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toggleHeroActive(hero)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        {hero.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => openHeroForm(hero)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteHero(hero.id)} disabled={deleting === hero.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                        {deleting === hero.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== GREETING TAB ===== */}
      {tab === 'greeting' && (
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
      )}
    </div>
  )

  /* ---- Helper for hero reorder ---- */
  async function moveHeroOrder(hero: Hero, direction: 'up' | 'down', idx: number) {
    const sorted = [...heroes].sort((a, b) => a.orderPosition - b.orderPosition)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    await Promise.all([
      fetch(`/api/homepage/${hero.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hero', ...hero, orderPosition: sorted[swapIdx].orderPosition }),
      }),
      fetch(`/api/homepage/${sorted[swapIdx].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hero', ...sorted[swapIdx], orderPosition: hero.orderPosition }),
      }),
    ])
    fetchData()
  }
}
