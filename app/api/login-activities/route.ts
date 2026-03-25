import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import type { Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(100, Math.max(5, Number(searchParams.get('limit')) || 20))
  const roleFilter = searchParams.get('role') as Role | null
  const query = searchParams.get('q')?.trim()

  const where = {
    role: roleFilter ?? undefined,
    user: query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
  }

  const [items, total] = await Promise.all([
    prisma.loginActivity.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.loginActivity.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
