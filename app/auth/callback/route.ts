import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const tokenHash = url.searchParams.get("token_hash")
  const otpType = url.searchParams.get("type")
  const requestedNext = url.searchParams.get("next") || "/dashboard"

  let nextUrl: URL

  try {
    const candidate = new URL(requestedNext, url.origin)

    nextUrl =
      requestedNext.startsWith("/") &&
      candidate.origin === url.origin
        ? candidate
        : new URL("/dashboard", url.origin)
  } catch {
    nextUrl = new URL("/dashboard", url.origin)
  }

  const isRecovery = nextUrl.pathname === "/reset-password"

  try {
    const supabase = await createClient()
    let verificationError = null

    if (code) {
      const { error } =
        await supabase.auth.exchangeCodeForSession(code)

      verificationError = error
    } else if (tokenHash && otpType === "recovery") {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      })

      verificationError = error
    } else {
      verificationError = new Error("Missing or unsupported authentication token")
    }

    if (!verificationError) {
      const response = NextResponse.redirect(nextUrl)
      response.headers.set("Cache-Control", "private, no-store")
      return response
    }
  } catch {
    // Continue to the appropriate failure page below.
  }

  const failureUrl = isRecovery
    ? new URL("/reset-password?error=invalid_link", url.origin)
    : new URL("/login?error=confirmation", url.origin)

  const response = NextResponse.redirect(failureUrl)
  response.headers.set("Cache-Control", "private, no-store")
  return response
}
