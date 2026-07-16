"use client"

import { cn } from "@/lib/utils"

type CampaignData = {
  title: string
  subtitle: string | null
  description: string | null
  highlightTitle: string | null
  badge: string | null
  buttonText: string
  titleColor: string
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

  const gradientStyle: React.CSSProperties | undefined = hasCustomGradient
    ? {
        backgroundImage: `linear-gradient(to ${data.gradientDirection === "to-br" ? "bottom right" : data.gradientDirection === "to-tr" ? "top right" : data.gradientDirection === "to-bl" ? "bottom left" : data.gradientDirection === "to-tl" ? "top left" : data.gradientDirection === "to-r" ? "right" : data.gradientDirection === "to-l" ? "left" : data.gradientDirection === "to-t" ? "top" : "bottom"}, ${data.gradientStart}, ${data.gradientEnd})`,
      }
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
            ? "bg-gradient-to-br from-zinc-900 to-zinc-950 text-white shadow-xl shadow-amber-500/5"
            : data.cardStyle === "premium-gradient"
              ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900 text-white shadow-xl shadow-amber-500/10 border border-amber-500/20"
              : "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg"),
        !isGradient && !hasCustomBg && data.cardStyle === "classic" && "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50",
        !isGradient && !hasCustomBg && data.cardStyle === "minimal" && "bg-transparent text-zinc-900 dark:text-zinc-50",
        !isGradient && !hasCustomBg && data.cardStyle !== "classic" && data.cardStyle !== "minimal" && "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50",
        borderClass,
        !data.borderColor && defaultBorder,
        isHighlight && "flex",
        animClass,
      )}
      style={{
        ...(hasCustomGradient ? gradientStyle : {}),
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
            className={cn(
              "inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
              isGradient || hasCustomGradient
                ? "bg-white/20 text-white backdrop-blur-sm"
                : "bg-orange-500 text-white",
            )}
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
          <p className="text-sm" style={{ color: data.titleColor + "CC" }}>
            {data.subtitle}
          </p>
        )}

        {data.highlightTitle && (
          <p className="text-lg font-semibold" style={{ color: data.titleColor }}>
            {data.highlightTitle}
          </p>
        )}

        {data.description && (
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: data.titleColor + "99" }}>
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
