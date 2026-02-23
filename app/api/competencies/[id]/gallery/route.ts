import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// GET /api/competencies/[id]/gallery
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    const gallery = await prisma.competencyGallery.findMany({
      where: { competencyId: id },
      orderBy: { orderPosition: 'asc' },
    })

    return apiSuccess(gallery)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/competencies/[id]/gallery
export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const body = await request.json()
    const { imageUrl, caption, orderPosition } = body

    if (!imageUrl) {
      return apiError('URL gambar wajib diisi', 400)
    }

    const competency = await prisma.competency.findUnique({ where: { id } })
    if (!competency) {
      return apiError('Konsentrasi tidak ditemukan', 404)
    }

    const gallery = await prisma.competencyGallery.create({
      data: {
        competencyId: id,
        imageUrl,
        caption: caption || null,
        orderPosition: orderPosition ?? 0,
      },
    })

    return apiSuccess(gallery, 'Gambar berhasil ditambahkan')
  } catch (error) {
    return handleError(error)
  }
}
