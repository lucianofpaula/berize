import Link from "next/link"
import { Scissors, UtensilsCrossed, Wrench, Sparkles, Stethoscope, Hammer, Shirt, Dumbbell, BookOpen, Camera, Home, Dog } from "lucide-react"

const allCategories = [
  { icon: Scissors, label: "Barbearia", href: "/exemplos" },
  { icon: UtensilsCrossed, label: "Gastronomia", href: "/exemplos" },
  { icon: Wrench, label: "Mecânica", href: "/exemplos" },
  { icon: Sparkles, label: "Estética", href: "/exemplos" },
  { icon: Stethoscope, label: "Saúde", href: "/exemplos" },
  { icon: Hammer, label: "Serviços", href: "/exemplos" },
  { icon: Shirt, label: "Moda", href: "/exemplos" },
  { icon: Dumbbell, label: "Esportes", href: "/exemplos" },
  { icon: BookOpen, label: "Educação", href: "/exemplos" },
  { icon: Camera, label: "Fotografia", href: "/exemplos" },
  { icon: Home, label: "Imobiliária", href: "/exemplos" },
  { icon: Dog, label: "Pet", href: "/exemplos" },
]

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-gutter">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-headline-md text-headline-md text-ld-foreground mb-2">Navegue por Categoria</h2>
          <p className="text-ld-on-surface-variant text-sm md:text-body-lg max-w-2xl mx-auto">
            Encontre exatamente o que você precisa filtrando por categoria.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {allCategories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl border border-ld-border-subtle bg-ld-surface-elevated/30 hover:bg-ld-surface-elevated hover:border-ld-primary/30 transition-all hover:shadow-lg hover:shadow-ld-primary-container/5"
            >
              <div className="w-12 h-12 rounded-xl bg-ld-accent-glow group-hover:bg-ld-primary-container/20 flex items-center justify-center transition-colors">
                <cat.icon className="h-6 w-6 text-ld-on-surface-variant group-hover:text-ld-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-ld-on-surface-variant group-hover:text-ld-primary transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
