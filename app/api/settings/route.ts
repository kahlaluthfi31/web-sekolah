import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// Settings keys that admins (non-superadmin) are allowed to update
const ADMIN_ALLOWED_KEYS = ['about_video_url', 'hero_video_url']

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
    const body = await request.json()
    if (!session) return apiError('Forbidden', 403)

    const isAdminAllowed = session.role === 'admin' && ADMIN_ALLOWED_KEYS.includes(body.settingKey)
    const isSuperadmin = session.role === 'superadmin'
    if (!isSuperadmin && !isAdminAllowed) return apiError('Forbidden', 403)
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
