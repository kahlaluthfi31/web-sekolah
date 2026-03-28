import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, handleError, apiError } from '@/lib/api-response'
import { alumniSubmissionCreateSchema } from '@/lib/validations'
import { auth } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
  const session = await auth()
    if (!session?.user?.id) {
      return apiError('Silakan login untuk melanjutkan.', 401)
    }

    const userId = Number(session.user.id)
    if (!Number.isFinite(userId) || Number.isNaN(userId)) {
      return apiError('User tidak valid.', 400)
    }

    const existing = await prisma.alumniSubmission.findFirst({
      where: { submittedById: userId },
    })

    return apiSuccess(
      {
        hasSubmitted: Boolean(existing),
        submission: existing ?? null,
      },
      'Status pengiriman alumni',
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
  const session = await auth()
    if (!session?.user?.id) {
      return apiError('Silakan login untuk mengirim testimoni.', 401)
    }

    const userId = Number(session.user.id)
    if (!Number.isFinite(userId) || Number.isNaN(userId)) {
      return apiError('User tidak valid.', 400)
    }

    const body = await request.json()

    const existing = await prisma.alumniSubmission.findFirst({
      where: { submittedById: userId },
    })

    if (existing) {
      return apiError('Anda sudah mengirim testimoni. Terima kasih!', 409)
    }

    // Coerce graduationYear to number if provided as string
    if (body.graduationYear && typeof body.graduationYear === 'string') {
      const parsed = parseInt(body.graduationYear, 10)
      body.graduationYear = isNaN(parsed) ? undefined : parsed
    }

    const parsed = alumniSubmissionCreateSchema.safeParse({
      ...body,
      submittedById: userId,
      status: 'pending',
    })

    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return apiError(first?.message || 'Validation error', 400, parsed.error.issues)
    }

    const data = await prisma.alumniSubmission.create({
      data: parsed.data,
    })

    return apiSuccess(data, 'Submission created')
  } catch (error) {
    return handleError(error)
  }
}
