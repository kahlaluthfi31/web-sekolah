import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-response'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

const sceneUpdateSchema = z.object({
  sceneKey: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung')
    .optional(),
  title: z.string().min(2).max(255).optional(),
  imagePath: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
  isDefault: z.boolean().optional(),
})

type Params = { params: Promise<{ id: string }> }

// GET /api/virtual-tour/scenes/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const scene = await db.virtualTourScene.findUnique({
      where: { id: parseInt(id) },
      include: { hotspots: { orderBy: { id: 'asc' } } },
    })
    if (!scene) return apiError('Scene tidak ditemukan', 404)
    return apiSuccess(scene)
  } catch (e) {
    console.error(e)
    return apiError('Gagal memuat data', 500)
  }
}

// PUT /api/virtual-tour/scenes/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response
    if (!['superadmin', 'admin'].includes(auth.user.role)) return apiError('Tidak punya akses', 403)

    const { id } = await params
    const numId = parseInt(id)

    const body = await req.json()
    const parsed = sceneUpdateSchema.safeParse(body)
    if (!parsed.success) return apiError('Data tidak valid', 400, parsed.error.issues)

    const existing = await db.virtualTourScene.findUnique({ where: { id: numId } })
    if (!existing) return apiError('Scene tidak ditemukan', 404)

    // Check sceneKey uniqueness if changing
    if (parsed.data.sceneKey && parsed.data.sceneKey !== existing.sceneKey) {
      const dup = await db.virtualTourScene.findUnique({ where: { sceneKey: parsed.data.sceneKey } })
      if (dup) return apiError('Scene key sudah digunakan', 409)
    }

    // If setting as default, unset others
    if (parsed.data.isDefault) {
      await db.virtualTourScene.updateMany({ where: { id: { not: numId } }, data: { isDefault: false } })
    }

    const scene = await db.virtualTourScene.update({
      where: { id: numId },
      data: parsed.data,
      include: { hotspots: { orderBy: { id: 'asc' } } },
    })
    return apiSuccess(scene, 'Scene berhasil diperbarui')
  } catch (e) {
    console.error(e)
    return apiError('Gagal memperbarui data', 500)
  }
}

// DELETE /api/virtual-tour/scenes/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response
    if (!['superadmin', 'admin'].includes(auth.user.role)) return apiError('Tidak punya akses', 403)

    const { id } = await params
    const numId = parseInt(id)

    const existing = await db.virtualTourScene.findUnique({ where: { id: numId } })
    if (!existing) return apiError('Scene tidak ditemukan', 404)

    // Cascade deletes hotspots automatically (onDelete: Cascade in schema)
    await db.virtualTourScene.delete({ where: { id: numId } })

    return apiSuccess(null, 'Scene berhasil dihapus')
  } catch (e) {
    console.error(e)
    return apiError('Gagal menghapus data', 500)
  }
}
