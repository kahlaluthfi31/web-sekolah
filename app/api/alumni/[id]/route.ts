import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'
import { trackActivity } from '@/lib/activity-logger'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) return apiError('Unauthorized', 401)

    const { id } = await params
    const body = await request.json()

    const data = await prisma.alumniSubmission.update({
      where: { id: parseInt(id) },
      data: {
        status: body.status,
        verifiedById: session.id,
        verifiedAt: new Date(),
      },
    })
    await trackActivity(request, 'UPDATE', 'alumni_submissions', null, data)
    return apiSuccess(data, 'Updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  return PUT(request, { params })
}
