import { NextRequest, NextResponse } from 'next/server'
// import { connectToDatabase } from '@/lib/db/mongodb'
import { Order } from '@/lib/db/models/order'
import { getCurrentUser, isAdmin } from '@/lib/auth/utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const skip = (page - 1) * pageSize
    
    // Build query based on user role
    const query: any = isAdmin(user) ? {} : { userId: user.id }
    
    const orders = await Order
      .find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()
    
    const total = await Order.countDocuments(query)
    
    return NextResponse.json({
      items: orders,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}