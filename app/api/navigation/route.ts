import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const menus = await prisma.navigationMenu.findMany({
      orderBy: [{ parentId: 'asc' }, { orderPosition: 'asc' }],
    })
    return apiSuccess(menus)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const body = await request.json()
    const menu = await prisma.navigationMenu.create({
      data: {
        menuName: body.menuName,
        menuUrl: body.menuUrl,
        parentId: body.parentId || null,
        menuType: body.menuType || 'internal',
        orderPosition: body.orderPosition || 0,
        isActive: body.isActive ?? true,
      },
    })
    return apiSuccess(menu, 'Menu created')
  } catch (error) {
    return handleError(error)
  }
}
