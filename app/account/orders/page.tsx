import { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Download, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Orders',
}

async function getUserOrders() {
  const user = await getCurrentUser()
  if (!user) return { items: [] }
  
  const res = await fetch(`${process.env.APP_URL}/api/orders`, {
    headers: {
      'Cookie': `next-auth.session-token=${user.id}`, // Pass auth in SSR
    },
    cache: 'no-store',
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch orders')
  }
  
  return res.json()
}

export default async function OrdersPage() {
  const { items: orders } = await getUserOrders()
  
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">No orders found</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order._id.slice(-8)}
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      order.status === 'paid'
                        ? 'default'
                        : order.status === 'pending'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item: any) => {
                      const download = order.downloads?.find(
                        (d: any) => d.productId === item.productId
                      )
                      
                      return (
                        <TableRow key={item.productId}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(item.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {order.status === 'paid' && download && (
                              <Button size="sm" variant="ghost" asChild>
                                <Link
                                  href={`/api/download/${order._id}/${item.productId}`}
                                >
                                  <Download className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold">
                    Total: {formatPrice(order.total)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}