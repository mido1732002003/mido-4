import { USER_ROLES, ORDER_STATUS } from '@/lib/constants'

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export interface CartItem {
  productId: string
  title: string
  price: number
  quantity: number
  image?: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  total: number
}

export interface SearchParams {
  q?: string
  category?: string
  tags?: string
  priceMin?: number
  priceMax?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
  page?: number
  pageSize?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}