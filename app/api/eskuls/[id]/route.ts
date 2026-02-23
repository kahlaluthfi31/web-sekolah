import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface Params {
  params: Promise<{ id: string }>
}

// GET - single eskul
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const eskul = await prisma.eskulData.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: { select: { activities: true } }
      }
    })

    if (!eskul) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { ...eskul, activityCount: eskul._count.activities }
    })
  } catch (error) {
    console.error('GET /api/eskuls/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
  }
}

// PUT - update eskul
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, description, coachName, image, isActive } = body

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Nama eskul wajib diisi' }, { status: 400 })
    }

    // Check if name already exists for another eskul
    const existing = await prisma.eskulData.findFirst({
      where: {
        name: name.trim(),
        NOT: { id: parseInt(id) }
      }
    })
    if (existing) {
      return NextResponse.json({ success: false, message: 'Nama eskul sudah ada' }, { status: 400 })
    }

    const eskul = await prisma.eskulData.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        description: description || null,
        coachName: coachName || null,
        image: image || null,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json({ success: true, data: eskul })
  } catch (error) {
    console.error('PUT /api/eskuls/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui data' }, { status: 500 })
  }
}

// DELETE - delete eskul (cascade deletes activities)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.eskulData.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/eskuls/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 })
  }
}
