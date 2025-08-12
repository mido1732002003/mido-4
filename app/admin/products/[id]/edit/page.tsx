import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = {
  title: 'Edit Product',
}

async function getProduct(id: string) {
  const res = await fetch(`${process.env.APP_URL}/api/products/${id}`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }
  
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}