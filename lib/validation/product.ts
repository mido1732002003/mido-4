import { z } from 'zod'

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive').multipleOf(1), // Price in cents
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string(),
  })).optional().default([]),
  file: z.object({
    url: z.string().url(),
    publicId: z.string(),
    size: z.number(),
    format: z.string(),
  }).optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const searchProductsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).optional().default('newest'),
  page: z.coerce.number().positive().optional().default(1),
  pageSize: z.coerce.number().positive().max(100).optional().default(12),
})