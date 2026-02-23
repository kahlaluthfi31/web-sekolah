import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiPagination, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const contentType = searchParams.get('contentType')
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (contentType) where.contentType = contentType
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

