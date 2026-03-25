import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const onlyActive = searchParams.get('active') === 'true'
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) where.title = { contains: search }
    if (onlyActive) where.isActive = true

    const [total, data] = await Promise.all([
      prisma.alumniEngagement.count({ where }),
      prisma.alumniEngagement.findMany({
        where,
        orderBy: { orderPosition: 'asc' },
        skip,
        take: limit,
      }),
    ])

    return apiPagination(data, page, limit, total)
  } catch (error: any) {
    if (error?.code === 'P2021') {
      console.warn('Alumni engagements table does not exist. Returning empty list.')
      return apiPagination([], 1, 20, 0)
    }
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await prisma.alumniEngagement.create({
      data: {
        title: body.title,
        description: body.description || null,
        icon: body.icon || null,
        orderPosition: body.orderPosition ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return apiSuccess(data, 'Created', 201)
  } catch (error) {
    return handleError(error)
  }
}
