import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const data = await prisma.alumniEngagement.findUnique({ where: { id: parseInt(id) } })
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
    const data = await prisma.alumniEngagement.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description || null,
        icon: body.icon || null,
        orderPosition: body.orderPosition ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return apiSuccess(data, 'Updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.alumniEngagement.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Deleted')
  } catch (error) {
    return handleError(error)
  }
}
