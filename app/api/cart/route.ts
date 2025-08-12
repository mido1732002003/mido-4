import { NextRequest, NextResponse } from 'next/server'
// import { connectToDatabase } from '@/lib/db/mongodb'
import { getCurrentUser } from '@/lib/auth/utils'
import { addToCartSchema } from '@/lib/validation/cart'
import { z } from 'zod'

// In-memory cart storage for authenticated users
// In production, you'd store this in Redis or MongoDB
const userCarts = new Map<string, any>()

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ items: [], subtotal: 0, total: 0 })
    }
    
    const cart = userCarts.get(user.id) || { items: [], subtotal: 0, total: 0 }
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to add items to cart' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = addToCartSchema.parse(body)
    
    await connectToDatabase()
    const { Product } = await import('@/lib/db/models/product')
    
    const product = await Product.findById(validatedData.productId).lean()
    if (!product || !product.isPublished) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const cart = userCarts.get(user.id) || { items: [], subtotal: 0, total: 0 }
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId === validatedData.productId
    )
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += validatedData.quantity
    } else {
      cart.items.push({
        productId: product._id.toString(),
        title: product.title,
        price: product.price,
        quantity: validatedData.quantity,
        image: product.images[0]?.url,
      })
    }
    
    // Recalculate totals
    cart.subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    cart.total = cart.subtotal // Add tax/shipping if needed
    
    userCarts.set(user.id, cart)
    
    return NextResponse.json(cart)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Clear cart or remove item
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (productId) {
      // Remove specific item
      const cart = userCarts.get(user.id) || { items: [], subtotal: 0, total: 0 }
      cart.items = cart.items.filter((item: any) => item.productId !== productId)
      
      // Recalculate totals
      cart.subtotal = cart.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      )
      cart.total = cart.subtotal
      
      userCarts.set(user.id, cart)
      return NextResponse.json(cart)
    } else {
      // Clear entire cart
      userCarts.delete(user.id)
      return NextResponse.json({ items: [], subtotal: 0, total: 0 })
    }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}