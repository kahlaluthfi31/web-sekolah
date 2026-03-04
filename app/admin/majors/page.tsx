'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft,
  Users,
  BookOpen
} from 'lucide-react'

interface Major {
  id: number
  name: string
  code: string
  description: string
  duration: number
  accreditation: string | null
  capacity: number
  logo: string | null
  _count: {
    competencies: number
    students: number
  }
}

export default function MajorsManagementPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMajors = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/majors?${params}`)
      const data = await response.json()

      if (data.success) {
        setMajors(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching majors:', error)
      alert('Gagal memuat data program')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, currentPage])

  useEffect(() => {
    fetchMajors()
  }, [fetchMajors])

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program keahlian ini?')) return

    try {
      const response = await fetch(`/api/majors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Program keahlian berhasil dihapus')
        fetchMajors()
      } else {
        const data = await response.json()
        alert(data.message || 'Gagal menghapus program keahlian')
      }
    } catch (error) {
      console.error('Error deleting major:', error)
      alert('Terjadi kesalahan')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kelola Program Keahlian</h1>
                <p className="mt-1 text-sm text-gray-600">Manajemen program keahlian sekolah</p>
              </div>
            </div>
            <Link
              href="/admin/majors/create"
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Program Keahlian</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="max-w-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Program Keahlian
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama program keahlian, kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              Loading...
            </div>
          ) : majors.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              Tidak ada data program keahlian
            </div>
          ) : (
            majors.map((major) => (
              <div
                key={major.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                          {major.code}
                        </span>
                        {major.accreditation && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Akreditasi {major.accreditation}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {major.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {major.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-500 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs">Kompetensi</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {major._count.competencies}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-500 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Siswa</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {major._count.students}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>Durasi: {major.duration} tahun</p>
                    <p>Kapasitas: {major.capacity} siswa/tahun</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/majors/${major.id}/edit`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(major.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
