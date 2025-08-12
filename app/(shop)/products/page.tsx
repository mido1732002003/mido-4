import { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSearch } from '@/components/products/product-search'
import { ProductSort } from '@/components/products/product-sort'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Browse Products',
  description: 'Explore our collection of premium digital products',
}

interface ProductsPageProps {
  searchParams: {
    q?: string
    category?: string
    tags?: string
    priceMin?: string
    priceMax?: string
    sort?: string
    page?: string
  }
}

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const dummyProducts = [
    { id: '1', name: 'Product 1', price: 100, images: [{ url: '/images/logo.svg' }], description: 'This is a dummy product description.', slug: 'product-1', category: 'Electronics' },
    { id: '2', name: 'Product 2', price: 200, images: [{ url: '/images/logo.svg' }], description: 'This is another dummy product description.', slug: 'product-2', category: 'Books' },
    { id: '3', name: 'Product 3', price: 300, images: [{ url: '/images/logo.svg' }], description: 'Yet another dummy product description.', slug: 'product-3', category: 'Clothing' },
    { id: '4', name: 'Product 4', price: 400, images: [{ url: '/images/logo.svg' }], description: 'A fourth dummy product.', slug: 'product-4', category: 'Electronics' },
    { id: '5', name: 'Product 5', price: 500, images: [{ url: '/images/logo.svg' }], description: 'The fifth dummy product.', slug: 'product-5', category: 'Books' },
    { id: '6', name: 'Product 6', price: 600, images: [{ url: '/images/logo.svg' }], description: 'Sixth dummy product.', slug: 'product-6', category: 'Clothing' },
  ];

  // Simulate filtering based on searchParams if needed
  let filteredProducts = [...dummyProducts];

  if (searchParams.q) {
    const query = searchParams.q.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );
  }

  if (searchParams.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === searchParams.category?.toLowerCase()
    );
  }

  // Simulate pagination
  const page = parseInt(searchParams.page || '1');
  const pageSize = 6; // Example page size
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const itemsForPage = filteredProducts.slice(startIndex, endIndex);

  return {
    items: itemsForPage,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { items: products, pagination } = await getProducts(searchParams)
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of digital products
        </p>
      </div>
      
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64">
          <ProductFilters />
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ProductSearch />
            <ProductSort />
          </div>
          
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} pagination={pagination} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64" />
      ))}
    </div>
  )
}