import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt'

// Simple in-memory rate limiting (note: won't work across serverless instances)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

function rateLimit(ip: string): boolean {
  const limit = Number(process.env.RATE_LIMIT_MAX) || 100
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000 // 1 minute
  
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit || now - userLimit.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return true
  }
  
  if (userLimit.count >= limit) {
    return false
  }
  
  userLimit.count++
  return true
}

export async function middleware(request: NextRequest) {
  // Get IP for rate limiting
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!rateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }
  
  // Temporarily disable admin and account route protection
  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   const token = await getToken({ req: request })
  //   
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/auth/signin', request.url))
  //   }
  //   
  //   if (token.role !== 'ADMIN') {
  //     return NextResponse.redirect(new URL('/', request.url))
  //   }
  // }
  // 
  // if (request.nextUrl.pathname.startsWith('/account')) {
  //   const token = await getToken({ req: request })
  //   
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/auth/signin', request.url))
  //   }
  // }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/api/:path*',
  ],
}