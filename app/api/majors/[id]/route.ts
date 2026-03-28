import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiError, handleError } from '@/lib/api-response'
import { majorUpdateSchema } from '@/lib/validations'

type Params = { params: Promise<{ id: string }> }

// GET /api/majors/[id] - Get single major
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    const major = await prisma.major.findUnique({
      where: { id },
      include: {
        competencies: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        gallery: {
          orderBy: { orderPosition: 'asc' },
        },
      },
    })

    if (!major) {
      return NextResponse.json(apiError('Jurusan tidak ditemukan'), { status: 404 })
    }

    return NextResponse.json({ success: true, data: major })
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/majors/[id] - Update major
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const body = await request.json()
    const validatedData = majorUpdateSchema.parse(body)

    const existingMajor = await prisma.major.findUnique({ where: { id } })
    if (!existingMajor) {
      return NextResponse.json(apiError('Jurusan tidak ditemukan'), { status: 404 })
    }

    if (validatedData.code && validatedData.code !== existingMajor.code) {
      const codeExists = await prisma.major.findUnique({ where: { code: validatedData.code } })
      if (codeExists) {
        return NextResponse.json(apiError('Kode jurusan sudah digunakan'), { status: 400 })
      }
    }

    const { competencies, ...majorData } = validatedData

    // Update major fields
    await prisma.major.update({ where: { id }, data: majorData })

    // Upsert competencies to preserve IDs (and thus gallery data)
    if (competencies) {
      const incomingIds = competencies.filter(c => c.id).map(c => c.id as number)

      // Delete competencies that were removed
      await prisma.competency.deleteMany({
        where: { majorId: id, id: { notIn: incomingIds.length > 0 ? incomingIds : [-1] } },
      })

      // Upsert each competency
      for (const comp of competencies) {
        if (comp.id) {
          await prisma.competency.update({
            where: { id: comp.id },
            data: {
              name: comp.name,
              description: comp.description ?? null,
              detailType: comp.detailType ?? 'PAGE',
              externalUrl: comp.externalUrl ?? null,
              isActive: comp.isActive ?? true,
            },
          })
        } else {
          await prisma.competency.create({
            data: {
              majorId: id,
              name: comp.name,
              description: comp.description ?? null,
              detailType: comp.detailType ?? 'PAGE',
              externalUrl: comp.externalUrl ?? null,
              isActive: comp.isActive ?? true,
            },
          })
        }
      }
    }

    const major = await prisma.major.findUnique({
      where: { id },
      include: {
        competencies: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        gallery: {
          orderBy: { orderPosition: 'asc' },
        },
      },
    })

    return NextResponse.json({ success: true, data: major, message: 'Jurusan berhasil diupdate' })
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/majors/[id] - Delete major
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    const major = await prisma.major.findUnique({
      where: { id },
      include: {
        competencies: true,
        gallery: {
          orderBy: { orderPosition: 'asc' },
        },
      },
    })
    if (!major) {
      return NextResponse.json(apiError('Jurusan tidak ditemukan'), { status: 404 })
    }

    // Explicitly delete children first to avoid FK issues on MySQL
    const competencyIds = major.competencies.map(c => c.id)
    if (competencyIds.length > 0) {
      await prisma.competencyGallery.deleteMany({ where: { competencyId: { in: competencyIds } } })
      await prisma.competency.deleteMany({ where: { majorId: id } })
    }
    await prisma.majorGallery.deleteMany({ where: { majorId: id } })
    await prisma.major.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null, message: 'Jurusan berhasil dihapus' })
  } catch (error) {
    return handleError(error)
  }
}
