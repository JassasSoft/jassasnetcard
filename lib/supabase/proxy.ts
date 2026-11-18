import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const isAuthenticated = Boolean(data?.claims)
  const pathname = request.nextUrl.pathname

  const isDashboard =
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/')

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const adminUserIds = (process.env.ADMIN_USER_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
  const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : ''
  const isAdmin = Boolean(userId && adminUserIds.includes(userId))

  // Same-origin validation for browser mutations prevents cross-site request forgery.
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  if (pathname.startsWith('/api/') && isMutation) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    let sameOrigin = false

    try {
      if (origin) sameOrigin = new URL(origin).origin === request.nextUrl.origin
      else if (referer) sameOrigin = new URL(referer).origin === request.nextUrl.origin
    } catch {
      sameOrigin = false
    }

    if (!sameOrigin) {
      return NextResponse.json(
        { success: false, message: 'تم رفض الطلب لأسباب أمنية.' },
        { status: 403, headers: { 'Cache-Control': 'private, no-store' } }
      )
    }
  }

  const isLogin = pathname === '/login'
  const isRegister = pathname === '/register'

  // Every API route is authenticated unless it is explicitly handled before this gate.
  const isProtectedApi = pathname.startsWith('/api/')

  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.search = ''
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Server-side UUID allowlist. Browser storage and user-editable metadata are not trusted.
    if (!isAdmin) {
      return new NextResponse('Not Found', {
        status: 404,
        headers: { 'Cache-Control': 'private, no-store' },
      })
    }
  }

  if (isDashboard || isProtectedApi) {
    if (!isAuthenticated) {
      if (isProtectedApi) {
        return NextResponse.json(
          {
            success: false,
            message: 'يرجى تسجيل الدخول أولاً.',
          },
          {
            status: 401,
            headers: { 'Cache-Control': 'private, no-store' },
          }
        )
      }

      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.search = ''
      url.searchParams.set('redirect', pathname)

      return NextResponse.redirect(url)
    }
  }

  if ((isLogin || isRegister) && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''

    return NextResponse.redirect(url)
  }

  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
