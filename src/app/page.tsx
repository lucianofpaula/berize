import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Berize
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Sua barbearia no digital. Gerencie agendamentos, campanhas e muito mais.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Entrar
          </Link>
          <Link
            href="/exemplos"
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Ver modelos de site
          </Link>
        </div>
      </div>
    </div>
  )
}
