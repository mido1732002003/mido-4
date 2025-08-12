'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Package, User } from 'lucide-react'

const accountLinks = [
  {
    title: 'Orders',
    href: '/account/orders',
    icon: Package,
  },
  {
    title: 'Profile',
    href: '/account/profile',
    icon: User,
  },
]

export function AccountNav() {
  const pathname = usePathname()
  
  return (
    <nav className="space-y-2">
      <h2 className="mb-4 text-lg font-semibold">Account</h2>
      {accountLinks.map((link) => {
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