import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { teacherCreateSchema } from '@/lib/validations'

function toBool(val: unknown): boolean | undefined {
  if (val === null || val === undefined || val === '') return undefined
  const str = String(val).trim().toLowerCase()
  if (['true', 'ya', 'yes', '1'].includes(str)) return true
  if (['false', 'tidak', 'no', '0'].includes(str)) return false
  return undefined
}

function normalizeStatus(val: unknown) {
  if (!val) return undefined
  const upper = String(val).trim().toUpperCase()
  if (['ACTIVE', 'RETIRED', 'RESIGNED', 'TRANSFERRED'].includes(upper)) return upper
  return undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const items = Array.isArray(body.items) ? body.items : []

    if (!items.length) return apiError('Tidak ada data untuk diimpor', 400)

  type TeacherInput = z.infer<typeof teacherCreateSchema>
  const parsed: TeacherInput[] = []
    const errors: { index: number; message: string }[] = []

    items.forEach((raw: unknown, idx: number) => {
      try {
        const rawObj = (typeof raw === 'object' && raw !== null)
          ? (raw as Record<string, unknown>)
          : {}
        const normalized = {
          ...rawObj,
          status: normalizeStatus(rawObj.status) || 'ACTIVE',
          joinDate: rawObj.joinDate ? new Date(rawObj.joinDate as string | number | Date) : undefined,
          orderPosition: rawObj.orderPosition ? Number(rawObj.orderPosition) : 0,
          isActive: toBool(rawObj.isActive),
        }

        const safe = teacherCreateSchema.parse(normalized)
        parsed.push({
          ...safe,
          joinDate: safe.joinDate ? new Date(safe.joinDate as string | Date) : undefined,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Baris tidak valid'
        errors.push({ index: idx + 1, message })
      }
    })

    if (!parsed.length) return apiError('Semua baris tidak valid', 400, errors)

    const result = await prisma.teacher.createMany({ data: parsed })

    return apiSuccess(
      { inserted: result.count, failed: errors },
      `Berhasil impor ${result.count} data guru`
    )
  } catch (error) {
    return handleError(error)
  }
}
