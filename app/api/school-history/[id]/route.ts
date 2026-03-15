import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// PUT /api/school-history/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return apiError('Unauthorized', 401)

    const { id } = await params
    const body = await request.json()
    const { year, title, description, sortOrder } = body

    const item = await prisma.schoolHistory.update({
      where: { id: Number(id) },
      data: {
        ...(year !== undefined && { year: String(year) }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    })
    return apiSuccess(item, 'Sejarah berhasil diperbarui')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/school-history/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return apiError('Unauthorized', 401)

    const { id } = await params
    await prisma.schoolHistory.delete({ where: { id: Number(id) } })
    return apiSuccess(null, 'Sejarah berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
