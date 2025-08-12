'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { CartItem } from './cart-item'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/lib/hooks'
import { useToast } from '@/components/ui/use-toast'

export function CartDrawer() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { cart, isLoading, removeItem, updateQuantity } = useCart()
  
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  
  function handleCheckout() {
    if (!cart?.items?.length) {
      toast({
        title: 'Cart is empty',
        description: 'Add some products before checking out',
        variant: 'destructive',
      })
      return
    }
    
    setOpen(false)
    router.push('/checkout')
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        
        {cart?.items?.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => setOpen(false)} asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cart?.items?.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onRemove={() => removeItem(item.productId)}
                    onUpdateQuantity={(quantity) =>
                      updateQuantity(item.productId, quantity)
                    }
                  />
                ))}
              </div>
            </ScrollArea>
            
            <div className="space-y-4 pt-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">
                    {formatPrice(cart?.subtotal || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(cart?.total || 0)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}