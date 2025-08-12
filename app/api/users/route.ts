import { NextRequest, NextResponse } from 'next/server'
// import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/user'
import { getCurrentUser, isAdmin } from '@/lib/auth/utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const skip = (page - 1) * pageSize
    
    const users = await User
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()
    
    const total = await User.countDocuments()
    
    return NextResponse.json({
      items: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}