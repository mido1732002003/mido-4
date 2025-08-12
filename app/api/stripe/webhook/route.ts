import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
// import { connectToDatabase } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/order'
import { Product } from '@/lib/db/models/product'
import { constructWebhookEvent } from '@/lib/payments/stripe'
import { generateDownloadExpiry } from '@/lib/utils'
import { sendOrderConfirmationEmail } from '@/lib/email/send'
import { generateSecureUrl } from '@/lib/storage/cloudinary'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!
  
  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }
  
  try {
    const event = await constructWebhookEvent(body, signature)
    
    await connectToDatabase()
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        
        // Get line items
        const lineItems = session.line_items?.data || []
        
        // Create order items
        const orderItems = await Promise.all(
          lineItems.map(async (item: any) => {
            const productId = item.price?.product?.metadata?.productId
            const product = await Product.findById(productId).lean()
            
            return {
              productId,
              title: item.description || product?.title || 'Unknown Product',
              price: item.price?.unit_amount || 0,
              quantity: item.quantity || 1,
            }
          })
        )
        
        // Create order
        const order = await Order.create({
          userId: session.metadata.userId,
          customerEmail: session.customer_email,
          items: orderItems,
          subtotal: session.amount_subtotal || 0,
          total: session.amount_total || 0,
          currency: session.currency,
          stripe: {
            sessionId: session.id,
            paymentIntentId: session.payment_intent,
            status: session.payment_status,
          },
          status: 'paid',
        })
        
        // Generate download links
        const downloads = []
        const downloadLinks = []
        
        for (const item of orderItems) {
          const product = await Product.findById(item.productId).lean()
          if (product?.file) {
            const expiresAt = generateDownloadExpiry()
            const downloadUrl = `${process.env.APP_URL}/api/download/${order._id}/${item.productId}`
            
            downloads.push({
              productId: item.productId,
              fileUrl: product.file.url,
              expiresAt,
            })
            
            downloadLinks.push({
              title: product.title,
              url: downloadUrl,
            })
          }
        }
        
        // Update order with downloads
        order.downloads = downloads
        await order.save()
        
        // Update product sales count
        await Product.updateMany(
          { _id: { $in: orderItems.map(item => item.productId) } },
          { $inc: { salesCount: 1 } }
        )
        
        // Clear user's cart
        // In production, implement proper cart clearing
        
        // Send confirmation email
        if (session.customer_email) {
          await sendOrderConfirmationEmail(
            session.customer_email,
            order,
            downloadLinks
          )
        }
        
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        
        // Update order status if exists
        await Order.findOneAndUpdate(
          { 'stripe.paymentIntentId': paymentIntent.id },
          { status: 'failed' }
        )
        
        break
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}