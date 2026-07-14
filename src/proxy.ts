import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { checkRateLimit } from "@/lib/rate-limit"

export const config = {
  matcher: ["/", "/clientes/:path*", "/barbeiros/:path*", "/planos/:path*", "/servicos/:path*", "/api/auth/callback/credentials"],
}

export async function proxy(request: NextRequest) {
  const isAuthPath = request.nextUrl.pathname.startsWith("/api/auth")

  if (isAuthPath) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")
      ?? "127.0.0.1"

    const result = checkRateLimit(ip)

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em instantes." },
        { status: 429 },
      )
    }

    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
