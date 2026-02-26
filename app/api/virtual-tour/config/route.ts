import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-response'

// GET /api/virtual-tour/config
// Returns data in Pannellum multi-scene JSON format
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scenes: any[] = await (prisma as any).virtualTourScene.findMany({
      include: {
        hotspots: { orderBy: { id: 'asc' } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })

    if (scenes.length === 0) {
      return apiSuccess({ default: { firstScene: '' }, scenes: {} })
    }

    const defaultScene = scenes.find((s: { isDefault: boolean }) => s.isDefault) ?? scenes[0]
    const scenesMap: Record<string, unknown> = {}
    const sceneKeyById = new Map(scenes.map((s: { id: number; sceneKey: string }) => [s.id, s.sceneKey]))

    for (const scene of scenes) {
      scenesMap[scene.sceneKey] = {
        title: scene.title,
        panorama: scene.imagePath,
        hotSpots: scene.hotspots.map((h: { pitch: number; yaw: number; text: string; targetSceneId: number | null }) => ({
          pitch: h.pitch,
          yaw: h.yaw,
          type: h.targetSceneId ? 'scene' : 'info',
          text: h.text,
          ...(h.targetSceneId ? { sceneId: sceneKeyById.get(h.targetSceneId) ?? '' } : {}),
        })),
      }
    }

    return apiSuccess({
      default: { firstScene: defaultScene.sceneKey },
      scenes: scenesMap,
    })
  } catch (e) {
    console.error(e)
    return apiError('Gagal memuat konfigurasi tour', 500)
  }
}
