"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  agendamentos: "Agendamentos",
  clientes: "Clientes",
  barbeiros: "Barbeiros",
  planos: "Planos",
  servicos: "Serviços",
  financeiro: "Financeiro",
  configuracoes: "Configurações",
  "minha-conta": "Minha conta",
  "minhas-assinaturas": "Minhas assinaturas",
  notificacoes: "Notificações",
  "planos-assinatura": "Planos de assinatura",
  website: "Web Site",
  dados: "Dados",
  negocio: "Meu Negócio",
  commerce: "Commerce Hub",
  configuracao: "Configuração",
  pagamentos: "Meios de Pagamento",
  "agente-ia": "Agente de IA",
}

function segmentLabel(segment: string): string {
  return labels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/")
          const isLast = index === segments.length - 1

          return (
            <BreadcrumbItem key={href} className={index > 0 ? "" : "hidden md:block"}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              {isLast ? (
                <BreadcrumbPage>{segmentLabel(segment)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={href}>
                  {segmentLabel(segment)}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
