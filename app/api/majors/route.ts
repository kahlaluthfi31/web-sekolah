import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiPagination, handleError } from '@/lib/api-response'
import { majorCreateSchema } from '@/lib/validations'

// GET /api/majors - Get all majors with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Get total count
    const total = await prisma.major.count({ where })

    // Get majors with counts
    const majors = await prisma.major.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            competencies: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return apiPagination(majors, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/majors - Create new major
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = majorCreateSchema.parse(body)

    // Check if code already exists
    if (validatedData.code) {
      const existingMajor = await prisma.major.findUnique({
        where: { code: validatedData.code },
      })

      if (existingMajor) {
        return NextResponse.json(
          apiError('Kode jurusan sudah digunakan'),
          { status: 400 }
        )
      }
    }

    // Create major with competencies
    const { competencies, ...majorData } = validatedData

    const major = await prisma.major.create({
      data: {
        ...majorData,
        competencies: competencies
          ? {
              create: competencies.map((comp) => ({
                name: comp.name,
                description: comp.description,
                detailType: comp.detailType ?? 'PAGE',
                externalUrl: comp.externalUrl,
                isActive: comp.isActive ?? true,
              })),
            }
          : undefined,
      },
      include: {
        competencies: true,
      },
    })

    return apiSuccess(major, 'Jurusan berhasil ditambahkan')
  } catch (error) {
    return handleError(error)
  }
}
