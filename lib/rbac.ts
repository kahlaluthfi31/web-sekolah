// ============================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================
// Superadmin: Full access + Website settings (Navbar, Settings, dll)
// Admin: Manage content (News, Achievements, Extracurricular, Agenda, Teachers)
// User: Read-only + Comments (perlu approval admin)

export type UserRole = 'superadmin' | 'admin' | 'user'

export type Permission =
  // Dashboard
  | 'dashboard.view'
  // News
  | 'news.view' | 'news.create' | 'news.edit' | 'news.delete' | 'news.publish'
  // Teachers
  | 'teachers.view' | 'teachers.create' | 'teachers.edit' | 'teachers.delete'
  // Majors
  | 'majors.view' | 'majors.create' | 'majors.edit' | 'majors.delete'
  // Facilities
  | 'facilities.view' | 'facilities.create' | 'facilities.edit' | 'facilities.delete'
  // Achievements
  | 'achievements.view' | 'achievements.create' | 'achievements.edit' | 'achievements.delete' | 'achievements.verify'
  // Extracurriculars
  | 'extracurriculars.view' | 'extracurriculars.create' | 'extracurriculars.edit' | 'extracurriculars.delete'
  // Routine Activities
  | 'routine_activities.view' | 'routine_activities.create' | 'routine_activities.edit' | 'routine_activities.delete'
  // Agendas
  | 'agendas.view' | 'agendas.create' | 'agendas.edit' | 'agendas.delete'
  // Alumni
  | 'alumni.view' | 'alumni.verify'
  // Partners
  | 'partners.view' | 'partners.create' | 'partners.edit' | 'partners.delete'
  // Comments
  | 'comments.view' | 'comments.create' | 'comments.approve' | 'comments.delete'
  // Contact info management
  | 'contact_info.manage'
  // Users
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  // Messages
  | 'messages.view' | 'messages.reply' | 'messages.delete'
  // Login Activity (Superadmin only)
  | 'login_activity.view'
  // User Activity (Superadmin only)
  | 'user_activity.view' | 'user_activity.next'
  // Settings (Superadmin only)
  | 'settings.view' | 'settings.edit'
  // Navigation Menu (Superadmin only)
  | 'navigation.view' | 'navigation.edit'
  // Hero / Homepage (Superadmin only)
  | 'homepage.view' | 'homepage.edit'
  // School Profile (Superadmin only)
  | 'school_profile.view' | 'school_profile.edit'
  // Virtual Tour
  | 'virtual_tour.view' | 'virtual_tour.manage'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    // Everything
    'dashboard.view',
    'news.view', 'news.create', 'news.edit', 'news.delete', 'news.publish',
    'teachers.view', 'teachers.create', 'teachers.edit', 'teachers.delete',
    'majors.view', 'majors.create', 'majors.edit', 'majors.delete',
    'facilities.view', 'facilities.create', 'facilities.edit', 'facilities.delete',
    'achievements.view', 'achievements.create', 'achievements.edit', 'achievements.delete', 'achievements.verify',
    'extracurriculars.view', 'extracurriculars.create', 'extracurriculars.edit', 'extracurriculars.delete',
  'routine_activities.view', 'routine_activities.create', 'routine_activities.edit', 'routine_activities.delete',
    'agendas.view', 'agendas.create', 'agendas.edit', 'agendas.delete',
    'alumni.view', 'alumni.verify',
    'partners.view', 'partners.create', 'partners.edit', 'partners.delete',
    'comments.view', 'comments.create', 'comments.approve', 'comments.delete',
  'contact_info.manage',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'messages.view', 'messages.reply', 'messages.delete',
    'login_activity.view',
  'user_activity.view', 'user_activity.next',
    'settings.view', 'settings.edit',
    'navigation.view', 'navigation.edit',
    'homepage.view', 'homepage.edit',
    'school_profile.view', 'school_profile.edit',
    'virtual_tour.view', 'virtual_tour.manage',
  ],
  admin: [
    'dashboard.view',
    'news.view', 'news.create', 'news.edit', 'news.delete', 'news.publish',
    'teachers.view', 'teachers.create', 'teachers.edit', 'teachers.delete',
    'majors.view', 'majors.create', 'majors.edit', 'majors.delete',
    'facilities.view', 'facilities.create', 'facilities.edit', 'facilities.delete',
    'achievements.view', 'achievements.create', 'achievements.edit', 'achievements.verify',
    'extracurriculars.view', 'extracurriculars.create', 'extracurriculars.edit',
  'routine_activities.view', 'routine_activities.create', 'routine_activities.edit',
    'agendas.view', 'agendas.create', 'agendas.edit',
    'alumni.view', 'alumni.verify',
    'partners.view', 'partners.create', 'partners.edit',
    'comments.view', 'comments.approve', 'comments.delete',
    'contact_info.manage',
    'messages.view', 'messages.reply',
    'virtual_tour.view', 'virtual_tour.manage',
  ],
  user: [
    'comments.create',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p))
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

// Navigation items based on role
export interface NavItem {
  title: string
  href: string
  icon: string  // lucide icon name
  permission: Permission
  badge?: string
  children?: NavItem[]
}

// All menu keys that can be toggled for admin role
export const ADMIN_MENU_ITEMS: { key: string; label: string; icon: string; href: string }[] = [
  { key: 'news',             label: 'Berita & Pengumuman', icon: 'Newspaper',    href: '/admin/dashboard/news' },
  { key: 'achievements',     label: 'Prestasi Siswa',      icon: 'Trophy',       href: '/admin/dashboard/achievements' },
  { key: 'extracurriculars', label: 'Ekstrakurikuler',     icon: 'Volleyball',   href: '/admin/dashboard/extracurriculars' },
  { key: 'routine-activities', label: 'Kegiatan Rutin',    icon: 'Route', href: '/admin/dashboard/routine-activities' },
  { key: 'agendas',          label: 'Agenda Kegiatan',     icon: 'CalendarDays', href: '/admin/dashboard/agendas' },
  { key: 'alumni',           label: 'Data Alumni',         icon: 'GraduationCap',href: '/admin/dashboard/alumni' },
  { key: 'comments',         label: 'Komentar (Tab Berita)', icon: 'MessageCircle',href: '/admin/dashboard/comments' },
  { key: 'messages',         label: 'Pesan Masuk',          icon: 'Mail',         href: '/admin/dashboard/messages' },
  { key: 'teachers',         label: 'Guru & Staff',         icon: 'Users',        href: '/admin/dashboard/teachers' },
  { key: 'majors',           label: 'Program Keahlian',     icon: 'BookOpen',     href: '/admin/dashboard/majors' },
  { key: 'facilities',       label: 'Fasilitas',            icon: 'Building2',    href: '/admin/dashboard/facilities' },
  { key: 'virtual-tour',     label: 'Virtual Tour',         icon: 'Camera',       href: '/admin/dashboard/virtual-tour' },
  { key: 'partners',         label: 'Mitra Kerja Sama',     icon: 'Building2',    href: '/admin/dashboard/partners' },
  { key: 'contact-info',     label: 'Info Kontak',          icon: 'Contact',      href: '/admin/dashboard/contact-info' },
]

export const DEFAULT_ADMIN_MENU_KEYS: string[] = [
  'news', 'achievements', 'extracurriculars', 'routine-activities', 'agendas', 'alumni', 'comments', 'messages', 'partners', 'contact-info',
]

export function getNavigation(role: UserRole, customMenuKeys?: string[] | null): NavItem[] {
  const allNav: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'dashboard.view' },

    // Content Management (Admin + Superadmin)
    { title: 'Berita & Pengumuman', href: '/admin/dashboard/news', icon: 'Newspaper', permission: 'news.view' },
    { title: 'Prestasi Siswa', href: '/admin/dashboard/achievements', icon: 'Trophy', permission: 'achievements.view' },
    { title: 'Ekstrakurikuler', href: '/admin/dashboard/extracurriculars', icon: 'Volleyball', permission: 'extracurriculars.view' },
    { title: 'Kegiatan Rutin', href: '/admin/dashboard/routine-activities', icon: 'Route', permission: 'routine_activities.view' },
    { title: 'Agenda Kegiatan', href: '/admin/dashboard/agendas', icon: 'CalendarDays', permission: 'agendas.view' },
  { title: 'Data Alumni', href: '/admin/dashboard/alumni', icon: 'GraduationCap', permission: 'alumni.view' },
    { title: 'Pesan Masuk', href: '/admin/dashboard/messages', icon: 'Mail', permission: 'messages.view' },
    { title: 'Mitra Kerja Sama', href: '/admin/dashboard/partners', icon: 'Building2', permission: 'partners.view' },
  { title: 'Info Kontak', href: '/admin/dashboard/contact-info', icon: 'Contact', permission: 'contact_info.manage' },

    // Data Master (Superadmin only)
    {
      title: 'Guru & Staff',
      href: '/admin/dashboard/teachers',
      icon: 'Users',
      permission: 'teachers.view',
      children: [
        { title: 'Daftar Guru & Staff', href: '/admin/dashboard/teachers', icon: 'Users', permission: 'teachers.view' as const },
        { title: 'Riwayat Jabatan', href: '/admin/dashboard/teachers/riwayat-jabatan', icon: 'BookOpen', permission: 'teachers.view' as const },
        { title: 'Kelola Jabatan', href: '/admin/dashboard/teachers/jabatan', icon: 'Award', permission: 'teachers.view' as const },
      ],
    },
    { title: 'Program Keahlian', href: '/admin/dashboard/majors', icon: 'BookOpen', permission: 'majors.view' },
    { title: 'Fasilitas', href: '/admin/dashboard/facilities', icon: 'Building2', permission: 'facilities.view' },
    { title: 'Virtual Tour', href: '/admin/dashboard/virtual-tour', icon: 'Camera', permission: 'virtual_tour.view' },

    // User Management (Superadmin only)
    { title: 'Manajemen User', href: '/admin/dashboard/users', icon: 'UserCog', permission: 'users.view' },

    // Access Control (Superadmin only)
    { title: 'Hak Akses Admin', href: '/admin/dashboard/access-control', icon: 'ShieldCheck', permission: 'users.view' },
    {
      title: 'Aktivitas Pengguna',
      href: '/admin/dashboard/login-activity',
      icon: 'Activity',
      permission: 'login_activity.view',
      children: [
        { title: 'Aktivitas Login', href: '/admin/dashboard/login-activity', icon: 'Activity', permission: 'login_activity.view' as const },
        { title: 'Log Perubahan', href: '/admin/dashboard/user-activity', icon: 'NotebookPen', permission: 'user_activity.view' as const },
  { title: 'Trace & Forensic', href: '/admin/dashboard/user-activity/next-task', icon: 'Crosshair', permission: 'user_activity.next' as const },
      ],
    },

    // Website Settings (Superadmin only)
    { title: 'Profil Sekolah', href: '/admin/dashboard/school-profile', icon: 'School', permission: 'school_profile.view' },
    { title: 'Pengaturan', href: '/admin/dashboard/settings', icon: 'Settings', permission: 'settings.view' },
  ]

  // For superadmin: always show everything
  if (role === 'superadmin') {
    return allNav.filter(item => hasPermission(role, item.permission))
  }

  // For admin: always filter by customMenuKeys (access-control settings)
  // - undefined = still loading permissions → show only dashboard (prevent flash)
  // - null      = no custom setting → use DEFAULT_ADMIN_MENU_KEYS
  // - string[]  = custom setting from superadmin
  const allowedKeys = customMenuKeys === undefined
    ? []  // loading state: hide all menus until permissions fetched
    : (customMenuKeys ?? DEFAULT_ADMIN_MENU_KEYS)

  return allNav.filter(item => hasPermission(role, item.permission)).filter(item => {
    if (item.href === '/admin/dashboard') return true
    const key = ADMIN_MENU_ITEMS.find(m => m.href === item.href)?.key
    return key ? allowedKeys.includes(key) : false
  })
}
