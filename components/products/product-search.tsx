'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

export function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  
  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    
    router.push(`/products?${params.toString()}`)
  }
  
  function clearSearch() {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/products?${params.toString()}`)
  }
  
  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-sm">
      <Input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-20"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          className="absolute right-10 top-0 h-full"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="submit"
        size="icon"
        className="absolute right-0 top-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}