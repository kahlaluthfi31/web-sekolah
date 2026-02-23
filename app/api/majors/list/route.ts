import { prisma } from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

// GET /api/majors/list - Get all active majors (for dropdown)
export async function GET() {
  try {
    const majors = await prisma.major.findMany({
      where: { isActive: true },
      select: { id: true, name: true, code: true },
      orderBy: { orderPosition: 'asc' },
    })
    return apiSuccess(majors)
  } catch (error) {
    return handleError(error)
  }
}
