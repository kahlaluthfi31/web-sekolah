import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, apiError, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
  const isActive = searchParams.get('isActive')
  const showInCategorySection = searchParams.get('showInCategorySection')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.name = { contains: search }
    }
    if (showInCategorySection !== null && showInCategorySection !== '') {
      where.showInCategorySection = showInCategorySection === 'true'
    }
    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    const [total, data] = await Promise.all([
      prisma.agendaCategory.count({ where }),
      prisma.agendaCategory.findMany({
        where,
        orderBy: { name: 'asc' },
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

    if (!body.name?.trim()) {
      return apiError('Nama kategori wajib diisi', 400)
    }

    // Check duplicate name
    const exists = await prisma.agendaCategory.findUnique({
      where: { name: body.name.trim() },
    })
    if (exists) {
      return apiError('Nama kategori sudah ada', 400)
    }

    const data = await prisma.agendaCategory.create({
      data: {
        name: body.name.trim(),
        color: body.color || null,
        description: body.description?.trim() || null,
        icon: body.icon?.trim() || null,
        isActive: body.isActive ?? true,
        showInCategorySection: body.showInCategorySection ?? true,
      },
    })

    return apiSuccess(data, 'Kategori agenda berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
