import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// GET all school profile sections
// ?section=visi_misi → filter by section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') as 'sejarah' | 'visi_misi' | 'keunggulan' | null

    const profiles = await prisma.schoolProfile.findMany({
      where: section ? { section } : undefined,
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
