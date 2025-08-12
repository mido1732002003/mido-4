import { NextRequest, NextResponse } from 'next/server'
// import { connectToDatabase } from '@/lib/db/mongodb'
import { Order } from '@/lib/db/models/order'
import { Product } from '@/lib/db/models/product'
import { getCurrentUser } from '@/lib/auth/utils'
import { generateSecureUrl } from '@/lib/storage/cloudinary'
import { isDownloadExpired } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string; productId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    // Find order and verify ownership
    const order = await Order.findOne({
      _id: params.orderId,
      userId: user.id,
      status: 'paid',
    }).lean()
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Find download entry
    const download = order.downloads.find(
      (d: any) => d.productId.toString() === params.productId
    )
    
    if (!download) {
      return NextResponse.json(
        { error: 'Product not found in order' },
        { status: 404 }
      )
    }
    
    // Check if download expired
    if (isDownloadExpired(download.expiresAt)) {
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      )
    }
    
    // Get product for file info
    const product = await Product.findById(params.productId).lean()
    if (!product?.file) {
      return NextResponse.json(
        { error: 'Product file not found' },
        { status: 404 }
      )
    }
    
    // Generate secure download URL
    const secureUrl = generateSecureUrl(product.file.publicId, {
      expiresIn: 3600, // 1 hour
      resourceType: 'raw',
      attachment: true,
      filename: `${product.slug}.${product.file.format || 'zip'}`,
    })
    
    // Redirect to secure URL
    return NextResponse.redirect(secureUrl)
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    )
  }
}