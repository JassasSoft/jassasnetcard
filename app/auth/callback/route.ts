import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const requestedNext = url.searchParams.get("next") || "/dashboard"

  let nextUrl: URL
  try {
    const candidate = new URL(requestedNext, url.origin)
    nextUrl =
      requestedNext.startsWith("/") && candidate.origin === url.origin
        ? candidate
        : new URL("/dashboard", url.origin)
  } catch {
    nextUrl = new URL("/dashboard", url.origin)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(nextUrl)
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation", url.origin),
  )
}
