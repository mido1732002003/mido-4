'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout')
      return
    }
    
    // Create checkout session
    async function createCheckout() {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
        })
        
        if (!res.ok) {
          throw new Error('Failed to create checkout session')
        }
        
        const { url } = await res.json()
        
        if (url) {
          window.location.href = url
        }
      } catch (error) {
        console.error('Checkout error:', error)
        router.push('/cart')
      }
    }
    
    createCheckout()
  }, [session, status, router])
  
  return (
    <div className="container flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Redirecting to checkout...</p>
      </div>
    </div>
  )
}