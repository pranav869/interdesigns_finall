import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CATEGORY_DIR_MAP: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  retail: 'Retail',
  'modular-kitchen': 'Modular Kitchen',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params
  // segments: [category, ...folderNames, filename]
  if (segments.length < 3) {
    return new NextResponse('Not found', { status: 404 })
  }

  const [category, ...rest] = segments
  const filename = rest[rest.length - 1]
  const folderSegments = rest.slice(0, -1)

  const categoryDir = CATEGORY_DIR_MAP[category]
  if (!categoryDir) return new NextResponse('Not found', { status: 404 })

  const EXTRACTED_ROOT = path.join(process.cwd(), 'final projects', 'Extracted')
  const filePath = path.join(EXTRACTED_ROOT, categoryDir, ...folderSegments, filename)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath)
  const ext = path.extname(filename).toLowerCase()
  const contentTypeMap: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  }
  const contentType = contentTypeMap[ext] ?? 'application/octet-stream'

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
