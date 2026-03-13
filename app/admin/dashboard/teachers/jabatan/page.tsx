'use client'

import { PositionsTab } from '../page'

export default function JabatanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Kelola Jabatan</h2>
        <p className="text-sm text-gray-500">Kelola daftar jabatan guru dan staf sekolah</p>
      </div>
      <PositionsTab />
    </div>
  )
}
