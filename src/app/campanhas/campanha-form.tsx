"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DatePicker } from "@/components/ui/date-picker"
import { CampaignCardPreview } from "@/app/campanhas/campanha-card-preview"
import { ColorPickerPopover, DualColorPopover } from "@/components/ui/color-picker-popover"
import {
  ChevronLeftIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  TypeIcon,
  SubtitlesIcon,
  FileTextIcon,
  HighlighterIcon,
  TagIcon,
  MousePointerClickIcon,
  AlignLeftIcon,
  SparklesIcon,
  Loader2Icon,
  SquareIcon,
  ImageIcon,
  LayersIcon,
  PlayIcon,
  ChevronDownIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type CampaignFormData = {
  id?: string
  title: string
  subtitle: string
  description: string
  highlightTitle: string
  badge: string
  buttonText: string
  buttonUrl: string
  titleColor: string
  subtitleColor: string
  descriptionColor: string
  highlightColor: string
  titleSize: string
  buttonColor: string
  buttonTextColor: string
  badgeColor: string
  badgeTextColor: string
  cardStyle: string
  textAlign: string
  cardBackground: string
  gradientStart: string
  gradientEnd: string
  gradientDirection: string
  borderEnabled: boolean
  borderColor: string
  borderWidth: string
  animation: string
  redemptionType: string
  requiresCoupon: boolean
  couponPrefix: string
  startDate: string
  endDate: string
  isActive: boolean
}

const COLOR_SWATCHES = [
  { label: "Branco", value: "#FFFFFF" },
  { label: "Laranja", value: "#F97316" },
  { label: "Preto", value: "#111111" },
  { label: "Azul", value: "#3B82F6" },
  { label: "Verde", value: "#22C55E" },
  { label: "Vermelho", value: "#EF4444" },
  { label: "Roxo", value: "#A855F7" },
  { label: "Rosa", value: "#EC4899" },
  { label: "Âmbar", value: "#F59E0B" },
  { label: "Ciano", value: "#06B6D4" },
  { label: "Dourado", value: "#D4A853" },
  { label: "Cinza", value: "#71717A" },
]

const TITLE_SIZES = [
  { label: "Pequeno", value: "text-2xl" },
  { label: "Médio", value: "text-3xl" },
  { label: "Grande", value: "text-4xl" },
  { label: "Extra Grande", value: "text-5xl" },
]

const BADGE_OPTIONS = [
  { label: "Nenhum", value: "" },
  { label: "Novidade", value: "Novidade" },
  { label: "Tempo Limitado", value: "Tempo Limitado" },
  { label: "Exclusivo", value: "Exclusivo" },
  { label: "Promoção", value: "Promoção" },
  { label: "Imperdível", value: "Imperdível" },
]

const CARD_STYLES = [
  { id: "classic", label: "Clássico", desc: "Limpo e profissional" },
  { id: "gradient", label: "Gradiente", desc: "Vibrante e energético" },
  { id: "premium", label: "Premium", desc: "Luxuoso e sofisticado" },
  { id: "premium-gradient", label: "Premium Gradiente", desc: "Luxuoso com gradiente" },
  { id: "minimal", label: "Minimalista", desc: "Moderno e elegante" },
  { id: "bordered", label: "Destacado", desc: "Alta visibilidade" },
  { id: "highlight", label: "Barra Lateral", desc: "Com destaque colorido" },
]

const GRADIENT_DIRECTIONS = [
  { label: "↗", value: "to-br" },
  { label: "→", value: "to-r" },
  { label: "↘", value: "to-b" },
  { label: "↙", value: "to-bl" },
  { label: "←", value: "to-l" },
  { label: "↖", value: "to-tl" },
]

const BORDER_WIDTHS = [
  { label: "Fina", value: "border" },
  { label: "Média", value: "border-2" },
  { label: "Grossa", value: "border-4" },
]

const ANIMATIONS = [
  { label: "Nenhuma", value: "none", desc: "Sem animação" },
  { label: "Pulse", value: "pulse", desc: "Pulsação suave" },
  { label: "Brilho", value: "glow", desc: "Brilho ao redor" },
  { label: "Brilho interno", value: "shimmer", desc: "Brilho deslizante" },
  { label: "Flutuar", value: "float", desc: "Elevação ao passar" },
]

export function CampaignForm({ initialData }: { initialData?: CampaignFormData }) {
  const router = useRouter()
  const isEditing = !!initialData?.id

  const [enviando, setEnviando] = useState(false)
  const [gerandoIA, setGerandoIA] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [title, setTitle] = useState(initialData?.title ?? "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [highlightTitle, setHighlightTitle] = useState(initialData?.highlightTitle ?? "")
  const [badge, setBadge] = useState(initialData?.badge ?? "")
  const [badgeColor, setBadgeColor] = useState(initialData?.badgeColor ?? "#F97316")
  const [badgeTextColor, setBadgeTextColor] = useState(initialData?.badgeTextColor ?? "#FFFFFF")
  const [buttonText, setButtonText] = useState(initialData?.buttonText ?? "Saiba Mais")
  const [buttonUrl] = useState(initialData?.buttonUrl ?? "")
  const [titleColor, setTitleColor] = useState(initialData?.titleColor ?? "#FFFFFF")
  const [subtitleColor, setSubtitleColor] = useState(initialData?.subtitleColor ?? "#FFFFFF")
  const [descriptionColor, setDescriptionColor] = useState(initialData?.descriptionColor ?? "#FFFFFF")
  const [highlightColor, setHighlightColor] = useState(initialData?.highlightColor ?? "#FFFFFF")
  const [titleSize, setTitleSize] = useState(initialData?.titleSize ?? "text-3xl")
  const [buttonColor, setButtonColor] = useState(initialData?.buttonColor ?? "#F97316")
  const [buttonTextColor, setButtonTextColor] = useState(initialData?.buttonTextColor ?? "#FFFFFF")
  const [cardStyle, setCardStyle] = useState(initialData?.cardStyle ?? "premium")
  const [textAlign, setTextAlign] = useState(initialData?.textAlign ?? "left")
  const [cardBackground, setCardBackground] = useState(initialData?.cardBackground ?? "")
  const [gradientStart, setGradientStart] = useState(initialData?.gradientStart ?? "")
  const [gradientEnd, setGradientEnd] = useState(initialData?.gradientEnd ?? "")
  const [gradientDirection, setGradientDirection] = useState(initialData?.gradientDirection ?? "to-br")
  const [borderEnabled, setBorderEnabled] = useState(initialData?.borderEnabled ?? true)
  const [borderColor, setBorderColor] = useState(initialData?.borderColor ?? "")
  const [borderWidth, setBorderWidth] = useState(initialData?.borderWidth ?? "border")
  const [animation, setAnimation] = useState(initialData?.animation ?? "none")
  const [redemptionType, setRedemptionType] = useState(initialData?.redemptionType ?? "unique")
  const [requiresCoupon, setRequiresCoupon] = useState(initialData?.requiresCoupon ?? false)
  const [couponPrefix, setCouponPrefix] = useState(initialData?.couponPrefix ?? "")
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "")
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "")
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const previewData = {
    title,
    subtitle: subtitle || null,
    description: description || null,
    highlightTitle: highlightTitle || null,
    badge: badge || null,
    badgeColor,
    badgeTextColor,
    buttonText,
    titleColor,
    subtitleColor,
    descriptionColor,
    highlightColor,
    titleSize,
    buttonColor,
    buttonTextColor,
    cardStyle,
    textAlign,
    cardBackground: cardBackground || null,
    gradientStart: gradientStart || null,
    gradientEnd: gradientEnd || null,
    gradientDirection,
    borderEnabled,
    borderColor: borderColor || null,
    borderWidth,
    animation,
    endDate: endDate || undefined,
  }

  const gerarComIA = useCallback(async () => {
    if (!title || title.trim().length === 0) return
    setGerandoIA(true)
    setErro(null)
    try {
      const res = await fetch("/api/gerar/campanha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Erro ao gerar com IA")
      }
      const data = await res.json()
      if (data.subtitle) setSubtitle(data.subtitle)
      if (data.description) setDescription(data.description)
      if (data.highlightTitle) setHighlightTitle(data.highlightTitle)
      if (data.buttonText) setButtonText(data.buttonText)
      if (data.badge) setBadge(data.badge)
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao gerar conteúdo")
    } finally {
      setGerandoIA(false)
    }
  }, [title])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!title || !startDate || !endDate) {
      setErro("Preencha o título, data de início e data de fim.")
      return
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setErro("A data de fim deve ser posterior à data de início.")
      return
    }

    setEnviando(true)

    const url = isEditing
      ? `/api/campanhas/${initialData!.id}`
      : "/api/campanhas"
    const method = isEditing ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subtitle: subtitle || null,
        description: description || null,
        highlightTitle: highlightTitle || null,
        badge: badge || null,
        badgeColor,
        badgeTextColor,
        buttonText,
        buttonUrl: buttonUrl || null,
        titleColor,
        subtitleColor,
        descriptionColor,
        highlightColor,
        titleSize,
        buttonColor,
        buttonTextColor,
        textAlign,
        cardStyle,
        cardBackground: cardBackground || null,
        gradientStart: gradientStart || null,
        gradientEnd: gradientEnd || null,
        gradientDirection,
        borderEnabled,
        borderColor: borderColor || null,
        borderWidth,
        animation,
        redemptionType,
        requiresCoupon,
        couponPrefix: couponPrefix || null,
        startDate,
        endDate,
        isActive,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setErro(data.error ?? "Erro ao salvar campanha.")
      setEnviando(false)
      return
    }

    setEnviando(false)
    window.location.href = "/campanhas"
  }

  function CollapsibleSection({
    id,
    title,
    icon: Icon,
    children,
  }: {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode
  }) {
    const isOpen = !collapsed.has(id)
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <button
          type="button"
          onClick={() => toggleCollapse(id)}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Icon className="size-4 text-zinc-400" />
            {title}
          </h3>
          <ChevronDownIcon
            className={cn(
              "size-4 text-zinc-400 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>
        {isOpen && <div className={cn("mt-5", title === "Borda" ? "space-y-5" : "space-y-4")}>{children}</div>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
        {erro && (
          <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangleIcon className="size-4 shrink-0" />
            {erro}
          </div>
        )}

        {/* Conteúdo */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <FileTextIcon className="size-4 text-zinc-400" />
            Conteúdo da Campanha
          </h3>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Corte a R$ 24,99"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                  required
                />
              </div>
              <button
                type="button"
                onClick={gerarComIA}
                disabled={gerandoIA || !title.trim()}
                title="Gerar campanha com IA"
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50"
              >
                {gerandoIA ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <SparklesIcon className="size-4" />
                )}
                <span className="hidden sm:inline">{gerandoIA ? "Gerando..." : "Gerar com IA"}</span>
              </button>
              <ColorPickerPopover value={titleColor} onChange={setTitleColor} label="Cor do Título" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Subtítulo</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SubtitlesIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ex: Promoção válida para novos clientes"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
              <ColorPickerPopover value={subtitleColor} onChange={setSubtitleColor} label="Cor do Subtítulo" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descrição</label>
            <div className="flex gap-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explique detalhes da campanha..."
                rows={3}
                className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 resize-none"
              />
              <ColorPickerPopover value={descriptionColor} onChange={setDescriptionColor} label="Cor da Descrição" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Título em Destaque</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HighlighterIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={highlightTitle}
                  onChange={(e) => setHighlightTitle(e.target.value)}
                  placeholder="Ex: Primeiro corte por apenas"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
              <ColorPickerPopover value={highlightColor} onChange={setHighlightColor} label="Cor do Destaque" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Texto do Botão
              </label>
              <div className="relative">
                <MousePointerClickIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Saiba Mais"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>Badge / Tag</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="appearance-none w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-8 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
                  >
                    {BADGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <DualColorPopover
                  valueA={badgeColor}
                  onChangeA={setBadgeColor}
                  labelA="Fundo"
                  valueB={badgeTextColor}
                  onChangeB={setBadgeTextColor}
                  labelB="Texto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Estilo Visual */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <SparklesIcon className="size-4 text-zinc-400" />
            Estilo Visual
          </h3>

          {/* Card Style */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Estilo do Card</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CARD_STYLES.map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setCardStyle(style.id)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    cardStyle === style.id
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 ring-1 ring-orange-500"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-3 rounded-full ${
                        style.id === "classic" ? "bg-white border border-zinc-300" :
                        style.id === "gradient" ? "bg-gradient-to-br from-orange-400 to-orange-700" :
                        style.id === "premium" ? "bg-zinc-800 border border-amber-500/50" :
                        style.id === "premium-gradient" ? "bg-gradient-to-br from-zinc-800 to-amber-800 border border-amber-500/30" :
                        style.id === "minimal" ? "bg-transparent border border-dashed border-zinc-400" :
                        style.id === "bordered" ? "bg-white border-2 border-orange-500" :
                        "bg-white border-l-4 border-orange-500 rounded-l-none"
                      }`}
                    />
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                      {style.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                    {style.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Background (for non-gradient styles) */}
          {(cardStyle === "classic" || cardStyle === "minimal" || cardStyle === "bordered" || cardStyle === "highlight") && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-3.5" />
                  Cor de Fundo Personalizada
                </div>
              </label>
              <input
                type="text"
                value={cardBackground}
                onChange={(e) => setCardBackground(e.target.value)}
                placeholder="Hex color (ex: #FFFFFF) — vazio = padrão"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-50 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          )}

          {/* Gradient customization */}
          {(cardStyle === "gradient" || cardStyle === "premium-gradient") && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  <div className="flex items-center gap-2">
                    <LayersIcon className="size-3.5" />
                    Cores do Gradiente
                  </div>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">Cor Inicial</label>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {COLOR_SWATCHES.slice(0, 6).map((swatch) => (
                        <button
                          type="button"
                          key={swatch.value}
                          onClick={() => setGradientStart(swatch.value === gradientStart ? "" : swatch.value)}
                          className={`size-6 rounded-full border-2 transition-all ${
                            gradientStart === swatch.value
                              ? "border-orange-500 scale-110 shadow-md"
                              : "border-transparent hover:scale-110"
                          }`}
                          style={{ backgroundColor: swatch.value }}
                        />
                      ))}
                    </div>
                    <input
                      type="text"
                      value={gradientStart}
                      onChange={(e) => setGradientStart(e.target.value)}
                      placeholder="#F97316"
                      className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-50 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">Cor Final</label>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {COLOR_SWATCHES.slice(0, 6).map((swatch) => (
                        <button
                          type="button"
                          key={swatch.value}
                          onClick={() => setGradientEnd(swatch.value === gradientEnd ? "" : swatch.value)}
                          className={`size-6 rounded-full border-2 transition-all ${
                            gradientEnd === swatch.value
                              ? "border-orange-500 scale-110 shadow-md"
                              : "border-transparent hover:scale-110"
                          }`}
                          style={{ backgroundColor: swatch.value }}
                        />
                      ))}
                    </div>
                    <input
                      type="text"
                      value={gradientEnd}
                      onChange={(e) => setGradientEnd(e.target.value)}
                      placeholder="#EA580C"
                      className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-50 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">Direção do Gradiente</label>
                <div className="grid grid-cols-6 gap-1">
                  {GRADIENT_DIRECTIONS.map((dir) => (
                    <button
                      type="button"
                      key={dir.value}
                      onClick={() => setGradientDirection(dir.value)}
                      className={`rounded-lg border py-2 text-center text-sm transition-all ${
                        gradientDirection === dir.value
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 ring-1 ring-orange-500"
                          : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {dir.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Title Size */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              <div className="flex items-center gap-2">
                <TypeIcon className="size-3.5" />
                Tamanho do Título
              </div>
            </label>
            <div className="flex gap-1">
              {TITLE_SIZES.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setTitleSize(opt.value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    titleSize === opt.value
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 ring-1 ring-orange-500"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              <div className="flex items-center gap-2">
                <AlignLeftIcon className="size-3.5" />
                Alinhamento
              </div>
            </label>
            <div className="flex gap-1">
              {["left", "center", "right"].map((align) => (
                <button
                  type="button"
                  key={align}
                  onClick={() => setTextAlign(align)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    textAlign === align
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 ring-1 ring-orange-500"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {align === "left" ? "Esquerda" : align === "center" ? "Centro" : "Direita"}
                </button>
              ))}
            </div>
          </div>

          {/* Button Color - Dual Popover */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              <div className="flex items-center gap-2">
                <MousePointerClickIcon className="size-3.5" />
                Cores do Botão
              </div>
            </label>
            <div className="flex items-center gap-3">
              <DualColorPopover
                valueA={buttonColor}
                onChangeA={setButtonColor}
                labelA="Fundo"
                valueB={buttonTextColor}
                onChangeB={setButtonTextColor}
                labelB="Texto"
              />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Fundo: <span className="font-mono text-zinc-700 dark:text-zinc-300">{buttonColor}</span>
                {" / "}
                Texto: <span className="font-mono text-zinc-700 dark:text-zinc-300">{buttonTextColor}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Borda (collapsible) */}
        <CollapsibleSection id="borda" title="Borda" icon={SquareIcon}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setBorderEnabled(!borderEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50 ${
                borderEnabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
              role="switch"
              aria-checked={borderEnabled}
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                  borderEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {borderEnabled ? "Borda visível" : "Sem borda"}
            </span>
          </div>

          {borderEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Espessura</label>
                <div className="flex gap-1">
                  {BORDER_WIDTHS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setBorderWidth(opt.value)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        borderWidth === opt.value
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 ring-1 ring-orange-500"
                          : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  <div className="flex items-center gap-2">
                    <SquareIcon className="size-3.5" />
                    Cor da Borda
                  </div>
                </label>
                <div className="flex items-center gap-2">
                  <ColorPickerPopover
                    value={borderColor || "#D4D4D8"}
                    onChange={(c) => setBorderColor(c === "#D4D4D8" ? "" : c)}
                    label="Cor da Borda"
                  />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {borderColor ? (
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">{borderColor}</span>
                    ) : (
                      "Cor padrão do estilo"
                    )}
                  </span>
                </div>
              </div>
            </>
          )}
        </CollapsibleSection>

        {/* Animação (collapsible) */}
        <CollapsibleSection id="animacao" title="Animação" icon={PlayIcon}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ANIMATIONS.map((anim) => (
              <button
                type="button"
                key={anim.value}
                onClick={() => setAnimation(anim.value)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  animation === anim.value
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 ring-1 ring-orange-500"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-3 rounded-full ${
                      anim.value === "pulse" ? "bg-orange-400 animate-pulse" :
                      anim.value === "glow" ? "bg-amber-400 shadow-lg shadow-amber-500/50" :
                      anim.value === "shimmer" ? "bg-gradient-to-r from-zinc-300 to-zinc-100" :
                      anim.value === "float" ? "bg-blue-400" :
                      "bg-zinc-300"
                    }`}
                  />
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                    {anim.label}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {anim.desc}
                </p>
              </button>
            ))}
          </div>
        </CollapsibleSection>

        {/* Resgate */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <TagIcon className="size-4 text-zinc-400" />
            Resgate
          </h3>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Tipo de Resgate</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRedemptionType("unique")}
                className={`flex-1 rounded-lg border p-3 text-left transition-all ${
                  redemptionType === "unique"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 ring-1 ring-orange-500"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">Única vez por cliente</span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Cliente pode usar uma única vez</p>
              </button>
              <button
                type="button"
                onClick={() => setRedemptionType("recurring")}
                className={`flex-1 rounded-lg border p-3 text-left transition-all ${
                  redemptionType === "recurring"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 ring-1 ring-orange-500"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">Recorrência</span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Cliente pode usar várias vezes</p>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRequiresCoupon(!requiresCoupon)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50 ${
                requiresCoupon ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
              role="switch"
              aria-checked={requiresCoupon}
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                  requiresCoupon ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Exigir cupom</span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Cliente retira um cupom para apresentar na barbearia</p>
            </div>
          </div>

          {requiresCoupon && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Prefixo do Cupom</label>
              <input
                type="text"
                value={couponPrefix}
                onChange={(e) => setCouponPrefix(e.target.value)}
                placeholder="Ex: CORTE24 (código gerado: CORTE24-A7X3K)"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 font-mono"
              />
              {couponPrefix && (
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Exemplo de código: <span className="font-mono text-zinc-700 dark:text-zinc-300">{couponPrefix.toUpperCase().replace(/[^A-Z0-9]/g, "") || "CUPOM"}-A7X3K</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Duração */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Duração da Campanha
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Data de Início <span className="text-red-500">*</span>
              </label>
              <DatePicker value={startDate} onChange={setStartDate} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Data de Fim <span className="text-red-500">*</span>
              </label>
              <DatePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50 ${
                isActive ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
              role="switch"
              aria-checked={isActive}
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {isActive ? "Campanha ativa" : "Campanha inativa"}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeftIcon className="size-4" />
            Voltar
          </button>

          <button
            type="submit"
            disabled={enviando || !title || !startDate || !endDate}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-6 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          >
            {enviando ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-white dark:border-zinc-900 border-t-transparent" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle2Icon className="size-4" />
                {isEditing ? "Salvar alterações" : "Criar campanha"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-4">
              <ImageIcon className="size-4 text-zinc-400" />
              Preview ao Vivo
            </h3>

            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700">
                <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-red-400" />
                    <div className="size-2.5 rounded-full bg-yellow-400" />
                    <div className="size-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-[10px] text-zinc-400 font-mono">locarize.com.br</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-950">
                  <CampaignCardPreview data={previewData} />
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="text-[10px] text-zinc-400">
                  Visualização em tempo real
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 mb-3 uppercase tracking-wider">
              Estilos de Card
            </h3>
            <div className="space-y-2">
              {CARD_STYLES.map((style) => (
                <div key={style.id} className="flex items-center gap-3">
                  <div
                    className={`size-6 rounded-lg border ${
                      style.id === "classic" ? "bg-white border-zinc-300" :
                      style.id === "gradient" ? "bg-gradient-to-br from-orange-400 to-orange-700 border-orange-500" :
                      style.id === "premium" ? "bg-zinc-800 border-amber-500/30" :
                      style.id === "premium-gradient" ? "bg-gradient-to-br from-zinc-800 to-amber-800 border-amber-500/30" :
                      style.id === "minimal" ? "bg-transparent border-dashed border-zinc-400" :
                      style.id === "bordered" ? "bg-white border-2 border-orange-500" :
                      "bg-white border-l-4 border-orange-500 rounded-l-sm"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50">{style.label}</p>
                    <p className="text-[10px] text-zinc-500">{style.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
