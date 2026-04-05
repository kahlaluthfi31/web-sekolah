import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { trackActivity } from '@/lib/activity-logger'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const data = await prisma.partner.findUnique({ where: { id: parseInt(id) } })
    if (!data) return apiError('Not found', 404)
    return apiSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const partnerId = parseInt(id)
    const existing = await prisma.partner.findUnique({ where: { id: partnerId } })
    if (!existing) return apiError('Not found', 404)
    const body = await request.json()
    const orderPosition = Math.max(1, Number(body.orderPosition) || 1)

    const duplicate = await prisma.partner.findFirst({
      where: {
        orderPosition,
        id: { not: partnerId },
      },
      select: { id: true },
    })
    if (duplicate) {
      return apiError('Urutan mitra sudah digunakan. Gunakan angka urutan yang berbeda.', 400)
    }

    const data = await prisma.partner.update({
      where: { id: partnerId },
      data: {
        name: body.name,
        logoUrl: body.logoUrl || null,
        websiteUrl: body.websiteUrl || null,
        orderPosition,
        isActive: body.isActive ?? true,
      },
    })
    await trackActivity(request, 'UPDATE', 'partners', existing, data)
    return apiSuccess(data, 'Updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const existing = await prisma.partner.findUnique({ where: { id: parseInt(id) } })
    if (!existing) return apiError('Not found', 404)
    await prisma.partner.delete({ where: { id: parseInt(id) } })
    await trackActivity(request, 'DELETE', 'partners', existing, null)
    return apiSuccess(null, 'Deleted')
  } catch (error) {
    return handleError(error)
  }
}

