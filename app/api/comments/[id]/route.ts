import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'
import { auth } from '@/app/api/auth/[...nextauth]/route'

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
    const session = await auth()
    const userId = Number(session?.user?.id)
    if (!session?.user?.id || !Number.isInteger(userId) || userId <= 0) {
      return apiError('Unauthorized', 401)
    }

    const commentId = parseInt(id)
    if (!Number.isInteger(commentId) || commentId <= 0) {
      return apiError('ID komentar tidak valid', 400)
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    })

    if (!existing) {
      return apiError('Komentar tidak ditemukan', 404)
    }

    if (existing.userId !== userId) {
      return apiError('Forbidden', 403)
    }

    // Delete likes first, then comment
    await prisma.commentLike.deleteMany({ where: { commentId } })
    await prisma.comment.delete({ where: { id: commentId } })
    return apiSuccess(null, 'Deleted')
  } catch (error) {
    return handleError(error)
  }
}
