import prisma from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

// GET /api/school-structure
// Returns active teachers grouped by position, ordered by orderPosition
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { isActive: true },
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
    })

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

    // Build ordered groups — use the min orderPosition of members as group order
    const groups = Object.entries(grouped).map(([positionName, members]) => ({
      positionName,
      members,
      groupOrder: Math.min(...members.map(m => m.orderPosition)),
    })).sort((a, b) => a.groupOrder - b.groupOrder)

    return apiSuccess(groups)
  } catch (error) {
    return handleError(error)
  }
}
