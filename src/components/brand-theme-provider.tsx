"use client"

import { type ReactNode } from "react"
import { getPalette, type BrandPalette } from "@/lib/brand-palettes"

type Props = {
  paletteName: string
  children: ReactNode
}

export function BrandThemeProvider({ paletteName, children }: Props) {
  const p = getPalette(paletteName)

  const vars = {
    "--brand-primary": p.primary,
    "--brand-primary-hover": p.primaryHover,
    "--brand-secondary": p.secondary,
    "--brand-accent": p.accent,
    "--brand-accent-light": p.accentLight,
    "--brand-text": p.text,
    "--brand-text-on-primary": p.textOnPrimary,
    "--brand-border": p.border,
    "--brand-muted": p.muted,
    "--brand-premium-card-from": p.premiumCardFrom,
    "--brand-premium-card-to": p.premiumCardTo,
    "--brand-premium-border": p.premiumBorder,
  } as React.CSSProperties

  return <div style={vars}>{children}</div>
}
