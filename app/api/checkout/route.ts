import { NextRequest, NextResponse } from 'next/server'
// import { connectToDatabase } from '@/lib/db/mongodb'
import { getCurrentUser } from '@/lib/auth/utils'
import { createCheckoutSession } from '@/lib/payments/stripe'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to checkout' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Get user's cart
    const cartResponse = await fetch(`${process.env.APP_URL}/api/cart`, {
  headers: request.headers,
})
    const cart = await cartResponse.json()
    
    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }
    
    // Create Stripe checkout session
    const session = await createCheckoutSession({
      items: cart.items,
      userId: user.id,
      userEmail: user.email!,
      successUrl: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.APP_URL}/cancel`,
    })
    
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}