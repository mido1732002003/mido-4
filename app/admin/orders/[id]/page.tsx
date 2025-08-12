import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OrderDetails } from '@/components/admin/order-details'

export const metadata: Metadata = {
  title: 'Order Details',
}

async function getOrder(id: string) {
  const res = await fetch(`${process.env.APP_URL}/api/orders/${id}`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)
  
  if (!order) {
    notFound()
  }
  
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Order #{params.id.slice(-8)}
      </h1>
      <OrderDetails order={order} />
    </div>
  )
}