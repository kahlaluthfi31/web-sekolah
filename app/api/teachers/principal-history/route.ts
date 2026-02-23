import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiPagination, apiError, handleError } from '@/lib/api-response'
import { z } from 'zod'

const principalHistorySchema = z.object({
  teacherId: z.number(),
  role: z.enum(['KEPALA_SEKOLAH', 'WAKIL_KEPALA_SEKOLAH']),
  startYear: z.number().min(1900).max(2100),
  endYear: z.number().min(1900).max(2100).optional().nullable(),
  note: z.string().optional().nullable(),
})

const ROLE_LABEL: Record<string, string> = {
  KEPALA_SEKOLAH: 'Kepala Sekolah',
  WAKIL_KEPALA_SEKOLAH: 'Wakil Kepala Sekolah',
}

// GET /api/teachers/principal-history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (role) where.role = role
    if (search) {
      where.teacher = { name: { contains: search } }
    }

    const total = await prisma.principalHistory.count({ where })
    const histories = await prisma.principalHistory.findMany({
      where,
      include: { teacher: { select: { id: true, name: true, photo: true } } },
      orderBy: { startYear: 'desc' },
      skip,
      take: limit,
    })

    return apiPagination(histories, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/teachers/principal-history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = principalHistorySchema.parse(body)

    const roleLabel = ROLE_LABEL[data.role] ?? data.role
    const newEnd = data.endYear ?? null

    // Check for overlapping periods for the same role
    const overlap = await prisma.principalHistory.findFirst({
      where: {
        role: data.role,
        startYear: { lte: newEnd ?? 9999 },
        OR: [
          { endYear: null },
          { endYear: { gte: data.startYear } },
        ],
      },
      include: { teacher: { select: { name: true } } },
    })

    if (overlap) {
      const periodStr = overlap.endYear === null
        ? `${overlap.startYear} – Sekarang`
        : `${overlap.startYear} – ${overlap.endYear}`
      if (overlap.endYear === null) {
        return apiError(
          `${roleLabel} "${overlap.teacher.name}" masih aktif menjabat (${periodStr}). Edit data tersebut terlebih dahulu untuk mengisi tahun selesai sebelum menambah penerus baru.`,
          400,
        )
      }
      return apiError(
        `Periode bertabrakan dengan ${roleLabel} "${overlap.teacher.name}" (${periodStr}). Edit masa akhir periode jabatan sebelumnya, agar tidak saling tumpang tindih`,
        400,
      )
    }

    const history = await prisma.principalHistory.create({
      data,
      include: { teacher: { select: { id: true, name: true } } },
    })

    return apiSuccess(history, 'Riwayat jabatan berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
