import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  // Public routes – now includes PWA files
  const publicRoutes = [
    '/', '/login', '/signup', '/events', '/offers', '/api', '/unauthorized',
    '/test-venues', '/auth/callback', '/admin/venues', '/dashboard/zbp',
    '/sw.js', '/manifest.json', '/sw'  // PWA service worker & manifest
  ]
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)
  // Also allow any path starting with /icons/ (for PWA icons)
  const isIconRoute = request.nextUrl.pathname.startsWith('/icons/')

  if (!user && !isPublicRoute && !isIconRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
