import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-response'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

const hotspotSchema = z.object({
  sceneId: z.number().int().positive(),
  pitch: z.number().min(-90).max(90),
  yaw: z.number().min(-180).max(180),
  text: z.string().min(1).max(255),
  targetSceneId: z.number().int().positive().nullable().optional(),
})

// POST /api/virtual-tour/hotspots
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response
    if (!['superadmin', 'admin'].includes(auth.user.role)) return apiError('Tidak punya akses', 403)

    const body = await req.json()
    const parsed = hotspotSchema.safeParse(body)
    if (!parsed.success) return apiError('Data tidak valid', 400, parsed.error.issues)

    const { sceneId, pitch, yaw, text, targetSceneId } = parsed.data

    // Verify scene exists
    const scene = await db.virtualTourScene.findUnique({ where: { id: sceneId } })
    if (!scene) return apiError('Scene tidak ditemukan', 404)

    // Verify target scene exists (if provided)
    if (targetSceneId) {
      const target = await db.virtualTourScene.findUnique({ where: { id: targetSceneId } })
      if (!target) return apiError('Target scene tidak ditemukan', 404)
    }

    const hotspot = await db.virtualTourHotspot.create({
      data: { sceneId, pitch, yaw, text, targetSceneId: targetSceneId ?? null },
    })

    return apiSuccess(hotspot, 'Hotspot berhasil ditambahkan', 201)
  } catch (e) {
    console.error(e)
    return apiError('Gagal menyimpan hotspot', 500)
  }
}
