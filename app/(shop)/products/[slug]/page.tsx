import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { formatPrice } from '@/lib/utils'
import { SITE_URL } from '@/lib/constants'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.APP_URL}/api/products/${slug}`, {
    next: { revalidate: 3600 },
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }
  
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      url: `${SITE_URL}/products/${product.slug}`,
      images: product.images[0] ? [
        {
          url: product.images[0].url,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.tags?.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>
          
          <AddToCartButton
            product={{
              id: product._id,
              title: product.title,
              price: product.price,
              image: product.images[0]?.url,
            }}
          />
          
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">What's included:</h3>
            <ul className="space-y-1 text-sm">
              <li>✓ Instant download after purchase</li>
              <li>✓ Lifetime access to files</li>
              <li>✓ Free updates (if applicable)</li>
              <li>✓ Secure checkout with Stripe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}