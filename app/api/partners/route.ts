import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, apiError, handleError } from '@/lib/api-response'
import { trackActivity } from '@/lib/activity-logger'

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
    const err = error as { code?: string }
    // Handle case when partners table doesn't exist yet
    if (err?.code === 'P2021') {
      console.warn('Partners table does not exist. Returning empty data.')
      return apiPagination([], 1, 20, 0)
    }
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderPosition = Math.max(1, Number(body.orderPosition) || 1)

    const duplicate = await prisma.partner.findFirst({
      where: { orderPosition },
      select: { id: true },
    })
    if (duplicate) {
      return apiError('Urutan mitra sudah digunakan. Gunakan angka urutan yang berbeda.', 400)
    }

    const data = await prisma.partner.create({
      data: {
        name: body.name,
        logoUrl: body.logoUrl || null,
        websiteUrl: body.websiteUrl || null,
        orderPosition,
        isActive: body.isActive ?? true,
      },
    })
    await trackActivity(request, 'CREATE', 'partners', null, data)
    return apiSuccess(data, 'Partner created', 201)
  } catch (error) {
    return handleError(error)
  }
}

