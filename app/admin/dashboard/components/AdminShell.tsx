'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { SessionUser } from '@/lib/auth'
import { getNavigation, type UserRole, type NavItem } from '@/lib/rbac'
import {
  LayoutDashboard, Newspaper, Trophy, Volleyball, CalendarDays,
  GraduationCap, MessageCircle, Mail, Users, BookOpen, Building2,
  UserCog, Menu as MenuIcon, Home, School, Settings, LogOut,
  ChevronLeft, ChevronRight, X, ShieldCheck,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Newspaper, Trophy, Volleyball, CalendarDays,
  GraduationCap, MessageCircle, Mail, Users, BookOpen, Building2,
  UserCog, Menu: MenuIcon, Home, School, Settings, ShieldCheck,
}

/* ------------------------------------------------------------------ */
/*  Stand-alone sub-components (outside render — React 19 safe)        */
/* ------------------------------------------------------------------ */

function SidebarNavLink({
  item,
  isActive,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  isActive: boolean
  collapsed: boolean
  onNavigate?: () => void
}) {
  const Icon = iconMap[item.icon] || LayoutDashboard
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
        ${isActive
          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
        ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? item.title : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </Link>
  )
}

function SidebarNavGroup({
  label,
  items,
  pathname,
  collapsed,
  onNavigate,
}: {
  label: string
  items: NavItem[]
  pathname: string
  collapsed: boolean
  onNavigate?: () => void
}) {
  if (items.length === 0) return null
  return (
    <div className="mb-2">
      {!collapsed && label && (
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map(item => (
          <SidebarNavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main shell                                                         */
/* ------------------------------------------------------------------ */

interface AdminShellProps {
  user: SessionUser
  children: React.ReactNode
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [customMenuKeys, setCustomMenuKeys] = useState<string[] | null | undefined>(undefined)
  const prevKeysRef = useRef<string[] | null | undefined>(undefined)
  const pathname = usePathname()
  const router = useRouter()

  // Fetch custom permissions for admin role
  const fetchPermissions = useCallback(async () => {
    if (user.role !== 'admin') return
    try {
      const r = await fetch(`/api/admin-permissions?userId=${user.id}`)
      const j = await r.json()
      if (j.success) {
        const next = (j.data.menuKeys ?? null) as string[] | null
        const prev = prevKeysRef.current
        // If permissions changed after initial load → redirect out of potentially forbidden page
        if (prev !== undefined && JSON.stringify(prev) !== JSON.stringify(next)) {
          setTimeout(() => router.push('/admin/dashboard'), 0)
        }
        prevKeysRef.current = next
        setCustomMenuKeys(next)
      }
    } catch { /* ignore */ }
  }, [user.id, user.role, router])

  useEffect(() => {
    let cancelled = false

    const sync = async () => {
      if (cancelled) return
      await fetchPermissions()
    }

    // Initial fetch + polling every 30s + re-fetch on window focus
    void sync()
    const interval = setInterval(() => { void sync() }, 30_000)
    const onFocus = () => { void sync() }
    window.addEventListener('focus', onFocus)

    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [fetchPermissions])

  const navigation = useMemo(
    () => getNavigation(user.role as UserRole, user.role === 'admin' ? customMenuKeys : undefined),
    [user.role, customMenuKeys]
  )

  const groups = useMemo(() => {
    const contentKeys = ['news', 'achievements', 'extracurriculars', 'agendas', 'alumni', 'comments', 'messages']
    const masterKeys = ['teachers', 'majors', 'facilities']
    const settingsKeys = ['navigation', 'homepage', 'school-profile', 'settings']
    return {
      dashboard: navigation.filter(n => n.href === '/admin/dashboard'),
      content: navigation.filter(n => contentKeys.some(k => n.href.includes(k))),
      master: navigation.filter(n => masterKeys.some(k => n.href.includes(k))),
      users: navigation.filter(n => n.href.includes('users') || n.href.includes('access-control')),
      settings: navigation.filter(n => settingsKeys.some(k => n.href.includes(k))),
    }
  }, [navigation])

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }, [router])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  /* Collapsed state — desktop uses `sidebarOpen`, mobile always expanded */
  const collapsed = !sidebarOpen

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ---- Mobile Sidebar Overlay ---- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobile} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 flex flex-col">
            {/* Close */}
            <button
              onClick={closeMobile}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-gray-100 shrink-0 gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <School className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">SMK Admin</p>
                <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <SidebarNavGroup label="" items={groups.dashboard} pathname={pathname} collapsed={false} onNavigate={closeMobile} />
              <SidebarNavGroup label="Konten" items={groups.content} pathname={pathname} collapsed={false} onNavigate={closeMobile} />
              <SidebarNavGroup label="Data Master" items={groups.master} pathname={pathname} collapsed={false} onNavigate={closeMobile} />
              <SidebarNavGroup label="Pengguna" items={groups.users} pathname={pathname} collapsed={false} onNavigate={closeMobile} />
              <SidebarNavGroup label="Website" items={groups.settings} pathname={pathname} collapsed={false} onNavigate={closeMobile} />
            </nav>

            {/* User */}
            <div className="p-3 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Desktop Sidebar ---- */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-18'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-100 shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <School className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">SMK Admin</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <SidebarNavGroup label="" items={groups.dashboard} pathname={pathname} collapsed={collapsed} />
          <SidebarNavGroup label="Konten" items={groups.content} pathname={pathname} collapsed={collapsed} />
          <SidebarNavGroup label="Data Master" items={groups.master} pathname={pathname} collapsed={collapsed} />
          <SidebarNavGroup label="Pengguna" items={groups.users} pathname={pathname} collapsed={collapsed} />
          <SidebarNavGroup label="Website" items={groups.settings} pathname={pathname} collapsed={collapsed} />
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          {/* <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} mb-2`}>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            )}
          </div> */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
        >
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* ---- Main Content Area ---- */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-18'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {pathname === '/admin/dashboard'
                  ? 'Dashboard'
                  : pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
