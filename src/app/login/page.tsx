import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-center text-zinc-900 dark:text-zinc-50">
          Entrar
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}
