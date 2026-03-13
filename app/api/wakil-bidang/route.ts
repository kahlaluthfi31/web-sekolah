import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { z } from 'zod'

const bidangSchema = z.object({
  name: z.string().min(1).max(255),
  orderPosition: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/wakil-bidang
export async function GET() {
  try {
    const items = await prisma.wakilBidang.findMany({
      orderBy: { orderPosition: 'asc' },
    })
    return apiSuccess(items)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/wakil-bidang
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = bidangSchema.parse(body)

    // Check unique name
    const existing = await prisma.wakilBidang.findFirst({ where: { name: { equals: data.name } } })
    if (existing) return apiError('Nama bidang sudah digunakan', 400)

    // Auto orderPosition
    if (data.orderPosition === undefined) {
      const last = await prisma.wakilBidang.findFirst({ orderBy: { orderPosition: 'desc' } })
      data.orderPosition = (last?.orderPosition ?? 0) + 1
    }

    const item = await prisma.wakilBidang.create({ data: { ...data, isActive: data.isActive ?? true } })
    return apiSuccess(item, 'Bidang berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
