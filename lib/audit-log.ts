import { prisma } from './prisma'
import { NextRequest } from 'next/server'
import type { Prisma } from '@prisma/client'

export type AuditAction = 'CREATE' | 'EDIT' | 'DELETE'

async function resolveClientIp(request: NextRequest): Promise<string> {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const cfConnecting = request.headers.get('cf-connecting-ip')?.trim()
  const xRealIp = request.headers.get('x-real-ip')?.trim()
  const runtimeIp = (request as unknown as { ip?: string }).ip?.trim()
  const socketIp = (request as unknown as { socket?: { remoteAddress?: string } }).socket?.remoteAddress?.trim()

  let ip = forwardedFor || cfConnecting || xRealIp || runtimeIp || socketIp || 'unknown'

  if (ip === '::1' || ip === '127.0.0.1' || ip === 'unknown') {
    try {
      const res = await fetch('https://api.ipify.org?format=json', { next: { revalidate: 60 } })
      if (res.ok) {
        const data = (await res.json()) as { ip?: string }
        if (data.ip) ip = data.ip
      }
    } catch (err) {
      console.warn('Failed to fetch public IP for localhost', err)
    }
  }

  return ip
}

async function lookupGeo(ip: string | null) {
  try {
    if (!ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
      return { latitude: null as number | null, longitude: null as number | null }
    }

    const res = await fetch(`https://ipapi.co/${ip}/json/`, { next: { revalidate: 60 * 60 } })
    if (res.ok) {
      const data = (await res.json()) as { latitude?: number; longitude?: number }
      const latitude = typeof data.latitude === 'number' ? data.latitude : null
      const longitude = typeof data.longitude === 'number' ? data.longitude : null
      if (latitude !== null && longitude !== null) return { latitude, longitude }
    }

    const res2 = await fetch(`http://ip-api.com/json/${ip}?fields=status,lat,lon`, { next: { revalidate: 60 * 60 } })
    if (!res2.ok) return { latitude: null as number | null, longitude: null as number | null }
    const data2 = (await res2.json()) as { status?: string; lat?: number; lon?: number }
    return {
      latitude: typeof data2.lat === 'number' ? data2.lat : null,
      longitude: typeof data2.lon === 'number' ? data2.lon : null,
    }
  } catch (err) {
    console.warn('Geo lookup failed', err)
    return { latitude: null as number | null, longitude: null as number | null }
  }
}

export async function recordActivityLog({
  request,
  adminEmail,
  action,
  targetTable,
  oldData,
  newData,
}: {
  request: NextRequest
  adminEmail: string
  action: AuditAction
  targetTable: string
  oldData: unknown | null
  newData: unknown | null
}) {
  try {
    const ip = await resolveClientIp(request)
    const geo = await lookupGeo(ip)
    const locationCoords = geo.latitude !== null && geo.longitude !== null
      ? `${geo.latitude},${geo.longitude}`
      : null

    const prismaAny = prisma as unknown as { activityLog: { create: (args: unknown) => Promise<void> } }
    await prismaAny.activityLog.create({
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
