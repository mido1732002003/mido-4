import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface UploadOptions {
  folder?: string
  resourceType?: 'image' | 'raw' | 'video' | 'auto'
  transformation?: any[]
  eager?: any[]
  format?: string
}

// Generate signature for client-side uploads (more secure)
export function generateUploadSignature(folder: string = 'products') {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const paramsToSign = {
    timestamp,
    folder: `${process.env.CLOUDINARY_UPLOAD_FOLDER}/${folder}`,
  }
  
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )
  
  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder: paramsToSign.folder,
  }
}

// Upload file from server
export async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<any> {
  const uploadOptions = {
    folder: `${process.env.CLOUDINARY_UPLOAD_FOLDER}/${options.folder || 'products'}`,
    resource_type: options.resourceType || 'auto',
    ...options,
  }

  try {
    const result = await cloudinary.uploader.upload(file as string, uploadOptions)
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file')
  }
}

// Delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string, resourceType: string = 'image') {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as any,
    })
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete file')
  }
}

// Generate time-limited signed URL for secure downloads
export function generateSecureUrl(
  publicId: string,
  options: {
    expiresIn?: number // seconds
    resourceType?: string
    attachment?: boolean
    filename?: string
  } = {}
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + (options.expiresIn || 3600) // 1 hour default

  const signedUrl = cloudinary.utils.private_download_url(
    publicId,
    options.resourceType || 'raw',
    {
      expires_at: expiresAt,
      attachment: options.attachment !== false, // Force download by default
      ...(options.filename && { attachment: options.filename }),
    }
  )

  return signedUrl
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'jpg' | 'png'
  } = {}
): string {
  const transformations: any[] = []

  if (options.width || options.height) {
    transformations.push({
      width: options.width,
      height: options.height,
      crop: 'fill',
      gravity: 'auto',
    })
  }

  if (options.quality) {
    transformations.push({
      quality: options.quality,
    })
  }

  if (options.format) {
    transformations.push({
      fetch_format: options.format,
    })
  }

  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  })
}

// Verify webhook signature from Cloudinary (if using webhooks)
export function verifyCloudinaryWebhook(
  body: string,
  timestamp: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHash('sha1')
    .update(body + timestamp + process.env.CLOUDINARY_API_SECRET)
    .digest('hex')

  return signature === expectedSignature
}