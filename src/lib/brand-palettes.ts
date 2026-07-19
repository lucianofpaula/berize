export type BrandPalette = {
  name: string
  label: string
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  accentLight: string
  text: string
  textOnPrimary: string
  border: string
  muted: string
  premiumCardFrom: string
  premiumCardTo: string
  premiumBorder: string
}

export const BRAND_PALETTES: Record<string, BrandPalette> = {
  classic: {
    name: "classic",
    label: "Clássico",
    primary: "#F59E0B",
    primaryHover: "#D97706",
    secondary: "#18181B",
    accent: "#FEF3C7",
    accentLight: "#FFFBEB",
    text: "#18181B",
    textOnPrimary: "#000000",
    border: "#D97706",
    muted: "#71717A",
    premiumCardFrom: "#18181B",
    premiumCardTo: "#18181B",
    premiumBorder: "#F59E0B",
  },
  gold: {
    name: "gold",
    label: "Black & Gold",
    primary: "#F59E0B",
    primaryHover: "#EAB308",
    secondary: "#000000",
    accent: "#1A1A1A",
    accentLight: "#27272A",
    text: "#FFFFFF",
    textOnPrimary: "#000000",
    border: "#F59E0B",
    muted: "#A1A1AA",
    premiumCardFrom: "#000000",
    premiumCardTo: "#0A0A0A",
    premiumBorder: "#F59E0B",
  },
  blue: {
    name: "blue",
    label: "Blue Steel",
    primary: "#3B82F6",
    primaryHover: "#2563EB",
    secondary: "#0F172A",
    accent: "#EFF6FF",
    accentLight: "#DBEAFE",
    text: "#0F172A",
    textOnPrimary: "#FFFFFF",
    border: "#2563EB",
    muted: "#64748B",
    premiumCardFrom: "#0F172A",
    premiumCardTo: "#0F172A",
    premiumBorder: "#3B82F6",
  },
  forest: {
    name: "forest",
    label: "Forest",
    primary: "#10B981",
    primaryHover: "#059669",
    secondary: "#111827",
    accent: "#ECFDF5",
    accentLight: "#D1FAE5",
    text: "#111827",
    textOnPrimary: "#FFFFFF",
    border: "#059669",
    muted: "#6B7280",
    premiumCardFrom: "#111827",
    premiumCardTo: "#111827",
    premiumBorder: "#10B981",
  },
  ruby: {
    name: "ruby",
    label: "Ruby",
    primary: "#EF4444",
    primaryHover: "#DC2626",
    secondary: "#111827",
    accent: "#FEF2F2",
    accentLight: "#FEE2E2",
    text: "#111827",
    textOnPrimary: "#FFFFFF",
    border: "#DC2626",
    muted: "#6B7280",
    premiumCardFrom: "#111827",
    premiumCardTo: "#111827",
    premiumBorder: "#EF4444",
  },
  ocean: {
    name: "ocean",
    label: "Ocean",
    primary: "#06B6D4",
    primaryHover: "#0891B2",
    secondary: "#0F172A",
    accent: "#ECFEFF",
    accentLight: "#CFFAFE",
    text: "#0F172A",
    textOnPrimary: "#FFFFFF",
    border: "#0891B2",
    muted: "#64748B",
    premiumCardFrom: "#0F172A",
    premiumCardTo: "#0F172A",
    premiumBorder: "#06B6D4",
  },
  violet: {
    name: "violet",
    label: "Violet",
    primary: "#8B5CF6",
    primaryHover: "#7C3AED",
    secondary: "#111827",
    accent: "#F5F3FF",
    accentLight: "#EDE9FE",
    text: "#111827",
    textOnPrimary: "#FFFFFF",
    border: "#7C3AED",
    muted: "#6B7280",
    premiumCardFrom: "#111827",
    premiumCardTo: "#111827",
    premiumBorder: "#8B5CF6",
  },
  nature: {
    name: "nature",
    label: "Nature",
    primary: "#84CC16",
    primaryHover: "#65A30D",
    secondary: "#1A2E05",
    accent: "#F7FEE7",
    accentLight: "#ECFCCB",
    text: "#1A2E05",
    textOnPrimary: "#000000",
    border: "#65A30D",
    muted: "#6B7280",
    premiumCardFrom: "#1A2E05",
    premiumCardTo: "#1A2E05",
    premiumBorder: "#84CC16",
  },
}

export function getPalette(name: string): BrandPalette {
  return BRAND_PALETTES[name] ?? BRAND_PALETTES.classic
}
