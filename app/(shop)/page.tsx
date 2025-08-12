import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/products/product-grid'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Premium Digital Products for Creators',
}

function getFeaturedProducts() {
  const dummyProducts = [
  { id: 1, name: "Product 1", price: 100, images: [{ url: "/images/logo.svg" }], category: "Electronics", slug: "product-1" },
  { id: 2, name: "Product 2", price: 200, images: [{ url: "/images/logo.svg" }], category: "Books", slug: "product-2" },
  { id: 3, name: "Product 3", price: 300, images: [{ url: "/images/logo.svg"}], category: "Clothing", slug: "product-3" },
];

  return { items: dummyProducts };
}

export default async function HomePage() {
  const { items: featuredProducts } = await getFeaturedProducts()
  
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container relative z-10 py-24 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Premium Digital Products
            <span className="gradient-text"> for Creators</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Discover high-quality e-books, templates, audio packs, and more. 
            Instant downloads, lifetime access, and secure payments.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Instant Downloads</h3>
            <p className="text-muted-foreground">
              Get immediate access to your digital products after purchase
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Secure Payments</h3>
            <p className="text-muted-foreground">
              Protected by Stripe with SSL encryption for safe transactions
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Lifetime Access</h3>
            <p className="text-muted-foreground">
              Download your purchases anytime from your account dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="ghost" asChild>
            <Link href="/products">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  )
}