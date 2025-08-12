import { Metadata } from 'next'
import { UsersTable } from '@/components/admin/users-table'

export const metadata: Metadata = {
  title: 'Manage Users',
}

async function getUsers() {
  const res = await fetch(`${process.env.APP_URL}/api/users?pageSize=50`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  
  return res.json()
}

export default async function AdminUsersPage() {
  const { items: users } = await getUsers()
  
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
      <UsersTable users={users} />
    </div>
  )
}