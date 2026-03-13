import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// GET /api/school-history
export async function GET() {
  try {
    const items = await prisma.schoolHistory.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return apiSuccess(items)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/school-history
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return apiError('Unauthorized', 401)

    const body = await request.json()
    const { year, title, description, sortOrder } = body

    if (!year || !title || !description) {
      return apiError('year, title, dan description wajib diisi', 400)
    }

    const item = await prisma.schoolHistory.create({
      data: {
        year: String(year),
        title,
        description,
        sortOrder: sortOrder ?? 0,
      },
    })
    return apiSuccess(item, 'Sejarah berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
