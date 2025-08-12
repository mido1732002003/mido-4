import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              Premium digital products for creators. Instant downloads,
              lifetime access.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=ebooks" className="hover:underline">
                  E-books
                </Link>
              </li>
              <li>
                <Link href="/products?category=templates" className="hover:underline">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/products?category=audio" className="hover:underline">
                  Audio
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signin" className="hover:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:underline">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/account/downloads" className="hover:underline">
                  Downloads
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}