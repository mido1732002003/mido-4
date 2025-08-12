import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/admin/products-table'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Manage Products',
}

async function getProducts() {
  const res = await fetch(`${process.env.APP_URL}/api/products?pageSize=50`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return res.json()
}

export default async function AdminProductsPage() {
  const { items: products } = await getProducts()
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      
      <ProductsTable products={products} />
    </div>
  )
}