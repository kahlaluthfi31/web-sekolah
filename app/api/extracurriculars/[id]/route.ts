import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const data = await prisma.extracurricular.findUnique({
      where: { id: parseInt(id) },
    })
    if (!data) return apiError('Not found', 404)
    return apiSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = await prisma.extracurricular.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        activityTitle: body.activityTitle || null,
        description: body.description || null,
        activityDate: body.activityDate ? new Date(body.activityDate) : null,
        timeStart: body.timeStart || null,
        timeEnd: body.timeEnd || null,
        coachName: body.coachName || null,
        image: body.image || null,
        isActive: body.isActive,
      },
    })
    return apiSuccess(data, 'Kegiatan ekskul berhasil diperbarui')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.extracurricular.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Kegiatan ekskul berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
