import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = {
  params: Promise<{
    slug: string
  }>
}

// GET /api/news/slug/[slug] - Get single news by slug
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params

    const news = await prisma.news.findUnique({
      where: { slug },
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
