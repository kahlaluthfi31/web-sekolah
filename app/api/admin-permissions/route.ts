import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-response'

// GET /api/admin-permissions?userId=X  — get one admin's permissions
// GET /api/admin-permissions            — get all admins with their permissions
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    // Admin can only fetch their own permissions
    if (auth.user.role === 'admin') {
      if (!userId || parseInt(userId) !== auth.user.id) {
        return apiError('Tidak punya akses', 403)
      }
      const perm = await prisma.adminPermission.findUnique({
        where: { userId: auth.user.id },
      })
      return apiSuccess({ menuKeys: perm ? JSON.parse(perm.menuKeys) : null })
    }

    // Superadmin only beyond this point
    if (auth.user.role !== 'superadmin') return apiError('Tidak punya akses', 403)

    if (userId) {
      const perm = await prisma.adminPermission.findUnique({
        where: { userId: parseInt(userId) },
      })
      return apiSuccess({ menuKeys: perm ? JSON.parse(perm.menuKeys) : null })
    }

    // Return all admins with their permissions
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        adminPermission: { select: { menuKeys: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    const result = admins.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      status: a.status,
      menuKeys: a.adminPermission ? JSON.parse(a.adminPermission.menuKeys) : null,
    }))

    return apiSuccess(result)
  } catch (e) {
    console.error(e)
    return apiError('Terjadi kesalahan', 500)
  }
}

// PUT /api/admin-permissions  — upsert permissions for an admin
export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response
    if (auth.user.role !== 'superadmin') return apiError('Tidak punya akses', 403)

    const body = await req.json()
    const { userId, menuKeys } = body as { userId: number; menuKeys: string[] | null }

    if (!userId) return apiError('userId wajib diisi', 400)

    // Verify target user is admin
    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target || target.role !== 'admin') return apiError('User bukan admin', 400)

    if (menuKeys === null) {
      // null = reset to default (no custom restriction)
      await prisma.adminPermission.deleteMany({ where: { userId } })
      return apiSuccess({ message: 'Izin direset ke default' })
    }

    await prisma.adminPermission.upsert({
      where: { userId },
      update: { menuKeys: JSON.stringify(menuKeys) },
      create: { userId, menuKeys: JSON.stringify(menuKeys) },
    })

    return apiSuccess({ message: 'Hak akses berhasil diperbarui' })
  } catch (e) {
    console.error(e)
    return apiError('Terjadi kesalahan', 500)
  }
}
