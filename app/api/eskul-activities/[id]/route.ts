import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface Params {
  params: Promise<{ id: string }>
}

// GET - single activity
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const activity = await prisma.eskulActivity.findUnique({
      where: { id: parseInt(id) },
      include: {
        eskul: { select: { id: true, name: true, coachName: true } }
      }
    })

    if (!activity) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: activity })
  } catch (error) {
    console.error('GET /api/eskul-activities/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
  }
}

// PUT - update activity
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const { eskulId, activityTitle, description, activityDate, image } = body

    if (!eskulId) {
      return NextResponse.json({ success: false, message: 'Pilih eskul terlebih dahulu' }, { status: 400 })
    }

    if (!activityTitle?.trim()) {
      return NextResponse.json({ success: false, message: 'Judul kegiatan wajib diisi' }, { status: 400 })
    }

    if (!activityDate) {
      return NextResponse.json({ success: false, message: 'Tanggal kegiatan wajib diisi' }, { status: 400 })
    }

    const activity = await prisma.eskulActivity.update({
      where: { id: parseInt(id) },
      data: {
        eskulId: parseInt(eskulId),
        activityTitle: activityTitle.trim(),
        description: description || null,
        activityDate: new Date(activityDate),
        image: image || null,
      },
      include: {
        eskul: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json({ success: true, data: activity })
  } catch (error) {
    console.error('PUT /api/eskul-activities/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui data' }, { status: 500 })
  }
}

// DELETE - delete activity
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.eskulActivity.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/eskul-activities/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 })
  }
}
