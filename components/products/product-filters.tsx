'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const category = searchParams.get('category') || ''
  const priceMin = Number(searchParams.get('priceMin')) || 0
  const priceMax = Number(searchParams.get('priceMax')) || 1000
  
  function updateFilters(key: string, value: string | number) {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value.toString())
    } else {
      params.delete(key)
    }
    
    router.push(`/products?${params.toString()}`)
  }
  
  function clearFilters() {
    router.push('/products')
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <Label>Category</Label>
          <RadioGroup
            value={category}
            onValueChange={(value) => updateFilters('category', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer">
                All Categories
              </Label>
            </div>
            {PRODUCT_CATEGORIES.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.value} id={cat.value} />
                <Label htmlFor={cat.value} className="font-normal cursor-pointer">
                  {cat.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>${priceMin}</span>
              <span>${priceMax}</span>
            </div>
            <Slider
              value={[priceMin, priceMax]}
              onValueChange={([min, max]) => {
                updateFilters('priceMin', min)
                updateFilters('priceMax', max)
              }}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}