import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import bcrypt from 'bcryptjs'
import { trackActivity } from '@/lib/activity-logger'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, role: true, status: true, avatar: true, lastSeenAt: true, createdAt: true },
    })
    if (!user) return apiError('User not found', 404)
    return apiSuccess(user)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (!existing) return apiError('User not found', 404)

    const updateData: Record<string, unknown> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.role !== undefined) updateData.role = body.role
    if (body.status !== undefined) updateData.status = body.status
    if (body.avatar !== undefined) updateData.avatar = body.avatar || null
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 12)
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, status: true },
    })

    await trackActivity(request, 'UPDATE', 'users', existing, user)
    return apiSuccess(user, 'User updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    const existing = await prisma.user.findUnique({ where: { id: userId } })
    if (!existing) return apiError('User not found', 404)

    await prisma.$transaction(async (tx) => {
      await tx.news.updateMany({ where: { authorId: userId }, data: { authorId: null } })
      await tx.newsView.deleteMany({ where: { userId } })
      await tx.newsShare.deleteMany({ where: { userId } })

      await tx.commentLike.deleteMany({ where: { userId } })
      await tx.commentLike.deleteMany({ where: { comment: { userId } } })
      await tx.comment.updateMany({ where: { approvedById: userId }, data: { approvedById: null } })
      await tx.comment.deleteMany({ where: { userId } })

      await tx.userVerification.updateMany({ where: { verifiedById: userId }, data: { verifiedById: null } })
      await tx.userVerification.deleteMany({ where: { userId } })

      await tx.studentAchievement.updateMany({ where: { verifiedById: userId }, data: { verifiedById: null } })
      await tx.alumniSubmission.updateMany({ where: { submittedById: userId }, data: { submittedById: null } })
      await tx.alumniSubmission.updateMany({ where: { verifiedById: userId }, data: { verifiedById: null } })

      await tx.user.delete({ where: { id: userId } })
    })

    await trackActivity(_req, 'DELETE', 'users', existing, null)
    return apiSuccess(null, 'User deleted')
  } catch (error) {
    return handleError(error)
  }
}
