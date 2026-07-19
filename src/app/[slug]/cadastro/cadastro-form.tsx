"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X } from "lucide-react"

const cadastroSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  email: z.string().email("Email inválido").max(254),
  whatsapp: z.string().min(8, "WhatsApp inválido").max(20),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100),
})

type CadastroData = z.infer<typeof cadastroSchema>

type Props = {
  slug: string
  refCode: string | null
  companyName: string
}

export default function CadastroForm({ slug, refCode, companyName }: Props) {
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroData>({
    resolver: zodResolver(cadastroSchema),
  })

  async function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "berize/avatars")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        setPhotoUrl(data.url)
      } else {
        setApiError("Erro ao enviar foto.")
      }
    } catch {
      setApiError("Erro ao enviar foto.")
    } finally {
      setUploadingPhoto(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  async function onSubmit(data: CadastroData) {
    setApiError("")
    setLoading(true)

    try {
      const res = await fetch(`/api/empresa/${slug}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          photoUrl: photoUrl ?? undefined,
          ...(refCode ? { ref: refCode } : {}),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        if (typeof json.error === "string") {
          setApiError(json.error)
        } else if (typeof json.error === "object") {
          const msgs = Object.values(json.error).flat().join(". ")
          setApiError(msgs || "Erro ao cadastrar")
        } else {
          setApiError("Erro ao cadastrar")
        }
        return
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setApiError("Erro ao fazer login automático. Tente entrar manualmente.")
        return
      }

      router.push(`/${slug}/cliente`)
      router.refresh()
    } catch {
      setApiError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {apiError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      {/* Photo upload */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {photoUrl ? (
            <div className="relative">
              <img
                src={photoUrl}
                alt="foto"
                className="w-24 h-24 rounded-full object-cover border-2 border-zinc-200"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingPhoto}
              className="w-24 h-24 rounded-full border-2 border-dashed border-[var(--brand-border)]/30 flex flex-col items-center justify-center gap-1 text-[var(--brand-muted)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/50 transition-colors disabled:opacity-50"
            >
              {uploadingPhoto ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span className="text-[10px]">Foto</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadPhoto}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Nome completo
        </label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-[var(--brand-border)]/30 bg-[var(--brand-accent-light)] px-3 py-2 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          placeholder="Seu nome"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          className="w-full rounded-lg border border-[var(--brand-border)]/30 bg-[var(--brand-accent-light)] px-3 py-2 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          WhatsApp
        </label>
        <input
          {...register("whatsapp")}
          className="w-full rounded-lg border border-[var(--brand-border)]/30 bg-[var(--brand-accent-light)] px-3 py-2 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          placeholder="(11) 99999-9999"
        />
        {errors.whatsapp && (
          <p className="text-xs text-red-500 mt-1">{errors.whatsapp.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Senha
        </label>
        <input
          {...register("password")}
          type="password"
          className="w-full rounded-lg border border-[var(--brand-border)]/30 bg-[var(--brand-accent-light)] px-3 py-2 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          placeholder="Mínimo 6 caracteres"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] font-bold rounded-lg text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Criar conta
      </button>

      <p className="text-xs text-[var(--brand-muted)] text-center">
        Ao criar conta, você concorda com nossos termos de uso.
      </p>

      <div className="text-center">
        <a
          href={`/${slug}/login`}
          className="text-sm text-[var(--brand-border)] hover:text-[var(--brand-primary)] hover:underline"
        >
          Já tem conta? Faça login
        </a>
      </div>
    </form>
  )
}
