import { Metadata } from 'next'
import { OrdersTable } from '@/components/admin/orders-table'

export const metadata: Metadata = {
  title: 'Manage Orders',
}

async function getOrders() {
  const res = await fetch(`${process.env.APP_URL}/api/orders?pageSize=50`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch orders')
  }
  
  return res.json()
}

export default async function AdminOrdersPage() {
  const { items: orders } = await getOrders()
  
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  )
}