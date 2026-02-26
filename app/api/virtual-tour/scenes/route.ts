import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-response'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

const sceneSchema = z.object({
  sceneKey: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung'),
  title: z.string().min(2).max(255),
  imagePath: z.string().min(1),
  sortOrder: z.number().int().default(0),
  isDefault: z.boolean().default(false),
})

// GET /api/virtual-tour/scenes
export async function GET() {
  try {
    const scenes = await db.virtualTourScene.findMany({
      include: {
        hotspots: {
          orderBy: { id: 'asc' },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return apiSuccess(scenes)
  } catch (e) {
    console.error(e)
    return apiError('Gagal memuat data', 500)
  }
}

// POST /api/virtual-tour/scenes
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response
    if (!['superadmin', 'admin'].includes(auth.user.role)) return apiError('Tidak punya akses', 403)

    const body = await req.json()
    const parsed = sceneSchema.safeParse(body)
    if (!parsed.success) return apiError('Data tidak valid', 400, parsed.error.issues)

    const { sceneKey, title, imagePath, sortOrder, isDefault } = parsed.data

    // Ensure sceneKey unique
    const existing = await db.virtualTourScene.findUnique({ where: { sceneKey } })
    if (existing) return apiError('Scene key sudah digunakan', 409)

    // If isDefault, unset previous default
    if (isDefault) {
      await db.virtualTourScene.updateMany({ data: { isDefault: false } })
    }

    const scene = await db.virtualTourScene.create({
      data: { sceneKey, title, imagePath, sortOrder, isDefault },
      include: { hotspots: true },
    })

    return apiSuccess(scene, 'Scene berhasil ditambahkan', 201)
  } catch (e) {
    console.error(e)
    return apiError('Gagal menyimpan data', 500)
  }
}
