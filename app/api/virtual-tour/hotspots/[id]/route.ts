import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-response'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

const hotspotUpdateSchema = z.object({
  pitch: z.number().min(-90).max(90).optional(),
  yaw: z.number().min(-180).max(180).optional(),
  text: z.string().min(1).max(255).optional(),
  targetSceneId: z.number().int().positive().nullable().optional(),
})

type Params = { params: Promise<{ id: string }> }

// PUT /api/virtual-tour/hotspots/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response
    if (!['superadmin', 'admin'].includes(auth.user.role)) return apiError('Tidak punya akses', 403)

    const { id } = await params
    const numId = parseInt(id)

    const body = await req.json()
    const parsed = hotspotUpdateSchema.safeParse(body)
    if (!parsed.success) return apiError('Data tidak valid', 400, parsed.error.issues)

    const existing = await db.virtualTourHotspot.findUnique({ where: { id: numId } })
    if (!existing) return apiError('Hotspot tidak ditemukan', 404)

    if (parsed.data.targetSceneId) {
      const target = await db.virtualTourScene.findUnique({ where: { id: parsed.data.targetSceneId } })
      if (!target) return apiError('Target scene tidak ditemukan', 404)
    }

    const hotspot = await db.virtualTourHotspot.update({
      where: { id: numId },
      data: parsed.data,
    })
    return apiSuccess(hotspot, 'Hotspot berhasil diperbarui')
  } catch (e) {
    console.error(e)
    return apiError('Gagal memperbarui hotspot', 500)
  }
}

// DELETE /api/virtual-tour/hotspots/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response
    if (!['superadmin', 'admin'].includes(auth.user.role)) return apiError('Tidak punya akses', 403)

    const { id } = await params
    const numId = parseInt(id)

    const existing = await db.virtualTourHotspot.findUnique({ where: { id: numId } })
    if (!existing) return apiError('Hotspot tidak ditemukan', 404)

    await db.virtualTourHotspot.delete({ where: { id: numId } })
    return apiSuccess(null, 'Hotspot berhasil dihapus')
  } catch (e) {
    console.error(e)
    return apiError('Gagal menghapus hotspot', 500)
  }
}
