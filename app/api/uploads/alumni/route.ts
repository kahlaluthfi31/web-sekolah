import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function parseDataUrl(dataUrl: string) {
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl)
  if (!match) return null
  const mime = match[1]
  const b64 = match[2]
  const buffer = Buffer.from(b64, 'base64')
  return { mime, buffer }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { file, fileName } = body as { file?: string; fileName?: string }

    if (!file || !fileName) {
      return NextResponse.json({ success: false, message: 'File tidak ditemukan.' }, { status: 400 })
    }

    const parsed = parseDataUrl(file)
    if (!parsed) {
      return NextResponse.json({ success: false, message: 'Format file tidak valid.' }, { status: 400 })
    }

    if (parsed.buffer.length > MAX_SIZE) {
      return NextResponse.json({ success: false, message: 'Ukuran file melebihi 5MB.' }, { status: 400 })
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const ext = path.extname(safeName) || '.jpg'
    const newName = `${randomUUID()}${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'alumni')
    await fs.mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, newName)
    await fs.writeFile(filePath, parsed.buffer)

    const url = `/uploads/alumni/${newName}`
    return NextResponse.json({ success: true, data: { url } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Gagal mengunggah file.' }, { status: 500 })
  }
}
