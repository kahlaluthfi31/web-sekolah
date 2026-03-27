import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

function parseCoords(locationCoords: string | null) {
  if (!locationCoords) return { latitude: null, longitude: null }
  const [lat, lng] = locationCoords.split(',').map(part => parseFloat(part.trim()))
  const latitude = Number.isFinite(lat) ? lat : null
  const longitude = Number.isFinite(lng) ? lng : null
  return { latitude, longitude }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')
    const sourceParam = searchParams.get('source')

    const id = idParam ? parseInt(idParam) : NaN
    if (!Number.isFinite(id)) return apiError('id invalid', 400)

    const sources: Array<'activity' | 'login'> =
      sourceParam === 'activity'
        ? ['activity']
        : sourceParam === 'login'
          ? ['login']
          : ['activity', 'login']

    let record: {
      id: number
      source: 'activity' | 'login'
      action?: string | null
      ipAddress: string | null
      latitude: number | null
      longitude: number | null
      device?: string | null
      userAgent?: string | null
      createdAt: Date
    } | null = null

    if (sources.includes('activity')) {
      const activity = await prisma.activityLog.findUnique({
        where: { id },
        select: { id: true, action: true, ipAddress: true, locationCoords: true, createdAt: true },
      })
      if (activity) {
        const coords = parseCoords(activity.locationCoords)
        record = {
          id: activity.id,
          source: 'activity',
          action: activity.action,
          ipAddress: activity.ipAddress,
          latitude: coords.latitude,
          longitude: coords.longitude,
          device: null,
          userAgent: null,
          createdAt: activity.createdAt,
        }
      }
    }

    if (!record && sources.includes('login')) {
      const login = await prisma.loginActivity.findUnique({
        where: { id },
        select: { id: true, ipAddress: true, latitude: true, longitude: true, device: true, userAgent: true, createdAt: true },
      })
      if (login) {
        record = {
          id: login.id,
          source: 'login',
          action: 'LOGIN',
          ipAddress: login.ipAddress,
          latitude: login.latitude,
          longitude: login.longitude,
          device: login.device,
          userAgent: login.userAgent,
          createdAt: login.createdAt,
        }
      }
    }

    if (!record) return apiError('Log tidak ditemukan', 404)

    return apiSuccess(
      {
        ...record,
        createdAt: record.createdAt.toISOString(),
      },
      'OK'
    )
  } catch (error) {
    return handleError(error)
  }
}
