import { prisma } from '@/lib/prisma'
import { apiSuccess, handleError } from '@/lib/api-response'

export async function GET() {
  try {
    // Ambil semua tahun lulusan yang unik dari data alumni
    const years = await prisma.alumniSubmission.findMany({
      select: {
        graduationYear: true
      },
      distinct: ['graduationYear'],
      orderBy: {
        graduationYear: 'desc'
      }
    })

    // Extract hanya nilai tahunnya
    const yearList = years.map(item => item.graduationYear)

    return apiSuccess(yearList, 'Daftar tahun lulusan berhasil diambil')
  } catch (error) {
    return handleError(error)
  }
}
