import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { z } from 'zod'

const bidangUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  orderPosition: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

type Params = { params: Promise<{ id: string }> }

// PUT /api/wakil-bidang/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const bidangId = parseInt(id)
    const body = await request.json()
    const data = bidangUpdateSchema.parse(body)

    const existing = await prisma.wakilBidang.findUnique({ where: { id: bidangId } })
    if (!existing) return apiError('Data tidak ditemukan', 404)

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const nameConflict = await prisma.wakilBidang.findFirst({ where: { name: data.name } })
      if (nameConflict) return apiError('Nama bidang sudah digunakan', 400)
    }

    const item = await prisma.wakilBidang.update({ where: { id: bidangId }, data })
    return apiSuccess(item, 'Bidang berhasil diupdate')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/wakil-bidang/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const bidangId = parseInt(id)

    const existing = await prisma.wakilBidang.findUnique({ where: { id: bidangId } })
    if (!existing) return apiError('Data tidak ditemukan', 404)

    await prisma.wakilBidang.delete({ where: { id: bidangId } })
    return apiSuccess(null, 'Bidang berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
