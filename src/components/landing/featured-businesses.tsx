import Link from "next/link"
import { ArrowRight, Star, MapPin, Store } from "lucide-react"
import { Badge } from "@/components/landing/ui/badge"
import { Card, CardContent } from "@/components/landing/ui/card"
import { prisma } from "@/lib/prisma"

export async function FeaturedBusinesses() {
  const companies = await prisma.company.findMany({
    where: { status: "ACTIVE" },
    take: 6,
    orderBy: { createdAt: "desc" },
  })

  if (companies.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-ld-surface-container-lowest">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-gutter">
        <div className="flex justify-between items-end mb-10 md:mb-14">
          <div>
            <h2 className="font-headline-md text-headline-md text-ld-foreground mb-2">Empresas em Destaque</h2>
            <p className="text-ld-on-surface-variant font-body-md text-sm md:text-body-md">
              Conheça os locais e profissionais mais recomendados da plataforma.
            </p>
          </div>
          <Link
            className="hidden md:flex items-center gap-2 text-ld-primary font-button-text hover:underline"
            href="/exemplos"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {companies.map((c) => (
            <Card
              key={c.id}
              className="overflow-hidden group hover:shadow-lg hover:shadow-ld-primary-container/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-32 bg-gradient-to-br from-ld-surface-variant to-ld-surface-container-high flex items-center justify-center">
                <Store className="h-12 w-12 text-ld-on-surface-variant/40 group-hover:text-ld-primary/40 transition-colors" />
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline-md text-base md:text-lg text-ld-foreground font-semibold">{c.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-xs font-bold">5.0</span>
                  </div>
                </div>
                {c.description && (
                  <p className="text-ld-on-surface-variant text-sm line-clamp-2">{c.description}</p>
                )}
                <div className="flex items-center flex-wrap gap-2">
                  {c.slug && (
                    <Badge variant="primary" className="text-[10px] uppercase tracking-wider">
                      {c.slug}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/exemplos"
            className="inline-flex items-center gap-2 text-ld-primary font-button-text hover:underline"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
