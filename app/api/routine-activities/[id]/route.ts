import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { trackActivity } from '@/lib/activity-logger'

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = await prisma.routineActivity.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        days: body.days ?? null,
        time: body.time ?? null,
        description: body.description ?? null,
        icon: body.icon ?? null,
        orderPosition: body.orderPosition ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    await trackActivity(request, 'UPDATE', 'routine_activities', null, data)
    return apiSuccess(data, 'Kegiatan rutin diperbarui')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const existing = await prisma.routineActivity.findUnique({ where: { id: parseInt(id) } })
    if (!existing) return apiError('Data tidak ditemukan', 404)

    await prisma.routineActivity.delete({ where: { id: parseInt(id) } })
    await trackActivity(request, 'DELETE', 'routine_activities', existing, null)
    return apiSuccess(null, 'Kegiatan rutin dihapus')
  } catch (error) {
    const err = error as { code?: string }
    if (err?.code === 'P2025') {
      return apiError('Data tidak ditemukan', 404)
    }
    return handleError(error)
  }
}
