'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/hooks'
import { Loader2 } from 'lucide-react'

export function CartSummary() {
  const router = useRouter()
  const { cart, isLoading } = useCart()
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(cart?.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(cart?.total || 0)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push('/checkout')}
          disabled={!cart?.items?.length}
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  )
}