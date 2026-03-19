import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiPagination, handleError } from '@/lib/api-response'
import { newsCreateSchema } from '@/lib/validations'
import { getSession } from '@/lib/auth'

// GET /api/news - Get all news with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const published = searchParams.get('published')

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (category) {
      where.category = category
    }
    
    if (published === 'true') {
      where.isPublished = true
    } else if (published === 'false') {
      where.isPublished = false
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // Get total count
    const total = await prisma.news.count({ where })

    // Get news with pagination
    const news = await prisma.news.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    return apiPagination(news, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/news - Create new news
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const body = await request.json()
    const validatedData = newsCreateSchema.parse(body)

    // Extract tags if provided
    const { tags, ...newsData } = validatedData

    // Set authorId from session if logged in
    if (session) {
      newsData.authorId = session.id
    }

    // Create news with tags
    const news = await prisma.news.create({
      data: {
        ...newsData,
        // Simpan waktu publish hanya saat status publish (draft = null)
        publishedAt: newsData.isPublished ? new Date() : null,
        tags: tags
          ? {
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

    return apiSuccess(news, 'News created successfully', 201)
  } catch (error) {
    return handleError(error)
  }
}
