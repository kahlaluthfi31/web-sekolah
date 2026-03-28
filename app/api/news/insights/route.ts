import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '7')
    const safeLimit = Number.isNaN(limit) ? 5 : Math.max(1, Math.min(limit, 20))
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [popularTags, commentCounts] = await Promise.all([
      prisma.newsTag.groupBy({
        by: ['tagName'],
        _count: { tagName: true },
        orderBy: { _count: { tagName: 'desc' } },
        take: safeLimit,
      }),
      prisma.comment.groupBy({
        by: ['contentId'],
        where: {
          contentType: 'news',
          createdAt: { gte: monthStart },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: safeLimit,
      }),
    ])

    const trendingIds = commentCounts.map((row) => row.contentId)
    const trendingNews = trendingIds.length
      ? await prisma.news.findMany({
          where: {
            id: { in: trendingIds },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
            category: true,
            publishedAt: true,
            createdAt: true,
          },
        })
      : []

    const trendingMap = new Map(trendingNews.map((item) => [item.id, item]))
    const trending = commentCounts
      .map((row) => {
        const news = trendingMap.get(row.contentId)
        if (!news) return null
        return {
          ...news,
          commentCount: row._count?.id ?? 0,
        }
      })
      .filter(Boolean)

    return apiSuccess({
      popularTags: popularTags.map((tag) => ({
        name: tag.tagName,
        count: tag._count.tagName,
      })),
      trending,
    })
  } catch (error) {
    return handleError(error)
  }
}