'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
//import { toast } from '@/components/ui/use-toast'
import { Mail, Download, Loader2 } from 'lucide-react'

interface OrderDetailsProps {
  order: any
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [status, setStatus] = useState(order.status)
  
  async function updateStatus(newStatus: string) {
    setIsUpdating(true)
    
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to update order')
      }
      
      setStatus(newStatus)
      toast({
        title: 'Order updated',
        description: 'Order status has been updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }
  
  async function resendEmail() {
    setIsResending(true)
    
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend-email' }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to resend email')
      }
      
      toast({
        title: 'Email sent',
        description: 'Order confirmation email has been resent',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend email',
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-medium">#{order._id.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <Select
                  value={status}
                  onValueChange={updateStatus}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">
                {order.userId?.name || 'Guest'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">
                {order.customerEmail || order.userId?.email}
              </span>
            </div>
            <div className="pt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={resendEmail}
                disabled={isResending || order.status !== 'paid'}
              >
                {isResending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Resend Confirmation Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>
            Products included in this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item: any) => {
                const download = order.downloads?.find(
                  (d: any) => d.productId.toString() === item.productId.toString()
                )
                
                return (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.productId && (
                          <p className="text-sm text-muted-foreground">
                            ID: {item.productId}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === 'paid' && download && (
                        <Button size="sm" variant="ghost" asChild>
                          <a
                            href={`/api/download/${order._id}/${item.productId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {order.stripe && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session ID</span>
              <span className="font-mono text-sm">{order.stripe.sessionId}</span>
            </div>
            {order.stripe.paymentIntentId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Intent</span>
                <span className="font-mono text-sm">
                  {order.stripe.paymentIntentId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge>{order.stripe.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
