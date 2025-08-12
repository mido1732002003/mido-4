import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    _id: string
    title: string
    slug: string
    description: string
    price: number
    images: Array<{ url: string }>
    category: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden card-hover">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <Badge className="absolute right-2 top-2">{product.category}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{product.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </CardFooter>
      </Link>
    </Card>
  )
}