import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, handleError } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await prisma.agendaCategory.findUnique({
      where: { id: parseInt(id) },
    })

    if (!data) {
      return apiError('Kategori tidak ditemukan', 404)
    }

    return apiSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.agendaCategory.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existing) {
      return apiError('Kategori tidak ditemukan', 404)
    }

    // Check duplicate name (excluding current)
    if (body.name && body.name.trim() !== existing.name) {
      const duplicate = await prisma.agendaCategory.findUnique({
        where: { name: body.name.trim() },
      })
      if (duplicate) {
        return apiError('Nama kategori sudah ada', 400)
      }
    }

    const existingWithFlag = existing as unknown as { showInCategorySection?: boolean }

    const data = await prisma.agendaCategory.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name?.trim() ?? existing.name,
        color: body.color !== undefined ? body.color : existing.color,
        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : (existing as { description?: string | null }).description ?? null,
        icon:
          body.icon !== undefined
            ? body.icon?.trim() || null
            : (existing as { icon?: string | null }).icon ?? null,
        isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
        showInCategorySection:
          body.showInCategorySection !== undefined
            ? body.showInCategorySection
            : existingWithFlag.showInCategorySection ?? true,
      },
    })

    return apiSuccess(data, 'Kategori berhasil diperbarui')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if category has agendas
    const agendaCount = await prisma.agenda.count({
      where: { categoryId: parseInt(id) },
    })

    if (agendaCount > 0) {
      return apiError(`Tidak dapat menghapus. ${agendaCount} agenda masih menggunakan kategori ini.`, 400)
    }

    await prisma.agendaCategory.delete({
      where: { id: parseInt(id) },
    })

    return apiSuccess(null, 'Kategori berhasil dihapus')
  } catch (error) {
    return handleError(error)
  }
}
