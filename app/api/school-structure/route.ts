import prisma from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

// GET /api/school-structure
// Returns active Guru & Staff grouped by position, ordered by Position master
export async function GET() {
  try {
    const normalizeText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')

    const getPreferredOrderIndex = (positionName: string) => {
      const normalized = normalizeText(positionName)

      if (normalized.includes('kepala sekolah')) return 0
      if (normalized.includes('wakil kepala sekolah') || normalized.includes('wakasek') || normalized.includes('waka ')) return 1
      if (normalized.includes('dewan guru') || normalized.includes('guru')) return 2
      if (normalized.includes('tata usaha') || normalized.includes('tu ') || normalized === 'tu') return 3
      if (normalized.includes('tenaga honorer') || normalized.includes('honorer')) return 4
      if (normalized.includes('penjaga sekolah') || normalized.includes('satpam') || normalized.includes('security')) return 5
      if (normalized.includes('komite')) return 6

      return -1
    }

    const [teachers, positions] = await Promise.all([
      prisma.teacher.findMany({
        where: {
          isActive: true,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          photo: true,
          position: true,
          education: true,
          nip: true,
          orderPosition: true,
        },
        orderBy: { orderPosition: 'asc' },
      }),
      prisma.position.findMany({
        where: { isActive: true },
        select: {
          name: true,
          orderPosition: true,
        },
        orderBy: { orderPosition: 'asc' },
      }),
    ])

    const positionOrderMap = new Map<string, number>(
      positions.map((position) => [position.name.trim().toLowerCase(), position.orderPosition])
    )

    // Group by position
    const grouped: Record<string, { id: number; name: string; photo: string | null; education: string | null; nip: string | null; orderPosition: number }[]> = {}

    for (const t of teachers) {
      const key = t.position?.trim() || 'Lainnya'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push({
        id: t.id,
        name: t.name,
        photo: t.photo,
        education: t.education,
        nip: t.nip,
        orderPosition: t.orderPosition,
      })
    }

    // Build ordered groups: prioritize Position master order, fallback ke orderPosition member
    const groups = Object.entries(grouped)
      .map(([positionName, members]) => {
        const normalizedPosition = normalizeText(positionName)
        const masterOrder = positionOrderMap.get(normalizedPosition)
        const fallbackOrder = Math.min(...members.map((member) => member.orderPosition))
        const preferredOrderIndex = getPreferredOrderIndex(positionName)

        return {
          positionName,
          members: [...members].sort((a, b) => a.orderPosition - b.orderPosition),
          groupOrder:
            preferredOrderIndex >= 0
              ? preferredOrderIndex
              : masterOrder ?? (1000 + fallbackOrder),
        }
      })
      .sort((a, b) => a.groupOrder - b.groupOrder)

    return apiSuccess(groups)
  } catch (error) {
    return handleError(error)
  }
}
