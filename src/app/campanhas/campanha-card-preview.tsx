"use client"

import { cn } from "@/lib/utils"

type CampaignData = {
  title: string
  subtitle: string | null
  description: string | null
  highlightTitle: string | null
  badge: string | null
  badgeColor?: string
  badgeTextColor?: string
  buttonText: string
  titleColor: string
  subtitleColor?: string
  descriptionColor?: string
  highlightColor?: string
  titleSize: string
  buttonColor: string
  buttonTextColor: string
  cardStyle: string
  textAlign: string
  cardBackground: string | null
  gradientStart: string | null
  gradientEnd: string | null
  gradientDirection: string
  borderEnabled: boolean
  borderColor: string | null
  borderWidth: string
  animation: string
  endDate?: string
}

const titleSizeMap: Record<string, string> = {
  "text-2xl": "text-2xl",
  "text-3xl": "text-3xl",
  "text-4xl": "text-4xl",
  "text-5xl": "text-5xl",
}

const alignMap: Record<string, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
}

const animationMap: Record<string, string> = {
  none: "",
  pulse: "animate-pulse",
  glow: "animate-pulse shadow-lg shadow-orange-500/20",
  shimmer: "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent overflow-hidden",
  float: "hover:-translate-y-1 transition-transform duration-300",
}

function getAnimationClass(anim: string, isGradient: boolean): string {
  if (anim === "glow") {
    return isGradient
      ? "animate-pulse shadow-lg shadow-orange-500/20"
      : "animate-pulse shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
  }
  return animationMap[anim] || ""
}

export function CampaignCardPreview({ data }: { data: CampaignData }) {
  const size = titleSizeMap[data.titleSize] || "text-3xl"
  const align = alignMap[data.textAlign] || "text-left items-start"
  const isGradient = data.cardStyle === "gradient" || data.cardStyle === "premium" || data.cardStyle === "premium-gradient"
  const isHighlight = data.cardStyle === "highlight"

  const hasCustomGradient = (data.cardStyle === "gradient" || data.cardStyle === "premium-gradient") && data.gradientStart && data.gradientEnd
  const hasCustomBg = data.cardBackground && !isGradient

  function dirCSS(d: string): string {
    return d === "to-br" ? "bottom right" : d === "to-tr" ? "top right" : d === "to-bl" ? "bottom left" : d === "to-tl" ? "top left" : d === "to-r" ? "right" : d === "to-l" ? "left" : d === "to-t" ? "top" : "bottom"
  }

  const defaultGradientBg = isGradient && !hasCustomGradient
    ? data.cardStyle === "premium"
      ? `linear-gradient(to ${dirCSS(data.gradientDirection)}, #18181b, #09090b)`
      : data.cardStyle === "premium-gradient"
        ? `linear-gradient(to ${dirCSS(data.gradientDirection)}, #18181b, #27272a, #78350f)`
        : `linear-gradient(to ${dirCSS(data.gradientDirection)}, #F97316, #EA580C, #C2410C)`
    : undefined

  const gradientStyle: React.CSSProperties | undefined = hasCustomGradient
    ? { backgroundImage: `linear-gradient(to ${dirCSS(data.gradientDirection)}, ${data.gradientStart}, ${data.gradientEnd})` }
    : defaultGradientBg
      ? { backgroundImage: defaultGradientBg }
      : undefined

  const borderClass =
    !data.borderEnabled
      ? "border-0"
      : data.cardStyle === "bordered"
        ? "border-2"
        : data.cardStyle === "minimal"
          ? "border border-dashed"
          : data.borderWidth || "border"

  const borderStyleValue: React.CSSProperties | undefined =
    data.borderEnabled && data.borderColor
      ? { borderColor: data.borderColor }
      : undefined

  const defaultBorder = data.cardStyle === "bordered" && !data.borderColor
    ? "border-orange-500 dark:border-orange-400"
    : data.cardStyle === "premium" && !data.borderColor
      ? "border-amber-500/20"
      : data.cardStyle === "minimal"
        ? "border-zinc-300 dark:border-zinc-700"
        : "border-zinc-200 dark:border-zinc-700"

  const animClass = getAnimationClass(data.animation, isGradient)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-8 transition-all",
        isGradient && !hasCustomGradient && (
          data.cardStyle === "premium"
            ? "text-white shadow-xl shadow-amber-500/5"
            : data.cardStyle === "premium-gradient"
              ? "text-white shadow-xl shadow-amber-500/10 border border-amber-500/20"
              : "text-white shadow-lg"),
        !isGradient && !hasCustomBg && data.cardStyle === "classic" && "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50",
        !isGradient && !hasCustomBg && data.cardStyle === "minimal" && "bg-transparent text-zinc-900 dark:text-zinc-50",
        !isGradient && !hasCustomBg && data.cardStyle !== "classic" && data.cardStyle !== "minimal" && "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50",
        borderClass,
        !data.borderColor && defaultBorder,
        isHighlight && "flex",
        animClass,
      )}
      style={{
        ...(gradientStyle || {}),
        ...(hasCustomBg && data.cardBackground ? { backgroundColor: data.cardBackground } : {}),
        ...(borderStyleValue || {}),
      } as React.CSSProperties}
    >
      {isHighlight && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
          style={{
            background: data.gradientStart
              ? `linear-gradient(to bottom, ${data.gradientStart}, ${data.gradientEnd || data.gradientStart})`
              : "#F97316",
          } as React.CSSProperties}
        />
      )}

      <div className={cn("flex flex-col gap-4 relative", isHighlight && "ml-3", align)}>
        {data.badge && (
          <span
            className="inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: data.badgeColor || "#F97316",
              color: data.badgeTextColor || "#FFFFFF",
            }}
          >
            {data.badge}
          </span>
        )}

        <h2
          className={cn("font-bold leading-tight", size)}
          style={{ color: data.titleColor }}
        >
          {data.title || "Título da Campanha"}
        </h2>

        {data.subtitle && (
          <p className="text-sm" style={{ color: data.subtitleColor || data.titleColor + "CC" }}>
            {data.subtitle}
          </p>
        )}

        {data.highlightTitle && (
          <p className="text-lg font-semibold" style={{ color: data.highlightColor || data.titleColor }}>
            {data.highlightTitle}
          </p>
        )}

        {data.description && (
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: data.descriptionColor || data.titleColor + "99" }}>
            {data.description}
          </p>
        )}

        <div className="mt-2">
          <span
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-all"
            style={{
              backgroundColor: data.buttonColor || "#F97316",
              color: data.buttonTextColor || "#FFFFFF",
            }}
          >
            {data.buttonText || "Saiba Mais"}
          </span>
        </div>

        {data.endDate && (
          <p className={cn("text-[11px] mt-1", isGradient || hasCustomGradient ? "text-white/60" : "text-zinc-400 dark:text-zinc-500")}>
            Válida até {new Date(data.endDate).toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>
    </div>
  )
}
