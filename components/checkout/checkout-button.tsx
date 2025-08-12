'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CheckoutButtonProps {
  disabled?: boolean
  className?: string
}

export function CheckoutButton({ disabled, className }: CheckoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  async function handleCheckout() {
    setIsLoading(true)
    router.push('/checkout')
  }
  
  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      size="lg"
      className={className}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Proceed to Checkout
    </Button>
  )
}