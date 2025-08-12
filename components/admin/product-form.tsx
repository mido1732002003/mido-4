'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductSchema } from '@/lib/validation/product'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Upload } from 'lucide-react'
import { z } from 'zod'

interface ProductFormProps {
  product?: any
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  
  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: product?.category || '',
      tags: product?.tags || [],
      isPublished: product?.isPublished || false,
      images: product?.images || [],
      file: product?.file || undefined,
    },
  })
  
  async function uploadToCloudinary(file: File, type: 'image' | 'file') {
    const isImage = type === 'image'
    isImage ? setUploadingImage(true) : setUploadingFile(true)
    
    try {
      // Get upload signature
      const signatureRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: isImage ? 'products/images' : 'products/files' }),
      })
      
      if (!signatureRes.ok) {
        throw new Error('Failed to get upload signature')
      }
      
      const { signature, timestamp, cloudName, apiKey, folder } = await signatureRes.json()
      
      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', apiKey)
      formData.append('folder', folder)
      
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${isImage ? 'image' : 'raw'}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      
      if (!uploadRes.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await uploadRes.json()
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        size: data.bytes,
        format: data.format || file.name.split('.').pop(),
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: `Failed to upload ${type}`,
        variant: 'destructive',
      })
      throw error
    } finally {
      isImage ? setUploadingImage(false) : setUploadingFile(false)
    }
  }
  
  async function onSubmit(values: z.infer<typeof createProductSchema>) {
    setIsLoading(true)
    
    try {
      const url = product
        ? `/api/products/${product._id}`
        : '/api/products'
      
      const res = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      
      if (!res.ok) {
        throw new Error('Failed to save product')
      }
      
      toast({
        title: product ? 'Product updated' : 'Product created',
        description: 'Your product has been saved successfully',
      })
      
      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (cents)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="9900"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter price in cents (e.g., 9900 = $99.00)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tag1, tag2, tag3"
                      value={field.value.join(', ')}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(',').map((tag) => tag.trim())
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Separate tags with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      Make this product visible to customers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <FormLabel>Product Images</FormLabel>
              <div className="mt-2 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      try {
                        const uploadedImage = await uploadToCloudinary(file, 'image')
                        const currentImages = form.getValues('images')
                        form.setValue('images', [...currentImages, uploadedImage])
                      } catch (error) {
                        // Error handled in uploadToCloudinary
                      }
                    }
                  }}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                    Uploading image...
                  </p>
                )}
                {form.watch('images').length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {form.watch('images').map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image.url}
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-1 top-1 h-6 w-6"
                          onClick={() => {
                            const images = form.getValues('images')
                            form.setValue(
                              'images',
                              images.filter((_, i) => i !== index)
                            )
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <FormLabel>Digital File</FormLabel>
              <div className="mt-2 space-y-2">
                <Input
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      try {
                        const uploadedFile = await uploadToCloudinary(file, 'file')
                        form.setValue('file', uploadedFile)
                      } catch (error) {
                        // Error handled in uploadToCloudinary
                      }
                    }
                  }}
                  disabled={uploadingFile}
                />
                {uploadingFile && (
                  <p className="text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                    Uploading file...
                  </p>
                )}
                {form.watch('file') && (
                  <p className="text-sm text-muted-foreground">
                    File uploaded: {form.watch('file').format} (
                    {(form.watch('file').size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || uploadingImage || uploadingFile}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}