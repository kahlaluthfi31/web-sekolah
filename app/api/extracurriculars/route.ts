import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, handleError } from '@/lib/api-response'

// GET /api/extracurriculars
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const eskulName = searchParams.get('eskulName')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { activityTitle: { contains: search } },
        { coachName: { contains: search } },
        { description: { contains: search } },
      ]
    }
    if (eskulName) {
      where.name = eskulName
    }
    if (year) {
      const y = parseInt(year)
      const startDate = new Date(y, month ? parseInt(month) - 1 : 0, 1)
      const endDate = month
        ? new Date(y, parseInt(month), 1)
        : new Date(y + 1, 0, 1)
      where.activityDate = { gte: startDate, lt: endDate }
    } else if (month) {
      const currentYear = new Date().getFullYear()
      const m = parseInt(month)
      where.activityDate = {
        gte: new Date(currentYear, m - 1, 1),
        lt: new Date(currentYear, m, 1),
      }
    }

    const [total, data] = await Promise.all([
      prisma.extracurricular.count({ where }),
      prisma.extracurricular.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    return apiPagination(data, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/extracurriculars
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await prisma.extracurricular.create({
      data: {
        name: body.name,
        activityTitle: body.activityTitle || null,
        description: body.description || null,
        activityDate: body.activityDate ? new Date(body.activityDate) : null,
        timeStart: body.timeStart || null,
        timeEnd: body.timeEnd || null,
        coachName: body.coachName || null,
        image: body.image || null,
        isActive: body.isActive ?? true,
      },
    })
    return apiSuccess(data, 'Kegiatan ekskul berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
