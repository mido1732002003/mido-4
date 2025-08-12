'use client'

import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Eye } from 'lucide-react'

interface OrdersTableProps {
  orders: any[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">
                #{order._id.slice(-8)}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {order.userId?.name || 'Guest'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerEmail || order.userId?.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{formatPrice(order.total)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === 'paid'
                      ? 'default'
                      : order.status === 'pending'
                      ? 'secondary'
                      : order.status === 'fulfilled'
                      ? 'default'
                      : 'destructive'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/admin/orders/${order._id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}