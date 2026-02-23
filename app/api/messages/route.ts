import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiPagination, handleError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } }
      ]
    }
    
    // Date filters
    if (month || year) {
      const currentYear = new Date().getFullYear()
      const filterYear = year ? parseInt(year) : currentYear
      const filterMonth = month ? parseInt(month) - 1 : 0
      
      if (month && year) {
        // Filter by specific month and year
        const startDate = new Date(filterYear, filterMonth, 1)
        const endDate = new Date(filterYear, filterMonth + 1, 0, 23, 59, 59)
        where.createdAt = { gte: startDate, lte: endDate }
      } else if (year) {
        // Filter by year only
        const startDate = new Date(filterYear, 0, 1)
        const endDate = new Date(filterYear, 11, 31, 23, 59, 59)
        where.createdAt = { gte: startDate, lte: endDate }
      } else if (month) {
        // Filter by month only (current year)
        const startDate = new Date(currentYear, filterMonth, 1)
        const endDate = new Date(currentYear, filterMonth + 1, 0, 23, 59, 59)
        where.createdAt = { gte: startDate, lte: endDate }
      }
    }

    const [total, data] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    return apiPagination(data, page, limit, total)
  } catch (error) {
    return handleError(error)
  }
}
