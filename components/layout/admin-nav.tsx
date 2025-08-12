'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react'

const adminLinks = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
]

export function AdminNav() {
  const pathname = usePathname()
  
  return (
    <nav className="space-y-2">
      <h2 className="mb-4 text-lg font-semibold">Admin</h2>
      {adminLinks.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === link.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            {link.title}
          </Link>
        )
      })}
    </nav>
  )
}