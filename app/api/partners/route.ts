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
    if (search) where.name = { contains: search }
    if (onlyActive) where.isActive = true

    const [total, data] = await Promise.all([
      prisma.partner.count({ where }),
      prisma.partner.findMany({
        where,
        orderBy: { orderPosition: 'asc' },
        skip,
        take: limit,
      }),
    ])

    return apiPagination(data, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await prisma.partner.create({
      data: {
        name: body.name,
        logoUrl: body.logoUrl || null,
        websiteUrl: body.websiteUrl || null,
        orderPosition: body.orderPosition ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return apiSuccess(data, 'Partner created', 201)
  } catch (error) {
    return handleError(error)
  }
}

