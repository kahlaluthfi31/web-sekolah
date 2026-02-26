import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

// App Router segment config — allow large uploads (50 MB)
export const maxDuration = 60 // seconds

const MAX_WIDTH = 4096
const WEBP_QUALITY = 80
const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB raw input limit

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: 'File tidak ditemukan' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Hanya JPG, PNG, WEBP, dan TIFF yang didukung untuk foto 360°.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ success: false, message: 'Ukuran file melebihi 50MB' }, { status: 400 })
    }

    // -- Server-side compression with sharp (safety net) --
    const inputBuffer = Buffer.from(await file.arrayBuffer())

    const metadata = await sharp(inputBuffer).metadata()
    const originalWidth = metadata.width ?? 0

    let pipeline = sharp(inputBuffer)

    // Resize if wider than MAX_WIDTH
    if (originalWidth > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    }

    // Convert to WebP @ quality 80
    const compressed = await pipeline
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer()

    // Save file
    const uploadDir = path.join(process.cwd(), 'public', 'assets', '360')
    await mkdir(uploadDir, { recursive: true })

    const uniqueName = `360_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webp`
    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, compressed)

    return NextResponse.json({
      success: true,
      message: 'Upload berhasil',
      data: {
        url: `/assets/360/${uniqueName}`,
        originalSize: file.size,
        compressedSize: compressed.length,
        savedPercent: Math.round((1 - compressed.length / file.size) * 100),
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Upload gagal' }, { status: 500 })
  }
}
