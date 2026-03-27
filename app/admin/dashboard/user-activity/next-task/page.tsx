import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import TraceDashboard from "./TraceDashboard"

function parseCoords(locationCoords: string | null) {
  if (!locationCoords) return { latitude: null, longitude: null }
  const [lat, lng] = locationCoords.split(',').map(part => parseFloat(part.trim()))
  const latitude = Number.isFinite(lat) ? lat : null
  const longitude = Number.isFinite(lng) ? lng : null
  return { latitude, longitude }
}

export default async function TraceForensicPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")
  if (session.role !== "superadmin") redirect("/admin/dashboard")

  const [activityLogs, loginLogs] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, action: true, ipAddress: true, locationCoords: true, createdAt: true, adminEmail: true },
    }),
    prisma.loginActivity.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        ipAddress: true,
        latitude: true,
        longitude: true,
        device: true,
        userAgent: true,
        createdAt: true,
        loginEmail: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ])

  type TraceRecord = {
    id: number
    source: "activity" | "login"
    action: string | null
    userName: string | null
    userEmail: string | null
    ipAddress: string | null
    latitude: number | null
    longitude: number | null
    device: string | null
    userAgent: string | null
    createdAt: string
  }

  const records: TraceRecord[] = [
    ...activityLogs.map((log) => {
      const coords = parseCoords(log.locationCoords)
      return {
        id: log.id,
        source: "activity" as const,
        action: log.action,
        userName: null,
        userEmail: log.adminEmail,
        ipAddress: log.ipAddress,
        latitude: coords.latitude,
        longitude: coords.longitude,
        device: null,
        userAgent: null,
        createdAt: log.createdAt.toISOString(),
      }
    }),
    ...loginLogs.map((log) => ({
      id: log.id,
      source: "login" as const,
      action: "LOGIN" as const,
  userName: log.user?.name ?? null,
  userEmail: log.user?.email ?? log.loginEmail ?? null,
      ipAddress: log.ipAddress,
      latitude: log.latitude,
      longitude: log.longitude,
      device: log.device,
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISOString(),
    })),
  ].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))

  return <TraceDashboard initialRecords={records} />
}
