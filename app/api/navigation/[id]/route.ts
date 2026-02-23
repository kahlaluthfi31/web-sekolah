import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const { id } = await params
    const body = await request.json()
    const menu = await prisma.navigationMenu.update({
      where: { id: parseInt(id) },
      data: {
        menuName: body.menuName,
        menuUrl: body.menuUrl,
        parentId: body.parentId,
        menuType: body.menuType,
        orderPosition: body.orderPosition,
        isActive: body.isActive,
      },
    })
    return apiSuccess(menu, 'Menu updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const { id } = await params
    await prisma.navigationMenu.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Menu deleted')
  } catch (error) {
    return handleError(error)
  }
}
