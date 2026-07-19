export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "team"
  | "gallery"
  | "testimonials"
  | "hours"
  | "contact"
  | "booking"
  | "team-carousel"
  | "full-page"

export type WebsiteSection = {
  id: string
  type: SectionType
  title: string
  enabled: boolean
  content: Record<string, unknown>
}

export type WebsiteData = {
  enabled: boolean
  sections: WebsiteSection[]
}

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero (Banner Principal)",
  about: "Sobre",
  services: "Serviços",
  team: "Equipe",
  gallery: "Galeria",
  testimonials: "Depoimentos",
  hours: "Horários",
  contact: "Contato",
  booking: "Agendamento",
  "team-carousel": "Equipe (Carrossel Premium)",
  "full-page": "Template Completo",
}

export const TITLE_SIZES = [
  { value: "2xl", label: "Pequeno" },
  { value: "3xl", label: "Médio" },
  { value: "4xl", label: "Grande" },
  { value: "5xl", label: "Extra Grande" },
]

export const DESC_SIZES = [
  { value: "sm", label: "Pequeno" },
  { value: "base", label: "Médio" },
  { value: "lg", label: "Grande" },
  { value: "xl", label: "Extra Grande" },
]

export const ALIGN_OPTIONS = [
  { value: "left", label: "Esquerda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Direita" },
]

export const BG_COLORS = [
  { label: "Branco", value: "#FFFFFF" },
  { label: "Off White", value: "#F8F8F8" },
  { label: "Creme", value: "#FFF8F0" },
  { label: "Bege", value: "#F5F0E8" },
  { label: "Gelo", value: "#F0EDE8" },
  { label: "Cinza Claro", value: "#E8E8E8" },
  { label: "Cinza Médio", value: "#888888" },
  { label: "Carbon", value: "#111111" },
  { label: "Charcoal", value: "#1A1A1A" },
  { label: "Preto", value: "#080808" },
]

const DEFAULT_STYLE = {
  bgColor: "#FFFFFF",
  titleColor: "#111111",
  titleSize: "3xl",
  titleAlign: "center",
}

const DEFAULT_HERO_STYLE = {
  ...DEFAULT_STYLE,
  bgColor: "#080808",
  titleColor: "#FFFFFF",
  titleSize: "5xl",
  titleAlign: "center",
  descColor: "#FFFFFF99",
  descSize: "lg",
  descAlign: "center",
}

export const DEFAULT_SECTIONS: WebsiteSection[] = [
  {
    id: "hero",
    type: "hero",
    title: "Hero",
    enabled: true,
    content: {
      title: "", subtitle: "", ctaText: "Agende Agora", secondaryCta: "Conheça a Experiência",
      backgroundUrl: null, overlay: "#00000066", heightVh: 85,
      years: "10+", clients: "5.000+", satisfaction: "98%",
      ...DEFAULT_HERO_STYLE,
    },
  },
  {
    id: "about",
    type: "about",
    title: "Sobre",
    enabled: true,
    content: { title: "Sobre Nós", text: "", imageUrl: null, stats: [], ...DEFAULT_STYLE, descColor: "#52525B", descSize: "base", descAlign: "center" },
  },
  {
    id: "services",
    type: "services",
    title: "Serviços",
    enabled: true,
    content: { title: "Nossos Serviços", ...DEFAULT_STYLE },
  },
  {
    id: "team",
    type: "team",
    title: "Equipe",
    enabled: true,
    content: { title: "Nossa Equipe", ...DEFAULT_STYLE },
  },
  {
    id: "gallery",
    type: "gallery",
    title: "Galeria",
    enabled: true,
    content: { title: "Galeria", images: [], ...DEFAULT_STYLE },
  },
  {
    id: "testimonials",
    type: "testimonials",
    title: "Depoimentos",
    enabled: true,
    content: { title: "O Que Nossos Clientes Dizem", items: [], ...DEFAULT_STYLE, descColor: "#52525B", descSize: "base", descAlign: "center" },
  },
  {
    id: "hours",
    type: "hours",
    title: "Horários",
    enabled: true,
    content: { title: "Horários de Funcionamento", ...DEFAULT_STYLE },
  },
  {
    id: "contact",
    type: "contact",
    title: "Contato",
    enabled: true,
    content: { title: "Contato", showMap: true, ...DEFAULT_STYLE },
  },
  {
    id: "booking",
    type: "booking",
    title: "Agendamento",
    enabled: true,
    content: { title: "Pronto para Agendar?", ctaText: "Agende Online", ...DEFAULT_STYLE, descColor: "#52525B", descSize: "base", descAlign: "center" },
  },
  {
    id: "full-page",
    type: "full-page",
    title: "Template Completo",
    enabled: true,
    content: { templateId: "classic" },
  },
]
