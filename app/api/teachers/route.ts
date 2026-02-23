import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiPagination, handleError } from '@/lib/api-response'
import { teacherCreateSchema } from '@/lib/validations'

// GET /api/teachers - Get all teachers with pagination & filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = all ? 10000 : parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const position = searchParams.get('position')
    const education = searchParams.get('education')

    const skip = all ? 0 : (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (status) where.status = status
    if (position) where.position = { contains: position }
    if (education) where.education = education

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nip: { contains: search } },
        { position: { contains: search } },
      ]
    }

    const total = await prisma.teacher.count({ where })

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        principalHistories: {
          orderBy: { startYear: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    return apiPagination(teachers, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/teachers - Create new teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = teacherCreateSchema.parse(body)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = { ...validatedData }
    if (data.joinDate && typeof data.joinDate === 'string') {
      data.joinDate = new Date(data.joinDate)
    }

    const teacher = await prisma.teacher.create({ data })

    return apiSuccess(teacher, 'Guru berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
