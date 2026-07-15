"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2Icon,
  AlertTriangleIcon,
  GlobeIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  SettingsIcon,
  LinkIcon,
  Building2Icon,
  ImageIcon,
  MessageCircleIcon,
  SparklesIcon,
  Loader2Icon,
  TargetIcon,
  DollarSignIcon,
} from "lucide-react"

type Hour = {
  id: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
}

type Address = {
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

type SocialMedia = {
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
}

type InitialData = {
  id: string
  name: string
  slug: string
  logo: string | null
  description: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: Address | null
  socialMedia: SocialMedia | null
  customDomain: string | null
  domainVerified: boolean
  timezone: string
  appointmentLeadTime: number
  appointmentInterval: number
  dailyAppointmentGoal: number
  dailyRevenueGoal: number
  hours: Hour[]
}

const DAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

function emptyAddress(): Address {
  return { street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "" }
}

function emptySocialMedia(): SocialMedia {
  return { instagram: "", facebook: "", tiktok: "", youtube: "" }
}

export function CompanyConfigForm({ initialData }: { initialData: InitialData }) {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [gerandoDescricao, setGerandoDescricao] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  const [name, setName] = useState(initialData.name)
  const [slug] = useState(initialData.slug)
  const [description, setDescription] = useState(initialData.description ?? "")
  const [phone, setPhone] = useState(initialData.phone ?? "")
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp ?? "")
  const [email, setEmail] = useState(initialData.email ?? "")

  const [address, setAddress] = useState<Address>(initialData.address ?? emptyAddress())
  const [socialMedia, setSocialMedia] = useState<SocialMedia>(initialData.socialMedia ?? emptySocialMedia())

  const [customDomain, setCustomDomain] = useState(initialData.customDomain ?? "")
  const [timezone, setTimezone] = useState(initialData.timezone)
  const [appointmentLeadTime, setAppointmentLeadTime] = useState(initialData.appointmentLeadTime)
  const [appointmentInterval, setAppointmentInterval] = useState(initialData.appointmentInterval)
  const [dailyAppointmentGoal, setDailyAppointmentGoal] = useState(initialData.dailyAppointmentGoal ?? 0)
  const [dailyRevenueGoal, setDailyRevenueGoal] = useState(initialData.dailyRevenueGoal ?? 0)
  const [hours, setHours] = useState<Hour[]>(initialData.hours.length > 0 ? initialData.hours : createDefaultHours())

  function createDefaultHours(): Hour[] {
    return DAYS.map((_, i) => ({
      id: `new-${i}`,
      dayOfWeek: i,
      openTime: i === 0 ? "08:00" : "08:00",
      closeTime: i === 0 ? "12:00" : "18:00",
      isOpen: i !== 0,
    }))
  }

  function updateHour(dayOfWeek: number, field: "openTime" | "closeTime" | "isOpen", value: string | boolean) {
    setHours(hours.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h)))
  }

  function updateAddress(field: keyof Address, value: string) {
    setAddress({ ...address, [field]: value })
  }

  function updateSocialMedia(field: keyof SocialMedia, value: string) {
    setSocialMedia({ ...socialMedia, [field]: value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setSucesso(false)

    if (!name) return

    setEnviando(true)

    const body = {
      name,
      description: description || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      email: email || null,
      address: address.street || address.city ? address : null,
      socialMedia: socialMedia.instagram || socialMedia.facebook ? socialMedia : null,
      customDomain: customDomain || null,
      timezone,
      appointmentLeadTime,
      appointmentInterval,
      dailyAppointmentGoal,
      dailyRevenueGoal,
      hours: hours.map((h) => ({
        dayOfWeek: h.dayOfWeek,
        openTime: h.openTime,
        closeTime: h.closeTime,
        isOpen: h.isOpen,
      })),
    }

    const res = await fetch("/api/empresa/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setErro(data.error ?? "Erro ao salvar configurações.")
      setEnviando(false)
      return
    }

    setEnviando(false)
    setSucesso(true)
    router.refresh()

    setTimeout(() => setSucesso(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {erro && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="size-4 shrink-0" />
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2Icon className="size-4 shrink-0" />
          Configurações salvas com sucesso!
        </div>
      )}

      {/* Slug (apenas leitura) */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <GlobeIcon className="size-4 text-zinc-400" />
          URL do negócio
        </h3>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Slug</label>
          <div className="relative">
            <input
              type="text"
              value={slug}
              disabled
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-zinc-400 mt-1">O slug é definido na criação e não pode ser alterado.</p>
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Building2Icon className="size-4 text-zinc-400" />
          Informações gerais
        </h3>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Nome do negócio <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da empresa"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Descrição</label>
            <button
              type="button"
              onClick={async () => {
                setGerandoDescricao(true)
                try {
                  const res = await fetch("/api/gerar/descricao", { method: "POST" })
                  if (res.ok) {
                    const data = await res.json()
                    setDescription(data.descricao)
                  }
                } catch {
                  // ignora erro silenciosamente
                }
                setGerandoDescricao(false)
              }}
              disabled={gerandoDescricao}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
            >
              {gerandoDescricao ? (
                <Loader2Icon className="size-3.5 animate-spin" />
              ) : (
                <SparklesIcon className="size-3.5" />
              )}
              {gerandoDescricao ? "Gerando..." : "Gerar com IA"}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva seu negócio em poucas palavras"
            rows={3}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Telefone</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 3333-4444"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">WhatsApp</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-8888"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">E-mail</label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <MapPinIcon className="size-4 text-zinc-400" />
          Endereço
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Logradouro</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => updateAddress("street", e.target.value)}
              placeholder="Rua, Avenida..."
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Número</label>
            <input
              type="text"
              value={address.number}
              onChange={(e) => updateAddress("number", e.target.value)}
              placeholder="123"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Complemento</label>
          <input
            type="text"
            value={address.complement}
            onChange={(e) => updateAddress("complement", e.target.value)}
            placeholder="Sala, bloco, andar..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bairro</label>
            <input
              type="text"
              value={address.neighborhood}
              onChange={(e) => updateAddress("neighborhood", e.target.value)}
              placeholder="Centro"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cidade</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              placeholder="São Paulo"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">UF</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => updateAddress("state", e.target.value)}
                placeholder="SP"
                maxLength={2}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">CEP</label>
              <input
                type="text"
                value={address.zipCode}
                onChange={(e) => updateAddress("zipCode", e.target.value)}
                placeholder="01234-567"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ImageIcon className="size-4 text-zinc-400" />
          Redes sociais
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Instagram</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={socialMedia.instagram}
                onChange={(e) => updateSocialMedia("instagram", e.target.value)}
                placeholder="@seubarbeiro"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Facebook</label>
            <div className="relative">
              <MessageCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={socialMedia.facebook}
                onChange={(e) => updateSocialMedia("facebook", e.target.value)}
                placeholder="facebook.com/seubarbeiro"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">TikTok</label>
            <input
              type="text"
              value={socialMedia.tiktok}
              onChange={(e) => updateSocialMedia("tiktok", e.target.value)}
              placeholder="@seubarbeiro"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">YouTube</label>
            <input
              type="text"
              value={socialMedia.youtube}
              onChange={(e) => updateSocialMedia("youtube", e.target.value)}
              placeholder="youtube.com/@seubarbeiro"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
          </div>
        </div>
      </div>

      {/* Horários de Funcionamento */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ClockIcon className="size-4 text-zinc-400" />
          Horários de funcionamento
        </h3>

        <div className="space-y-3">
          {hours.map((h) => (
            <div
              key={h.dayOfWeek}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3"
            >
              <div className="flex items-center gap-2 min-w-[140px]">
                <input
                  type="checkbox"
                  checked={h.isOpen}
                  onChange={(e) => updateHour(h.dayOfWeek, "isOpen", e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{DAYS[h.dayOfWeek]}</span>
              </div>
              {h.isOpen && (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={h.openTime}
                      onChange={(e) => updateHour(h.dayOfWeek, "openTime", e.target.value)}
                      className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    />
                    <span className="text-xs text-zinc-400">às</span>
                    <input
                      type="time"
                      value={h.closeTime}
                      onChange={(e) => updateHour(h.dayOfWeek, "closeTime", e.target.value)}
                      className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    />
                  </div>
                </>
              )}
              {!h.isOpen && (
                <span className="text-xs text-zinc-400 italic">Fechado</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Domínio Personalizado */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <LinkIcon className="size-4 text-zinc-400" />
          Domínio personalizado
        </h3>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Domínio próprio
          </label>
          <div className="relative">
            <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="barbearia.meudominio.com.br"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {initialData.domainVerified
              ? "Domínio verificado ✓"
              : "Configure o DNS do seu domínio para apontar para nosso sistema."}
          </p>
        </div>
      </div>

      {/* Configurações de Agendamento */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <SettingsIcon className="size-4 text-zinc-400" />
          Configurações de agendamento
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fuso horário</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            >
              <option value="America/Sao_Paulo">América/São Paulo (UTC-3)</option>
              <option value="America/Manaus">América/Manaus (UTC-4)</option>
              <option value="America/Fortaleza">América/Fortaleza (UTC-3)</option>
              <option value="America/Noronha">América/Noronha (UTC-2)</option>
              <option value="America/Belem">América/Belém (UTC-3)</option>
              <option value="America/Cuiaba">América/Cuiabá (UTC-4)</option>
              <option value="America/Campo_Grande">América/Campo Grande (UTC-4)</option>
              <option value="America/Bahia">América/Bahia (UTC-3)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Antecedência mínima (min)
            </label>
            <input
              type="number"
              min={0}
              value={appointmentLeadTime}
              onChange={(e) => setAppointmentLeadTime(Number(e.target.value))}
              placeholder="60"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
            <p className="text-xs text-zinc-400 mt-1">Tempo mínimo antes do horário para agendar.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Intervalo entre horários (min)
            </label>
            <input
              type="number"
              min={5}
              step={5}
              value={appointmentInterval}
              onChange={(e) => setAppointmentInterval(Number(e.target.value))}
              placeholder="30"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            />
            <p className="text-xs text-zinc-400 mt-1">Espaçamento entre horários disponíveis.</p>
          </div>
        </div>
      </div>

      {/* Metas */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <TargetIcon className="size-4 text-zinc-400" />
          Metas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Meta de agendamentos por dia
            </label>
            <div className="relative">
              <TargetIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="number"
                min={0}
                value={dailyAppointmentGoal}
                onChange={(e) => setDailyAppointmentGoal(Number(e.target.value))}
                placeholder="15"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">Quantos agendamentos você quer atingir por dia.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Meta de faturamento diário (R$)
            </label>
            <div className="relative">
              <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="number"
                min={0}
                step="0.01"
                value={dailyRevenueGoal}
                onChange={(e) => setDailyRevenueGoal(Number(e.target.value))}
                placeholder="1200.00"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">Quanto você quer faturar por dia.</p>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={enviando || !name}
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
              Salvar configurações
            </>
          )}
        </button>
      </div>
    </form>
  )
}
