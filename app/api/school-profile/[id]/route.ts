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
    const profile = await prisma.schoolProfile.update({
      where: { id: parseInt(id) },
      data: {
        section: body.section,
        title: body.title,
        content: body.content,
        videoUrl: body.videoUrl,
        image: body.image,
        orderPosition: body.orderPosition,
      },
    })
    return apiSuccess(profile, 'Profile section updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const { id } = await params
    await prisma.schoolProfile.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Profile section deleted')
  } catch (error) {
    return handleError(error)
  }
}
