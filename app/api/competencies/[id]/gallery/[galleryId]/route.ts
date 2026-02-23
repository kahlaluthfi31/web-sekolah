import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string; galleryId: string }> }

// DELETE /api/competencies/[id]/gallery/[galleryId]
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { galleryId: gIdStr } = await params
    const galleryId = parseInt(gIdStr)

    const item = await prisma.competencyGallery.findUnique({ where: { id: galleryId } })
    if (!item) {
      return apiError('Gambar tidak ditemukan', 404)
    }

    await prisma.competencyGallery.delete({ where: { id: galleryId } })

    return apiSuccess(null, 'Gambar berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}

// PATCH /api/competencies/[id]/gallery/[galleryId]
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { galleryId: gIdStr } = await params
    const galleryId = parseInt(gIdStr)
    const body = await request.json()

    const item = await prisma.competencyGallery.update({
      where: { id: galleryId },
      data: {
        caption: body.caption ?? undefined,
        orderPosition: body.orderPosition ?? undefined,
      },
    })

    return apiSuccess(item, 'Gambar berhasil diupdate')
  } catch (error) {
    return handleError(error)
  }
}
