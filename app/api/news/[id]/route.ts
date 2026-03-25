import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { newsUpdateSchema } from '@/lib/validations'
import { trackActivity } from '@/lib/activity-logger'

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
