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
  console.log('Request headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    if (!request.body) {
      console.error('No request body')
      return createErrorResponse('요청 본문이 없습니다.')
    }

    const contentType = request.headers.get('content-type')
    console.log('Content-Type:', contentType)
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return createErrorResponse(`잘못된 Content-Type입니다: ${contentType}`)
    }

    let formData: FormData
    try {
      formData = await request.formData()
      console.log('FormData parsed successfully')
    } catch (error) {
      console.error('FormData parsing error:', error)
      return createErrorResponse('폼 데이터를 파싱할 수 없습니다: ' + (error instanceof Error ? error.message : String(error)))
    }

    const file = formData.get('file') as File | null
    if (!file) {
      return createErrorResponse('파일이 없습니다.')
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // 파일 크기 검증
    if (file.size === 0) {
      return createErrorResponse('빈 파일입니다.')
    }

    if (file.size > MAX_FILE_SIZE) {
      return createErrorResponse(`파일 크기는 ${MAX_FILE_SIZE / (1024 * 1024)}MB를 초과할 수 없습니다.`)
    }

    // 파일 타입 검증
    const fileType = file.type
    if (!fileType) {
      return createErrorResponse('파일 타입을 확인할 수 없습니다.')
    }

    if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      return createErrorResponse('이미지 또는 비디오 파일만 업로드 가능합니다.')
    }

    // 비디오 파일 추가 검증
    if (fileType.startsWith('video/')) {
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
      if (!allowedVideoTypes.includes(fileType)) {
        return createErrorResponse('MP4, WebM, MOV 형식의 비디오만 업로드 가능합니다.')
      }
    }

    // 이미지 파일 추가 검증
    if (fileType.startsWith('image/')) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedImageTypes.includes(fileType)) {
        return createErrorResponse('JPG, PNG, GIF, WebP 형식의 이미지만 업로드 가능합니다.')
      }
    }

    try {
      // 파일을 Base64로 변환
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64Data = buffer.toString('base64')
      const dataUrl = `data:${fileType};base64,${base64Data}`
      
      console.log('File converted to Base64 successfully')
      console.log('File size:', buffer.length, 'bytes')

      // Vercel 환경에서는 Base64 데이터 URL을 반환
      const isVercel = process.env.VERCEL === '1'
      
      if (isVercel) {
        console.log('Running on Vercel - returning Base64 data URL')
        
        const response = {
          url: dataUrl,
          message: '파일이 성공적으로 업로드되었습니다. (Base64 인코딩)'
        }
        
        console.log('Sending success response with Base64 data')
        return createSuccessResponse(response)
      } else {
        // 로컬 개발 환경에서는 파일 시스템에 저장
        const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const mediaType = fileType.startsWith('image/') ? 'images' : 'videos'
        const uploadDir = join(process.cwd(), 'public', 'uploads', mediaType)
        const relativePath = `/uploads/${mediaType}/${filename}`
        const absolutePath = join(uploadDir, filename)

        console.log('Saving file to local filesystem:', {
          filename,
          type: fileType,
          size: file.size,
          uploadDir,
          absolutePath
        })

        // 업로드 디렉토리 생성 (재귀적으로)
        try {
          if (!existsSync(uploadDir)) {
            console.log('Creating upload directory:', uploadDir)
            await mkdir(uploadDir, { recursive: true })
            console.log('Upload directory created successfully')
          }
        } catch (dirError) {
          console.error('Directory creation error:', dirError)
          return createErrorResponse('업로드 디렉토리를 생성할 수 없습니다: ' + (dirError instanceof Error ? dirError.message : String(dirError)), 500)
        }

        // 파일 저장
        try {
          console.log('Writing file to disk...')
          await writeFile(absolutePath, buffer)
          console.log('File saved successfully')
        } catch (writeError) {
          console.error('File write error:', writeError)
          if (writeError instanceof Error && writeError.message.includes('EACCES')) {
            return createErrorResponse('파일 저장 권한이 없습니다. 관리자에게 문의하세요.', 500)
          }
          if (writeError instanceof Error && writeError.message.includes('ENOSPC')) {
            return createErrorResponse('디스크 공간이 부족합니다.', 500)
          }
          return createErrorResponse('파일 저장 중 오류가 발생했습니다: ' + (writeError instanceof Error ? writeError.message : String(writeError)), 500)
        }

        const response = {
          url: relativePath,
          message: '파일이 성공적으로 업로드되었습니다.'
        }

        console.log('Sending success response:', response)
        return createSuccessResponse(response)
      }

    } catch (error) {
      console.error('File processing error:', error)
      if (error instanceof Error && error.message.includes('EACCES')) {
        return createErrorResponse('파일 저장 권한이 없습니다. 관리자에게 문의하세요.', 500)
      }
      return createErrorResponse('파일 처리 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)), 500)
    }
  } catch (error) {
    console.error('Upload error:', error)
    return createErrorResponse('파일 업로드 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)), 500)
  }
} 