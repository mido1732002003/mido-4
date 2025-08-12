import { z } from 'zod'
import { USER_ROLES } from '@/lib/constants'

export const updateUserRoleSchema = z.object({
  role: z.enum([USER_ROLES.USER, USER_ROLES.ADMIN]),
})