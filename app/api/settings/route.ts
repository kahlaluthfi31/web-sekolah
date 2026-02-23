import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.websiteSetting.findMany({
      orderBy: { settingKey: 'asc' },
    })
    return apiSuccess(settings)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403)

    const body = await request.json()
    const setting = await prisma.websiteSetting.upsert({
      where: { settingKey: body.settingKey },
      update: {
        settingValue: body.settingValue,
        settingType: body.settingType,
      },
      create: {
        settingKey: body.settingKey,
        settingValue: body.settingValue,
        settingType: body.settingType || 'text',
      },
    })
    return apiSuccess(setting, 'Setting saved')
  } catch (error) {
    return handleError(error)
  }
}
