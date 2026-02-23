import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - list active eskul for dropdown
export async function GET() {
  try {
    const data = await prisma.eskulData.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        coachName: true,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/eskuls/list error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
  }
}
