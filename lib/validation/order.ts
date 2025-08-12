import { z } from 'zod'

export const createCheckoutSessionSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive().int(),
  })).min(1, 'Cart cannot be empty'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'fulfilled', 'refunded']),
})