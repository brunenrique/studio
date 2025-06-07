import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware to enforce HTTPS.
 *
 * It detects the original protocol via the `X-Forwarded-Proto` header if
 * available, which is commonly set by proxies or load balancers. When the
 * header is not present, `request.nextUrl.protocol` is used.
 * If the request was originally made via HTTP, we redirect permanently to the
 * same URL using HTTPS.
 */
export function middleware(request: NextRequest) {
  // Prefer the protocol reported by upstream proxies when available.
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '')

  if (proto === 'http') {
    // Clone the current URL and switch it to HTTPS.
    const url = new URL(request.nextUrl.href)
    url.protocol = 'https:'
    // Issue a 301 permanent redirect to the HTTPS version of this URL.
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Apply middleware to all routes.
export const config = {
  matcher: '/:path*'
}
