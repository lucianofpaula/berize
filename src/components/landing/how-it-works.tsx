import { UserPlus, Building2, BadgeDollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/landing/ui/button"

const steps = [
  {
    icon: UserPlus,
    title: "Crie sua conta",
    description: "Cadastre-se gratuitamente e comece a indicar os melhores estabelecimentos da sua cidade.",
    link: "/login",
    label: "Criar Conta",
    number: "01",
  },
  {
    icon: Building2,
    title: "Indique empresas",
    description: "Recomende empresas que você conhece e confia. Cada indicação fortalece o guia local.",
    link: "/exemplos",
    label: "Indicar Agora",
    number: "02",
  },
  {
    icon: BadgeDollarSign,
    title: "Ganhe comissões",
    description: "Quando a empresa indicada contratar um plano, você recebe uma comissão automática.",
    link: "/login",
    label: "Começar Agora",
    number: "03",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-ld-surface-container-lowest">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-gutter relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline-md text-headline-md text-ld-foreground mb-3">Como funciona</h2>
          <p className="text-ld-on-surface-variant text-sm md:text-body-lg max-w-2xl mx-auto">
            Em três passos simples você começa a indicar empresas e ganhar comissões.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center space-y-5 relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-ld-primary/40 to-transparent" />
              )}
              <div className="relative inline-flex">
                <div className="w-20 h-20 bg-ld-accent-glow rounded-2xl flex items-center justify-center mx-auto border border-ld-primary-container/20 group">
                  <step.icon className="h-9 w-9 text-ld-primary-container group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-ld-primary text-white text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-ld-foreground">{step.title}</h3>
              <p className="text-ld-on-surface-variant text-sm md:text-body-md">{step.description}</p>
              <Link href={step.link}>
                <Button variant="primary" className="mt-2">
                  {step.label}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
