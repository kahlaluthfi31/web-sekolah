'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Plus, Search, ChevronLeft, ChevronRight, Loader2, MoreVertical, Edit2, Trash2, X, Calendar, AlertTriangle, Save, ArrowLeft, Volleyball, Image as ImageIcon, Upload, Users, Activity, Eye } from 'lucide-react'
import { useDropdownPosition } from '@/lib/useDropdownPosition'

interface EskulData { id: number; name: string; description: string | null; coachName: string | null; image: string | null; isActive: boolean; createdAt: string }
interface EskulActivity { id: number; eskulId: number; activityTitle: string; description: string | null; activityDate: string; image: string | null; createdAt: string; eskul: { id: number; name: string; coachName: string | null } }
interface EskulListItem { id: number; name: string; coachName: string | null }
interface TeacherItem { id: number; name: string; position: string | null }
interface Pagination { page: number; limit: number; total: number; totalPages: number }

const MONTHS = [{ value: '1', label: 'Januari' }, { value: '2', label: 'Februari' }, { value: '3', label: 'Maret' }, { value: '4', label: 'April' }, { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' }, { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' }, { value: '9', label: 'September' }, { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' }]

function ActionDropdown({ onDetail, onEdit, onDelete }: { onDetail?: () => void; onEdit: () => void; onDelete: () => void }) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } = useDropdownPosition(120)
  return (
    <div ref={ref} className='relative inline-block'>
      <button ref={btnRef} onClick={toggle} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all'><MoreVertical className='w-4 h-4' /></button>
      {open && <div style={{ position: 'fixed', top: dropUp ? 'auto' : pos.top, bottom: dropUp ? window.innerHeight - pos.top : 'auto', right: pos.right, zIndex: 9999 }} className='w-36 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden'>
        {onDetail && <><button onClick={() => { close(); onDetail() }} className='flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50'><Eye className='w-3.5 h-3.5' /> Detail</button><div className='border-t border-gray-100' /></>}
        <button onClick={() => { close(); onEdit() }} className='flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50'><Edit2 className='w-3.5 h-3.5' /> Edit</button>
        <div className='border-t border-gray-100' />
        <button onClick={() => { close(); onDelete() }} className='flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50'><Trash2 className='w-3.5 h-3.5' /> Hapus</button>
      </div>}
    </div>
  )
}

function DeleteModal({ title, name, onConfirm, onCancel, deleting }: { title: string; name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  return (
    <div className='fixed inset-0 z-60 overflow-hidden'>
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm' onClick={onCancel} />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5'>
          <div className='flex justify-center'><div className='w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center'><AlertTriangle className='w-7 h-7 text-red-600' /></div></div>
          <div className='text-center space-y-2'>
            <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
            <p className='text-sm text-gray-500'>Yakin ingin menghapus <span className='font-semibold text-gray-700'>{name}</span>?</p>
            <p className='text-xs text-gray-400'>Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className='flex gap-3'>
            <button onClick={onCancel} disabled={deleting} className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50'>Batal</button>
            <button onClick={onConfirm} disabled={deleting} className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50'>
              {deleting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Trash2 className='w-4 h-4' />}
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExtracurricularsPage() {
  const [activeTab, setActiveTab] = useState<'activities' | 'eskul'>('activities')
  const [eskulData, setEskulData] = useState<EskulData[]>([])
  const [eskulPagination, setEskulPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [eskulLoading, setEskulLoading] = useState(true)
  const [eskulSearch, setEskulSearch] = useState('')
  const [activities, setActivities] = useState<EskulActivity[]>([])
  const [activityPagination, setActivityPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [activityLoading, setActivityLoading] = useState(true)
  const [activitySearch, setActivitySearch] = useState('')
  const [activityEskulFilter, setActivityEskulFilter] = useState('')
  const [activityMonthFilter, setActivityMonthFilter] = useState('')
  const [activityYearFilter, setActivityYearFilter] = useState('')
  const [eskulList, setEskulList] = useState<EskulListItem[]>([])
  const [teachers, setTeachers] = useState<TeacherItem[]>([])
  const [showEskulForm, setShowEskulForm] = useState(false)
  const [editEskul, setEditEskul] = useState<EskulData | null>(null)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [editActivity, setEditActivity] = useState<EskulActivity | null>(null)
  const [deleteEskul, setDeleteEskul] = useState<EskulData | null>(null)
  const [deleteActivity, setDeleteActivity] = useState<EskulActivity | null>(null)
  const [detailEskul, setDetailEskul] = useState<EskulData | null>(null)
  const [detailActivity, setDetailActivity] = useState<EskulActivity | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  useEffect(() => { fetch('/api/eskuls/list').then(r => r.json()).then(j => { if (j.success) setEskulList(j.data) }).catch(() => {}) }, [])
  useEffect(() => { fetch('/api/teachers/list').then(r => r.json()).then(j => { if (j.success) setTeachers(j.data) }).catch(() => {}) }, [])

  const fetchEskul = useCallback(async () => {
    setEskulLoading(true)
    try { const p = new URLSearchParams(); p.set('page', String(eskulPagination.page)); if (eskulSearch) p.set('search', eskulSearch); const res = await fetch('/api/eskuls?' + p); const json = await res.json(); if (json.success) { setEskulData(json.data); setEskulPagination(json.pagination) } } catch (err) { console.error(err) } finally { setEskulLoading(false) }
  }, [eskulPagination.page, eskulSearch])

  const fetchActivities = useCallback(async () => {
    setActivityLoading(true)
    try { const p = new URLSearchParams(); p.set('page', String(activityPagination.page)); if (activitySearch) p.set('search', activitySearch); if (activityEskulFilter) p.set('eskulId', activityEskulFilter); if (activityMonthFilter) p.set('month', activityMonthFilter); if (activityYearFilter) p.set('year', activityYearFilter); const res = await fetch('/api/eskul-activities?' + p); const json = await res.json(); if (json.success) { setActivities(json.data); setActivityPagination(json.pagination) } } catch (err) { console.error(err) } finally { setActivityLoading(false) }
  }, [activityPagination.page, activitySearch, activityEskulFilter, activityMonthFilter, activityYearFilter])

  useEffect(() => { if (activeTab === 'eskul') fetchEskul() }, [activeTab, fetchEskul])
  useEffect(() => { if (activeTab === 'activities') fetchActivities() }, [activeTab, fetchActivities])

  const handleDeleteEskul = async () => { if (!deleteEskul) return; setDeleting(true); try { await fetch('/api/eskuls/' + deleteEskul.id, { method: 'DELETE' }); setDeleteEskul(null); fetchEskul(); fetch('/api/eskuls/list').then(r => r.json()).then(j => { if (j.success) setEskulList(j.data) }) } catch { alert('Gagal menghapus') } finally { setDeleting(false) } }
  const handleDeleteActivity = async () => { if (!deleteActivity) return; setDeleting(true); try { await fetch('/api/eskul-activities/' + deleteActivity.id, { method: 'DELETE' }); setDeleteActivity(null); fetchActivities() } catch { alert('Gagal menghapus') } finally { setDeleting(false) } }

  const openCreateEskul = () => { setEditEskul(null); setShowEskulForm(true) }
  const openEditEskul = (item: EskulData) => { setEditEskul(item); setShowEskulForm(true) }
  const closeEskulForm = () => { setShowEskulForm(false); setEditEskul(null) }
  const onEskulSaved = () => { closeEskulForm(); fetchEskul(); fetch('/api/eskuls/list').then(r => r.json()).then(j => { if (j.success) setEskulList(j.data) }) }
  const openCreateActivity = () => { setEditActivity(null); setShowActivityForm(true) }
  const openEditActivity = (item: EskulActivity) => { setEditActivity(item); setShowActivityForm(true) }
  const closeActivityForm = () => { setShowActivityForm(false); setEditActivity(null) }
  const onActivitySaved = () => { closeActivityForm(); fetchActivities() }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div><h2 className='text-xl font-bold text-gray-900'>Ekstrakurikuler</h2><p className='text-sm text-gray-500'>Kelola data eskul dan kegiatan ekstrakurikuler</p></div>
      </div>

      <div className='flex gap-1 p-1 bg-gray-100 rounded-xl w-fit'>
        <button onClick={() => setActiveTab('activities')} className={'px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ' + (activeTab === 'activities' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}><Activity className='w-4 h-4' /> Kegiatan Eskul</button>
        <button onClick={() => setActiveTab('eskul')} className={'px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ' + (activeTab === 'eskul' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}><Users className='w-4 h-4' /> Data Eskul</button>
      </div>

      {activeTab === 'activities' && <>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'><Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' /><input type='text' placeholder='Cari kegiatan...' value={activitySearch} onChange={e => { setActivitySearch(e.target.value); setActivityPagination(p => ({ ...p, page: 1 })) }} className='w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' /></div>
          <select value={activityEskulFilter} onChange={e => { setActivityEskulFilter(e.target.value); setActivityPagination(p => ({ ...p, page: 1 })) }} className='px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'><option value=''>Semua Eskul</option>{eskulList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
          <select value={activityMonthFilter} onChange={e => { setActivityMonthFilter(e.target.value); setActivityPagination(p => ({ ...p, page: 1 })) }} className='px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'><option value=''>Semua Bulan</option>{MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
          <select value={activityYearFilter} onChange={e => { setActivityYearFilter(e.target.value); setActivityPagination(p => ({ ...p, page: 1 })) }} className='px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'><option value=''>Semua Tahun</option>{yearOptions.map(y => <option key={y} value={y}>{y}</option>)}</select>
          <button onClick={openCreateActivity} className='inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shrink-0'><Plus className='w-4 h-4' /> Tambah Kegiatan</button>
        </div>
        <div className='bg-white rounded-2xl border border-gray-100 overflow-visible'>
          {activityLoading ? <div className='flex items-center justify-center py-20'><Loader2 className='w-6 h-6 animate-spin text-blue-600' /></div> : activities.length === 0 ? <div className='text-center py-20'><Volleyball className='w-10 h-10 mx-auto text-gray-300 mb-2' /><p className='text-gray-400'>Belum ada kegiatan eskul.</p></div> : <div className='overflow-x-auto overflow-y-visible'>
            <table className='w-full text-left'><thead><tr className='border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider'><th className='px-6 py-4'>Eskul</th><th className='px-6 py-4'>Kegiatan</th><th className='px-6 py-4'>Tanggal</th><th className='px-6 py-4'>Foto</th><th className='px-6 py-4 text-right'>Aksi</th></tr></thead>
            <tbody className='divide-y divide-gray-50'>{activities.map(item => <tr key={item.id} className='hover:bg-gray-50/50 transition-colors'><td className='px-6 py-4'><p className='text-sm font-medium text-gray-900'>{item.eskul?.name || '-'}</p>{item.eskul?.coachName && <p className='text-xs text-gray-400'>Pembina: {item.eskul.coachName}</p>}</td><td className='px-6 py-4'><p className='text-sm text-gray-900 truncate max-w-52'>{item.activityTitle}</p>{item.description && <p className='text-xs text-gray-400 truncate max-w-52'>{item.description}</p>}</td><td className='px-6 py-4'><div className='flex items-center gap-1.5 text-sm text-gray-600'><Calendar className='w-3.5 h-3.5 text-gray-400' />{item.activityDate ? new Date(item.activityDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</div></td><td className='px-6 py-4'>{item.image ? <button type='button' onClick={() => setPreviewPhoto(item.image)} className='focus:outline-none group'><Image src={item.image} alt='Foto' width={48} height={48} className='w-12 h-12 rounded-lg object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-blue-400 cursor-pointer' unoptimized /></button> : <div className='w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center'><ImageIcon className='w-4 h-4 text-gray-300' /></div>}</td><td className='px-6 py-4'><div className='flex items-center justify-end'><ActionDropdown onDetail={() => setDetailActivity(item)} onEdit={() => openEditActivity(item)} onDelete={() => setDeleteActivity(item)} /></div></td></tr>)}</tbody></table>
          </div>}
          {activityPagination.totalPages > 1 && <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100'><p className='text-sm text-gray-500'>Halaman {activityPagination.page} dari {activityPagination.totalPages}</p><div className='flex items-center gap-1'><button onClick={() => setActivityPagination(p => ({ ...p, page: p.page - 1 }))} disabled={activityPagination.page <= 1} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50'><ChevronLeft className='w-4 h-4' /></button><button onClick={() => setActivityPagination(p => ({ ...p, page: p.page + 1 }))} disabled={activityPagination.page >= activityPagination.totalPages} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50'><ChevronRight className='w-4 h-4' /></button></div></div>}
        </div>
      </>}

      {activeTab === 'eskul' && <>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'><Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' /><input type='text' placeholder='Cari eskul...' value={eskulSearch} onChange={e => { setEskulSearch(e.target.value); setEskulPagination(p => ({ ...p, page: 1 })) }} className='w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' /></div>
          <button onClick={openCreateEskul} className='inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shrink-0'><Plus className='w-4 h-4' /> Tambah Eskul</button>
        </div>
        <div className='bg-white rounded-2xl border border-gray-100 overflow-visible'>
          {eskulLoading ? <div className='flex items-center justify-center py-20'><Loader2 className='w-6 h-6 animate-spin text-blue-600' /></div> : eskulData.length === 0 ? <div className='text-center py-20'><Users className='w-10 h-10 mx-auto text-gray-300 mb-2' /><p className='text-gray-400'>Belum ada data eskul.</p></div> : <div className='overflow-x-auto overflow-y-visible'>
            <table className='w-full text-left'><thead><tr className='border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider'><th className='px-6 py-4'>Nama Eskul</th><th className='px-6 py-4'>Pembina</th><th className='px-6 py-4'>Status</th><th className='px-6 py-4'>Logo</th><th className='px-6 py-4 text-right'>Aksi</th></tr></thead>
            <tbody className='divide-y divide-gray-50'>{eskulData.map(item => <tr key={item.id} className='hover:bg-gray-50/50 transition-colors'><td className='px-6 py-4'><p className='text-sm font-medium text-gray-900'>{item.name}</p>{item.description && <p className='text-xs text-gray-400 truncate max-w-52'>{item.description}</p>}</td><td className='px-6 py-4 text-sm text-gray-600'>{item.coachName || '-'}</td><td className='px-6 py-4'><span className={'text-xs px-2.5 py-1 rounded-full ' + (item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>{item.isActive ? 'Aktif' : 'Nonaktif'}</span></td><td className='px-6 py-4'>{item.image ? <button type='button' onClick={() => setPreviewPhoto(item.image)} className='focus:outline-none group'><Image src={item.image} alt='Logo' width={48} height={48} className='w-12 h-12 rounded-lg object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-blue-400 cursor-pointer' unoptimized /></button> : <div className='w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center'><ImageIcon className='w-4 h-4 text-gray-300' /></div>}</td><td className='px-6 py-4'><div className='flex items-center justify-end'><ActionDropdown onDetail={() => setDetailEskul(item)} onEdit={() => openEditEskul(item)} onDelete={() => setDeleteEskul(item)} /></div></td></tr>)}</tbody></table>
          </div>}
          {eskulPagination.totalPages > 1 && <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100'><p className='text-sm text-gray-500'>Halaman {eskulPagination.page} dari {eskulPagination.totalPages}</p><div className='flex items-center gap-1'><button onClick={() => setEskulPagination(p => ({ ...p, page: p.page - 1 }))} disabled={eskulPagination.page <= 1} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50'><ChevronLeft className='w-4 h-4' /></button><button onClick={() => setEskulPagination(p => ({ ...p, page: p.page + 1 }))} disabled={eskulPagination.page >= eskulPagination.totalPages} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50'><ChevronRight className='w-4 h-4' /></button></div></div>}
        </div>
      </>}

      {showEskulForm && <EskulFormModal eskul={editEskul} teachers={teachers} onClose={closeEskulForm} onSaved={onEskulSaved} />}
      {showActivityForm && <ActivityFormModal activity={editActivity} eskulList={eskulList} onClose={closeActivityForm} onSaved={onActivitySaved} />}
      {deleteEskul && <DeleteModal title='Hapus Eskul' name={deleteEskul.name} onConfirm={handleDeleteEskul} onCancel={() => setDeleteEskul(null)} deleting={deleting} />}
      {deleteActivity && <DeleteModal title='Hapus Kegiatan' name={deleteActivity.activityTitle} onConfirm={handleDeleteActivity} onCancel={() => setDeleteActivity(null)} deleting={deleting} />}

      {detailActivity && <div className='fixed inset-0 z-50 overflow-hidden'><div className='fixed inset-0 bg-black/50 backdrop-blur-sm' onClick={() => setDetailActivity(null)} /><div className='fixed inset-0 overflow-y-auto'><div className='flex min-h-full items-start justify-center p-4 py-10'><div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'><h2 className='text-lg font-bold text-gray-900'>Detail Kegiatan</h2><button onClick={() => setDetailActivity(null)} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'><X className='w-4 h-4' /></button></div>
        <div className='px-6 py-5 space-y-4'>
          {detailActivity.image && <button type='button' onClick={() => setPreviewPhoto(detailActivity.image)} className='w-full focus:outline-none group'><div className='w-full aspect-video rounded-xl overflow-hidden bg-gray-100'><Image src={detailActivity.image} alt={detailActivity.activityTitle} width={500} height={280} className='w-full h-full object-cover group-hover:scale-105 transition-transform' unoptimized /></div></button>}
          <div className='grid grid-cols-[120px_1fr] gap-y-3 text-sm'>
            <span className='text-gray-500'>Eskul</span><span className='font-medium text-gray-900'>{detailActivity.eskul?.name || '-'}</span>
            <span className='text-gray-500'>Pembina</span><span className='text-gray-700'>{detailActivity.eskul?.coachName || '-'}</span>
            <span className='text-gray-500'>Kegiatan</span><span className='font-medium text-gray-900'>{detailActivity.activityTitle}</span>
            {detailActivity.description && <><span className='text-gray-500'>Deskripsi</span><span className='text-gray-700 whitespace-pre-wrap'>{detailActivity.description}</span></>}
            <span className='text-gray-500'>Tanggal</span><span className='text-gray-700'>{detailActivity.activityDate ? new Date(detailActivity.activityDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
            <span className='text-gray-500'>Dibuat</span><span className='text-gray-700'>{new Date(detailActivity.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div></div></div></div>}

      {detailEskul && <div className='fixed inset-0 z-50 overflow-hidden'><div className='fixed inset-0 bg-black/50 backdrop-blur-sm' onClick={() => setDetailEskul(null)} /><div className='fixed inset-0 overflow-y-auto'><div className='flex min-h-full items-start justify-center p-4 py-10'><div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'><h2 className='text-lg font-bold text-gray-900'>Detail Eskul</h2><button onClick={() => setDetailEskul(null)} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'><X className='w-4 h-4' /></button></div>
        <div className='px-6 py-5 space-y-4'>
          {detailEskul.image && <button type='button' onClick={() => setPreviewPhoto(detailEskul.image)} className='w-full focus:outline-none group'><div className='w-full aspect-video rounded-xl overflow-hidden bg-gray-100'><Image src={detailEskul.image} alt={detailEskul.name} width={500} height={280} className='w-full h-full object-cover group-hover:scale-105 transition-transform' unoptimized /></div></button>}
          <div className='grid grid-cols-[120px_1fr] gap-y-3 text-sm'>
            <span className='text-gray-500'>Nama</span><span className='font-medium text-gray-900'>{detailEskul.name}</span>
            {detailEskul.description && <><span className='text-gray-500'>Deskripsi</span><span className='text-gray-700 whitespace-pre-wrap'>{detailEskul.description}</span></>}
            <span className='text-gray-500'>Pembina</span><span className='text-gray-700'>{detailEskul.coachName || '-'}</span>
            <span className='text-gray-500'>Status</span><span><span className={'text-xs px-2.5 py-1 rounded-full ' + (detailEskul.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>{detailEskul.isActive ? 'Aktif' : 'Nonaktif'}</span></span>
            <span className='text-gray-500'>Dibuat</span><span className='text-gray-700'>{new Date(detailEskul.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div></div></div></div>}

      {previewPhoto && <div className='fixed inset-0 z-70 flex items-center justify-center' onClick={() => setPreviewPhoto(null)}><div className='fixed inset-0 bg-black/70 backdrop-blur-sm' /><div className='relative max-w-3xl max-h-[85vh] p-2' onClick={e => e.stopPropagation()}><button onClick={() => setPreviewPhoto(null)} className='absolute -top-3 -right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all'><X className='w-5 h-5 text-gray-600' /></button><Image src={previewPhoto} alt='Preview' width={800} height={600} className='rounded-2xl object-contain max-h-[80vh] w-auto shadow-2xl' unoptimized /></div></div>}
    </div>
  )
}

function EskulFormModal({ eskul, teachers, onClose, onSaved }: { eskul: EskulData | null; teachers: TeacherItem[]; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!eskul
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ name: '', description: '', coachName: '', image: '', isActive: true })

  useEffect(() => { if (eskul) { setForm({ name: eskul.name || '', description: eskul.description || '', coachName: eskul.coachName || '', image: eskul.image || '', isActive: eskul.isActive }); if (eskul.image) setImagePreview(eskul.image) } }, [eskul])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; setUploading(true); try { const reader = new FileReader(); reader.onload = (ev) => setImagePreview(ev.target?.result as string); reader.readAsDataURL(file); const fd = new FormData(); fd.append('file', file); const res = await fetch('/api/upload', { method: 'POST', body: fd }); const json = await res.json(); if (json.success) setForm(f => ({ ...f, image: json.data.url })); else { setError(json.message || 'Gagal upload'); setImagePreview(null) } } catch { setError('Gagal upload'); setImagePreview(null) } finally { setUploading(false) } }

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!form.name.trim()) { setError('Nama eskul wajib diisi'); return }; setSaving(true); setError(''); try { const url = isEdit ? '/api/eskuls/' + eskul!.id : '/api/eskuls'; const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); const json = await res.json(); if (json.success) onSaved(); else setError(json.message || 'Gagal menyimpan') } catch { setError('Terjadi kesalahan') } finally { setSaving(false) } }

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />
      <div className='fixed inset-0 overflow-y-auto'><div className='flex min-h-full items-start justify-center p-4 py-10'><div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'><div className='flex items-center gap-3'><button onClick={onClose} className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'><ArrowLeft className='w-4 h-4' /></button><div><h2 className='text-lg font-bold text-gray-900'>{isEdit ? 'Edit Eskul' : 'Tambah Eskul'}</h2><p className='text-xs text-gray-500'>{isEdit ? 'Perbarui data eskul' : 'Tambahkan eskul baru'}</p></div></div><button onClick={onClose} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'><X className='w-4 h-4' /></button></div>
        {error && <div className='mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700'>{error}</div>}
        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Nama Eskul <span className="text-red-500">*</span></label><input type='text' required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Contoh: Pramuka, Basket' /></div>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Deskripsi</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' placeholder='Deskripsi eskul' /></div>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Pembina</label><select value={form.coachName} onChange={e => setForm(f => ({ ...f, coachName: e.target.value }))} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'><option value=''>-- Pilih Pembina --</option>{teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}</select></div>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Logo / Foto</label><input ref={imageInputRef} type='file' accept='image/*' onChange={handleUpload} className='hidden' />{imagePreview ? <div className='relative rounded-xl overflow-hidden border border-gray-200'><Image src={imagePreview} alt='Preview' width={400} height={120} className='w-full h-28 object-cover' unoptimized /><div className='absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100'><button type='button' onClick={() => imageInputRef.current?.click()} className='px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow'>Ganti</button></div><button type='button' onClick={() => { setImagePreview(null); setForm(f => ({ ...f, image: '' })) }} className='absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50'><X className='w-3.5 h-3.5 text-red-500' /></button></div> : <button type='button' onClick={() => imageInputRef.current?.click()} disabled={uploading} className='w-full py-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-1.5 hover:border-blue-400 hover:bg-blue-50/30 transition-all disabled:opacity-50'>{uploading ? <Loader2 className='w-5 h-5 animate-spin text-blue-500' /> : <Upload className='w-5 h-5 text-gray-400' />}<span className='text-xs text-gray-500'>{uploading ? 'Mengupload...' : 'Klik untuk upload'}</span></button>}</div>
          <div className='flex items-center gap-3'><input type='checkbox' id='isActive' checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500' /><label htmlFor='isActive' className='text-sm text-gray-700'>Eskul Aktif</label></div>
          <div className='flex gap-3 pt-2'><button type='button' onClick={onClose} className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all'>Batal</button><button type='submit' disabled={saving || uploading} className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50'>{saving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}{saving ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}</button></div>
        </form>
      </div></div></div>
    </div>
  )
}

function ActivityFormModal({ activity, eskulList, onClose, onSaved }: { activity: EskulActivity | null; eskulList: EskulListItem[]; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!activity
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ eskulId: '', activityTitle: '', description: '', activityDate: today, image: '' })

  useEffect(() => { if (activity) { setForm({ eskulId: String(activity.eskulId), activityTitle: activity.activityTitle || '', description: activity.description || '', activityDate: activity.activityDate ? activity.activityDate.substring(0, 10) : today, image: activity.image || '' }); if (activity.image) setImagePreview(activity.image) } }, [activity, today])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; setUploading(true); try { const reader = new FileReader(); reader.onload = (ev) => setImagePreview(ev.target?.result as string); reader.readAsDataURL(file); const fd = new FormData(); fd.append('file', file); const res = await fetch('/api/upload', { method: 'POST', body: fd }); const json = await res.json(); if (json.success) setForm(f => ({ ...f, image: json.data.url })); else { setError(json.message || 'Gagal upload'); setImagePreview(null) } } catch { setError('Gagal upload'); setImagePreview(null) } finally { setUploading(false) } }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.eskulId) {
      setError('Pilih eskul terlebih dahulu')
      return
    }
    if (!form.activityTitle.trim()) {
      setError('Judul kegiatan wajib diisi')
      return
    }
    if (!form.image?.trim()) {
      setError('Foto kegiatan wajib diunggah')
      return
    }

    setSaving(true)
    setError('')
    try {
      const url = isEdit ? '/api/eskul-activities/' + activity!.id : '/api/eskul-activities'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eskulId: parseInt(form.eskulId),
          activityTitle: form.activityTitle,
          description: form.description || null,
          activityDate: form.activityDate || null,
          image: form.image || null,
        }),
      })
      const json = await res.json()
      if (json.success) onSaved()
      else setError(json.message || 'Gagal menyimpan')
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />
      <div className='fixed inset-0 overflow-y-auto'><div className='flex min-h-full items-start justify-center p-4 py-10'><div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'><div className='flex items-center gap-3'><button onClick={onClose} className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'><ArrowLeft className='w-4 h-4' /></button><div><h2 className='text-lg font-bold text-gray-900'>{isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h2><p className='text-xs text-gray-500'>{isEdit ? 'Perbarui data kegiatan' : 'Catat kegiatan eskul'}</p></div></div><button onClick={onClose} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'><X className='w-4 h-4' /></button></div>
        {error && <div className='mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700'>{error}</div>}
        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Eskul <span className="text-red-500">*</span></label><select required value={form.eskulId} onChange={e => setForm(f => ({ ...f, eskulId: e.target.value }))} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'><option value=''>-- Pilih Eskul --</option>{eskulList.map(ek => <option key={ek.id} value={ek.id}>{ek.name}</option>)}</select></div>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Judul Kegiatan <span className="text-red-500">*</span></label><input type='text' required value={form.activityTitle} onChange={e => setForm(f => ({ ...f, activityTitle: e.target.value }))} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Contoh: Latihan Rutin, Perkemahan' /></div>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Deskripsi</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' placeholder='Deskripsi kegiatan' /></div>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Tanggal <span className="text-red-500">*</span></label><div className='relative'><Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' /><input type='date' max={today} value={form.activityDate} onChange={e => setForm(f => ({ ...f, activityDate: e.target.value }))} className='w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' /></div></div>
          <div><label className='block text-sm font-medium text-gray-700 mb-1.5'>Foto Kegiatan <span className="text-red-500">*</span></label><input ref={imageInputRef} type='file' accept='image/*' onChange={handleUpload} className='hidden' />{imagePreview ? <div className='relative rounded-xl overflow-hidden border border-gray-200'><Image src={imagePreview} alt='Preview' width={400} height={120} className='w-full h-28 object-cover' unoptimized /><div className='absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100'><button type='button' onClick={() => imageInputRef.current?.click()} className='px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow'>Ganti</button></div><button type='button' onClick={() => { setImagePreview(null); setForm(f => ({ ...f, image: '' })) }} className='absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50'><X className='w-3.5 h-3.5 text-red-500' /></button></div> : <button type='button' onClick={() => imageInputRef.current?.click()} disabled={uploading} className='w-full py-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-1.5 hover:border-blue-400 hover:bg-blue-50/30 transition-all disabled:opacity-50'>{uploading ? <Loader2 className='w-5 h-5 animate-spin text-blue-500' /> : <Upload className='w-5 h-5 text-gray-400' />}<span className='text-xs text-gray-500'>{uploading ? 'Mengupload...' : 'Klik untuk upload'}</span></button>}</div>
          <div className='flex gap-3 pt-2'><button type='button' onClick={onClose} className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all'>Batal</button><button type='submit' disabled={saving || uploading} className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50'>{saving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}{saving ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}</button></div>
        </form>
      </div></div></div>
    </div>
  )
}
