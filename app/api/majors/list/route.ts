import { prisma } from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

// GET /api/majors/list - Get all active majors (for public display)
export async function GET() {
  try {
    const majors = await prisma.major.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        image: true,
        icon: true,
        competencies: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            detailType: true,
            externalUrl: true,
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { orderPosition: 'asc' },
    })
    return apiSuccess(majors)
  } catch (error) {
    return handleError(error)
  }
}
