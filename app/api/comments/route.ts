import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CommentContentType } from '@prisma/client'
import { apiPagination, apiSuccess, apiError, handleError } from '@/lib/api-response'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
  const contentType = searchParams.get('contentType') as CommentContentType | null
    const contentId = searchParams.get('contentId')
    const search = searchParams.get('search')
    const mine = searchParams.get('mine') === 'true'
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
  if (contentType) where.contentType = contentType
    if (contentId) {
      const parsedContentId = parseInt(contentId)
      if (!Number.isNaN(parsedContentId)) {
        where.contentId = parsedContentId
      }
    }
    if (mine) {
      const session = await auth()
      const userId = session?.user?.id
      if (!userId) return apiError('Unauthorized', 401)
      where.userId = parseInt(userId)
    }
    if (search) {
      where.OR = [
        { commentText: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } }
      ]
    }

    const [total, data] = await Promise.all([
      prisma.comment.count({ where }),
      prisma.comment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          approvedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    // Fetch content titles (and slug for news) based on contentType and contentId
    const dataWithTitles = await Promise.all(
      data.map(async (comment) => {
        let contentTitle = ''
        let contentSlug: string | null = null
        try {
          if (comment.contentType === 'news') {
            const news = await prisma.news.findUnique({
              where: { id: comment.contentId },
              select: { title: true, slug: true }
            })
            contentTitle = news?.title || ''
            contentSlug = news?.slug || null
          } else if (comment.contentType === 'agenda') {
            const agenda = await prisma.agenda.findUnique({
              where: { id: comment.contentId },
              select: { title: true }
            })
            contentTitle = agenda?.title || ''
          } else if (comment.contentType === 'facility') {
            const facility = await prisma.facility.findUnique({
              where: { id: comment.contentId },
              select: { name: true }
            })
            contentTitle = facility?.name || ''
          }
        } catch {
          contentTitle = ''
        }
        return { ...comment, contentTitle, contentSlug }
      })
    )

    return apiPagination(dataWithTitles, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    const parsedUserId = Number(userId)
    if (!userId || !Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      return apiError('Unauthorized', 401)
    }

    const userExists = await prisma.user.findUnique({
      where: { id: parsedUserId },
      select: { id: true },
    })
    if (!userExists) return apiError('User tidak ditemukan', 404)

    const body = await request.json()
  const contentType = body?.contentType as CommentContentType | undefined
  const contentId = typeof body?.contentId === 'number' ? body.contentId : parseInt(body?.contentId)
    const commentText = String(body?.commentText || '').trim()

    if (!contentType || !commentText || Number.isNaN(contentId) || contentId <= 0) {
      return apiError('Data komentar tidak lengkap', 400)
    }

    const existing = await prisma.comment.findFirst({
      where: {
        contentType,
        contentId,
  userId: parsedUserId,
      },
    })

    if (existing) {
      const updated = await prisma.comment.update({
        where: { id: existing.id },
        data: {
          commentText,
          status: 'pending',
          approvedById: null,
          approvedAt: null,
        },
      })
      return apiSuccess(updated, 'Komentar diperbarui dan menunggu verifikasi')
    }

    const created = await prisma.comment.create({
      data: {
        contentType,
        contentId,
  userId: parsedUserId,
        commentText,
        status: 'pending',
      },
    })

    return apiSuccess(created, 'Komentar dikirim dan menunggu verifikasi')
  } catch (error) {
    return handleError(error)
  }
}

