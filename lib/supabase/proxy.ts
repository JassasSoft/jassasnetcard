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

  const isLogin = pathname === '/login'
  const isRegister = pathname === '/register'

  const isLegacyAuthApi =
    pathname === '/api/login' ||
    pathname === '/api/register'

  const isProtectedApi =
    pathname.startsWith('/api/') && !isLegacyAuthApi

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
