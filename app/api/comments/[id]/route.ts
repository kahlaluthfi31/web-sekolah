import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

// PUT /api/comments/[id] — approve/reject comment
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) return apiError('Unauthorized', 401)

    const { id } = await params
    const body = await request.json()

    const data = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        status: body.status, // 'approved' | 'rejected'
        approvedById: session.id,
        approvedAt: new Date(),
      },
    })
    return apiSuccess(data, 'Comment updated')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/comments/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    // Delete likes first, then comment
    await prisma.commentLike.deleteMany({ where: { commentId: parseInt(id) } })
    await prisma.comment.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Deleted')
  } catch (error) {
    return handleError(error)
  }
}
