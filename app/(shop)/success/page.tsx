import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Successful',
}

export default function SuccessPage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-3xl font-bold">Order Successful!</h1>
        <p className="mb-6 text-muted-foreground">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}