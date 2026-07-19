"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(254, "Email muito longo"),
  password: z
    .string()
    .min(1, "Senha é obrigatória"),
})

type LoginData = z.infer<typeof loginSchema>

type Props = {
  slug: string
}

export default function LoginForm({ slug }: Props) {
  const router = useRouter()
  const [apiError, setApiError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginData) {
    setApiError("")

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      const message =
        result.error === "CredentialsSignin"
          ? "Email ou senha inválidos"
          : result.error
      setApiError(message)
      return
    }

    router.push(`/${slug}/cliente`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {apiError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {apiError}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--brand-text)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-[var(--brand-border)]/30 bg-[var(--brand-accent-light)] px-3 py-2 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] aria-invalid:ring-red-500"
          placeholder="seu@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-[var(--brand-text)]">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-[var(--brand-border)]/30 bg-[var(--brand-accent-light)] px-3 py-2 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] aria-invalid:ring-red-500"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm text-[var(--brand-muted)]">
        Ainda não tem conta?{" "}
        <Link href={`/${slug}/cadastro`} className="text-[var(--brand-primary)] hover:underline font-medium">
          Cadastre-se
        </Link>
      </p>
    </form>
  )
}
