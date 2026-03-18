import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiPagination, apiError, handleError } from '@/lib/api-response'

// ─── Helper: hitung status berdasarkan tanggal & jam ──────────────────────────
function computeStatus(eventDate: Date | null, eventTime: Date | null): 'upcoming' | 'ongoing' | 'completed' {
  if (!eventDate) return 'upcoming'

  const [y, m, d] = [eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate()]
  const hh = eventTime ? eventTime.getUTCHours() : 0
  const mm = eventTime ? eventTime.getUTCMinutes() : 0

  const eventStartMs = new Date(y, m, d, hh, mm).getTime()
  const nowMs = Date.now()

  // Belum sampai jam mulai → upcoming
  if (nowMs < eventStartMs) return 'upcoming'

  // Sudah lewat jam mulai → minimal ongoing
  // (completed hanya bisa di-set jika ada timeEnd & sudah terlewat — ditangani di autoUpdateStatuses)
  return 'ongoing'
}

// ─── Helper: auto-update status agenda yang sudah berubah ─────────────────────
async function autoUpdateStatuses(agendas: Array<{ id: number; eventDate: Date | null; eventTime: Date | null; timeEnd: Date | null; timeEndText: string | null; status: string }>) {
  const toUpdate: Array<{ id: number; newStatus: 'upcoming' | 'ongoing' | 'completed' }> = []

  for (const agenda of agendas) {
    // Jika jam selesai tidak diketahui, status ditentukan manual oleh admin → jangan auto-update
    if (agenda.timeEndText) continue

    const base = computeStatus(agenda.eventDate, agenda.eventTime)

    let computed: 'upcoming' | 'ongoing' | 'completed' = base

    // Jika jam selesai diketahui, gunakan untuk auto-completed
    if (base === 'ongoing' && agenda.timeEnd && !agenda.timeEndText) {
      if (!agenda.eventDate) { computed = 'ongoing'; }
      else {
        const [y, m, d] = [agenda.eventDate.getUTCFullYear(), agenda.eventDate.getUTCMonth(), agenda.eventDate.getUTCDate()]
        const ehh = agenda.timeEnd.getUTCHours()
        const emm = agenda.timeEnd.getUTCMinutes()
        const eventEndMs = new Date(y, m, d, ehh, emm).getTime()
        if (Date.now() >= eventEndMs) computed = 'completed'
      }
    }

    if (agenda.status !== computed) {
      toUpdate.push({ id: agenda.id, newStatus: computed })
    }
  }

  if (toUpdate.length > 0) {
    await Promise.all(
      toUpdate.map(({ id, newStatus }) =>
        prisma.agenda.update({ where: { id }, data: { status: newStatus } })
      )
    )
  }

  return toUpdate
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const skip = (page - 1) * limit

    const isPublished = searchParams.get('isPublished')

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
      ]
    }
    if (status) where.status = status
    if (categoryId) where.categoryId = parseInt(categoryId)
    if (isPublished !== null) where.isPublished = isPublished === 'true'

    // Filter by month and year
    if (month || year) {
      const conditions: unknown[] = []
      if (year) {
        const yearNum = parseInt(year)
        conditions.push({
          eventDate: {
            gte: new Date(`${yearNum}-01-01`),
            lt: new Date(`${yearNum + 1}-01-01`),
          },
        })
      }
      if (month) {
        const monthNum = parseInt(month)
        const yearNum = year ? parseInt(year) : new Date().getFullYear()
        const startDate = new Date(yearNum, monthNum - 1, 1)
        const endDate = new Date(yearNum, monthNum, 1)
        conditions.push({
          eventDate: {
            gte: startDate,
            lt: endDate,
          },
        })
      }
      if (conditions.length > 0) {
        where.AND = conditions
      }
    }

    const [total, data] = await Promise.all([
      prisma.agenda.count({ where }),
      prisma.agenda.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, color: true },
          },
        },
        orderBy: { eventDate: 'desc' },
        skip,
        take: limit,
      }),
    ])

    // Auto-update status agenda yang sudah berubah (tanpa nunggu)
    autoUpdateStatuses(data).catch(() => {})

    // Kembalikan data dengan status yang sudah dihitung ulang (real-time)
    const dataWithComputedStatus = data.map((item) => {
      // Untuk agenda tanpa jam selesai (manual), gunakan status yang disimpan admin apa adanya
      if (item.timeEndText) return item

      const base = computeStatus(item.eventDate, item.eventTime)
      let status: string = base

      if (base === 'ongoing' && item.timeEnd && !item.timeEndText) {
        if (item.eventDate) {
          const [y, m, d] = [item.eventDate.getUTCFullYear(), item.eventDate.getUTCMonth(), item.eventDate.getUTCDate()]
          const ehh = item.timeEnd.getUTCHours()
          const emm = item.timeEnd.getUTCMinutes()
          if (Date.now() >= new Date(y, m, d, ehh, emm).getTime()) status = 'completed'
        }
      }
      if (item.timeEndText && item.status === 'completed') status = 'completed'

      return { ...item, status }
    })

    return apiPagination(dataWithComputedStatus, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title?.trim()) {
      return apiError('Judul agenda wajib diisi', 400)
    }

    // Helper to parse time safely
    const parseTime = (timeStr: string | null | undefined): Date | null => {
      if (!timeStr || timeStr.trim() === '') return null
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
      if (!timeRegex.test(timeStr.trim())) return null
      // Normalisasi ke HH:mm:ss lalu tambah "Z" agar diparse sebagai UTC
      // mencegah pergeseran jam akibat timezone lokal server
      const parts = timeStr.trim().split(':')
      const normalized = `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:${parts[2] ? parts[2].padStart(2,'0') : '00'}`
      const d = new Date(`1970-01-01T${normalized}.000Z`)
      return isNaN(d.getTime()) ? null : d
    }

    const data = await prisma.agenda.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        categoryId: body.categoryId ? parseInt(body.categoryId) : null,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventTime: parseTime(body.eventTime),
        timeEnd: parseTime(body.timeEnd),
        timeEndText: body.timeEndText || null,
        location: body.location || null,
        organizer: body.organizer || null,
        participants: body.participants || null,
        hasRegistration: body.hasRegistration === true,
        registrationUrl: body.hasRegistration ? body.registrationUrl || null : null,
        image: body.image || null,
        status: body.status || 'upcoming',
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    })
    return apiSuccess(data, 'Agenda berhasil ditambahkan', 201)
  } catch (error) {
    return handleError(error)
  }
}
