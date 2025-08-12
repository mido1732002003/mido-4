export const SITE_NAME = 'Digital Marketplace'
export const SITE_DESCRIPTION = 'Premium digital products for creators'
export const SITE_URL = process.env.APP_URL || 'http://localhost:3000'

export const CURRENCY = 'usd'
export const CURRENCY_SYMBOL = '$'

export const DOWNLOAD_EXPIRY_HOURS = 48
export const ITEMS_PER_PAGE = 12

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FULFILLED: 'fulfilled',
  REFUNDED: 'refunded',
} as const

export const PRODUCT_CATEGORIES = [
  { value: 'ebooks', label: 'E-books' },
  { value: 'templates', label: 'Templates' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'graphics', label: 'Graphics' },
] as const