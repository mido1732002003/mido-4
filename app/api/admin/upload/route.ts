import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isAdmin } from '@/lib/auth/utils'
import { generateUploadSignature } from '@/lib/storage/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { folder = 'products' } = body
    
    const signature = generateUploadSignature(folder)
    
    return NextResponse.json(signature)
  } catch (error) {
    console.error('Upload signature error:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}