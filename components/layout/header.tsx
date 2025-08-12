'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { AuthButton } from '@/components/auth-button'
import { SITE_NAME } from '@/lib/constants'
import { ShoppingBag, Package } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileNav />
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              {SITE_NAME}
            </span>
          </Link>
          
          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-6">
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Products
            </Link>
            {session?.user && (
              <Link
                href="/account/orders"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                My Orders
              </Link>
            )}
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <CartDrawer />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}