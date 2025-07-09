import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
}

export async function OPTIONS() {
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
    }
  )
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const createErrorResponse = (message: string, status: number = 400) => {
  console.error('Upload error:', message)
  return NextResponse.json(
    { success: false, error: message },
    {
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      }
    }
  )
}

const createSuccessResponse = (data: any) => {
  return NextResponse.json(
    { success: true, ...data },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      }
    }
  )
}

export async function POST(request: NextRequest) {
  console.log('Upload request received')
  
  try {
    if (!request.body) {
      console.error('No request body')
      return createErrorResponse('요청 본문이 없습니다.')
    }

    const contentType = request.headers.get('content-type')
    console.log('Content-Type:', contentType)
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      console.error('Invalid content type:', contentType)
      return createErrorResponse(`잘못된 Content-Type입니다: ${contentType}`)
    }

    let formData: FormData
    try {
      formData = await request.formData()
      console.log('FormData parsed successfully')
      console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => {
        if (value instanceof File) {
          return [key, { name: value.name, type: value.type, size: value.size }]
        }
        return [key, value]
      }))
    } catch (error) {
      console.error('FormData parsing error:', error)
      return createErrorResponse('폼 데이터를 파싱할 수 없습니다: ' + (error instanceof Error ? error.message : String(error)))
    }

    const file = formData.get('file') as File | null
    if (!file) {
      console.error('No file in request')
      return createErrorResponse('파일이 없습니다.')
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    })

    // 파일 크기 검증
    if (file.size === 0) {
      console.error('Empty file received')
      return createErrorResponse('빈 파일입니다.')
    }

    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.size, 'max:', MAX_FILE_SIZE)
      return createErrorResponse(`파일 크기는 ${MAX_FILE_SIZE / (1024 * 1024)}MB를 초과할 수 없습니다.`)
    }

    // 파일 타입 검증
    const fileType = file.type
    if (!fileType) {
      console.error('No file type')
      return createErrorResponse('파일 타입을 확인할 수 없습니다.')
    }

    console.log('Processing file type:', fileType)

    if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      return createErrorResponse('이미지 또는 비디오 파일만 업로드 가능합니다.')
    }

    // 비디오 파일 추가 검증
    if (fileType.startsWith('video/')) {
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
      if (!allowedVideoTypes.includes(fileType)) {
        return createErrorResponse('MP4, WebM, MOV 형식의 비디오만 업로드 가능합니다.')
      }

      try {
        // Vercel 환경에서도 Base64로 처리
        const buffer = Buffer.from(await file.arrayBuffer())
        const base64Data = buffer.toString('base64')
        const dataUrl = `data:${fileType};base64,${base64Data}`

        console.log('Video processing:', {
          type: fileType,
          size: buffer.length,
          isBase64: true
        })

        return createSuccessResponse({
          url: dataUrl,
          type: 'video',
          message: '비디오가 성공적으로 업로드되었습니다.'
        })
      } catch (error) {
        console.error('Video processing error:', error)
        return createErrorResponse('비디오 처리 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)))
      }
    }

    // 이미지 파일 처리
    if (fileType.startsWith('image/')) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedImageTypes.includes(fileType)) {
        return createErrorResponse('JPG, PNG, GIF, WebP 형식의 이미지만 업로드 가능합니다.')
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const base64Data = buffer.toString('base64')
        const dataUrl = `data:${fileType};base64,${base64Data}`

        console.log('Image processing:', {
          type: fileType,
          size: buffer.length,
          isBase64: true
        })

        return createSuccessResponse({
          url: dataUrl,
          type: 'image',
          message: '이미지가 성공적으로 업로드되었습니다.'
        })
      } catch (error) {
        console.error('Image processing error:', error)
        return createErrorResponse('이미지 처리 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)))
      }
    }

    return createErrorResponse('지원하지 않는 파일 형식입니다.')

  } catch (error) {
    console.error('Upload error:', error)
    return createErrorResponse('파일 업로드 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)), 500)
  }
} 