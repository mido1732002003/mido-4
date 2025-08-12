'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{SITE_NAME}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="text-lg font-medium transition-colors hover:text-primary"
          >
            Products
          </Link>
          {session?.user && (
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="text-lg font-medium transition-colors hover:text-primary"
            >
              My Orders
            </Link>
          )}
          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="text-lg font-medium transition-colors hover:text-primary"
            >
              Admin
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}