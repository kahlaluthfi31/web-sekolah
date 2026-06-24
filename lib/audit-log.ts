import { prisma } from './prisma'
import { NextRequest } from 'next/server'
import type { Prisma } from '@prisma/client'
import { getClientIp, lookupGeo } from './resolve-ip'

export type AuditAction = 'CREATE' | 'EDIT' | 'DELETE'

export async function recordActivityLog({
  request,
  adminEmail,
  userId,
  action,
  targetTable,
  oldData,
  newData,
}: {
  request?: NextRequest
  adminEmail: string
  userId?: number
  action: AuditAction
  targetTable: string
  oldData: unknown | null
  newData: unknown | null
}) {
  try {
    // Prefer latest login activity for this user to reuse accurate IP/coords
    let ip: string | null = null
    let latitude: number | null = null
    let longitude: number | null = null

    if (userId) {
      const latestLogin = await prisma.loginActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { ipAddress: true, latitude: true, longitude: true },
      })
      ip = latestLogin?.ipAddress ?? null
      latitude = latestLogin?.latitude ?? null
      longitude = latestLogin?.longitude ?? null
    }

    if (!ip) {
      ip = await getClientIp()
    }

    if (latitude === null || longitude === null) {
      const geo = await lookupGeo(ip)
      latitude = geo.latitude
      longitude = geo.longitude
    }

  const latRounded = latitude !== null ? Number(latitude.toFixed(4)) : null
  const lonRounded = longitude !== null ? Number(longitude.toFixed(4)) : null
  const locationCoords = latRounded !== null && lonRounded !== null ? `${latRounded},${lonRounded}` : null

    await prisma.activityLog.create({
      data: {
        adminEmail,
        action,
        targetTable,
        oldData: oldData as Prisma.InputJsonValue,
        newData: newData as Prisma.InputJsonValue,
        ipAddress: ip,
        locationCoords,
      },
    })
  } catch (err) {
    console.error('Failed to record activity log', err)
  }
}
