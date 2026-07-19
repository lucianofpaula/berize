"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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

export function LoginForm() {
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

    router.push("/meu-negocio")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {apiError && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {apiError}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-ld-on-surface-variant"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="flex h-12 w-full rounded-lg bg-ld-surface-variant/5 border border-ld-border-subtle px-4 py-2 text-sm text-ld-foreground outline-none transition-all placeholder:text-ld-muted-foreground/60 focus:border-ld-primary-container focus:ring-4 focus:ring-ld-accent-glow"
          placeholder="seu@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-ld-on-surface-variant"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="flex h-12 w-full rounded-lg bg-ld-surface-variant/5 border border-ld-border-subtle px-4 py-2 text-sm text-ld-foreground outline-none transition-all placeholder:text-ld-muted-foreground/60 focus:border-ld-primary-container focus:ring-4 focus:ring-ld-accent-glow"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-ld-primary-container text-white shadow-xl shadow-ld-primary-container/20 px-4 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  )
}
