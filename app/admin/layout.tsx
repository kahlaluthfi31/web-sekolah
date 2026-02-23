import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - SMK',
  description: 'Admin Dashboard untuk Manajemen Website Sekolah',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
