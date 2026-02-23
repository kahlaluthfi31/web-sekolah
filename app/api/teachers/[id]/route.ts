import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'
import { teacherUpdateSchema } from '@/lib/validations'

type Params = {
  params: Promise<{
    id: string
  }>
}

// GET /api/teachers/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const teacherId = parseInt(id)

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        principalHistories: { orderBy: { startYear: 'desc' } },
      },
    })

    if (!teacher) {
      return apiError('Teacher not found', 404)
    }

    return apiSuccess(teacher)
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/teachers/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const teacherId = parseInt(id)
    const body = await request.json()
    const validatedData = teacherUpdateSchema.parse(body)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = { ...validatedData }
    if (data.joinDate && typeof data.joinDate === 'string') {
      data.joinDate = new Date(data.joinDate)
    }

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data,
    })

    return apiSuccess(teacher, 'Guru berhasil diupdate')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/teachers/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const teacherId = parseInt(id)

    // Delete related principal histories first
    await prisma.principalHistory.deleteMany({ where: { teacherId } })
    await prisma.teacher.delete({ where: { id: teacherId } })

    return apiSuccess(null, 'Guru berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
