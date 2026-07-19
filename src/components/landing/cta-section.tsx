import Link from "next/link"
import { Button } from "@/components/landing/ui/button"
import { ArrowRight, Star } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-margin-mobile md:px-gutter">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-ld-primary-container via-ld-primary-container to-ld-accent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl rounded-full -ml-32 -mb-32 pointer-events-none" />

        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="font-headline-md text-headline-md md:text-[36px] text-white font-bold leading-tight">
              Sua empresa ainda não está aqui?
            </h2>
            <p className="text-white/80 text-sm md:text-body-lg">
              Cadastre-se gratuitamente e indique empresas da sua região. Quando elas contratarem um plano,
              você ganha uma comissão automática. Todo mundo sai ganhando!
            </p>
          </div>
          <Link href="/exemplos" className="shrink-0">
            <Button
              className="bg-white text-ld-primary-container hover:bg-ld-foreground hover:text-ld-bg shadow-xl shadow-black/20 text-base md:text-lg px-8 py-6 h-auto rounded-xl group"
            >
              Quero Indicar
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
