'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ShieldCheck, Loader2, RotateCcw, CheckCircle2, AlertTriangle,
  Newspaper, Trophy, Volleyball, CalendarDays, GraduationCap,
  MessageCircle, Mail, Users, BookOpen, Building2,
} from 'lucide-react'
import { ADMIN_MENU_ITEMS, DEFAULT_ADMIN_MENU_KEYS } from '@/lib/rbac'

/* ------------------------------------------------------------------ */
/*  Icon map for menu items                                            */
/* ------------------------------------------------------------------ */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper, Trophy, Volleyball, CalendarDays, GraduationCap,
  MessageCircle, Mail, Users, BookOpen, Building2,
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface AdminUser {
  id: number
  name: string
  email: string
  status: string
  menuKeys: string[] | null   // null = default, array = custom
}

/* ------------------------------------------------------------------ */
/*  Toggle component                                                   */
/* ------------------------------------------------------------------ */
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function AccessControlPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)
  const [error, setError] = useState('')

  // Local state: track checked keys per admin id
  const [permissions, setPermissions] = useState<Record<number, string[]>>({})

  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin-permissions')
      const json = await res.json()
      if (json.success) {
        const data: AdminUser[] = json.data
        setAdmins(data)
        // Initialize local permission state
        const init: Record<number, string[]> = {}
        data.forEach(a => {
          init[a.id] = a.menuKeys ?? DEFAULT_ADMIN_MENU_KEYS
        })
        setPermissions(init)
      }
    } catch {
      setError('Gagal memuat data admin')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAdmins() }, [fetchAdmins])

  const toggleMenu = (adminId: number, key: string) => {
    setPermissions(prev => {
      const current = prev[adminId] ?? DEFAULT_ADMIN_MENU_KEYS
      return {
        ...prev,
        [adminId]: current.includes(key)
          ? current.filter(k => k !== key)
          : [...current, key],
      }
    })
  }

  const handleSave = async (adminId: number) => {
    setSaving(adminId)
    setError('')
    try {
      const res = await fetch('/api/admin-permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: adminId, menuKeys: permissions[adminId] }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.message || 'Gagal menyimpan'); return }
      setSaved(adminId)
      setTimeout(() => setSaved(null), 2000)
    } catch {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setSaving(null)
    }
  }

  const handleReset = async (adminId: number) => {
    setSaving(adminId)
    setError('')
    try {
      const res = await fetch('/api/admin-permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: adminId, menuKeys: null }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.message || 'Gagal mereset'); return }
      // Reset local state to default
      setPermissions(prev => ({ ...prev, [adminId]: DEFAULT_ADMIN_MENU_KEYS }))
      setSaved(adminId)
      setTimeout(() => setSaved(null), 2000)
    } catch {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setSaving(null)
    }
  }

  // Check if local state differs from saved state
  const isDirty = (admin: AdminUser) => {
    const saved = admin.menuKeys ?? DEFAULT_ADMIN_MENU_KEYS
    const local = permissions[admin.id] ?? DEFAULT_ADMIN_MENU_KEYS
    return JSON.stringify([...saved].sort()) !== JSON.stringify([...local].sort())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Hak Akses Admin</h2>
        <p className="text-sm text-gray-500">Atur menu yang dapat diakses oleh setiap akun admin</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : admins.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ShieldCheck className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Belum ada akun dengan role <span className="font-medium">admin</span>.</p>
          <p className="text-gray-400 text-xs mt-1">Tambahkan admin terlebih dahulu di halaman Manajemen User.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map(admin => {
            const localKeys = permissions[admin.id] ?? DEFAULT_ADMIN_MENU_KEYS
            const dirty = isDirty(admin)
            const isSaving = saving === admin.id
            const isSaved = saved === admin.id

            return (
              <div key={admin.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Admin header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Reset to default */}
                    <button
                      onClick={() => handleReset(admin.id)}
                      disabled={isSaving}
                      title="Reset ke default"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                    {/* Save */}
                    <button
                      onClick={() => handleSave(admin.id)}
                      disabled={isSaving || !dirty}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                        isSaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isSaved ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {isSaved ? 'Tersimpan' : 'Simpan'}
                    </button>
                  </div>
                </div>

                {/* Menu toggles grid */}
                <div className="px-6 py-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Menu yang dapat diakses
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ADMIN_MENU_ITEMS.map(menu => {
                      const Icon = iconMap[menu.icon] || ShieldCheck
                      const enabled = localKeys.includes(menu.key)
                      return (
                        <div
                          key={menu.key}
                          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors ${
                            enabled
                              ? 'border-blue-200 bg-blue-50/50'
                              : 'border-gray-100 bg-gray-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium truncate ${enabled ? 'text-gray-800' : 'text-gray-400'}`}>
                              {menu.label}
                            </span>
                          </div>
                          <Toggle
                            checked={enabled}
                            onChange={() => toggleMenu(admin.id, menu.key)}
                            disabled={isSaving}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {dirty && (
                  <div className="px-6 pb-4">
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      Ada perubahan yang belum disimpan. Klik <strong>Simpan</strong> untuk menerapkan.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
        <p className="font-medium mb-1">Catatan:</p>
        <ul className="space-y-0.5 text-blue-500">
          <li>• Menu <strong>Dashboard</strong> selalu aktif untuk semua admin.</li>
          <li>• Klik <strong>Reset</strong> untuk mengembalikan ke hak akses default.</li>
        </ul>
      </div>
    </div>
  )
}
