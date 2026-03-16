import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminShell } from './components/AdminShell'

export const metadata = {
  title: 'Admin Dashboard - SMKN 1 CIAMIS',
  icons: {
    icon: [{ url: '/images/web/logo.png', type: 'image/png' }],
    shortcut: [{ url: '/images/web/logo.png', type: 'image/png' }],
    apple: [{ url: '/images/web/logo.png', type: 'image/png' }],
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  // Only superadmin & admin can access
  if (session.role === 'user') {
    redirect('/')
  }

  return <AdminShell user={session}>{children}</AdminShell>
}
