import { prisma } from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

export async function GET() {
  try {
    const data = await prisma.agendaCategory.findMany({
      where: { isActive: true, showInCategorySection: true },
      select: {
        id: true,
        name: true,
        color: true,
        description: true,
        icon: true,
        isActive: true,
        showInCategorySection: true,
      },
      orderBy: { name: 'asc' },
    })

    return apiSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}
