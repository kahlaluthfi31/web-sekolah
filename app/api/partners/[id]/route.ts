import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

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
    const body = await request.json()
    const data = await prisma.partner.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        logoUrl: body.logoUrl || null,
        websiteUrl: body.websiteUrl || null,
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
    await prisma.partner.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Deleted')
  } catch (error) {
    return handleError(error)
  }
}

