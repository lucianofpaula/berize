import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { checkRateLimit } from "@/lib/rate-limit"

const PUBLIC_ROUTES = ["/", "/login", "/exemplos", "/exemplos/:path*"]

export const config = {
  matcher: ["/", "/login", "/exemplos/:path*", "/clientes/:path*", "/barbeiros/:path*", "/planos/:path*", "/servicos/:path*", "/agendamentos/:path*", "/api/auth/callback/credentials"],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthPath = pathname.startsWith("/api/auth")
  const isPublic = PUBLIC_ROUTES.some((route) => {
    if (route.endsWith("/:path*")) {
      return pathname.startsWith(route.replace("/:path*", ""))
    }
    return pathname === route
  })

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

  if (isPublic) return NextResponse.next()

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
