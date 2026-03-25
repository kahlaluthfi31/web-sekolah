import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

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
    return apiSuccess(data, 'Kegiatan rutin diperbarui')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.routineActivity.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Kegiatan rutin dihapus')
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return apiError('Data tidak ditemukan', 404)
    }
    return handleError(error)
  }
}
