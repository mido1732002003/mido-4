import { NextRequest, NextResponse } from 'next/server'
// import { connectToDatabase } from '@/lib/db/mongodb';
import { Product } from '@/lib/db/models/product'
import { searchProductsSchema } from '@/lib/validation/product'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const validatedParams = searchProductsSchema.parse(params)
    const { q, category, tags, priceMin, priceMax, sort, page, pageSize } = validatedParams
    
    // Build query
    const query: any = { isPublished: true }
    
    if (q) {
      query.$text = { $search: q }
    }
    
    if (category) {
      query.category = category
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') }
    }
    
    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {}
      if (priceMin !== undefined) query.price.$gte = priceMin * 100 // Convert to cents
      if (priceMax !== undefined) query.price.$lte = priceMax * 100
    }
    
    // Build sort
    let sortOption: any = {}
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 }
        break
      case 'price_desc':
        sortOption = { price: -1 }
        break
      case 'newest':
      default:
        sortOption = { createdAt: -1 }
    }
    
    const skip = (page - 1) * pageSize
    
    const products = await Product
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .lean()
    
    const total = await Product.countDocuments(query)
    
    return NextResponse.json({
      items: products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}