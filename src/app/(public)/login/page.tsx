import Link from "next/link"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ld-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-ld-surface-elevated p-8 shadow-xl border border-ld-border-subtle">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-ld-foreground">
            Entrar
          </h1>
          <p className="text-sm text-ld-on-surface-variant">
            Acesse sua conta localize.com.br
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-ld-on-surface-variant">
          Ainda não tem uma conta?{" "}
          <Link href="/cadastro" className="text-ld-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
