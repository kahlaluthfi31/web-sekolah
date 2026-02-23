import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { z } from 'zod'

const positionUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  orderPosition: z.number().optional(),
  isActive: z.boolean().optional(),
})

type Params = { params: Promise<{ id: string }> }

// PUT /api/positions/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const positionId = parseInt(id)
    const body = await request.json()
    const data = positionUpdateSchema.parse(body)

    const existing = await prisma.position.findUnique({ where: { id: positionId } })
    if (!existing) return apiError('Jabatan tidak ditemukan', 404)

    const position = await prisma.position.update({
      where: { id: positionId },
      data,
    })

    return apiSuccess(position, 'Jabatan berhasil diupdate')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/positions/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const positionId = parseInt(id)

    const existing = await prisma.position.findUnique({ where: { id: positionId } })
    if (!existing) return apiError('Jabatan tidak ditemukan', 404)

    // Check if any teacher is using this position
    const teacherCount = await prisma.teacher.count({
      where: { position: existing.name },
    })

    if (teacherCount > 0) {
      return apiError(`Jabatan "${existing.name}" masih digunakan oleh ${teacherCount} guru. Hapus atau ubah jabatan guru terlebih dahulu.`, 400)
    }

    await prisma.position.delete({ where: { id: positionId } })

    return apiSuccess(null, 'Jabatan berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
