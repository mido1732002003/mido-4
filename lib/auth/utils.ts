import { getServerSession } from 'next-auth/next'
import { authOptions } from './options'
import { redirect } from 'next/navigation'
import { USER_ROLES } from '@/lib/constants'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/signin')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== USER_ROLES.ADMIN) {
    redirect('/')
  }
  return user
}

export function isAdmin(user: any) {
  return user?.role === USER_ROLES.ADMIN
}