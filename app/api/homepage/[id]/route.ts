import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

// PUT update hero slide or principal greeting
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const { id } = await params
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'hero') {
      const hero = await prisma.mainHero.update({
        where: { id: parseInt(id) },
        data: {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          image: data.image,
          videoUrl: data.videoUrl,
          buttonText: data.buttonText,
          buttonUrl: data.buttonUrl,
          orderPosition: data.orderPosition,
          isActive: data.isActive,
        },
      })
      return apiSuccess(hero, 'Hero slide updated')
    }

    if (type === 'greeting') {
      const greeting = await prisma.principalGreeting.update({
        where: { id: parseInt(id) },
        data: {
          title: data.title,
          content: data.content,
          principalName: data.principalName,
          principalPhoto: data.principalPhoto,
          signature: data.signature,
          isActive: data.isActive,
        },
      })
      return apiSuccess(greeting, 'Principal greeting updated')
    }

    return apiError('Invalid type', 400)
  } catch (error) {
    return handleError(error)
  }
}

// DELETE hero slide or principal greeting
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'hero') {
      await prisma.mainHero.delete({ where: { id: parseInt(id) } })
      return apiSuccess(null, 'Hero slide deleted')
    }

    if (type === 'greeting') {
      await prisma.principalGreeting.delete({ where: { id: parseInt(id) } })
      return apiSuccess(null, 'Principal greeting deleted')
    }

    return apiError('Invalid type query param', 400)
  } catch (error) {
    return handleError(error)
  }
}
