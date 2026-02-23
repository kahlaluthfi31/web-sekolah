import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// GET all school profile sections
export async function GET() {
  try {
    const profiles = await prisma.schoolProfile.findMany({
      orderBy: [{ section: 'asc' }, { orderPosition: 'asc' }],
    })
    return apiSuccess(profiles)
  } catch (error) {
    return handleError(error)
  }
}

// POST create school profile section
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const body = await request.json()
    const profile = await prisma.schoolProfile.create({
      data: {
        section: body.section,
        title: body.title,
        content: body.content,
        videoUrl: body.videoUrl,
        image: body.image,
        orderPosition: body.orderPosition || 0,
      },
    })
    return apiSuccess(profile, 'Profile section created')
  } catch (error) {
    return handleError(error)
  }
}
