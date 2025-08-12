import Stripe from 'stripe'
import { formatPrice } from '@/lib/utils'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createCheckoutSession({
  items,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
  }>
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          metadata: {
            productId: item.productId,
          },
        },
        unit_amount: item.price, // Already in cents
      },
      quantity: item.quantity,
    })
  )

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      userId,
    },
    payment_intent_data: {
      metadata: {
        userId,
      },
    },
  })

  return session
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

export function getStripePublishableKey() {
  // In a real app, you'd have this in env vars
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
}