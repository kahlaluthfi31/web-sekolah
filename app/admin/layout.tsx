import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - SMKN 1 Ciamis',
  description: 'Admin Dashboard untuk Manajemen Website Sekolah',
  icons: {
    icon: [{ url: '/images/web/logo-smkn1-ciamis.png', type: 'image/png' }],
    shortcut: [{ url: '/images/web/logo-smkn1-ciamis.png', type: 'image/png' }],
    apple: [{ url: '/images/web/logo-smkn1-ciamis.png', type: 'image/png' }],
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {children}
    </div>
  )
}
