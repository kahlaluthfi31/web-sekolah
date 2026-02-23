import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// GET /api/achievements/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const achievement = await prisma.studentAchievement.findUnique({
      where: { id: parseInt(id) },
      include: { verifiedBy: { select: { id: true, name: true } } },
    })
    if (!achievement) return apiError('Achievement not found', 404)
    return apiSuccess(achievement)
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/achievements/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const achievement = await prisma.studentAchievement.update({
      where: { id: parseInt(id) },
      data: {
        studentName: body.studentName,
        class: body.class || null,
        achievementName: body.achievementName,
        competitionName: body.competitionName || null,
        level: body.level,
        position: body.position || null,
        year: body.year ? parseInt(body.year) : null,
        competitionDate: body.competitionDate ? new Date(body.competitionDate) : null,
        photo: body.photo || null,
        certificateImage: body.certificateImage || null,
        status: body.status,
      },
    })
    return apiSuccess(achievement, 'Achievement updated')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/achievements/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.studentAchievement.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Achievement deleted')
  } catch (error) {
    return handleError(error)
  }
}
