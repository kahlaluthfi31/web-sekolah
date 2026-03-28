import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { newsUpdateSchema } from '@/lib/validations'
import { trackActivity } from '@/lib/activity-logger'
import { getSession } from '@/lib/auth'

type Params = {
  params: Promise<{
    id: string
  }>
}

// GET /api/news/[id] - Get single news by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const newsId = parseInt(id)

    const news = await prisma.news.findUnique({
      where: { id: newsId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tags: true,
      },
    })

    if (!news) {
      return apiError('News not found', 404)
    }

    return apiSuccess(news)
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/news/[id] - Update news
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const newsId = parseInt(id)
    const body = await request.json()
    const validatedData = newsUpdateSchema.parse(body)

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!existingNews) {
      return apiError('News not found', 404)
    }

    // Extract tags if provided
    const { tags, ...newsData } = validatedData

    // Update news
    const news = await prisma.news.update({
      where: { id: newsId },
      data: {
        ...newsData,
        // Set publishedAt when transitioning to published or when missing
        publishedAt:
          validatedData.isPublished && (!existingNews.isPublished || !existingNews.publishedAt)
            ? new Date()
            : existingNews.publishedAt,
        tags: tags
          ? {
              deleteMany: {},
              create: tags.map((tag) => ({
                tagName: tag,
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
    })

    await trackActivity(request, 'UPDATE', 'news', existingNews, news)
    return apiSuccess(news, 'News updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

// PATCH /api/news/[id]?action=increment-view - Increment view counter
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const newsId = parseInt(id)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action !== 'increment-view' && action !== 'increment-share') {
      return apiError('Invalid action', 400)
    }

    const existingNews = await prisma.news.findUnique({
      where: { id: newsId },
      select: { id: true, views: true, shares: true },
    })

    if (!existingNews) {
      return apiError('News not found', 404)
    }

  const session = await getSession()
  const existingGuestId = request.cookies.get('guest_view_id')?.value
  const headerGuestId = request.headers.get('x-guest-id') || null
  const fallbackGuestId = headerGuestId || existingGuestId || crypto.randomUUID()
  const guestId = session ? null : fallbackGuestId
    const viewerKey = session ? `user:${session.id}` : `guest:${guestId}`

    if (action === 'increment-view') {
      const existingView = await prisma.newsView.findUnique({
        where: {
          newsId_viewerKey: {
            newsId,
            viewerKey,
          },
        },
        select: { id: true },
      })

      if (existingView) {
        const response = apiSuccess({ id: newsId, views: existingNews.views }, 'View already counted')
        if (!session && guestId && !existingGuestId) {
          response.cookies.set('guest_view_id', guestId, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
          })
        }
        return response
      }

      const [updated] = await prisma.$transaction([
        prisma.news.update({
          where: { id: newsId },
          data: {
            views: {
              increment: 1,
            },
          },
          select: {
            id: true,
            views: true,
          },
        }),
        prisma.newsView.create({
          data: {
            newsId,
            viewerKey,
            userId: session?.id,
            guestId: guestId || null,
          },
        }),
      ])

      const response = apiSuccess(updated, 'View count incremented')
      if (!session && guestId && !existingGuestId) {
        response.cookies.set('guest_view_id', guestId, {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
        })
      }
      return response
    }

    const existingShare = await prisma.newsShare.findUnique({
      where: {
        newsId_viewerKey: {
          newsId,
          viewerKey,
        },
      },
      select: { id: true },
    })

    if (existingShare) {
      const response = apiSuccess({ id: newsId, shares: existingNews.shares }, 'Share already counted')
      if (!session && guestId && !existingGuestId) {
        response.cookies.set('guest_view_id', guestId, {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
        })
      }
      return response
    }

    const [updatedShare] = await prisma.$transaction([
      prisma.news.update({
        where: { id: newsId },
        data: {
          shares: {
            increment: 1,
          },
        },
        select: {
          id: true,
          shares: true,
        },
      }),
      prisma.newsShare.create({
        data: {
          newsId,
          viewerKey,
          userId: session?.id,
          guestId: guestId || null,
        },
      }),
    ])

    const response = apiSuccess(updatedShare, 'Share count incremented')
    if (!session && guestId && !existingGuestId) {
      response.cookies.set('guest_view_id', guestId, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
    }
    return response
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/news/[id] - Delete news
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const newsId = parseInt(id)

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!existingNews) {
      return apiError('News not found', 404)
    }

    // Delete news (tags will be deleted automatically due to cascade)
    await prisma.news.delete({
      where: { id: newsId },
    })

    await trackActivity(request, 'DELETE', 'news', existingNews, null)

    return apiSuccess(null, 'News deleted successfully')
  } catch (error) {
    return handleError(error)
  }
}
