'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/hooks'
import { toast } from '@/components/ui/toast'
import { ShoppingBag, Loader2 } from 'lucide-react'

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    price: number
    image?: string
  }
  quantity?: number
  className?: string
}

export function AddToCartButton({ 
  product, 
  quantity = 1, 
  className 
}: AddToCartButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()
  
  async function handleAddToCart() {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    setIsLoading(true)
    
    try {
      await addItem(product.id, quantity)
      
      toast({
        title: 'Added to cart',
        description: `${product.title} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      size="lg"
      className={className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingBag className="mr-2 h-4 w-4" />
      )}
      Add to Cart
    </Button>
  )
}