import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiPagination, handleError } from '@/lib/api-response'
import { z } from 'zod'

const positionSchema = z.object({
  name: z.string().min(1, 'Nama jabatan wajib diisi').max(255),
  description: z.string().optional().nullable(),
  orderPosition: z.number().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/positions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const all = searchParams.get('all') // if ?all=true, return all without pagination

    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (search) {
      where.name = { contains: search }
    }

    if (all === 'true') {
      const positions = await prisma.position.findMany({
        where,
        orderBy: { orderPosition: 'asc' },
      })
      return apiSuccess(positions)
    }

    const total = await prisma.position.count({ where })
    const positions = await prisma.position.findMany({
      where,
      orderBy: { orderPosition: 'asc' },
      skip,
      take: limit,
    })

    return apiPagination(positions, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/positions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = positionSchema.parse(body)

    const position = await prisma.position.create({ data })

    return apiSuccess(position, 'Jabatan berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
