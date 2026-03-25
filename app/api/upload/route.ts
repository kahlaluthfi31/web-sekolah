import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, stat } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const videoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    const isImage = imageTypes.includes(file.type)
    const isVideo = videoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, message: 'Tipe file tidak didukung. Gunakan gambar (JPG, PNG, GIF, WEBP, SVG) atau video (MP4, WebM).' },
        { status: 400 }
      )
    }

    // Size guard: images 5MB, video 80MB pre-compress (recommended kompres di client juga)
    const maxSize = isVideo ? 80 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: isVideo ? 'Video terlalu besar (maks 80MB sebelum kompres). Kompres dulu lalu upload.' : 'Ukuran file melebihi 5MB' },
        { status: 400 }
      )
    }

    // Create upload directory
    const uploadDir = isVideo
      ? path.join(process.cwd(), 'public', 'videos', 'uploads')
      : path.join(process.cwd(), 'public', 'images', 'uploads')
    await mkdir(uploadDir, { recursive: true })

  // Generate unique filename
  const ext = isVideo ? (path.extname(file.name) || '.mp4') : (path.extname(file.name) || '.jpg')
    const timestamp = Date.now()
    const safeName = file.name
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
    const filename = `${timestamp}-${safeName}${ext}`

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const stats = await stat(filePath)
    const publicUrl = isVideo ? `/videos/uploads/${filename}` : `/images/uploads/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        size: stats.size,
        type: file.type,
      },
      message: 'File berhasil diupload',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Gagal mengupload file',
      },
      { status: 500 }
    )
  }
}
