'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, X } from 'lucide-react'

interface CartItemProps {
  item: {
    productId: string
    title: string
    price: number
    quantity: number
    image?: string
  }
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="flex gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (!isNaN(value) && value > 0) {
                  onUpdateQuantity(value)
                }
              }}
              className="h-8 w-12 text-center"
              min="1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <p className="text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}