import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { Order } from '@/lib/db/models/order'
import { getCurrentUser, isAdmin } from '@/lib/auth/utils'
import { updateOrderStatusSchema } from '@/lib/validation/order'
import { sendOrderConfirmationEmail } from '@/lib/email/send'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const query: any = { _id: params.id }
    if (!isAdmin(user)) {
      query.userId = user.id
    }
    
    const order = await Order
      .findOne(query)
      .populate('userId', 'name email')
      .populate('items.productId', 'title slug images')
      .lean()
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    await connectToDatabase()
    
    const body = await request.json()
    
    // Handle resend email action
    if (body.action === 'resend-email') {
      const order = await Order
        .findById(params.id)
        .populate('items.productId')
        .lean()
      
      if (!order || !order.customerEmail) {
        return NextResponse.json(
          { error: 'Order not found or no email' },
          { status: 404 }
        )
      }
      
      // Generate download links
      const downloadLinks = order.downloads.map((download: any) => {
        const product = order.items.find(
          (item: any) => item.productId._id.toString() === download.productId.toString()
        )
        return {
          title: product?.productId?.title || 'Product',
          url: `${process.env.APP_URL}/api/download/${order._id}/${download.productId}`,
        }
      })
      
      await sendOrderConfirmationEmail(
        order.customerEmail,
        order,
        downloadLinks
      )
      
      return NextResponse.json({ success: true })
    }
    
    // Handle status update
    const validatedData = updateOrderStatusSchema.parse(body)
    
    const order = await Order.findByIdAndUpdate(
      params.id,
      { status: validatedData.status },
      { new: true }
    )
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}