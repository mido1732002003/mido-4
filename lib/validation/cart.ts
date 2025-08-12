import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive().int().default(1),
})

export const addToCartSchema = cartItemSchema

export const updateCartItemSchema = z.object({
  quantity: z.number().positive().int(),
})