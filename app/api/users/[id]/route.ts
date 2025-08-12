import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { User } from '@/lib/db/models/user'
import { getCurrentUser, isAdmin } from '@/lib/auth/utils'
import { updateUserRoleSchema } from '@/lib/validation/user'
import { z } from 'zod'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    await connectToDatabase()
    
    const body = await request.json()
    const validatedData = updateUserRoleSchema.parse(body)
    
    // Prevent admin from demoting themselves
    if (currentUser.id === params.id && validatedData.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot demote yourself' },
        { status: 400 }
      )
    }
    
    const user = await User.findByIdAndUpdate(
      params.id,
      { role: validatedData.role },
      { new: true }
    )
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}