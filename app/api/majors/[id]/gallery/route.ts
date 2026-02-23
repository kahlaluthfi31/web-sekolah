import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// GET /api/majors/[id]/gallery - Get gallery for a major
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    const gallery = await prisma.majorGallery.findMany({
      where: { majorId: id },
      orderBy: { orderPosition: 'asc' },
    })

    return NextResponse.json(apiSuccess(gallery))
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/majors/[id]/gallery - Add image to gallery
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
      return NextResponse.json(apiError('URL gambar wajib diisi'), { status: 400 })
    }

    // Check major exists
    const major = await prisma.major.findUnique({ where: { id } })
    if (!major) {
      return NextResponse.json(apiError('Jurusan tidak ditemukan'), { status: 404 })
    }

    const gallery = await prisma.majorGallery.create({
      data: {
        majorId: id,
        imageUrl,
        caption: caption || null,
        orderPosition: orderPosition ?? 0,
      },
    })

    return NextResponse.json(apiSuccess(gallery, 'Gambar berhasil ditambahkan'))
  } catch (error) {
    return handleError(error)
  }
}
