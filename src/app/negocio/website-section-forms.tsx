"use client"

import { useRef, useState, useEffect } from "react"
import type { WebsiteSection } from "./website-types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import SectionStyleEditor from "./section-style-editor"
import { ImageIcon, Trash2, Plus, Loader2, Upload, Maximize2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

function ImageInput({
  value,
  onChange,
  placeholder,
}: {
  value: string | null | undefined
  onChange: (url: string | null) => void
  placeholder?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        onChange(data.url)
        toast.success("Imagem enviada!")
      } else {
        toast.error("Erro ao enviar imagem.")
      }
    } catch {
      toast.error("Erro ao enviar imagem.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <Input placeholder={placeholder ?? "URL da imagem"} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />
      <Button variant="outline" size="icon" className="shrink-0" disabled={uploading} onClick={() => fileRef.current?.click()} type="button">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
      </Button>
      {value && (
        <Button variant="ghost" size="icon" className="shrink-0 text-red-400 hover:text-red-600" onClick={() => onChange(null)} type="button">
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

// ─── HERO ───
export function HeroForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  const set = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } })
  const height = (c.heightVh as number) ?? 85
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} showDescription />
      <Input placeholder="Título (deixe vazio para usar nome da empresa)" value={(c.title as string) ?? ""} onChange={(e) => set("title", e.target.value)} />
      <Input placeholder="Subtítulo" value={(c.subtitle as string) ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
      <Input placeholder="Texto do botão (ex: Agende Agora)" value={(c.ctaText as string) ?? "Agende Agora"} onChange={(e) => set("ctaText", e.target.value)} />
      <Input placeholder="Texto do botão secundário" value={(c.secondaryCta as string) ?? ""} onChange={(e) => set("secondaryCta", e.target.value)} />
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">Imagem de fundo</label>
        <ImageInput value={c.backgroundUrl as string | null | undefined} onChange={(url) => set("backgroundUrl", url)} placeholder="URL da imagem de fundo" />
      </div>
      <div>
        <label className="text-xs text-zinc-400 mb-1 flex items-center gap-1">
          <Maximize2 className="w-3 h-3" /> Altura: <span className="font-medium text-zinc-600">{height}vh</span>
        </label>
        <Slider value={[height]} onValueChange={([v]) => set("heightVh", v)} min={30} max={100} step={5} />
      </div>
    </div>
  )
}

// ─── SOBRE ───
export function AboutForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  const set = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } })
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} showDescription />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Sobre Nós"} onChange={(e) => set("title", e.target.value)} />
      <Textarea placeholder="Texto descritivo sobre o negócio" rows={4} value={(c.text as string) ?? ""} onChange={(e) => set("text", e.target.value)} />
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">Imagem</label>
        <ImageInput value={c.imageUrl as string | null | undefined} onChange={(url) => set("imageUrl", url)} placeholder="URL da imagem" />
      </div>
    </div>
  )
}

// ─── SERVIÇOS ───
export function ServicesForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Nossos Serviços"} onChange={(e) => onChange({ ...section, content: { ...section.content, title: e.target.value } })} />
      <p className="text-xs text-zinc-400">Os serviços são listados automaticamente do cadastro da empresa.</p>
    </div>
  )
}

// ─── EQUIPE ───
export function TeamForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Nossa Equipe"} onChange={(e) => onChange({ ...section, content: { ...section.content, title: e.target.value } })} />
      <p className="text-xs text-zinc-400">Os barbeiros são listados automaticamente do cadastro da empresa.</p>
    </div>
  )
}

// ─── GALERIA ───
export function GalleryForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  const images = (c.images as string[]) ?? []
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const set = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) { set("images", [...images, data.url]); toast.success("Imagem adicionada!") }
      else { toast.error("Erro ao enviar imagem.") }
    } catch { toast.error("Erro ao enviar imagem.") }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = "" }
  }

  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} />
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Galeria"} onChange={(e) => set("title", e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-zinc-200">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => set("images", images.filter((_, j) => j !== i))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} type="button">
        {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
        Adicionar Imagem
      </Button>
    </div>
  )
}

// ─── DEPOIMENTOS ───
export function TestimonialsForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  const items = (c.items as Array<{ name: string; text: string }>) ?? []
  const set = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } })
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} showDescription />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Depoimentos"} onChange={(e) => set("title", e.target.value)} />
      {items.map((item, i) => (
        <div key={i} className="border border-zinc-200 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-zinc-500">Depoimento {i + 1}</span>
            <button onClick={() => set("items", items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <Input placeholder="Nome do cliente" value={item.name} onChange={(e) => { const next = [...items]; next[i] = { ...next[i], name: e.target.value }; set("items", next) }} />
          <Textarea placeholder="Depoimento" rows={2} value={item.text} onChange={(e) => { const next = [...items]; next[i] = { ...next[i], text: e.target.value }; set("items", next) }} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set("items", [...items, { name: "", text: "" }])}>
        <Plus className="w-4 h-4 mr-1" /> Adicionar Depoimento
      </Button>
    </div>
  )
}

// ─── HORÁRIOS ───
export function HoursForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Horários"} onChange={(e) => onChange({ ...section, content: { ...section.content, title: e.target.value } })} />
      <p className="text-xs text-zinc-400">Os horários são listados automaticamente da configuração da empresa.</p>
    </div>
  )
}

// ─── CONTATO ───
export function ContactForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Contato"} onChange={(e) => onChange({ ...section, content: { ...section.content, title: e.target.value } })} />
      <p className="text-xs text-zinc-400">Endereço e WhatsApp são exibidos automaticamente da configuração da empresa.</p>
    </div>
  )
}

// ─── AGENDAMENTO ───
export function BookingForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  const set = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } })
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} showDescription />
      <Input placeholder="Título da seção" value={(c.title as string) ?? "Pronto para Agendar?"} onChange={(e) => set("title", e.target.value)} />
      <Input placeholder="Texto do botão" value={(c.ctaText as string) ?? "Agende Online"} onChange={(e) => set("ctaText", e.target.value)} />
    </div>
  )
}

// ─── EQUIPE (CARROSSEL PREMIUM) ───
export function TeamCarouselForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  const set = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } })
  const members = (c.members as Array<{ name: string; role: string; bio: string; image: string | null; featured?: boolean; tag?: string }>) ?? []
  return (
    <div className="space-y-3">
      <SectionStyleEditor section={section} onChange={onChange} showDescription />
      <Input placeholder="Subtítulo" value={(c.subtitle as string) ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
      <Input placeholder="Texto do botão do banner" value={(c.ctaText as string) ?? "Agendar Agora"} onChange={(e) => set("ctaText", e.target.value)} />
      <p className="text-xs font-medium text-zinc-500">Membros da Equipe</p>
      {members.map((member, i) => (
        <div key={i} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-zinc-500">Membro {i + 1}{member.featured ? " ★" : ""}</span>
            <button onClick={() => set("members", members.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <Input placeholder="Nome" value={member.name} onChange={(e) => { const next = [...members]; next[i] = { ...next[i], name: e.target.value }; set("members", next) }} />
          <Input placeholder="Cargo (ex: ESPECIALISTA EM CORTES CLÁSSICOS)" value={member.role} onChange={(e) => { const next = [...members]; next[i] = { ...next[i], role: e.target.value }; set("members", next) }} />
          <Textarea placeholder="Biografia" rows={2} value={member.bio} onChange={(e) => { const next = [...members]; next[i] = { ...next[i], bio: e.target.value }; set("members", next) }} />
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-zinc-500">
              <input type="checkbox" checked={!!member.featured} onChange={(e) => { const next = [...members]; next[i] = { ...next[i], featured: e.target.checked }; set("members", next) }} />
              Destaque
            </label>
            {member.featured && (
              <Input placeholder="Tag (ex: MAIS EXPERIENTE)" value={member.tag ?? ""} onChange={(e) => { const next = [...members]; next[i] = { ...next[i], tag: e.target.value }; set("members", next) }} className="text-xs" />
            )}
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set("members", [...members, { name: "", role: "", bio: "", image: null, featured: false }])}>
        <Plus className="w-4 h-4 mr-1" /> Adicionar Membro
      </Button>
      <p className="text-xs text-zinc-400">Se nenhum membro for cadastrado, os barbeiros da empresa serão exibidos com dados gerados automaticamente.</p>
    </div>
  )
}

const TEMPLATE_NAMES: Record<string, string> = {
  classic: "Clássico Acolhedor",
  urban: "Urbano Contemporâneo",
  premium: "Premium Elegante",
  photographic: "Fotográfico Impactante",
  "gpt-dark": "Premium Noturno",
  "gpt-completo": "Premium 2",
  "premium-3": "Premium 3",
}

// ─── TEMPLATE COMPLETO ───
export function FullPageForm({ section, onChange }: { section: WebsiteSection; onChange: (updated: WebsiteSection) => void }) {
  const c = section.content as Record<string, unknown>
  const templateId = (c.templateId as string) || ""
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500 mb-1">Template selecionado</p>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{TEMPLATE_NAMES[templateId] || templateId}</p>
      </div>
      <p className="text-xs text-zinc-400">Este template exibe o site completo com o design pronto. Use o botão "Templates" na barra para trocar o template.</p>
      <a
        href={`/exemplos/${templateId === "gpt-dark" ? "gpt" : templateId === "classic" ? "tradicional" : templateId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
      >
        <ExternalLink className="w-3 h-3" />
        Ver página de exemplo completa
      </a>
    </div>
  )
}
