import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// GET all homepage data (hero slides + principal greeting)
export async function GET() {
  try {
    const [heroes, greeting] = await Promise.all([
      prisma.mainHero.findMany({ orderBy: { orderPosition: 'asc' } }),
      prisma.principalGreeting.findFirst({ where: { isActive: true } }),
    ])
    return apiSuccess({ heroes, greeting })
  } catch (error) {
    return handleError(error)
  }
}

// POST create hero slide or principal greeting
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const body = await request.json()
    const { type, ...data } = body

    if (type === 'hero') {
      const hero = await prisma.mainHero.create({
        data: {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          image: data.image,
          videoUrl: data.videoUrl,
          buttonText: data.buttonText,
          buttonUrl: data.buttonUrl,
          orderPosition: data.orderPosition || 0,
          isActive: data.isActive ?? true,
        },
      })
      return apiSuccess(hero, 'Hero slide created')
    }

    if (type === 'greeting') {
      const greeting = await prisma.principalGreeting.create({
        data: {
          title: data.title,
          content: data.content,
          principalName: data.principalName,
          principalPhoto: data.principalPhoto,
          signature: data.signature,
          isActive: data.isActive ?? true,
        },
      })
      return apiSuccess(greeting, 'Principal greeting created')
    }

    return apiError('Invalid type. Use "hero" or "greeting"', 400)
  } catch (error) {
    return handleError(error)
  }
}
