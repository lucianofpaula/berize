"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  ScissorsIcon,
  PercentIcon,
  CameraIcon,
  XIcon,
  ChevronLeftIcon,
  ClockIcon,
  PlusIcon,
  Trash2Icon,
  CheckCircle2Icon,
  SunIcon,
  MoonIcon,
  TagIcon,
  FileTextIcon,
  AlertTriangleIcon,
} from "lucide-react"
import Image from "next/image"

type Slot = { start: string; end: string }

type FormData = {
  nome: string
  email: string
  whatsapp: string
  bio: string
  especialidades: string[]
  comissao: number
  foto: string | null
  disponibilidade: Record<number, Slot[]>
}

const DIAS_SEMANA = [
  { value: 0, label: "Domingo", short: "Dom" },
  { value: 1, label: "Segunda-feira", short: "Seg" },
  { value: 2, label: "Terça-feira", short: "Ter" },
  { value: 3, label: "Quarta-feira", short: "Qua" },
  { value: 4, label: "Quinta-feira", short: "Qui" },
  { value: 5, label: "Sexta-feira", short: "Sex" },
  { value: 6, label: "Sábado", short: "Sáb" },
]

function horarioEmMinutos(h: string) {
  const [hh, mm] = h.split(":").map(Number)
  return hh * 60 + mm
}

function horariosValidos(slots: Slot[]) {
  for (const s of slots) {
    if (horarioEmMinutos(s.start) >= horarioEmMinutos(s.end)) return false
  }
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i]
      const b = slots[j]
      const aIni = horarioEmMinutos(a.start)
      const aFim = horarioEmMinutos(a.end)
      const bIni = horarioEmMinutos(b.start)
      const bFim = horarioEmMinutos(b.end)
      if (aIni < bFim && bIni < aFim) return false
    }
  }
  return true
}

function mascaraWhatsapp(valor: string) {
  const nums = valor.replace(/\D/g, "").slice(0, 11)
  if (nums.length <= 2) return `(${nums}`
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
}

export function BarbeiroForm({
  modo,
  initialData,
  memberId,
}: {
  modo: "criar" | "editar"
  initialData?: FormData
  memberId?: string
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [nome, setNome] = useState(initialData?.nome ?? "")
  const [email, setEmail] = useState(initialData?.email ?? "")
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "")
  const [bio, setBio] = useState(initialData?.bio ?? "")
  const [especialidadesInput, setEspecialidadesInput] = useState("")
  const [especialidades, setEspecialidades] = useState<string[]>(initialData?.especialidades ?? [])
  const [comissao, setComissao] = useState(initialData?.comissao ?? 40)
  const [fotoPreview, setFotoPreview] = useState<string | null>(initialData?.foto ?? null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoAtual, setFotoAtual] = useState<string | null>(initialData?.foto ?? null)

  const [diasAtivos, setDiasAtivos] = useState<Record<number, Slot[]>>(initialData?.disponibilidade ?? {})

  function toggleDia(dia: number) {
    setDiasAtivos((prev) => {
      if (prev[dia]) {
        const { [dia]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [dia]: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "18:00" }] }
    })
  }

  function addSlot(dia: number) {
    setDiasAtivos((prev) => ({
      ...prev,
      [dia]: [...(prev[dia] || []), { start: "08:00", end: "18:00" }],
    }))
  }

  function removeSlot(dia: number, idx: number) {
    setDiasAtivos((prev) => {
      const slots = prev[dia].filter((_, i) => i !== idx)
      if (slots.length === 0) {
        const { [dia]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [dia]: slots }
    })
  }

  function updateSlot(dia: number, idx: number, field: "start" | "end", value: string) {
    setDiasAtivos((prev) => {
      const slots = [...prev[dia]]
      slots[idx] = { ...slots[idx], [field]: value }
      return { ...prev, [dia]: slots }
    })
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setFotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removerFoto() {
    setFotoFile(null)
    setFotoPreview(null)
    setFotoAtual(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  function slotsValidos() {
    for (const slots of Object.values(diasAtivos)) {
      if (!horariosValidos(slots)) return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!nome || !email) return
    if (especialidades.length === 0) return
    if (Object.keys(diasAtivos).length === 0) return
    if (!slotsValidos()) return

    setEnviando(true)

    let fotoUrl: string | null = fotoAtual
    if (fotoFile) {
      const formData = new FormData()
      formData.append("file", fotoFile)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        fotoUrl = data.url
      } else {
        setErro("Erro ao enviar foto.")
        setEnviando(false)
        return
      }
    }

    const payload = {
      nome,
      email,
      whatsapp: whatsapp.replace(/\D/g, ""),
      especialidades,
      comissao,
      bio: bio || null,
      fotoUrl,
      disponibilidade: diasAtivos,
    }

    const url = modo === "editar" && memberId
      ? `/api/barbeiros/${memberId}`
      : "/api/barbeiros"

    const res = await fetch(url, {
      method: modo === "editar" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setErro(data.error ?? "Erro ao salvar barbeiro.")
      setEnviando(false)
      return
    }

    setEnviando(false)
    router.push("/barbeiros")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="size-4 shrink-0" />
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── COLUNA ESQUERDA: DADOS PESSOAIS ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Foto */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Foto do barbeiro</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {fotoPreview ? (
                  <div className="relative size-28 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700">
                    <Image src={fotoPreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="size-28 rounded-full bg-zinc-100 dark:bg-zinc-800 ring-2 ring-zinc-200 dark:ring-zinc-700 flex items-center justify-center">
                    <UserIcon className="size-10 text-zinc-300 dark:text-zinc-600" />
                  </div>
                )}
                {fotoPreview && (
                  <button
                    type="button"
                    onClick={removerFoto}
                    className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <CameraIcon className="size-4" />
                {fotoPreview ? "Trocar foto" : "Selecionar foto"}
              </button>
            </div>
          </div>

          {/* Dados pessoais */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Dados pessoais</h3>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do barbeiro"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                  required
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
                  onChange={(e) => setWhatsapp(mascaraWhatsapp(e.target.value))}
                  placeholder="(11) 99999-0000"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bio</label>
              <div className="relative">
                <FileTextIcon className="absolute left-3 top-3 size-4 text-zinc-400" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Breve descrição do barbeiro..."
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Especialidades <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ScissorsIcon className="absolute left-3 top-3 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={especialidadesInput}
                  onChange={(e) => setEspecialidadesInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === ",") && especialidadesInput.trim()) {
                      e.preventDefault()
                      const nova = especialidadesInput.trim().replace(/,+$/, "")
                      if (nova && !especialidades.includes(nova)) {
                        setEspecialidades([...especialidades, nova])
                      }
                      setEspecialidadesInput("")
                    }
                    if (e.key === "Backspace" && !especialidadesInput && especialidades.length > 0) {
                      setEspecialidades(especialidades.slice(0, -1))
                    }
                  }}
                  onBlur={() => {
                    if (especialidadesInput.trim()) {
                      const nova = especialidadesInput.trim().replace(/,+$/, "")
                      if (nova && !especialidades.includes(nova)) {
                        setEspecialidades([...especialidades, nova])
                      }
                      setEspecialidadesInput("")
                    }
                  }}
                  placeholder="Digite e pressione Enter ou vírgula para adicionar"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
              {especialidades.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {especialidades.map((esp) => (
                    <span
                      key={esp}
                      className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      <TagIcon className="size-3" />
                      {esp}
                      <button
                        type="button"
                        onClick={() => setEspecialidades(especialidades.filter((e) => e !== esp))}
                        className="ml-0.5 hover:text-red-500 transition-colors"
                      >
                        <XIcon className="size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Comissão (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <PercentIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={comissao}
                  onChange={(e) => setComissao(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── COLUNA DIREITA: DISPONIBILIDADE ─── */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Disponibilidade semanal</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Selecione os dias e defina os horários de atendimento
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <SunIcon className="size-3" />
                <span>manhã</span>
                <MoonIcon className="size-3 ml-1" />
                <span>tarde</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {DIAS_SEMANA.map((dia) => {
                const ativo = dia.value in diasAtivos
                const slots = diasAtivos[dia.value] || []

                return (
                  <div
                    key={dia.value}
                    className={`rounded-lg border transition-colors ${
                      ativo
                        ? "border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDia(dia.value)}
                      className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                        ativo
                          ? "text-zinc-900 dark:text-zinc-50"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                    >
                      <div
                        className={`size-3 rounded-full border-2 transition-colors ${
                          ativo
                            ? "bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      />
                      <span className="flex-1 text-left">{dia.short}</span>
                      {ativo && <ClockIcon className="size-3.5 text-zinc-400" />}
                    </button>

                    {ativo && (
                      <div className="px-3 pb-3 space-y-2">
                        {slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateSlot(dia.value, idx, "start", e.target.value)}
                              className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                            />
                            <span className="text-xs text-zinc-400">às</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateSlot(dia.value, idx, "end", e.target.value)}
                              className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                            />
                            {slots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSlot(dia.value, idx)}
                                className="shrink-0 flex size-6 items-center justify-center rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              >
                                <Trash2Icon className="size-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addSlot(dia.value)}
                          className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        >
                          <PlusIcon className="size-3" />
                          Adicionar horário
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {!slotsValidos() && Object.keys(diasAtivos).length > 0 && (
              <p className="mt-3 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <XIcon className="size-3" />
                Existem horários sobrepostos ou inválidos. Ajuste os intervalos.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── AÇÕES ─── */}
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
          disabled={enviando || !nome || !email || especialidades.length === 0 || Object.keys(diasAtivos).length === 0 || !slotsValidos()}
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
              {modo === "criar" ? "Cadastrar barbeiro" : "Salvar alterações"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
