import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - list all eskul data
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || '' // 'active' | 'inactive' | ''

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { coachName: { contains: search } },
      ]
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    const [data, total] = await Promise.all([
      prisma.eskulData.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { activities: true }
          }
        }
      }),
      prisma.eskulData.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: data.map(d => ({
        ...d,
        activityCount: d._count.activities
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/eskuls error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
  }
}

// POST - create new eskul
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, coachName, image, isActive } = body

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Nama eskul wajib diisi' }, { status: 400 })
    }

    // Check if name already exists
    const existing = await prisma.eskulData.findUnique({ where: { name: name.trim() } })
    if (existing) {
      return NextResponse.json({ success: false, message: 'Nama eskul sudah ada' }, { status: 400 })
    }

    const eskul = await prisma.eskulData.create({
      data: {
        name: name.trim(),
        description: description || null,
        coachName: coachName || null,
        image: image || null,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json({ success: true, data: eskul }, { status: 201 })
  } catch (error) {
    console.error('POST /api/eskuls error:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat data' }, { status: 500 })
  }
}
