import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Cart, CartItem } from '@/types'
import { toast } from '@/components/ui/use-toast'

// Cart hook for managing cart state
export function useCart() {
  const { data: session } = useSession()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Load cart on mount and session change
  useEffect(() => {
    loadCart()
  }, [session])
  
  async function loadCart() {
    try {
      if (session) {
        // Load from server
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          setCart(data)
        }
      } else {
        // Load from localStorage
        const localCart = localStorage.getItem('cart')
        if (localCart) {
          setCart(JSON.parse(localCart))
        } else {
          setCart({ items: [], subtotal: 0, total: 0 })
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCart({ items: [], subtotal: 0, total: 0 })
    } finally {
      setIsLoading(false)
    }
  }
  
  async function addItem(productId: string, quantity: number = 1) {
    if (session) {
      // Add to server cart
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to add item to cart')
      }
      
      const updatedCart = await res.json()
      setCart(updatedCart)
    } else {
      // Add to local cart
      const product = await fetch(`/api/products/${productId}`).then(r => r.json())
      
      const updatedCart = { ...cart } as Cart
      const existingItem = updatedCart.items.find(item => item.productId === productId)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        updatedCart.items.push({
          productId,
          title: product.title,
          price: product.price,
          quantity,
          image: product.images[0]?.url,
        })
      }
      
      // Recalculate totals
      updatedCart.subtotal = updatedCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      updatedCart.total = updatedCart.subtotal
      
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
  }
  
  async function removeItem(productId: string) {
    if (session) {
      // Remove from server cart
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        throw new Error('Failed to remove item from cart')
      }
      
      const updatedCart = await res.json()
      setCart(updatedCart)
    } else {
      // Remove from local cart
      const updatedCart = { ...cart } as Cart
      updatedCart.items = updatedCart.items.filter(item => item.productId !== productId)
      
      // Recalculate totals
      updatedCart.subtotal = updatedCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      updatedCart.total = updatedCart.subtotal
      
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
  }
  
  async function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return
    
    if (session) {
      // Update on server
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to update quantity')
      }
      
      const updatedCart = await res.json()
      setCart(updatedCart)
    } else {
      // Update local cart
      const updatedCart = { ...cart } as Cart
      const item = updatedCart.items.find(item => item.productId === productId)
      
      if (item) {
        item.quantity = quantity
        
        // Recalculate totals
        updatedCart.subtotal = updatedCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
        updatedCart.total = updatedCart.subtotal
        
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
      }
    }
  }
  
  async function clearCart() {
    if (session) {
      // Clear server cart
      const res = await fetch('/api/cart', { method: 'DELETE' })
      
      if (!res.ok) {
        throw new Error('Failed to clear cart')
      }
    } else {
      // Clear local cart
      localStorage.removeItem('cart')
    }
    
    setCart({ items: [], subtotal: 0, total: 0 })
  }
  
  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }
  
  return [storedValue, setValue] as const
}