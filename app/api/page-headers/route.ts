import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// GET /api/page-headers          → semua header
// GET /api/page-headers?key=about → satu header by pageKey
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      const header = await prisma.pageHeader.findUnique({ where: { pageKey: key } })
      return apiSuccess(header)
    }

    const headers = await prisma.pageHeader.findMany({ orderBy: { pageKey: 'asc' } })
    return apiSuccess(headers)
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/page-headers  → upsert by pageKey
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return apiError('Unauthorized', 401)

    const body = await request.json()
    const { pageKey, title, subtitle, isActive } = body

    if (!pageKey || !title) return apiError('pageKey dan title wajib diisi', 400)

    const header = await prisma.pageHeader.upsert({
      where: { pageKey },
      update: { title, subtitle: subtitle ?? null, isActive: isActive ?? true },
      create: { pageKey, title, subtitle: subtitle ?? null, isActive: isActive ?? true },
    })
    return apiSuccess(header, 'Header berhasil disimpan')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/page-headers?key=about → hapus header by pageKey
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    if (!key) return apiError('pageKey wajib diisi', 400)

    await prisma.pageHeader.delete({ where: { pageKey: key } })
    return apiSuccess(null, 'Header berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
