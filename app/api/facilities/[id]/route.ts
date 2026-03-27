import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { trackActivity } from '@/lib/activity-logger'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const data = await prisma.facility.findUnique({ where: { id: parseInt(id) } })
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
    const before = await prisma.facility.findUnique({ where: { id: parseInt(id) } })

    const data = await prisma.facility.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        description: body.description || null,
        category: body.category,
        image: body.image || null,
        quantity: body.quantity,
        quantityType: body.quantityType === 'kapasitas' ? 'kapasitas' : 'jumlah',
        condition: body.condition,
      },
    })

    await trackActivity(request, 'UPDATE', 'facilities', before, data)
    return apiSuccess(data, 'Updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const before = await prisma.facility.findUnique({ where: { id: parseInt(id) } })
    await prisma.facility.delete({ where: { id: parseInt(id) } })
    await trackActivity(_req, 'DELETE', 'facilities', before, null)
    return apiSuccess(null, 'Deleted')
  } catch (error) {
    return handleError(error)
  }
}
