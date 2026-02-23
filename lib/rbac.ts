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
  // Agendas
  | 'agendas.view' | 'agendas.create' | 'agendas.edit' | 'agendas.delete'
  // Alumni
  | 'alumni.view' | 'alumni.verify'
  // Comments
  | 'comments.view' | 'comments.create' | 'comments.approve' | 'comments.delete'
  // Users
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  // Messages
  | 'messages.view' | 'messages.reply' | 'messages.delete'
  // Settings (Superadmin only)
  | 'settings.view' | 'settings.edit'
  // Navigation Menu (Superadmin only)
  | 'navigation.view' | 'navigation.edit'
  // Hero / Homepage (Superadmin only)
  | 'homepage.view' | 'homepage.edit'
  // School Profile (Superadmin only)
  | 'school_profile.view' | 'school_profile.edit'

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
    'agendas.view', 'agendas.create', 'agendas.edit', 'agendas.delete',
    'alumni.view', 'alumni.verify',
    'comments.view', 'comments.create', 'comments.approve', 'comments.delete',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'messages.view', 'messages.reply', 'messages.delete',
    'settings.view', 'settings.edit',
    'navigation.view', 'navigation.edit',
    'homepage.view', 'homepage.edit',
    'school_profile.view', 'school_profile.edit',
  ],
  admin: [
    'dashboard.view',
    'news.view', 'news.create', 'news.edit', 'news.delete', 'news.publish',
    'teachers.view',
    'achievements.view', 'achievements.create', 'achievements.edit', 'achievements.verify',
    'extracurriculars.view', 'extracurriculars.create', 'extracurriculars.edit',
    'agendas.view', 'agendas.create', 'agendas.edit',
    'alumni.view', 'alumni.verify',
    'comments.view', 'comments.approve', 'comments.delete',
    'messages.view', 'messages.reply',
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

export function getNavigation(role: UserRole): NavItem[] {
  const allNav: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'dashboard.view' },

    // Content Management (Admin + Superadmin)
    { title: 'Berita & Pengumuman', href: '/admin/dashboard/news', icon: 'Newspaper', permission: 'news.view' },
    { title: 'Prestasi Siswa', href: '/admin/dashboard/achievements', icon: 'Trophy', permission: 'achievements.view' },
    { title: 'Ekstrakurikuler', href: '/admin/dashboard/extracurriculars', icon: 'Volleyball', permission: 'extracurriculars.view' },
    { title: 'Agenda Kegiatan', href: '/admin/dashboard/agendas', icon: 'CalendarDays', permission: 'agendas.view' },
    { title: 'Data Alumni', href: '/admin/dashboard/alumni', icon: 'GraduationCap', permission: 'alumni.view' },
    { title: 'Komentar', href: '/admin/dashboard/comments', icon: 'MessageCircle', permission: 'comments.view' },
    { title: 'Pesan Masuk', href: '/admin/dashboard/messages', icon: 'Mail', permission: 'messages.view' },

    // Data Master (Superadmin only)
    { title: 'Guru & Staff', href: '/admin/dashboard/teachers', icon: 'Users', permission: 'teachers.view' },
    { title: 'Program Keahlian', href: '/admin/dashboard/majors', icon: 'BookOpen', permission: 'majors.view' },
    { title: 'Fasilitas', href: '/admin/dashboard/facilities', icon: 'Building2', permission: 'facilities.view' },

    // User Management (Superadmin only)
    { title: 'Manajemen User', href: '/admin/dashboard/users', icon: 'UserCog', permission: 'users.view' },

    // Website Settings (Superadmin only)
    { title: 'Menu Navigasi', href: '/admin/dashboard/navigation', icon: 'Menu', permission: 'navigation.view' },
    { title: 'Halaman Utama', href: '/admin/dashboard/homepage', icon: 'Home', permission: 'homepage.view' },
    { title: 'Profil Sekolah', href: '/admin/dashboard/school-profile', icon: 'School', permission: 'school_profile.view' },
    { title: 'Pengaturan', href: '/admin/dashboard/settings', icon: 'Settings', permission: 'settings.view' },
  ]

  return allNav.filter(item => hasPermission(role, item.permission))
}
