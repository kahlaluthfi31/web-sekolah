import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - list all eskul activities
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const eskulId = searchParams.get('eskulId') || ''
    const month = searchParams.get('month') || ''
    const year = searchParams.get('year') || ''

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { activityTitle: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (eskulId) {
      where.eskulId = parseInt(eskulId)
    }

    if (month) {
      const monthNum = parseInt(month)
      where.AND = where.AND || []
      ;(where.AND as Array<unknown>).push({
        activityDate: {
          gte: new Date(`${year || new Date().getFullYear()}-${String(monthNum).padStart(2, '0')}-01`),
          lt: new Date(`${year || new Date().getFullYear()}-${String(monthNum + 1).padStart(2, '0')}-01`),
        }
      })
    }

    if (year && !month) {
      where.activityDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${parseInt(year) + 1}-01-01`),
      }
    }

    const [data, total] = await Promise.all([
      prisma.eskulActivity.findMany({
        where,
        orderBy: { activityDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          eskul: {
            select: { id: true, name: true, coachName: true }
          }
        }
      }),
      prisma.eskulActivity.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/eskul-activities error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
  }
}

// POST - create new eskul activity
export async function POST(req: NextRequest) {
  try {
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

    const activity = await prisma.eskulActivity.create({
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

    return NextResponse.json({ success: true, data: activity }, { status: 201 })
  } catch (error) {
    console.error('POST /api/eskul-activities error:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat data' }, { status: 500 })
  }
}
