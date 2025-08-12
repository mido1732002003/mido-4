import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  image: z.string().url('Invalid image URL').optional(),
})