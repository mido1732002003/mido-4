import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout Cancelled',
}

export default function CancelPage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
        <h1 className="mb-2 text-3xl font-bold">Checkout Cancelled</h1>
        <p className="mb-6 text-muted-foreground">
          Your order was cancelled. No charges were made.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/cart">Return to Cart</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}