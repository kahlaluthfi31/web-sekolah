import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { z } from 'zod'

const principalHistoryUpdateSchema = z.object({
  teacherId: z.number().optional(),
  role: z.enum(['KEPALA_SEKOLAH', 'WAKIL_KEPALA_SEKOLAH']).optional(),
  bidang: z.string().optional().nullable(),
  startYear: z.number().min(1900).max(2100).optional(),
  endYear: z.number().min(1900).max(2100).optional().nullable(),
  endReason: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
})

type Params = { params: Promise<{ id: string }> }

// PUT /api/teachers/principal-history/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const historyId = parseInt(id)
    const body = await request.json()
    const data = principalHistoryUpdateSchema.parse(body)

    const history = await prisma.principalHistory.update({
      where: { id: historyId },
      data,
      include: { teacher: { select: { id: true, name: true } } },
    })

    return apiSuccess(history, 'Riwayat jabatan berhasil diupdate')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/teachers/principal-history/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const historyId = parseInt(id)

    const existing = await prisma.principalHistory.findUnique({ where: { id: historyId } })
    if (!existing) return apiError('Data tidak ditemukan', 404)

    await prisma.principalHistory.delete({ where: { id: historyId } })

    return apiSuccess(null, 'Riwayat jabatan berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
