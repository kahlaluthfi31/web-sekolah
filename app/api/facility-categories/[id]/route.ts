import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    if (!body.name?.trim()) return apiError('Nama kategori wajib diisi', 400)
    const existing = await prisma.facilityCategoryConfig.findFirst({
      where: { name: body.name.trim(), NOT: { id: parseInt(id) } },
    })
    if (existing) return apiError('Nama kategori sudah ada', 409)
    const data = await prisma.facilityCategoryConfig.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name.trim(),
        color: body.color || 'bg-gray-100 text-gray-600',
        isActive: body.isActive !== false,
        sortOrder: body.sortOrder ?? 0,
      },
    })
    return apiSuccess(data, 'Kategori berhasil diperbarui')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.facilityCategoryConfig.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Kategori berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
