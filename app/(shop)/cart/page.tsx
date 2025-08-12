import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shopping Cart',
}

export default function CartPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Cart items will be rendered client-side */}
          <div id="cart-items">
            <CartItemsList />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}

function CartItemsList() {
  // This will be replaced by client component
  return (
    <div className="rounded-lg border p-8 text-center">
      <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">Your cart is empty</p>
      <Button asChild className="mt-4">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  )
}