'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatPrice } from '@/lib/utils'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { toast } from '@/components/ui/toast'

interface ProductsTableProps {
  products: any[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }
    
    setIsDeleting(productId)
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        throw new Error('Failed to delete product')
      }
      
      toast({
        title: 'Product deleted',
        description: 'The product has been deleted successfully',
      })
      
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(null)
    }
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>
                <Badge variant={product.isPublished ? 'default' : 'secondary'}>
                  {product.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>{product.salesCount || 0}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting === product._id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.slug}`}>
                        View Product
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product._id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(product._id)}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}