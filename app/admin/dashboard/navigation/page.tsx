'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Menu, Plus, Edit2, Trash2, Save, X,
  ChevronDown, ChevronRight, ExternalLink, Link as LinkIcon,
  GripVertical, Loader2, Eye, EyeOff, ArrowUp, ArrowDown,
} from 'lucide-react'

interface NavMenu {
  id: number
  menuName: string
  menuUrl: string | null
  parentId: number | null
  menuType: 'internal' | 'external' | 'dropdown'
  orderPosition: number
  isActive: boolean
  children?: NavMenu[]
}

interface FormData {
  menuName: string
  menuUrl: string
  parentId: number | null
  menuType: 'internal' | 'external' | 'dropdown'
  orderPosition: number
  isActive: boolean
}

const emptyForm: FormData = {
  menuName: '',
  menuUrl: '',
  parentId: null,
  menuType: 'internal',
  orderPosition: 0,
  isActive: true,
}

export default function NavigationPage() {
  const [menus, setMenus] = useState<NavMenu[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchMenus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/navigation')
      const json = await res.json()
      if (json.success) setMenus(json.data)
    } catch (err) {
      console.error('Failed to fetch menus', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMenus() }, [fetchMenus])

  // Build tree structure
  const parentMenus = menus.filter(m => !m.parentId)
  const getChildren = (parentId: number) => menus.filter(m => m.parentId === parentId)

  const handleSave = async () => {
    if (!form.menuName.trim()) return
    setSaving(true)
    try {
      const url = editId ? `/api/navigation/${editId}` : '/api/navigation'
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
        fetchMenus()
      } else {
        const json = await res.json()
        alert(json.message || 'Gagal menyimpan')
      }
    } catch {
      alert('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (menu: NavMenu) => {
    setForm({
      menuName: menu.menuName,
      menuUrl: menu.menuUrl || '',
      parentId: menu.parentId,
      menuType: menu.menuType,
      orderPosition: menu.orderPosition,
      isActive: menu.isActive,
    })
    setEditId(menu.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus menu ini? Sub-menu juga akan dihapus.')) return
    setDeleting(id)
    try {
      // Delete children first
      const children = getChildren(id)
      for (const child of children) {
        await fetch(`/api/navigation/${child.id}`, { method: 'DELETE' })
      }
      await fetch(`/api/navigation/${id}`, { method: 'DELETE' })
      fetchMenus()
    } catch {
      alert('Gagal menghapus')
    } finally {
      setDeleting(null)
    }
  }

  const toggleActive = async (menu: NavMenu) => {
    await fetch(`/api/navigation/${menu.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...menu, isActive: !menu.isActive }),
    })
    fetchMenus()
  }

  const moveOrder = async (menu: NavMenu, direction: 'up' | 'down') => {
    const siblings = menu.parentId
      ? getChildren(menu.parentId)
      : parentMenus
    const sorted = [...siblings].sort((a, b) => a.orderPosition - b.orderPosition)
    const idx = sorted.findIndex(m => m.id === menu.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    await Promise.all([
      fetch(`/api/navigation/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...menu, orderPosition: sorted[swapIdx].orderPosition }),
      }),
      fetch(`/api/navigation/${sorted[swapIdx].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sorted[swapIdx], orderPosition: menu.orderPosition }),
      }),
    ])
    fetchMenus()
  }

  const MenuTypeIcon = ({ type }: { type: string }) => {
    if (type === 'external') return <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
    if (type === 'dropdown') return <ChevronDown className="w-3.5 h-3.5 text-purple-500" />
    return <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Menu className="w-6 h-6 text-blue-600" />
            Navigasi Website
          </h2>
          <p className="text-sm text-gray-500 mt-1">Kelola menu navigasi yang tampil di website</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Menu
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editId ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Menu *</label>
              <input
                type="text"
                value={form.menuName}
                onChange={e => setForm({ ...form, menuName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Beranda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL</label>
              <input
                type="text"
                value={form.menuUrl}
                onChange={e => setForm({ ...form, menuUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/about atau https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Menu</label>
              <select
                value={form.menuType}
                onChange={e => setForm({ ...form, menuType: e.target.value as FormData['menuType'] })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="internal">Internal Link</option>
                <option value="external">External Link</option>
                <option value="dropdown">Dropdown (parent)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Menu</label>
              <select
                value={form.parentId ?? ''}
                onChange={e => setForm({ ...form, parentId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Tanpa parent (root) —</option>
                {parentMenus.filter(m => m.id !== editId).map(m => (
                  <option key={m.id} value={m.id}>{m.menuName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
              <input
                type="number"
                value={form.orderPosition}
                onChange={e => setForm({ ...form, orderPosition: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving || !form.menuName.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editId ? 'Update' : 'Simpan'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Menu Tree */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-20">
            <Menu className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Belum ada menu navigasi.</p>
            <p className="text-sm text-gray-300 mt-1">Klik &quot;Tambah Menu&quot; untuk memulai</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {parentMenus
              .sort((a, b) => a.orderPosition - b.orderPosition)
              .map(menu => {
                const children = getChildren(menu.id).sort((a, b) => a.orderPosition - b.orderPosition)
                return (
                  <div key={menu.id}>
                    {/* Parent menu item */}
                    <div className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                      <MenuTypeIcon type={menu.menuType} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{menu.menuName}</span>
                          {!menu.isActive && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">hidden</span>
                          )}
                          {children.length > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">
                              {children.length} sub-menu
                            </span>
                          )}
                        </div>
                        {menu.menuUrl && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{menu.menuUrl}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => moveOrder(menu, 'up')} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Naik">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => moveOrder(menu, 'down')} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Turun">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => toggleActive(menu)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title={menu.isActive ? 'Sembunyikan' : 'Tampilkan'}>
                          {menu.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleEdit(menu)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id)}
                          disabled={deleting === menu.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Hapus"
                        >
                          {deleting === menu.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    {children.map(child => (
                      <div key={child.id} className="flex items-center gap-3 px-6 py-3 pl-14 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                        <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                        <MenuTypeIcon type={child.menuType} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700">{child.menuName}</span>
                          {child.menuUrl && (
                            <span className="text-xs text-gray-400 ml-2">{child.menuUrl}</span>
                          )}
                          {!child.isActive && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 ml-2">hidden</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => moveOrder(child, 'up')} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button onClick={() => moveOrder(child, 'down')} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button onClick={() => toggleActive(child)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            {child.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </button>
                          <button onClick={() => handleEdit(child)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            disabled={deleting === child.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          >
                            {deleting === child.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">💡 Tips:</p>
        <ul className="list-disc list-inside space-y-0.5 text-blue-600">
          <li>Menu bertipe <strong>dropdown</strong> digunakan sebagai parent yang punya sub-menu</li>
          <li>Menu <strong>internal</strong> untuk link di dalam website (mis: /about)</li>
          <li>Menu <strong>external</strong> untuk link ke luar (mis: https://...)</li>
          <li>Gunakan tombol panah ↑↓ untuk mengatur urutan</li>
        </ul>
      </div>
    </div>
  )
}
