"use client"

import { useEffect, useRef } from "react"
import type { WebsiteSection, WebsiteData } from "./website-types"
import { ImageIcon, Star, MapPin, Phone, ChevronRight, Scissors, Crown, ShieldCheck, Calendar, ArrowRight } from "lucide-react"
import { Instagram } from "@/components/ui/icons"
import TradicionalPage from "@/app/(public)/exemplos/tradicional/page"
import ContemporaneoPage from "@/app/(public)/exemplos/contemporaneo/page"
import PremiumPage from "@/app/(public)/exemplos/premium/page"
import FotograficoPage from "@/app/(public)/exemplos/fotografico/page"
import GptPage from "@/app/(public)/exemplos/gpt/page"
import GptCompletoPage from "@/app/(public)/exemplos/gpt-completo/page"
import Premium3Page from "@/app/(public)/exemplos/premium-3/page"
import { reapplyEdits, type EditEntry } from "./dom-edits"

type Props = {
  data: WebsiteData
  companyName: string
  companySlug: string
  companyDescription: string | null
  companyPhone: string | null
  companyWhatsapp: string | null
  companyEmail: string | null
  companyAddress: Record<string, string> | null
  companySocialMedia: Record<string, string> | null
  services: { name: string; price: number | null }[]
  barbers: { name: string; image: string | null }[]
  hours: { dayOfWeek: number; openTime: string | null; closeTime: string | null; isOpen: boolean }[]
}

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default function WebsitePreview({
  data, companyName, companySlug, companyDescription, companyPhone, companyWhatsapp,
  companyEmail, companyAddress, companySocialMedia, services, barbers, hours,
}: Props) {
  const enabled = data.sections.filter((s) => s.enabled)
  const appliedRef = useRef<Set<string>>(new Set())

  // Aplica edições salvas quando seções são (re)montadas
  useEffect(() => {
    // Remove do cache seções que foram desativadas
    for (const id of appliedRef.current) {
      if (!data.sections.some(s => s.id === id && s.enabled)) {
        appliedRef.current.delete(id)
      }
    }
    // Aplica edições para seções ativas ainda não aplicadas
    for (const section of data.sections) {
      if (!section.enabled) continue
      if (appliedRef.current.has(section.id)) continue
      const edits = (section.content as Record<string, unknown>)._edits as EditEntry[] | undefined
      if (!edits || edits.length === 0) continue
      const wrapper = document.querySelector(`[data-section-id="${section.id}"]`)
      if (!wrapper) continue
      reapplyEdits(wrapper as HTMLElement, edits)
      appliedRef.current.add(section.id)
    }
  })

  if (!data.enabled) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
        Site desativado. Ative na aba ao lado.
      </div>
    )
  }

  if (enabled.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
        Nenhuma seção habilitada. Ative seções ao lado.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-inner overflow-y-auto max-h-full">
      {data.sections
        .filter((s) => s.enabled)
        .map((section) => (
          <div key={section.id} data-section-id={section.id} className="section-wrapper relative">
            <SectionRenderer
              section={section}
              companyName={companyName}
              companySlug={companySlug}
              companyDescription={companyDescription}
              companyPhone={companyPhone}
              companyWhatsapp={companyWhatsapp}
              companyEmail={companyEmail}
              companyAddress={companyAddress}
              companySocialMedia={companySocialMedia}
              services={services}
              barbers={barbers}
              hours={hours}
            />
          </div>
        ))}
    </div>
  )
}



function SectionRenderer({
  section,
  companyName,
  companySlug,
  companyDescription,
  companyPhone,
  companyWhatsapp,
  companyEmail,
  companyAddress,
  companySocialMedia,
  services,
  barbers,
  hours,
}: {
  section: WebsiteSection
  companyName: string
  companySlug: string
  companyDescription: string | null
  companyPhone: string | null
  companyWhatsapp: string | null
  companyEmail: string | null
  companyAddress: Record<string, string> | null
  companySocialMedia: Record<string, string> | null
  services: { name: string; price: number | null }[]
  barbers: { name: string; image: string | null }[]
  hours: { dayOfWeek: number; openTime: string | null; closeTime: string | null; isOpen: boolean }[]
}) {
  const _html = (section.content as Record<string, unknown>)._html as string | undefined
  if (_html) {
    return <div className="section-html" dangerouslySetInnerHTML={{ __html: _html }} />
  }

  switch (section.type) {
    case "hero":
      return <HeroSection section={section} companyName={companyName} />
    case "about":
      return <AboutSection section={section} companyDescription={companyDescription} />
    case "services":
      return <ServicesSection section={section} services={services} />
    case "team":
      return <TeamSection section={section} barbers={barbers} />
    case "team-carousel":
      return <TeamCarouselSection section={section} barbers={barbers} />
    case "gallery":
      return <GallerySection section={section} />
    case "testimonials":
      return <TestimonialsSection section={section} />
    case "hours":
      return <HoursSection section={section} hours={hours} />
    case "contact":
      return <ContactSection section={section} companyPhone={companyPhone} companyWhatsapp={companyWhatsapp} companyEmail={companyEmail} companyAddress={companyAddress} companySocialMedia={companySocialMedia} />
    case "booking":
      return <BookingSection section={section} />
    case "full-page":
      return <FullPageSection section={section} slug={companySlug} />
    default:
      return null
  }
}

type SectionContent = Record<string, unknown>

function s(content: SectionContent) {
  return {
    bgColor: (content.bgColor as string) ?? "#FFFFFF",
    titleColor: (content.titleColor as string) ?? "#111111",
    titleSize: (content.titleSize as string) ?? "3xl",
    titleAlign: (content.titleAlign as string) ?? "center",
    descColor: (content.descColor as string) ?? "#52525B",
    descSize: (content.descSize as string) ?? "base",
    descAlign: (content.descAlign as string) ?? "center",
  }
}

function SectionTitle({ content, children }: { content: SectionContent; children: React.ReactNode }) {
  const st = s(content)
  const sizeMap: Record<string, string> = { "2xl": "text-2xl", "3xl": "text-3xl", "4xl": "text-4xl", "5xl": "text-5xl" }
  const alignMap: Record<string, string> = { left: "text-left", center: "text-center", right: "text-right" }
  return (
    <h2
      className={`font-bold mb-4 ${sizeMap[st.titleSize] ?? "text-3xl"} ${alignMap[st.titleAlign] ?? "text-center"}`}
      style={{ color: st.titleColor }}
    >
      {children}
    </h2>
  )
}

function SectionDesc({ content, children }: { content: SectionContent; children: React.ReactNode }) {
  const st = s(content)
  const sizeMap: Record<string, string> = { sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl" }
  const alignMap: Record<string, string> = { left: "text-left", center: "text-center", right: "text-right" }
  return (
    <p
      className={`leading-relaxed ${sizeMap[st.descSize] ?? "text-base"} ${alignMap[st.descAlign] ?? "text-center"}`}
      style={{ color: st.descColor }}
    >
      {children}
    </p>
  )
}

// ─── HERO ───
function HeroSection({ section, companyName }: { section: WebsiteSection; companyName: string }) {
  const c = section.content
  const st = s(c)
  const bg = c.backgroundUrl as string | null | undefined
  const minH = (c.heightVh as number) ?? 85
  const title = c.title as string
  const subtitle = c.subtitle as string
  const ctaText = c.ctaText as string
  const secondaryCta = c.secondaryCta as string
  const years = c.years as string
  const clients = c.clients as string
  const satisfaction = c.satisfaction as string
  const sizeMap: Record<string, string> = { "2xl": "text-3xl sm:text-4xl", "3xl": "text-4xl sm:text-5xl", "4xl": "text-5xl sm:text-6xl", "5xl": "text-5xl sm:text-7xl" }
  const alignMap: Record<string, string> = { left: "text-left", center: "text-center", right: "text-right" }
  return (
    <div
      className="relative flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{
        minHeight: `${minH}vh`,
        backgroundColor: st.bgColor,
        color: st.titleColor,
        ...(bg ? { background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg}) center/cover` } : {}),
      }}
    >
      {(years || clients || satisfaction) && (
        <div className={`flex gap-6 mb-8 text-xs uppercase tracking-widest font-medium ${alignMap[st.titleAlign]}`} style={{ color: st.descColor }}>
          {years && <span>{years} de experiência</span>}
          {clients && <span>{clients} clientes</span>}
          {satisfaction && <span>{satisfaction} satisfação</span>}
        </div>
      )}
      <h1
        className={`font-bold mb-4 leading-tight tracking-tight ${sizeMap[st.titleSize] ?? "text-4xl sm:text-5xl"} ${alignMap[st.titleAlign] ?? "text-center"}`}
        style={{ color: st.titleColor }}
      >
        {title || companyName || "Sua Barbearia"}
      </h1>
      {subtitle && (
        <p className={`max-w-lg mb-8 font-light tracking-wide ${st.descSize === "sm" ? "text-sm" : st.descSize === "base" ? "text-base" : st.descSize === "lg" ? "text-lg" : "text-xl"} ${alignMap[st.descAlign] ?? "text-center"}`}
           style={{ color: st.descColor }}>
          {subtitle}
        </p>
      )}
      <div className={`flex gap-4 flex-wrap ${alignMap[st.titleAlign] === "text-center" ? "justify-center" : alignMap[st.titleAlign] === "text-right" ? "justify-end" : "justify-start"}`}>
        {ctaText && <button className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all text-sm tracking-wider shadow-lg">{ctaText}</button>}
        {secondaryCta && <button className="px-8 py-3 border border-white/20 hover:border-white/40 rounded-lg text-sm tracking-wider backdrop-blur-sm">{secondaryCta}</button>}
      </div>
    </div>
  )
}

// ─── SOBRE ───
function AboutSection({ section, companyDescription }: { section: WebsiteSection; companyDescription: string | null }) {
  const c = section.content
  const st = s(c)
  const stats = (c.stats as Array<{ label: string; value: string }>) ?? []
  const text = (c.text as string) || companyDescription || ""
  if (!c.title && !text) return null
  return (
    <div className="px-6 py-16 border-b border-zinc-100" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      <div className="flex flex-col md:flex-row gap-8 items-center max-w-3xl mx-auto mb-8">
        {(c.imageUrl as string) && (
          <div className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100"><img src={c.imageUrl as string} alt="" className="w-full h-full object-cover" /></div>
        )}
        {text && <SectionDesc content={c}>{text}</SectionDesc>}
      </div>
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto" style={{ color: st.titleColor }}>
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs mt-0.5 opacity-60" style={{ color: st.descColor }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SERVIÇOS ───
function ServicesSection({ section, services }: { section: WebsiteSection; services: { name: string; price: number | null }[] }) {
  const c = section.content
  const st = s(c)
  if (services.length === 0) return null
  return (
    <div className="px-6 py-16 border-b border-zinc-100" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      <div className="max-w-lg mx-auto space-y-3">
        {services.map((svc, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-100 last:border-0">
            <span className="font-medium" style={{ color: st.titleColor }}>{svc.name}</span>
            <span style={{ color: st.descColor }}>{svc.price ? `R$${svc.price.toFixed(2)}` : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── EQUIPE ───
function TeamSection({ section, barbers }: { section: WebsiteSection; barbers: { name: string; image: string | null }[] }) {
  const c = section.content
  const st = s(c)
  if (barbers.length === 0) return null
  return (
    <div className="px-6 py-16 border-b border-zinc-100" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      <div className="flex flex-wrap gap-6 justify-center">
        {barbers.map((barber, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden">
              {barber.image ? <img src={barber.image} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold" style={{ color: st.descColor }}>{barber.name.charAt(0)}</span>}
            </div>
            <span className="text-sm font-medium" style={{ color: st.titleColor }}>{barber.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── EQUIPE (CARROSSEL PREMIUM) ───
type TeamMember = {
  name: string
  role: string
  bio: string
  image: string | null
  featured?: boolean
  tag?: string
}

const ICONS = [Scissors, Crown, ShieldCheck]
const ROLES = ["Especialista em Cortes Clássicos", "Especialista em Barba e Design", "Especialista em Degradê", "Master Barbeiro", "Visagista"]
const BIOS = [
  "Apaixonado por cortes tradicionais e modernos. Mais de 8 anos de experiência entregando precisão e elegância em cada detalhe.",
  "Especialista em barbas e visagismo masculino. Detalhista, criativo e referência em desenho de barba e acabamento premium.",
  "Mestre do degradê e tendências modernas. Técnicas avançadas para entregar um visual único e cheio de personalidade.",
  "Profissional experiente com expertise em todos os estilos. Referência em atendimento personalizado e resultados impecáveis.",
  "Artista da tesoura e máquina. Referência em transformações e cortes personalizados para cada tipo de rosto.",
]

function buildMembers(c: Record<string, unknown>, barbers: { name: string; image: string | null }[]): TeamMember[] {
  const fromContent = c.members as TeamMember[] | undefined
  if (fromContent && fromContent.length > 0) return fromContent
  return barbers.map((b, i) => ({
    name: b.name,
    image: b.image,
    role: ROLES[i % ROLES.length],
    bio: BIOS[i % BIOS.length],
    featured: i === Math.min(1, barbers.length - 1),
    tag: i === 1 ? "MAIS EXPERIENTE" : undefined,
  }))
}

function TeamCarouselSection({ section, barbers }: { section: WebsiteSection; barbers: { name: string; image: string | null }[] }) {
  const c = section.content
  const st = s(c)
  const subtitle = c.subtitle as string
  const members = buildMembers(c, barbers)
  if (members.length === 0) return null
  return (
    <div className="py-16 px-4 md:px-8 flex flex-col items-center justify-center" style={{ backgroundColor: st.bgColor }}>
      {/* Header */}
      <div className="text-center max-w-2xl mb-12 flex flex-col items-center">
        <span className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "#F59E0B" }}>
          Nossa Equipe
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase" style={{ color: st.titleColor }}>
          Profissionais <span style={{ color: "#F59E0B" }}>que Elevam</span>
        </h2>
        <Crown className="w-5 h-5 mb-4" style={{ color: "#F59E0B", fill: "rgba(245,158,11,0.2)" }} />
        {subtitle && (
          <p className="text-sm md:text-base leading-relaxed" style={{ color: st.descColor }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Carrossel */}
      <div className="w-full max-w-5xl relative px-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <div
                key={index}
                className={`overflow-hidden relative transition-all duration-300 rounded-2xl ${
                  member.featured
                    ? "border-2 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    : "border hover:border-zinc-700"
                }`}
                style={{
                  backgroundColor: "#121212",
                  borderColor: member.featured ? "#F59E0B" : "#27272A",
                  boxShadow: member.featured ? "0 0 20px rgba(245,158,11,0.15)" : undefined,
                }}
              >
                {/* Tag de Destaque */}
                {member.featured && member.tag && (
                  <div className="absolute top-0 right-6 text-black font-black text-[9px] tracking-wider px-2 py-3 flex flex-col items-center z-10 rounded-b-sm shadow-md" style={{ backgroundColor: "#F59E0B" }}>
                    <span className="text-[12px] mb-0.5">★</span>
                    <span className="text-center leading-none max-w-[60px]">{member.tag}</span>
                  </div>
                )}

                {/* Imagem */}
                <div className="relative h-72 w-full overflow-hidden" style={{ backgroundColor: "#18181B" }}>
                  <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, #121212, transparent, transparent)" }} />
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: "grayscale(1) contrast(1.25)" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                  />
                </div>

                {/* Conteúdo */}
                <div className="p-6 pt-0 flex flex-col items-center text-center relative z-20">
                  {/* Ícone Redondo Flutuante */}
                  <div
                    className="p-3 rounded-full border mb-4 -mt-7 shadow-lg"
                    style={{
                      backgroundColor: "#121212",
                      borderColor: member.featured ? "#F59E0B" : "#3F3F46",
                      color: member.featured ? "#F59E0B" : "rgba(245,158,11,0.8)",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Nome e Cargo */}
                  <h3 className="text-xl font-bold tracking-wide mb-1" style={{ color: "#F4F4F5" }}>{member.name}</h3>
                  <div className="flex items-center gap-2 mb-4 w-full justify-center">
                    <span className="h-[1px] w-4" style={{ backgroundColor: "rgba(245,158,11,0.5)" }} />
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#F59E0B" }}>{member.role}</p>
                    <span className="h-[1px] w-4" style={{ backgroundColor: "rgba(245,158,11,0.5)" }} />
                  </div>

                  {/* Bio */}
                  <p className="text-xs min-h-[64px] leading-relaxed mb-6 px-2" style={{ color: "#A1A1AA" }}>{member.bio}</p>

                  {/* Redes Sociais */}
                  <div className="flex gap-3">
                    <button className="p-2 rounded-full border transition-colors" style={{ borderColor: "#27272A", color: "rgba(245,158,11,0.8)", backgroundColor: "rgba(24,24,27,0.5)" }}>
                      <Instagram className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full border transition-colors" style={{ borderColor: "#27272A", color: "rgba(245,158,11,0.8)", backgroundColor: "rgba(24,24,27,0.5)" }}>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.451 5.438 1.453 5.494 0 9.961-4.47 9.964-9.97.002-2.666-1.033-5.174-2.907-7.05-1.876-1.877-4.374-2.912-7.043-2.913-5.499 0-9.966 4.47-9.969 9.971-.001 1.995.521 3.946 1.512 5.66l-.98 3.58 3.673-.963zm10.741-7.345c-.29-.145-1.714-.846-1.979-.942-.266-.096-.459-.145-.653.146-.193.29-.748.942-.917 1.134-.169.192-.338.217-.628.072-.29-.145-1.223-.45-2.33-1.439-.86-.767-1.44-1.716-1.609-2.007-.169-.29-.018-.447.127-.591.13-.13.29-.338.435-.507.145-.169.193-.29.29-.483.096-.193.048-.361-.024-.507-.072-.145-.653-1.573-.895-2.152-.236-.569-.475-.492-.653-.501-.17-.008-.363-.01-.556-.01-.193 0-.507.072-.772.361-.266.29-1.014.99-1.014 2.415 0 1.425 1.038 2.801 1.182 2.994.145.193 2.043 3.12 4.949 4.373.691.298 1.232.476 1.653.61.694.22 1.326.19 1.825.115.556-.083 1.714-.7 1.956-1.374.242-.675.242-1.253.169-1.374-.073-.121-.266-.193-.556-.338z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full border transition-colors" style={{ borderColor: "#27272A", color: "rgba(245,158,11,0.8)", backgroundColor: "rgba(24,24,27,0.5)" }}>
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Banner de Agendamento */}
      <div className="w-full max-w-5xl border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: "rgba(39,39,42,0.8)", backgroundColor: "rgba(18,18,18,0.5)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
          <div className="p-4 rounded-xl shadow-md" style={{ backgroundColor: "rgba(24,24,27,0.8)", borderColor: "#27272A", border: "1px solid #27272A", color: "#F59E0B" }}>
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-wide uppercase" style={{ color: "#F4F4F5" }}>
              {(c.bookingTitle as string) || "Agende com seu barbeiro preferido"}
            </h4>
            <p className="text-sm mt-1" style={{ color: "#A1A1AA" }}>
              {(c.bookingDesc as string) || "Escolha o profissional e o horário ideal para você."}
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all duration-300 uppercase tracking-wider text-xs md:text-sm shadow-lg justify-center group" style={{ backgroundColor: "#F59E0B", color: "#09090B", boxShadow: "0 10px 15px -3px rgba(245,158,11,0.1)" }}>
          {(c.ctaText as string) || "Agendar Agora"}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

// ─── GALERIA ───
function GallerySection({ section }: { section: WebsiteSection }) {
  const c = section.content
  const st = s(c)
  const images = (c.images as string[]) ?? []
  return (
    <div className="px-6 py-16 border-b border-zinc-100" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      {images.length === 0 ? (
        <div className="flex items-center justify-center gap-2 opacity-40"><ImageIcon className="w-5 h-5" /><span className="text-sm">Nenhuma imagem</span></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {images.map((url, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-zinc-100"><img src={url} alt="" className="w-full h-full object-cover" /></div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── DEPOIMENTOS ───
function TestimonialsSection({ section }: { section: WebsiteSection }) {
  const c = section.content
  const st = s(c)
  const items = (c.items as Array<{ name: string; text: string }>) ?? []
  return (
    <div className="px-6 py-16 border-b border-zinc-100" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      {items.length === 0 ? (
        <div className="flex items-center justify-center gap-2 opacity-40"><Star className="w-5 h-5" /><span className="text-sm">Nenhum depoimento</span></div>
      ) : (
        <div className="flex flex-col gap-4 max-w-lg mx-auto">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: st.bgColor === "#FFFFFF" ? "#F8F8F8" : st.bgColor, borderColor: st.bgColor === "#FFFFFF" ? "#E8E8E8" : "#333333" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden" style={{ backgroundColor: st.titleColor, color: st.bgColor }}>
                  {item.name.charAt(0)}
                </div>
                <span className="text-sm font-medium" style={{ color: st.titleColor }}>{item.name}</span>
              </div>
              <SectionDesc content={c}>"{item.text}"</SectionDesc>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── HORÁRIOS ───
function HoursSection({ section, hours }: { section: WebsiteSection; hours: { dayOfWeek: number; openTime: string | null; closeTime: string | null; isOpen: boolean }[] }) {
  const c = section.content
  const st = s(c)
  if (hours.length === 0) return null
  const sorted = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  return (
    <div className="px-6 py-16 border-b border-zinc-100" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      <div className="max-w-sm mx-auto space-y-2">
        {sorted.map((h, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="font-medium" style={{ color: st.titleColor }}>{DAY_LABELS[h.dayOfWeek]}</span>
            <span style={{ color: h.isOpen ? st.descColor : "#EF4444" }}>
              {h.isOpen ? `${h.openTime?.slice(0, 5) ?? "—"} às ${h.closeTime?.slice(0, 5) ?? "—"}` : "Fechado"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CONTATO ───
function ContactSection({ section, companyPhone, companyWhatsapp, companyEmail, companyAddress, companySocialMedia }: {
  section: WebsiteSection
  companyPhone: string | null
  companyWhatsapp: string | null
  companyEmail: string | null
  companyAddress: Record<string, string> | null
  companySocialMedia: Record<string, string> | null
}) {
  const c = section.content
  const st = s(c)
  const addr = companyAddress ? Object.values(companyAddress).filter(Boolean).join(", ") : null
  const instagram = companySocialMedia?.instagram
  const facebook = companySocialMedia?.facebook
  return (
    <div className="px-6 py-16 border-b border-zinc-100" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
        {addr && <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 shrink-0" style={{ color: st.titleColor }} /><span style={{ color: st.descColor }}>{addr}</span></div>}
        {companyPhone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 shrink-0" style={{ color: st.titleColor }} /><span style={{ color: st.descColor }}>{companyPhone}</span></div>}
        {companyWhatsapp && (
          <a href={`https://wa.me/${companyWhatsapp.replace(/\D/g, "")}`} target="_blank" className="flex items-center gap-2 text-sm hover:opacity-80">
            <Phone className="w-4 h-4 shrink-0" style={{ color: "#22C55E" }} /><span style={{ color: st.descColor }}>WhatsApp</span>
          </a>
        )}
        {companyEmail && <div className="flex items-center gap-2 text-sm"><span className="w-4 h-4 shrink-0" /> <span style={{ color: st.descColor }}>{companyEmail}</span></div>}
        {(instagram || facebook) && (
          <div className="flex items-center gap-4 mt-2">
            {instagram && (
              <a href={`https://instagram.com/${instagram}`} target="_blank" className="flex items-center gap-1.5 text-sm hover:opacity-80" style={{ color: st.titleColor }}>
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            )}
            {facebook && (
              <a href={`https://facebook.com/${facebook}`} target="_blank" className="flex items-center gap-1.5 text-sm hover:opacity-80" style={{ color: st.titleColor }}>
                <Instagram className="w-4 h-4" /> Facebook
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── BOOKING ───
function BookingSection({ section }: { section: WebsiteSection }) {
  const c = section.content
  const st = s(c)
  return (
    <div className="px-6 py-16 text-center" style={{ backgroundColor: st.bgColor }}>
      <SectionTitle content={c}>{c.title as string}</SectionTitle>
      <button className="inline-flex items-center gap-1 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all text-sm tracking-wider shadow-lg">
        {(c.ctaText as string) || "Agende Online"}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── TEMPLATE COMPLETO ───
function FullPageSection({ section, slug }: { section: WebsiteSection; slug: string }) {
  const templateId = section.content.templateId as string
  switch (templateId) {
    case "classic":
      return <TradicionalPage />
    case "urban":
      return <ContemporaneoPage />
    case "premium":
      return <PremiumPage />
    case "photographic":
      return <FotograficoPage />
    case "gpt-dark":
      return <GptPage />
    case "gpt-completo":
      return <GptCompletoPage />
    case "premium-3":
      return <Premium3Page slug={slug} />
    default:
      return <TradicionalPage />
  }
}
