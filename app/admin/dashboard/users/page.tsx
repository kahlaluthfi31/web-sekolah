'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Trash2, Loader2, ChevronLeft, ChevronRight, UserCog,
  Plus, MoreVertical, Edit2, X, Eye, EyeOff, AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

interface UserItem {
  id: number
  name: string
  email: string
  role: string
  status: string
  avatar: string | null
  lastSeenAt: string | null
  createdAt: string
}

interface Pagination { page: number; limit: number; total: number; totalPages: number }

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// "Online" = lastSeenAt within the last 5 minutes (for admins only)
function isOnline(user: UserItem): boolean {
  if (user.role === 'user') return false
  if (!user.lastSeenAt) return false
  return Date.now() - new Date(user.lastSeenAt).getTime() < 5 * 60 * 1000
}

const roleBadge: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  user: 'bg-gray-100 text-gray-600',
}

const roleLabel: Record<string, string> = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  user: 'User',
}

/* ------------------------------------------------------------------ */
/* ActionDropdown                                                      */
/* ------------------------------------------------------------------ */

function ActionDropdown({
  userId, userName, onEdit, onDelete,
}: {
  userId: number; userName: string
  onEdit: (id: number) => void; onDelete: (id: number, name: string) => void
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(120)
  return (
    <div className="relative" ref={ref}>
      <button ref={btnRef} onClick={toggle} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }} className="w-40 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden text-sm">
          <button onClick={() => { close(); onEdit(userId) }} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-yellow-600 hover:bg-yellow-50">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { close(); onDelete(userId, userName) }} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* EditModal (Role + Status Akun)                                      */
/* ------------------------------------------------------------------ */

function EditModal({
  user,
  onClose,
  onSaved,
}: {
  user: UserItem
  onClose: () => void
  onSaved: () => void
}) {
  const [role, setRole] = useState(user.role)
  const [status, setStatus] = useState(user.status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Status options depend on role
  const statusOptions =
    role === 'user'
      ? [
          { value: 'active', label: 'Aktif' },
          { value: 'inactive', label: 'Nonaktif' },
        ]
      : [
          { value: 'active', label: 'Aktif' },
          { value: 'inactive', label: 'Nonaktif' },
        ]

  // If role changes and current status isn't valid, reset to 'active'
  useEffect(() => {
    const valid = statusOptions.map(o => o.value)
    if (!valid.includes(status)) setStatus('active')
  }, [role]) // eslint-disable-line react-hooks/exhaustive-deps

  const unchanged = role === user.role && status === user.status

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, status }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.message || 'Gagal menyimpan'); return }
      onSaved()
      onClose()
    } catch {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Edit Akun</h3>
            <p className="text-xs text-gray-400 mt-0.5">Ubah role dan status akun pengguna</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* User info */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Role select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Akun</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <p className="text-xs text-gray-400 mt-1.5">
              {role === 'superadmin' && 'Akses penuh ke seluruh fitur & manajemen user.'}
              {role === 'admin' && 'Akses ke dashboard admin, tanpa manajemen user.'}
              {role === 'user' && 'Akses terbatas ke halaman front-end saja.'}
            </p>
          </div>

          {/* Status Akun select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status Akun</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || unchanged}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* AddUserModal                                                        */
/* ------------------------------------------------------------------ */

function AddUserModal({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    status: 'active',
  })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setError('')
    if (!form.name.trim()) { setError('Nama wajib diisi'); return }
    if (!form.email.trim()) { setError('Email wajib diisi'); return }
    if (!form.password) { setError('Password wajib diisi'); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter'); return }
    if (form.password !== form.confirmPassword) { setError('Konfirmasi password tidak cocok'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          status: form.status,
        }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.message || 'Gagal menambahkan user'); return }
      onSaved()
      onClose()
    } catch {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Tambah User Baru</h3>
            <p className="text-xs text-gray-400 mt-0.5">Buat akun admin atau user biasa</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="contoh@email.com"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password <span className="text-red-500">*</span></label>
            <input
              type={showPass ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => set('confirmPassword', e.target.value)}
              placeholder="Ulangi password"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role & Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={e => set('role', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status Awal</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Role hint */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-600">
            {form.role === 'admin' && 'Admin dapat mengakses dashboard dan mengelola konten.'}
            {form.role === 'user' && 'User biasa hanya dapat mengakses halaman front-end.'}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Tambah User
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* DeleteModal                                                         */
/* ------------------------------------------------------------------ */

function DeleteModal({
  userName,
  onConfirm,
  onCancel,
  deleting,
}: {
  userName: string
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Hapus User</h3>
            <p className="text-sm text-gray-500 mt-1">
              Yakin ingin menghapus akun <span className="font-medium text-gray-800">{userName}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function UsersPage() {
  const [data, setData] = useState<UserItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // Modals
  const [editModal, setEditModal] = useState<UserItem | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ id: number; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch own session to know which account to hide
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(j => { if (j.success) setCurrentUserId(j.user.id) })
      .catch(() => {})
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      if (search) params.set('search', search)
      if (roleFilter) params.set('role', roleFilter)
      if (statusFilter) params.set('status', statusFilter)
      // Exclude own account from list
      if (currentUserId) params.set('excludeId', String(currentUserId))
      const res = await fetch(`/api/users?${params}`)
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setPagination(json.pagination)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [pagination.page, search, roleFilter, statusFilter, currentUserId])

  useEffect(() => { fetchData() }, [fetchData])

  // Poll every 15s for near-realtime online status
  // (logout clears lastSeenAt → shows Offline immediately on next poll)
  useEffect(() => {
    const timer = setInterval(() => {
      // silent refresh — don't show loading spinner
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      if (search) params.set('search', search)
      if (roleFilter) params.set('role', roleFilter)
      if (statusFilter) params.set('status', statusFilter)
      if (currentUserId) params.set('excludeId', String(currentUserId))
      fetch(`/api/users?${params}`)
        .then(r => r.json())
        .then(json => {
          if (json.success) {
            setData(json.data)
            setPagination(json.pagination)
          }
        })
        .catch(() => {})
    }, 15_000)
    return () => clearInterval(timer)
  }, [pagination.page, search, roleFilter, statusFilter, currentUserId])

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      await fetch(`/api/users/${deleteModal.id}`, { method: 'DELETE' })
      setDeleteModal(null)
      fetchData()
    } catch {
      alert('Gagal menghapus user')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen User</h2>
        <p className="text-sm text-gray-500">Kelola pengguna, role, dan status akun</p>
      </div>

      {/* Filters + Tambah User */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Role</option>
          <option value="superadmin">Superadmin</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Tambah User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <UserCog className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-400">Tidak ada user.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status Login</th>
                  <th className="px-6 py-4">Status Akun</th>
                  <th className="px-6 py-4">Terdaftar</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(user => {
                  const online = isOnline(user)
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* User info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            {/* Online dot — only for admin/superadmin */}
                            {user.role !== 'user' && (
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                  online ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${roleBadge[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {roleLabel[user.role] ?? user.role}
                        </span>
                      </td>

                      {/* Online status — admin only */}
                      <td className="px-6 py-4">
                        {user.role === 'user' ? (
                          <span className="text-xs text-gray-300">—</span>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                            online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {online ? 'Online' : 'Offline'}
                          </span>
                        )}
                      </td>

                      {/* Account status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>

                      {/* Registered date */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <ActionDropdown
                          userId={user.id}
                          userName={user.name}
                          onEdit={id => setEditModal(data.find(u => u.id === id) ?? null)}
                          onDelete={(id, name) => setDeleteModal({ id, name })}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <p className="text-xs text-gray-400">
        Status login ( Online / Offline ) akan diperbarui setiap 15 detik.
      </p>

      {/* Modals */}
      {editModal && (
        <EditModal
          user={editModal}
          onClose={() => setEditModal(null)}
          onSaved={fetchData}
        />
      )}
      {addModal && (
        <AddUserModal
          onClose={() => setAddModal(false)}
          onSaved={fetchData}
        />
      )}
      {deleteModal && (
        <DeleteModal
          userName={deleteModal.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}
