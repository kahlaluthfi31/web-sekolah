'use client'

import { useState, useCallback } from 'react'
import { HistoryTab } from '../page'

type SubTab = 'kepsek' | 'wakepsek' | 'bidang'

const TAB_META: Record<SubTab, { title: string; desc: string }> = {
  kepsek:   { title: 'Riwayat Kepala Sekolah',       desc: 'Kelola riwayat jabatan Kepala Sekolah' },
  wakepsek: { title: 'Riwayat Wakil Kepala Sekolah', desc: 'Kelola riwayat jabatan Wakil Kepala Sekolah per bidang' },
  bidang:   { title: 'Kelola Bidang Wakepsek',        desc: 'Kelola daftar bidang Wakil Kepala Sekolah' },
}

export default function RiwayatJabatanPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('kepsek')

  const handleSubTabChange = useCallback((tab: SubTab) => {
    setActiveTab(tab)
  }, [])

  const { title, desc } = TAB_META[activeTab]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <HistoryTab defaultSubTab="kepsek" onSubTabChange={handleSubTabChange} />
    </div>
  )
}
