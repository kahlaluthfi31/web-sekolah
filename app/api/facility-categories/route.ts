import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

export async function GET() {
  try {
    const data = await prisma.facilityCategoryConfig.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    return apiSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name?.trim()) return apiError('Nama kategori wajib diisi', 400)
    const existing = await prisma.facilityCategoryConfig.findUnique({ where: { name: body.name.trim() } })
    if (existing) return apiError('Nama kategori sudah ada', 409)
    const data = await prisma.facilityCategoryConfig.create({
      data: {
        name: body.name.trim(),
        color: body.color || 'bg-gray-100 text-gray-600',
        isActive: body.isActive !== false,
        sortOrder: body.sortOrder || 0,
      },
    })
    return apiSuccess(data, 'Kategori berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
