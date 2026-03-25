'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import NextImage from 'next/image'
import { Search, ChevronLeft, ChevronRight, Loader2, MoreVertical, Eye, Check, X, AlertTriangle, GraduationCap, Briefcase, Building2, FileText, ImageIcon, Plus, Edit2, Trash2, Heart, Users, Trophy, Sparkles, HandshakeIcon, Megaphone, BookOpen, Globe2, Lightbulb, Gift, CalendarCheck2 } from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

interface Alumni {
  id: string
  alumniName: string
  graduationYear: number
  major: string | null
  currentOccupation: string | null
  company: string | null
  story: string | null
  photo: string | null
  nisn: string | null
  diplomaPhoto: string | null
  status: string
  verifiedById: string | null
  verifiedAt: string | null
  createdAt: string
}

interface Pagination { page: number; limit: number; total: number; totalPages: number }

interface Engagement {
  id: number
  title: string
  description: string | null
  icon: string | null
  orderPosition: number
  isActive: boolean
}

const ALUMNI_CTA_DEFAULTS = {
  title: 'Bergabung dengan Portal Alumni',
  subtitle: 'Dapatkan akses ke event, networking, dan berbagai program alumni',
  buttonText: 'Masuk Portal',
  buttonUrl: '#',
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu Verifikasi', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'approved', label: 'Disetujui', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Ditolak', color: 'bg-red-100 text-red-700' }
]

function getStatusLabel(status: string): string {
  const found = STATUS_OPTIONS.find(s => s.value === status)
  return found ? found.label : status
}

function getStatusColor(status: string): string {
  const found = STATUS_OPTIONS.find(s => s.value === status)
  return found ? found.color : 'bg-gray-100 text-gray-600'
}

function ActionDropdown({ onView, onApprove, onReject, status }: { onView: () => void; onApprove?: () => void; onReject?: () => void; status: string }) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(150)
  return (
    <div ref={ref} className="relative inline-block">
      <button ref={btnRef} onClick={toggle} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }} className="w-44 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          <button onClick={() => { close(); onView() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
            <Eye className="w-3.5 h-3.5" /> Lihat Detail
          </button>
          {status === 'pending' && onApprove && (
            <><div className="border-t border-gray-100" />
              <button onClick={() => { close(); onApprove() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-green-600 hover:bg-green-50">
                <Check className="w-3.5 h-3.5" /> Setujui
              </button></>
          )}
          {status === 'pending' && onReject && (
            <><div className="border-t border-gray-100" />
              <button onClick={() => { close(); onReject() }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                <X className="w-3.5 h-3.5" /> Tolak
              </button></>
          )}
        </div>
      )}
    </div>
  )
}

function EngagementDropdown({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(150)
  return (
    <div ref={ref} className="relative inline-block">
      <button
        ref={btnRef}
        onClick={toggle}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div
          style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }}
          className="w-40 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
        >
          <button
            onClick={() => { close(); onEdit() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => { close(); onDelete() }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

function EngagementDeleteModal({ engagement, onConfirm, onCancel, deleting }: { engagement: Engagement; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  const title = engagement.title.length > 60 ? engagement.title.slice(0, 60) + '...' : engagement.title
  return (
    <div className="fixed inset-0 z-60 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-900">Hapus Cara Terlibat</h3>
            <p className="text-sm text-gray-500">Yakin ingin menghapus item <span className="font-semibold text-gray-700">“{title}”</span>?</p>
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

function ConfirmModal({ title, message, onConfirm, onCancel, loading, type }: { title: string; message: string; onConfirm: () => void; onCancel: () => void; loading: boolean; type: 'approve' | 'reject' }) {
  const isApprove = type === 'approve'
  return (
    <div className="fixed inset-0 z-60 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex justify-center">
            <div className={'w-14 h-14 rounded-2xl flex items-center justify-center ' + (isApprove ? 'bg-green-100' : 'bg-red-100')}>
              {isApprove ? <Check className="w-7 h-7 text-green-600" /> : <AlertTriangle className="w-7 h-7 text-red-600" />}
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50">Batal</button>
            <button onClick={onConfirm} disabled={loading} className={'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl disabled:opacity-50 ' + (isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isApprove ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {loading ? 'Memproses...' : isApprove ? 'Ya, Setujui' : 'Ya, Tolak'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlumniPage() {
  const [activeTab, setActiveTab] = useState<'alumni' | 'engagements' | 'cta'>('alumni')
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ alumni: Alumni; type: 'approve' | 'reject' } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [engagementLoading, setEngagementLoading] = useState(true)
  const [engagementModalOpen, setEngagementModalOpen] = useState(false)
  const [engagementEditing, setEngagementEditing] = useState<Engagement | null>(null)
  const [engagementSaving, setEngagementSaving] = useState(false)
  const [engagementError, setEngagementError] = useState<string | null>(null)
  const [engagementSearch, setEngagementSearch] = useState('')
  const [engagementDeleteTarget, setEngagementDeleteTarget] = useState<Engagement | null>(null)
  const [engagementDeleting, setEngagementDeleting] = useState(false)
  const [engagementForm, setEngagementForm] = useState({
    title: '',
    description: '',
    icon: '',
    orderPosition: 0,
    isActive: true,
  })

  const [ctaForm, setCtaForm] = useState(ALUMNI_CTA_DEFAULTS)
  const [ctaLoading, setCtaLoading] = useState(false)
  const [ctaSaving, setCtaSaving] = useState(false)
  const [ctaMessage, setCtaMessage] = useState<string | null>(null)
  const [ctaError, setCtaError] = useState<string | null>(null)

  const engagementIconMap = useMemo(() => ({
    heart: Heart,
    handshake: HandshakeIcon,
    award: Trophy,
    graduation: GraduationCap,
    briefcase: Briefcase,
    users: Users,
    sparkles: Sparkles,
    megaphone: Megaphone,
    'book-open': BookOpen,
    'globe-2': Globe2,
    lightbulb: Lightbulb,
    gift: Gift,
    'calendar-check': CalendarCheck2,
  }), [])

  const engagementIconOptions = useMemo(() => ([
    { value: 'heart', label: 'Dukungan', icon: Heart },
    { value: 'handshake', label: 'Kolaborasi', icon: HandshakeIcon },
    { value: 'award', label: 'Apresiasi', icon: Trophy },
    { value: 'graduation', label: 'Mentor', icon: GraduationCap },
    { value: 'briefcase', label: 'Karier', icon: Briefcase },
    { value: 'users', label: 'Komunitas', icon: Users },
    { value: 'sparkles', label: 'Inovasi', icon: Sparkles },
    { value: 'megaphone', label: 'Promosi', icon: Megaphone },
    { value: 'book-open', label: 'Pelatihan', icon: BookOpen },
    { value: 'globe-2', label: 'Global', icon: Globe2 },
    { value: 'lightbulb', label: 'Ide', icon: Lightbulb },
    { value: 'gift', label: 'Donasi', icon: Gift },
    { value: 'calendar-check', label: 'Acara', icon: CalendarCheck2 },
  ]), [])

  // Fetch available years from alumni data
  const fetchAvailableYears = useCallback(async () => {
    try {
      const res = await fetch('/api/alumni?limit=1000')
      const json = await res.json()
      if (json.success && json.data) {
        const years = [...new Set(json.data.map((a: Alumni) => a.graduationYear))] as number[]
        setAvailableYears(years.sort((a, b) => b - a))
      }
    } catch (err) { console.error(err) }
  }, [])

  useEffect(() => { fetchAvailableYears() }, [fetchAvailableYears])

  const fetchEngagements = useCallback(async () => {
    setEngagementLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', '100')
      if (engagementSearch) params.set('search', engagementSearch)
      const res = await fetch('/api/alumni-engagements?' + params.toString())
      const json = await res.json()
      if (json.success) {
        setEngagements(json.data || [])
      }
    } catch (err) { console.error(err) }
    finally { setEngagementLoading(false) }
  }, [engagementSearch])

  const fetchAlumni = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      if (yearFilter) params.set('year', yearFilter)
      const res = await fetch('/api/alumni?' + params.toString())
      const json = await res.json()
      if (json.success) {
        setAlumni(json.data || [])
        setPagination(prev => json.pagination || prev)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [pagination.page, search, statusFilter, yearFilter])

  useEffect(() => { fetchAlumni() }, [fetchAlumni])
  useEffect(() => { fetchEngagements() }, [fetchEngagements])

  const fetchCtaSettings = useCallback(async () => {
    setCtaLoading(true)
    setCtaError(null)
    try {
      const res = await fetch('/api/settings')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        const map: Record<string, string> = {}
        for (const item of json.data) {
          if (item.settingKey && typeof item.settingValue === 'string') {
            map[item.settingKey] = item.settingValue
          }
        }
        setCtaForm({
          title: map['alumni_portal_cta_title'] || ALUMNI_CTA_DEFAULTS.title,
          subtitle: map['alumni_portal_cta_subtitle'] || ALUMNI_CTA_DEFAULTS.subtitle,
          buttonText: map['alumni_portal_cta_button_text'] || ALUMNI_CTA_DEFAULTS.buttonText,
          buttonUrl: map['alumni_portal_cta_button_url'] || ALUMNI_CTA_DEFAULTS.buttonUrl,
        })
      }
    } catch (err) {
      console.error(err)
      setCtaError('Gagal memuat pengaturan CTA')
    } finally {
      setCtaLoading(false)
    }
  }, [])

  useEffect(() => { fetchCtaSettings() }, [fetchCtaSettings])

  const handleSaveCta = async () => {
    setCtaSaving(true)
    setCtaMessage(null)
    setCtaError(null)
    const payloads = [
      { settingKey: 'alumni_portal_cta_title', settingValue: ctaForm.title, settingType: 'text' },
      { settingKey: 'alumni_portal_cta_subtitle', settingValue: ctaForm.subtitle, settingType: 'text' },
      { settingKey: 'alumni_portal_cta_button_text', settingValue: ctaForm.buttonText, settingType: 'text' },
      { settingKey: 'alumni_portal_cta_button_url', settingValue: ctaForm.buttonUrl, settingType: 'text' },
    ]
    try {
      const responses = await Promise.all(payloads.map(p =>
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
        })
      ))
      const jsons = await Promise.all(responses.map(r => r.json()))
      const failed = jsons.find(j => !j.success)
      if (failed) {
        throw new Error(failed.message || 'Gagal menyimpan pengaturan')
      }
      setCtaMessage('Pengaturan CTA tersimpan')
    } catch (err: any) {
      console.error(err)
      setCtaError(err?.message || 'Gagal menyimpan pengaturan CTA')
    } finally {
      setCtaSaving(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/alumni/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        fetchAlumni()
        setConfirmAction(null)
        setShowModal(false)
        setSelectedAlumni(null)
      } else {
        alert('Gagal mengubah status')
      }
    } catch { alert('Terjadi kesalahan') }
    finally { setActionLoading(false) }
  }

  const openCreateEngagement = () => {
    const nextOrder = engagements.length > 0 ? Math.max(...engagements.map(e => e.orderPosition ?? 0)) + 1 : 1
    setEngagementEditing(null)
    setEngagementForm({
      title: '',
      description: '',
      icon: '',
      orderPosition: nextOrder,
      isActive: true,
    })
    setEngagementError(null)
    setEngagementModalOpen(true)
  }

  const openEditEngagement = (item: Engagement) => {
    setEngagementEditing(item)
    setEngagementForm({
      title: item.title,
      description: item.description ?? '',
      icon: item.icon ?? '',
      orderPosition: item.orderPosition,
      isActive: item.isActive,
    })
    setEngagementError(null)
    setEngagementModalOpen(true)
  }

  const handleEngagementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEngagementSaving(true)
    setEngagementError(null)
    try {
      const payload = {
        title: engagementForm.title.trim(),
        description: engagementForm.description.trim() || null,
        icon: engagementForm.icon.trim() || null,
        orderPosition: engagementForm.orderPosition,
        isActive: engagementForm.isActive,
      }
      if (!payload.title) {
        setEngagementError('Judul tidak boleh kosong')
        setEngagementSaving(false)
        return
      }

      const url = engagementEditing ? '/api/alumni-engagements/' + engagementEditing.id : '/api/alumni-engagements'
      const method = engagementEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) {
        setEngagementError(json.message || 'Gagal menyimpan data')
      } else {
        setEngagementModalOpen(false)
        fetchEngagements()
      }
    } catch (err) {
      console.error(err)
      setEngagementError('Terjadi kesalahan saat menyimpan')
    } finally {
      setEngagementSaving(false)
    }
  }

  const handleEngagementDelete = async () => {
    if (!engagementDeleteTarget) return
    setEngagementDeleting(true)
    try {
      const res = await fetch('/api/alumni-engagements/' + engagementDeleteTarget.id, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) {
        alert(json.message || 'Gagal menghapus data')
      } else {
        setEngagementDeleteTarget(null)
        fetchEngagements()
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus')
    } finally {
      setEngagementDeleting(false)
    }
  }

  const openDetailModal = (item: Alumni) => {
    setSelectedAlumni(item)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Alumni</h2>
          <p className="text-sm text-gray-500">Verifikasi dan kelola testimoni alumni sekolah</p>
        </div>
        
      </div>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('alumni')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'alumni' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Data Alumni
          </button>
          <button
            onClick={() => setActiveTab('engagements')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'engagements' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HandshakeIcon className="w-4 h-4" /> Cara Terlibat
          </button>
          <button
            onClick={() => setActiveTab('cta')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'cta' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Megaphone className="w-4 h-4" /> Portal Alumni CTA
          </button>
        </div>
      {activeTab === 'alumni' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama alumni..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select
              value={yearFilter}
              onChange={e => { setYearFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tahun</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : alumni.length === 0 ? (
              <div className="text-center py-20">
                <GraduationCap className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400">Belum ada data alumni.</p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 w-[30%]">Alumni</th>
                      <th className="px-6 py-4 w-[20%]">Lulusan</th>
                      <th className="px-6 py-4 w-[25%]">Pekerjaan</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {alumni.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{item.alumniName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Dikirim {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                              <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                              <span>Tahun {item.graduationYear}</span>
                            </div>
                            {item.major && (
                              <p className="text-xs text-gray-500 pl-5">Program Keahlian {item.major}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.currentOccupation ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <span>{item.currentOccupation}</span>
                              </div>
                              {item.company && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Building2 className="w-3 h-3 text-gray-300" />
                                  <span>{item.company}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={'text-xs px-2.5 py-1 rounded-full whitespace-nowrap ' + getStatusColor(item.status)}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <ActionDropdown
                              status={item.status}
                              onView={() => openDetailModal(item)}
                              onApprove={() => setConfirmAction({ alumni: item, type: 'approve' })}
                              onReject={() => setConfirmAction({ alumni: item, type: 'reject' })}
                            />
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
                <p className="text-sm text-gray-500">Halaman {pagination.page} dari {pagination.totalPages}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {activeTab === 'engagements' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari cara terlibat..."
                value={engagementSearch}
                onChange={e => setEngagementSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={openCreateEngagement}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {engagementLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : engagements.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Belum ada data. Tambahkan cara terlibat alumni.</p>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ikon</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Urutan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {engagements
                    .slice()
                    .sort((a, b) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0))
                    .map(item => {
                      const IconComp = item.icon ? engagementIconMap[item.icon as keyof typeof engagementIconMap] || Sparkles : Sparkles
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                              <IconComp className="w-5 h-5" />
                            </div>
                            {item.icon && (
                              <p className="text-[10px] text-gray-400 mt-1">{item.icon}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{item.title}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-md">{item.description || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{item.orderPosition}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                              {item.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <EngagementDropdown
                              onEdit={() => openEditEngagement(item)}
                              onDelete={() => setEngagementDeleteTarget(item)}
                            />
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'cta' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Portal Alumni CTA</p>
              <h3 className="text-lg font-bold text-gray-900">Atur teks, tombol, dan tautan</h3>
              <p className="text-sm text-gray-500">Konten ini tampil di halaman publik Alumni.</p>
            </div>
            {ctaMessage && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">{ctaMessage}</span>
            )}
          </div>
          {ctaError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {ctaError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  value={ctaForm.title}
                  onChange={e => setCtaForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bergabung dengan Portal Alumni"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi singkat</label>
                <textarea
                  value={ctaForm.subtitle}
                  onChange={e => setCtaForm(f => ({ ...f, subtitle: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dapatkan akses ke event, networking, dan berbagai program alumni"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Teks tombol</label>
                <input
                  type="text"
                  value={ctaForm.buttonText}
                  onChange={e => setCtaForm(f => ({ ...f, buttonText: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masuk Portal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL tujuan</label>
                <input
                  type="text"
                  value={ctaForm.buttonUrl}
                  onChange={e => setCtaForm(f => ({ ...f, buttonUrl: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://portal-alumni.com"
                />
                <p className="text-[11px] text-gray-400 mt-1">Bisa berupa URL eksternal atau internal.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={fetchCtaSettings}
              disabled={ctaLoading || ctaSaving}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-60"
            >
              {ctaLoading ? 'Memuat...' : 'Reset' }
            </button>
            <button
              onClick={handleSaveCta}
              disabled={ctaSaving || ctaLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
            >
              {ctaSaving && <Loader2 className="w-4 h-4 animate-spin" />}Simpan CTA
            </button>
          </div>
        </div>
      )}

      {engagementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 my-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{engagementEditing ? 'Edit Cara Terlibat' : 'Tambah Cara Terlibat'}</h3>
                <p className="text-xs text-gray-500">Atur judul, deskripsi, ikon, urutan, dan status tampil</p>
              </div>
              <button onClick={() => setEngagementModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {engagementError && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {engagementError}
              </div>
            )}

            <form onSubmit={handleEngagementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Judul <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={engagementForm.title}
                  onChange={e => setEngagementForm(f => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mentoring, Networking, dsb"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={engagementForm.description}
                  onChange={e => setEngagementForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ringkasan singkat ajakan atau kontribusi"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ikon (optional)</label>
                  <input
                    type="text"
                    value={engagementForm.icon}
                    onChange={e => setEngagementForm(f => ({ ...f, icon: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="heart, handshake, award, graduation, briefcase, users, ..."
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Ketik manual atau pilih cepat di bawah.</p>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-600">
                      <span className="font-semibold">Ikon terpilih</span>
                      <button
                        type="button"
                        onClick={() => setEngagementForm(f => ({ ...f, icon: '' }))}
                        className="text-[11px] font-semibold text-gray-500 hover:text-red-600"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-700 text-sm">
                      {(() => {
                        const selected = engagementIconOptions.find(opt => opt.value === engagementForm.icon)
                        const IconComp = selected?.icon || (engagementForm.icon ? engagementIconMap[engagementForm.icon as keyof typeof engagementIconMap] || Sparkles : null)
                        return IconComp ? (
                          <>
                            <IconComp className="w-4 h-4" />
                            <span className="text-xs font-semibold">{engagementForm.icon}</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Belum ada ikon dipilih</span>
                        )
                      })()}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {engagementIconOptions.map(opt => {
                        const IconComp = opt.icon
                        const active = engagementForm.icon === opt.value
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => setEngagementForm(f => ({ ...f, icon: active ? '' : opt.value }))}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition ${active ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50'}`}
                            title={opt.label}
                          >
                            <IconComp className="w-4 h-4" />
                            <span className="capitalize">{opt.value.replace(/-/g, ' ')}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    value={engagementForm.orderPosition}
                    onChange={e => setEngagementForm(f => ({ ...f, orderPosition: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="eng-active"
                  checked={engagementForm.isActive}
                  onChange={e => setEngagementForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="eng-active" className="text-sm text-gray-700">Tampilkan ke publik</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEngagementModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                  disabled={engagementSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={engagementSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {engagementSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {engagementDeleteTarget && (
        <EngagementDeleteModal
          engagement={engagementDeleteTarget}
          deleting={engagementDeleting}
          onCancel={() => setEngagementDeleteTarget(null)}
          onConfirm={handleEngagementDelete}
        />
      )}

      {/* Detail Modal */}
      {showModal && selectedAlumni && (
        <DetailModal
          alumni={selectedAlumni}
          onClose={() => { setShowModal(false); setSelectedAlumni(null) }}
          onApprove={() => setConfirmAction({ alumni: selectedAlumni, type: 'approve' })}
          onReject={() => setConfirmAction({ alumni: selectedAlumni, type: 'reject' })}
        />
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <ConfirmModal
          title={confirmAction.type === 'approve' ? 'Setujui Alumni' : 'Tolak Alumni'}
          message={'Yakin ingin ' + (confirmAction.type === 'approve' ? 'menyetujui' : 'menolak') + ' alumni ' + confirmAction.alumni.alumniName + '?'}
          type={confirmAction.type}
          loading={actionLoading}
          onConfirm={() => handleUpdateStatus(confirmAction.alumni.id, confirmAction.type === 'approve' ? 'approved' : 'rejected')}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  )
}

function DetailModal({ alumni, onClose, onApprove, onReject }: { alumni: Alumni; onClose: () => void; onApprove: () => void; onReject: () => void }) {
  // Default sample diploma photo jika tidak ada
  const diplomaPhotoUrl = alumni.diplomaPhoto || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6dVyMGQK10_5LN0pSYyg-8TgKxT9QTGNKsw&s'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Detail Alumni</h2>
                <p className="text-xs text-gray-500">Verifikasi data alumni</p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alumni</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{alumni.alumniName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Lulus</label>
                    <p className="text-sm text-gray-700 mt-1 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      {alumni.graduationYear}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Program Keahlian</label>
                    <p className="text-sm text-gray-700 mt-1">{alumni.major || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</label>
                    <p className="text-sm text-gray-700 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {alumni.currentOccupation || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</label>
                    <p className="text-sm text-gray-700 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {alumni.company || '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                  <p className="mt-1">
                    <span className={'text-xs px-2.5 py-1 rounded-full ' + getStatusColor(alumni.status)}>
                      {getStatusLabel(alumni.status)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Verification Data */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Data Verifikasi
                </h3>
                <div>
                  <label className="text-xs font-medium text-gray-500">NISN</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{alumni.nisn || 'Tidak disertakan'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Foto Ijazah</label>
                  <div className="mt-2">
                    <NextImage
                      src={diplomaPhotoUrl}
                      alt="Foto Ijazah"
                      width={800}
                      height={600}
                      unoptimized
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200 bg-white"
                    />
                    <a
                      href={diplomaPhotoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Lihat Ukuran Penuh
                    </a>
                  </div>
                </div>
              </div>

              {/* Story */}
              {alumni.story && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cerita / Testimoni</label>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{alumni.story}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                Dikirim pada {new Date(alumni.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Actions */}
            {alumni.status === 'pending' && (
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                <button onClick={onReject} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-all">
                  <X className="w-4 h-4" /> Tolak
                </button>
                <button onClick={onApprove} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all">
                  <Check className="w-4 h-4" /> Setujui
                </button>
              </div>
            )}

            {alumni.status !== 'pending' && (
              <div className="px-6 py-4 border-t border-gray-100">
                <button onClick={onClose} className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
