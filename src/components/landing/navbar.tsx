"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Building2 } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const isAuthenticated = status === "authenticated" && !!session?.user
  const firstName = session?.user?.name?.split(" ")[0] ?? ""
  const avatarUrl = session?.user?.image
  const isOwner = session?.user?.isOwner ?? false

  return (
    <nav className="fixed top-0 w-full z-50 bg-ld-surface/80 backdrop-blur-xl border-b border-ld-border-subtle shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-gutter py-3 md:py-4 max-w-container-max-width mx-auto">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-ld-primary tracking-tight">
          localize.com.br
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`font-body-md text-body-md transition-colors ${
              pathname === "/"
                ? "text-ld-primary border-b-2 border-ld-primary pb-1"
                : "text-ld-on-surface-variant hover:text-ld-primary"
            }`}
          >
            Home
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 md:gap-4">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-ld-surface-variant/30 animate-pulse" />
          ) : isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ld-on-surface-variant hover:text-ld-primary hover:bg-ld-surface-variant/30 transition-colors"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-ld-primary-container flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{firstName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-ld-foreground hidden lg:inline">{firstName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform shrink-0 ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-ld-border-subtle bg-ld-surface-elevated shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-ld-border-subtle">
                    <p className="text-sm font-medium text-ld-foreground truncate">{session.user.name}</p>
                    <p className="text-xs text-ld-on-surface-variant truncate">{session.user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/meu-negocio"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ld-on-surface-variant hover:text-ld-primary hover:bg-ld-surface-variant/30 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 shrink-0" />
                      Painel
                    </Link>

                    {isOwner && (
                      <Link
                        href="/meu-negocio"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ld-on-surface-variant hover:text-ld-primary hover:bg-ld-surface-variant/30 transition-colors"
                      >
                        <Building2 className="w-4 h-4 shrink-0" />
                        Meu Negócio
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-ld-border-subtle py-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ld-on-surface-variant hover:text-red-400 hover:bg-ld-surface-variant/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="rounded-lg border border-ld-border-subtle px-4 py-2 text-sm font-medium text-ld-on-surface-variant hover:text-ld-primary hover:border-ld-primary/30 transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>

        <button className="md:hidden p-2 text-ld-on-surface-variant" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ld-border-subtle bg-ld-surface/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm ${pathname === "/" ? "text-ld-primary font-semibold" : "text-ld-on-surface-variant"}`}
            >
              Home
            </Link>
            <hr className="border-ld-border-subtle" />
            {status === "loading" ? (
              <div className="py-2 text-sm text-ld-on-surface-variant">Carregando...</div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-ld-primary-container flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{firstName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ld-foreground truncate">{session.user.name}</p>
                    <p className="text-xs text-ld-on-surface-variant truncate">{session.user.email}</p>
                  </div>
                </div>

                <Link href="/meu-negocio" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-sm text-ld-on-surface-variant">
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  Painel
                </Link>

                {isOwner && (
                  <Link href="/meu-negocio" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-sm text-ld-on-surface-variant">
                    <Building2 className="w-4 h-4 shrink-0" />
                    Meu Negócio
                  </Link>
                )}

                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false) }}
                  className="flex items-center gap-2 py-2 text-sm text-ld-on-surface-variant hover:text-red-400"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="block py-2 text-sm text-ld-on-surface-variant">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
