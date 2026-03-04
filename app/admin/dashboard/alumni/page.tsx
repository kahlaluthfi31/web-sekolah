'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Loader2, MoreVertical, Eye, Check, X, AlertTriangle, GraduationCap, Briefcase, Building2, FileText, Image } from 'lucide-react'
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

function ConfirmModal({ title, message, onConfirm, onCancel, loading, type }: { title: string; message: string; onConfirm: () => void; onCancel: () => void; loading: boolean; type: 'approve' | 'reject' }) {
  const isApprove = type === 'approve'
  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
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
        setPagination(json.pagination || pagination)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [pagination.page, search, statusFilter, yearFilter])

  useEffect(() => { fetchAlumni() }, [fetchAlumni])

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

  const openDetailModal = (item: Alumni) => {
    setSelectedAlumni(item)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen Alumni</h2>
        <p className="text-sm text-gray-500">Verifikasi dan kelola testimoni alumni sekolah</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
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
                    <img
                      src={diplomaPhotoUrl}
                      alt="Foto Ijazah"
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200 bg-white"
                    />
                    <a
                      href={diplomaPhotoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-2"
                    >
                      <Image className="w-4 h-4" />
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
