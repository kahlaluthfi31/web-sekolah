import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, handleError } from '@/lib/api-response'

// GET /api/achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const level = searchParams.get('level')
    const status = searchParams.get('status')
    const classFilter = searchParams.get('class')
    const year = searchParams.get('year')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { studentName: { contains: search } },
        { achievementName: { contains: search } },
        { competitionName: { contains: search } },
      ]
    }
    if (level === '_lainnya') {
      where.level = { notIn: ['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional'] }
    } else if (level) {
      where.level = level
    }
    if (status) where.status = status
    const majorFilter = searchParams.get('major')
    if (classFilter && majorFilter) {
      where.AND = [
        { class: { startsWith: classFilter } },
        { class: { contains: majorFilter } },
      ]
    } else if (classFilter) {
      where.class = { startsWith: classFilter }
    } else if (majorFilter) {
      where.class = { contains: majorFilter }
    }
    if (year) where.year = parseInt(year)

    const [total, achievements] = await Promise.all([
      prisma.studentAchievement.count({ where }),
      prisma.studentAchievement.findMany({
        where,
        include: { verifiedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    return apiPagination(achievements, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/achievements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const achievement = await prisma.studentAchievement.create({
      data: {
        studentName: body.studentName,
        class: body.class || null,
        achievementName: body.achievementName,
        competitionName: body.competitionName || null,
        level: body.level,
        position: body.position || null,
        year: body.year ? parseInt(body.year) : null,
        competitionDate: body.competitionDate ? new Date(body.competitionDate) : null,
        photo: body.photo || null,
        certificateImage: body.certificateImage || null,
        status: body.status || 'approved',
      },
    })
    return apiSuccess(achievement, 'Achievement created', 201)
  } catch (error) {
    return handleError(error)
  }
}
