import { prisma } from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

// GET /api/teachers/list - Get all active teachers (for dropdown)
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { isActive: true },
      select: { id: true, name: true, position: true },
      orderBy: { name: 'asc' },
    })
    return apiSuccess(teachers)
  } catch (error) {
    return handleError(error)
  }
}
