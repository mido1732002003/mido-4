import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGridProps {
  products: any[]
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export function ProductGrid({ products, pagination }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const current = pagination.page
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= current - 1 && page <= current + 1)
                )
              })
              .map((page, index, array) => (
                <>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span key={`ellipsis-${index}`} className="px-2">
                      ...
                    </span>
                  )}
                  <Button
                    key={page}
                    variant={page === pagination.page ? 'default' : 'outline'}
                    size="icon"
                  >
                    {page}
                  </Button>
                </>
              ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}