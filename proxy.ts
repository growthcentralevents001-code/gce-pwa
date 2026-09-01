import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { resolveLegacyDashboardPath } from '@/lib/architecture/workspace/registry'

const PUBLIC_EXACT = [
  '/',
  '/sw.js',
  '/manifest.json',
  // Marketing landings only — member CX under /connect/* requires auth
  '/connect',
  '/connect-bdp',
  '/marketplace-bdp',
  '/marketplace',
  '/enterprise',
]

const PUBLIC_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/auth/callback',
  '/events',
  '/venues',
  '/offers',
  '/about',
  '/terms',
  '/privacy',
  '/contact',
  '/for-partners',
  '/partners',
  '/unauthorized',
  '/offline',
  '/the-circle',
  '/memberships',
  '/how-membership-works',
  '/how-referrals',
  '/apply',
  '/onboarding',
  '/affiliate',
  '/zbp',
  '/bdm-dashboard',
  '/venue/apply',
  '/venue/plans',
  '/icons',
]

const PUBLIC_API_PREFIXES = [
  '/api/health',
  '/api/architecture/health',
  '/api/public-search',
  '/api/cities',
  '/api/venue-plans',
  '/api/venues/by-city',
  '/api/check-referral',
  '/api/affiliate/track',
  '/api/webhooks/payments',
  '/api/contact',
  '/api/marketplace/engagement',
]

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) return true
  if (PUBLIC_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) return true
  return false
}

function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

/** Phase 14B — retire legacy Venue dashboard siblings before auth gate. */
function resolveRetiredVenueSibling(pathname: string): string | null {
  const p = pathname.replace(/\/$/, '') || pathname
  if (p === '/dashboard/venue/events' || p.startsWith('/dashboard/venue/events/')) {
    if (p.startsWith('/dashboard/venue/events/edit/')) {
      const id = p.slice('/dashboard/venue/events/edit/'.length)
      return id ? `/venue/events/${id}` : '/venue/events'
    }
    return '/venue/events'
  }
  if (p === '/dashboard/venue/create-event') return '/venue/events/new'
  if (p === '/dashboard/venue/bookings') return '/venue/bookings'
  return null
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const venueSibling = resolveRetiredVenueSibling(pathname)
  if (venueSibling) {
    return NextResponse.redirect(new URL(venueSibling, request.url))
  }

  if (isPublicPath(pathname)) {
    return supabaseResponse
  }

  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Phase 2 legacy quarantine: inactive commercial workspaces do not grant entitlement (FD-039).
  const legacy = resolveLegacyDashboardPath(pathname)
  if (legacy && legacy.target === '/unauthorized') {
    const redirectUrl = new URL('/unauthorized', request.url)
    redirectUrl.searchParams.set('reason', legacy.reason)
    return NextResponse.redirect(redirectUrl)
  }
  if (legacy && legacy.target !== '/unauthorized') {
    const dest = `/dashboard/${legacy.target}`
    const current = pathname.replace(/\/$/, '') || pathname
    // Skip no-op redirects (e.g. already on the canonical path).
    if (current !== dest) {
      return NextResponse.redirect(new URL(dest, request.url))
    }
  }

  // Batch 10: mega-admin UI retired — Ops is canonical (Batch 8).
  // Prefer next.config redirects; proxy also covers authenticated hits.
  if (isAdminPath(pathname)) {
    return NextResponse.redirect(new URL('/ops', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
