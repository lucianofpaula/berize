import { prisma } from "@/lib/prisma"

export async function StatsSection() {
  const [companyCount, userCount, activeCount] = await Promise.all([
    prisma.company.count(),
    prisma.user.count(),
    prisma.company.count({ where: { status: "ACTIVE" } }),
  ])

  const stats = [
    { value: companyCount, label: "Empresas cadastradas" },
    { value: activeCount, label: "Empresas ativas" },
    { value: userCount, label: "Usuários" },
  ]

  return (
    <section className="py-12 md:py-16 border-y border-ld-border-subtle bg-ld-surface-container-low">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-gutter">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-headline-md md:text-[40px] font-bold text-ld-primary">
                {stat.value}
              </p>
              <p className="text-sm text-ld-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
