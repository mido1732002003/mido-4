'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { USER_ROLES } from '@/lib/constants'
//import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface UsersTableProps {
  users: any[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  
  async function updateUserRole(userId: string, newRole: string) {
    setUpdatingUser(userId)
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update user')
      }
      
      toast({
        title: 'User updated',
        description: 'User role has been updated successfully',
      })
      
      // Refresh the page to reflect changes
      window.location.reload()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role',
        variant: 'destructive',
      })
    } finally {
      setUpdatingUser(null)
    }
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name || 'Unknown'}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value) => updateUserRole(user._id, value)}
                    disabled={updatingUser === user._id}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={USER_ROLES.USER}>User</SelectItem>
                      <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {updatingUser === user._id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
