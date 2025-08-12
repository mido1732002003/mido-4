import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function DashboardStats() {
  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full justify-between" asChild>
        <Link href="/admin/products/new">
          Add New Product
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-between" asChild>
        <Link href="/admin/orders">
          View Orders
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-between" asChild>
        <Link href="/admin/users">
          Manage Users
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}