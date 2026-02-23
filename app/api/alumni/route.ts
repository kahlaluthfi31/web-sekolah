import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiPagination, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const year = searchParams.get('year') || searchParams.get('graduationYear')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { alumniName: { contains: search } },
        { major: { contains: search } },
        { company: { contains: search } },
      ]
    }
    if (status) where.status = status
    if (year) where.graduationYear = parseInt(year)

    const [total, data] = await Promise.all([
      prisma.alumniSubmission.count({ where }),
      prisma.alumniSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          verifiedBy: {
            select: { id: true, name: true }
          }
        }
      }),
    ])

    return apiPagination(data, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}
