import Link from "next/link"
import { Scissors, UtensilsCrossed, Wrench, Sparkles, Stethoscope, Hammer } from "lucide-react"
import { SearchWidget } from "@/components/landing/search-widget"

const categories = [
  { icon: Scissors, label: "Barbearia", href: "/exemplos", color: "from-pink-500/20 to-rose-500/10" },
  { icon: UtensilsCrossed, label: "Gastronomia", href: "/exemplos", color: "from-orange-500/20 to-amber-500/10" },
  { icon: Wrench, label: "Mecânica", href: "/exemplos", color: "from-blue-500/20 to-cyan-500/10" },
  { icon: Sparkles, label: "Estética", href: "/exemplos", color: "from-purple-500/20 to-violet-500/10" },
  { icon: Stethoscope, label: "Saúde", href: "/exemplos", color: "from-emerald-500/20 to-green-500/10" },
  { icon: Hammer, label: "Serviços", href: "/exemplos", color: "from-yellow-500/20 to-orange-500/10" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[700px] md:min-h-[870px] flex flex-col items-center justify-center px-margin-mobile md:px-gutter overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ld-accent-glow via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-ld-primary-container/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-ld-accent-glow blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-20 h-20 border border-white/5 rounded-full" />
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-white/5 rounded-full" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8 md:space-y-12">
        <div className="space-y-4">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ld-foreground max-w-3xl mx-auto leading-tight">
            Descubra os melhores{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ld-primary to-ld-accent">
              profissionais e empresas
            </span>{" "}
            perto de você
          </h1>
          <p className="text-ld-on-surface-variant text-sm md:text-body-lg max-w-2xl mx-auto">
            Indique seus lugares favoritos, ajude sua cidade a crescer e ganhe comissões quando eles contratarem um plano.
          </p>
        </div>

        <SearchWidget />

        <div className="space-y-4">
          <p className="text-xs text-ld-on-surface-variant tracking-widest uppercase font-label-sm">Categorias populares</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-ld-border-subtle bg-ld-surface-elevated/50 hover:bg-ld-surface-elevated transition-all hover:border-ld-primary/30 hover:shadow-lg hover:shadow-ld-primary-container/5"
              >
                <cat.icon className="h-4 w-4 md:h-5 md:w-5 text-ld-on-surface-variant group-hover:text-ld-primary transition-colors" />
                <span className="font-label-sm text-label-sm text-ld-on-surface-variant group-hover:text-ld-primary transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
