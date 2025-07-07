import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
}

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: '파일이 없습니다.' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse(
        JSON.stringify({ error: '파일 크기는 500MB를 초과할 수 없습니다.' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // 파일 타입 검증
    const fileType = file.type
    if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      return new NextResponse(
        JSON.stringify({ error: '이미지 또는 비디오 파일만 업로드 가능합니다.' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // 비디오 파일 추가 검증
    if (fileType.startsWith('video/')) {
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'] // MOV 형식 추가
      if (!allowedVideoTypes.includes(fileType)) {
        return new NextResponse(
          JSON.stringify({ error: 'MP4, WebM, MOV 형식의 비디오만 업로드 가능합니다.' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // 이미지 파일 추가 검증
    if (fileType.startsWith('image/')) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedImageTypes.includes(fileType)) {
        return new NextResponse(
          JSON.stringify({ error: 'JPG, PNG, GIF, WebP 형식의 이미지만 업로드 가능합니다.' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // 파일 저장 경로 설정
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const mediaType = fileType.startsWith('image/') ? 'images' : 'videos'
    const uploadDir = join(process.cwd(), 'public', 'uploads', mediaType)
    const relativePath = `/uploads/${mediaType}/${filename}`
    const absolutePath = join(uploadDir, filename)

    // 업로드 디렉토리 생성
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 파일 저장
    await writeFile(absolutePath, buffer)

    return new NextResponse(
      JSON.stringify({ url: relativePath }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return new NextResponse(
      JSON.stringify({ error: '파일 업로드 중 오류가 발생했습니다.' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 