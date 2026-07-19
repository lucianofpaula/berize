import Link from "next/link"
import { Send, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/landing/ui/button"

const footerLinks = {
  platform: [
    { label: "Home", href: "/" },
    { label: "Login", href: "/login" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-ld-surface-container-lowest border-t border-ld-border-subtle w-full">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-gutter py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="font-headline-md text-headline-md font-bold text-ld-primary tracking-tight">
              localize.com.br
            </Link>
            <p className="text-ld-on-surface-variant text-sm leading-relaxed">
              A plataforma de descoberta local que conecta você aos melhores profissionais e empresas da sua cidade.
              Indique, compartilhe e ganhe comissões.
            </p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-ld-foreground font-semibold text-sm uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    className="text-ld-on-surface-variant hover:text-ld-primary transition-colors text-sm flex items-center gap-1 group"
                    href={link.href}
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-ld-foreground font-semibold text-sm uppercase tracking-wider">Categorias</h4>
            <ul className="space-y-3">
              <li><Link className="text-ld-on-surface-variant hover:text-ld-primary transition-colors text-sm" href="/exemplos">Barbearias</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-ld-foreground font-semibold text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-ld-on-surface-variant text-sm">
              Receba dicas e novidades da sua cidade.
            </p>
            <div className="flex gap-2">
              <input
                className="bg-ld-surface-elevated border border-ld-border-subtle rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-ld-primary text-ld-foreground placeholder:text-ld-on-surface-variant/50"
                placeholder="Seu e-mail"
                type="email"
              />
              <Button variant="primary" size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ld-border-subtle">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-gutter py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ld-on-surface-variant text-xs md:text-sm">
            &copy; {new Date().getFullYear()} localize.com.br
          </p>
        </div>
      </div>
    </footer>
  )
}
