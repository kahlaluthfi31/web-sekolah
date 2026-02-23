import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const data = await prisma.agenda.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    })
    if (!data) return apiError('Agenda tidak ditemukan', 404)
    return apiSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.agenda.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existing) {
      return apiError('Agenda tidak ditemukan', 404)
    }

    // Helper to parse time safely - returns null for empty or invalid time
    const parseTime = (timeStr: string | null | undefined): Date | null => {
      if (!timeStr || timeStr.trim() === '') return null
      // Validate time format (HH:mm or HH:mm:ss)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
      if (!timeRegex.test(timeStr.trim())) return null
      const dateStr = `1970-01-01T${timeStr.trim()}`
      const d = new Date(dateStr)
      return isNaN(d.getTime()) ? null : d
    }

    // Only update eventTime if it's explicitly provided and valid, otherwise keep existing
    let eventTimeValue = existing.eventTime
    if (body.eventTime !== undefined) {
      if (body.eventTime === null || body.eventTime === '') {
        eventTimeValue = null
      } else {
        const parsed = parseTime(body.eventTime)
        if (parsed) {
          eventTimeValue = parsed
        }
        // If parsing fails, keep the existing value
      }
    }

    // Same for timeEnd
    let timeEndValue = existing.timeEnd
    if (body.timeEnd !== undefined) {
      if (body.timeEnd === null || body.timeEnd === '') {
        timeEndValue = null
      } else {
        const parsed = parseTime(body.timeEnd)
        if (parsed) {
          timeEndValue = parsed
        }
      }
    }

    const data = await prisma.agenda.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title ?? existing.title,
        description: body.description !== undefined ? body.description : existing.description,
        categoryId: body.categoryId !== undefined ? (body.categoryId ? parseInt(body.categoryId) : null) : existing.categoryId,
        eventDate: body.eventDate !== undefined ? (body.eventDate ? new Date(body.eventDate) : null) : existing.eventDate,
        eventTime: eventTimeValue,
        timeEnd: timeEndValue,
        timeEndText: body.timeEndText !== undefined ? body.timeEndText : existing.timeEndText,
        location: body.location !== undefined ? body.location : existing.location,
        organizer: body.organizer !== undefined ? body.organizer : existing.organizer,
        image: body.image !== undefined ? body.image : existing.image,
        status: body.status ?? existing.status,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    })
    return apiSuccess(data, 'Agenda berhasil diperbarui')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.agenda.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Agenda berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
