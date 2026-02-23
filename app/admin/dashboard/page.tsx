import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasPermission, type UserRole } from '@/lib/rbac'
import Link from 'next/link'
import {
  Newspaper, Users, Trophy, Volleyball, CalendarDays,
  GraduationCap, MessageCircle, Mail, BookOpen, Building2,
  TrendingUp, Clock, AlertCircle,
} from 'lucide-react'

async function getStats(role: UserRole) {
  const [
    newsCount,
    teacherCount,
    majorCount,
    facilityCount,
    achievementCount,
    extracurricularCount,
    agendaCount,
    alumniCount,
    pendingComments,
    unreadMessages,
    userCount,
    recentNews,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.teacher.count(),
    prisma.major.count(),
    prisma.facility.count(),
    prisma.studentAchievement.count(),
    prisma.extracurricular.count(),
    prisma.agenda.count(),
    prisma.alumniSubmission.count(),
    prisma.comment.count({ where: { status: 'pending' } }),
    prisma.contactMessage.count({ where: { status: 'unread' } }),
    prisma.user.count(),
    prisma.news.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, category: true, createdAt: true, isPublished: true },
    }),
  ])

  return {
    newsCount,
    teacherCount,
    majorCount,
    facilityCount,
    achievementCount,
    extracurricularCount,
    agendaCount,
    alumniCount,
    pendingComments,
    unreadMessages,
    userCount,
    recentNews,
  }
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null
  const role = session.role as UserRole

  const stats = await getStats(role)

  const statCards = [
    { label: 'Berita', value: stats.newsCount, icon: Newspaper, href: '/admin/dashboard/news', color: 'blue', permission: 'news.view' as const },
    { label: 'Guru & Staff', value: stats.teacherCount, icon: Users, href: '/admin/dashboard/teachers', color: 'emerald', permission: 'teachers.view' as const },
    { label: 'Program Keahlian', value: stats.majorCount, icon: BookOpen, href: '/admin/dashboard/majors', color: 'purple', permission: 'majors.view' as const },
    { label: 'Fasilitas', value: stats.facilityCount, icon: Building2, href: '/admin/dashboard/facilities', color: 'orange', permission: 'facilities.view' as const },
    { label: 'Prestasi', value: stats.achievementCount, icon: Trophy, href: '/admin/dashboard/achievements', color: 'yellow', permission: 'achievements.view' as const },
    { label: 'Ekstrakurikuler', value: stats.extracurricularCount, icon: Volleyball, href: '/admin/dashboard/extracurriculars', color: 'pink', permission: 'extracurriculars.view' as const },
    { label: 'Agenda', value: stats.agendaCount, icon: CalendarDays, href: '/admin/dashboard/agendas', color: 'cyan', permission: 'agendas.view' as const },
    { label: 'Alumni', value: stats.alumniCount, icon: GraduationCap, href: '/admin/dashboard/alumni', color: 'indigo', permission: 'alumni.view' as const },
  ].filter(card => hasPermission(role, card.permission))

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    pink: 'bg-pink-50 text-pink-600 border-pink-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Selamat Datang, {session.name}!</h2>
        <p className="text-gray-500 mt-1">Berikut ringkasan data website sekolah Anda.</p>
      </div>

      {/* Alerts */}
      <div className="flex flex-col sm:flex-row gap-4">
        {hasPermission(role, 'comments.approve') && stats.pendingComments > 0 && (
          <Link
            href="/admin/dashboard/comments"
            className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all"
          >
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              {stats.pendingComments} komentar menunggu persetujuan
            </span>
          </Link>
        )}
        {hasPermission(role, 'messages.view') && stats.unreadMessages > 0 && (
          <Link
            href="/admin/dashboard/messages"
            className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
          >
            <Mail className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              {stats.unreadMessages} pesan belum dibaca
            </span>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="w-3 h-3" />
                <span>Lihat semua</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent News + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent News */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Berita Terbaru</h3>
            {hasPermission(role, 'news.view') && (
              <Link href="/admin/dashboard/news" className="text-sm text-blue-600 hover:text-blue-800">
                Lihat semua →
              </Link>
            )}
          </div>
          {stats.recentNews.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada berita.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentNews.map(news => (
                <div key={news.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{news.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                        {news.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${news.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {news.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="space-y-2">
            {hasPermission(role, 'news.create') && (
              <Link
                href="/admin/dashboard/news/create"
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl text-sm font-medium text-blue-700 hover:bg-blue-100 transition-all"
              >
                <Newspaper className="w-4 h-4" />
                Tulis Berita Baru
              </Link>
            )}
            {hasPermission(role, 'achievements.create') && (
              <Link
                href="/admin/dashboard/achievements/create"
                className="flex items-center gap-3 px-4 py-3 bg-yellow-50 rounded-xl text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition-all"
              >
                <Trophy className="w-4 h-4" />
                Tambah Prestasi
              </Link>
            )}
            {hasPermission(role, 'agendas.create') && (
              <Link
                href="/admin/dashboard/agendas/create"
                className="flex items-center gap-3 px-4 py-3 bg-cyan-50 rounded-xl text-sm font-medium text-cyan-700 hover:bg-cyan-100 transition-all"
              >
                <CalendarDays className="w-4 h-4" />
                Buat Agenda
              </Link>
            )}
            {hasPermission(role, 'users.view') && (
              <Link
                href="/admin/dashboard/users"
                className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-100 transition-all"
              >
                <Users className="w-4 h-4" />
                Kelola Pengguna ({stats.userCount})
              </Link>
            )}
            {hasPermission(role, 'comments.approve') && (
              <Link
                href="/admin/dashboard/comments"
                className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-100 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Review Komentar ({stats.pendingComments})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
