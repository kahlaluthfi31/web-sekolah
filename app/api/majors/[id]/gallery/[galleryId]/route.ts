import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ galleryId: string; id: string }> }

// DELETE /api/majors/[id]/gallery/[galleryId] - Remove image from gallery
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { galleryId: gIdStr } = await params
    const galleryId = parseInt(gIdStr)

    const item = await prisma.majorGallery.findUnique({ where: { id: galleryId } })
    if (!item) {
      return NextResponse.json(apiError('Gambar tidak ditemukan'), { status: 404 })
    }

    await prisma.majorGallery.delete({ where: { id: galleryId } })

    return NextResponse.json(apiSuccess(null, 'Gambar berhasil dihapus'))
  } catch (error) {
    return handleError(error)
  }
}

// PATCH /api/majors/[id]/gallery/[galleryId] - Update caption/order
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { galleryId: gIdStr } = await params
    const galleryId = parseInt(gIdStr)
    const body = await request.json()

    const item = await prisma.majorGallery.update({
      where: { id: galleryId },
      data: {
        caption: body.caption ?? undefined,
        orderPosition: body.orderPosition ?? undefined,
      },
    })

    return NextResponse.json(apiSuccess(item, 'Gambar berhasil diupdate'))
  } catch (error) {
    return handleError(error)
  }
}
