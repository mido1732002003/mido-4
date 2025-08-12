import { Metadata } from 'next'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = {
  title: 'Create Product',
}

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Create Product</h1>
      <ProductForm />
    </div>
  )
}