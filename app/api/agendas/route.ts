import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, apiError, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
      ]
    }
    if (status) where.status = status
    if (categoryId) where.categoryId = parseInt(categoryId)

    // Filter by month and year
    if (month || year) {
      const conditions: unknown[] = []
      if (year) {
        const yearNum = parseInt(year)
        conditions.push({
          eventDate: {
            gte: new Date(`${yearNum}-01-01`),
            lt: new Date(`${yearNum + 1}-01-01`),
          },
        })
      }
      if (month) {
        const monthNum = parseInt(month)
        const yearNum = year ? parseInt(year) : new Date().getFullYear()
        const startDate = new Date(yearNum, monthNum - 1, 1)
        const endDate = new Date(yearNum, monthNum, 1)
        conditions.push({
          eventDate: {
            gte: startDate,
            lt: endDate,
          },
        })
      }
      if (conditions.length > 0) {
        where.AND = conditions
      }
    }

    const [total, data] = await Promise.all([
      prisma.agenda.count({ where }),
      prisma.agenda.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, color: true },
          },
        },
        orderBy: { eventDate: 'desc' },
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

    if (!body.title?.trim()) {
      return apiError('Judul agenda wajib diisi', 400)
    }

    // Helper to parse time safely
    const parseTime = (timeStr: string | null | undefined): Date | null => {
      if (!timeStr || timeStr.trim() === '') return null
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
      if (!timeRegex.test(timeStr.trim())) return null
      const dateStr = `1970-01-01T${timeStr.trim()}`
      const d = new Date(dateStr)
      return isNaN(d.getTime()) ? null : d
    }

    const data = await prisma.agenda.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        categoryId: body.categoryId ? parseInt(body.categoryId) : null,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventTime: parseTime(body.eventTime),
        timeEnd: parseTime(body.timeEnd),
        timeEndText: body.timeEndText || null,
        location: body.location || null,
        organizer: body.organizer || null,
        image: body.image || null,
        status: body.status || 'upcoming',
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    })
    return apiSuccess(data, 'Agenda berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
