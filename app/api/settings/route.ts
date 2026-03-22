import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// Settings keys that admins (non-superadmin) are allowed to update
const ADMIN_ALLOWED_KEYS = [
  'about_video_url',
  'hero_video_url',
  'alumni_portal_cta_title',
  'alumni_portal_cta_subtitle',
  'alumni_portal_cta_button_text',
  'alumni_portal_cta_button_url',
  // Contact & socials
  'contact_address',
  'contact_phone_main',
  'contact_phone_alt',
  'contact_whatsapp_main',
  'contact_whatsapp_alt',
  'contact_email_main',
  'contact_email_alt',
  'contact_hours_weekday',
  'contact_hours_friday',
  'contact_hours_saturday',
  'contact_hours_sunday',
  'contact_info_title',
  'contact_info_subtitle',
  'contact_show_address',
  'contact_show_phone',
  'contact_show_whatsapp',
  'contact_show_email',
  'contact_show_social',
  'contact_show_hours',
  'social_instagram',
  'social_facebook',
  'social_youtube',
  'social_tiktok',
  'social_linkedin',
]

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

    const role = (session.role || '').toLowerCase()
    const isAdminAllowed =
      role === 'admin' && (ADMIN_ALLOWED_KEYS.includes(body.settingKey) || body.settingKey?.startsWith('social_'))
    const isSuperadmin = role === 'superadmin'
    if (!isSuperadmin && !isAdminAllowed) {
      const msg = ADMIN_ALLOWED_KEYS.includes(body.settingKey)
        ? 'Forbidden: role not allowed'
        : 'Forbidden: key not allowed'
      return apiError(msg, 403)
    }
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
