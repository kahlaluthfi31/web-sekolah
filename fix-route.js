const fs = require('fs')

const content = `import { NextRequest, NextResponse } from 'next/server'
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
      include: { competencies: true },
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
    const major = await prisma.major.update({
      where: { id },
      data: {
        ...majorData,
        ...(competencies && {
          competencies: {
            deleteMany: {},
            create: competencies.map((comp) => ({
              name: comp.name,
              description: comp.description,
              detailType: comp.detailType ?? 'PAGE',
              externalUrl: comp.externalUrl,
              isActive: comp.isActive ?? true,
            })),
          },
        }),
      },
      include: { competencies: true },
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

    const major = await prisma.major.findUnique({ where: { id } })
    if (!major) {
      return NextResponse.json(apiError('Jurusan tidak ditemukan'), { status: 404 })
    }

    await prisma.major.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null, message: 'Jurusan berhasil dihapus' })
  } catch (error) {
    return handleError(error)
  }
}
`

fs.writeFileSync('d:/PROJEK PROJEK/website-sekolah-nextjs/app/api/majors/[id]/route.ts', content, 'utf8')
console.log('Done writing route.ts')
