import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const data = await prisma.contactMessage.findUnique({ where: { id: parseInt(id) } })
    if (!data) return apiError('Not found', 404)
    // Mark as read
    if (data.status === 'unread') {
      await prisma.contactMessage.update({ where: { id: data.id }, data: { status: 'read' } })
    }
    return apiSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    if (body.status) updateData.status = body.status
    if (body.adminReply !== undefined) {
      updateData.adminReply = body.adminReply
      updateData.repliedAt = body.repliedAt ? new Date(body.repliedAt) : new Date()
      updateData.status = 'replied'
    }
    
    const data = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: updateData,
    })
    return apiSuccess(data, 'Updated')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.contactMessage.delete({ where: { id: parseInt(id) } })
    return apiSuccess(null, 'Deleted')
  } catch (error) {
    return handleError(error)
  }
}
