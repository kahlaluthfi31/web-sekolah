import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) where.name = { contains: search }
    if (category) where.category = category

    const [total, data] = await Promise.all([
      prisma.facility.count({ where }),
      prisma.facility.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    ])

    return apiPagination(data, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await prisma.facility.create({
      data: {
        name: body.name,
        description: body.description || null,
        category: body.category,
        image: body.image || null,
        quantity: body.quantity || 1,
        condition: body.condition || 'good',
      },
    })
    return apiSuccess(data, 'Facility created', 201)
  } catch (error) {
    return handleError(error)
  }
}
