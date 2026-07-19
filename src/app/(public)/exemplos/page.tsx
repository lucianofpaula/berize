import Link from "next/link";

const exemplos = [
  {
    slug: "tradicional",
    titulo: "Barbearia Tradicional",
    descricao:
      "Estilo warm-natural: tons terrosos, aconchego rústico, t erracota e âmbar. Ideal para barbearias clássicas.",
    paleta: ["#FFF8F0", "#F5F0E8", "#C8673C", "#D97706", "#783F1D"],
    gradient: "from-amber-800 via-amber-700 to-amber-600",
    imagem: "✂️",
  },
  {
    slug: "contemporaneo",
    titulo: "Barbearia Contemporânea",
    descricao:
      "Estilo bold-modern: alto contraste, acentos vibrantes, tipografia ousada. Ideal para estúdios jovens.",
    paleta: ["#080808", "#1A1A1A", "#FF6B35", "#7C3AED", "#FFFFFF"],
    gradient: "from-zinc-900 via-purple-900 to-orange-900",
    imagem: "⚡",
  },
  {
    slug: "premium",
    titulo: "Barbearia Premium",
    descricao:
      "Estilo light-elegant: sofisticação clara, azul navy, minimalismo refinado. Ideal para salões de alto padrão.",
    paleta: ["#FFFFFF", "#F8F8F8", "#1E3A5F", "#1A1A1A", "#E2E8F0"],
    gradient: "from-slate-800 via-blue-900 to-slate-900",
    imagem: "✦",
  },
  {
    slug: "fotografico",
    titulo: "Barbearia com Imagem",
    descricao:
      "Hero com foto de fundo em fullscreen, overlay gradiente e design dark premium. Ideal para causar impacto visual.",
    paleta: ["#000000", "#18181B", "#F59E0B", "#FFFFFF", "#D97706"],
    gradient: "from-zinc-900 via-amber-950 to-zinc-900",
    imagem: "📸",
  },
  {
    slug: "premium-3",
    titulo: "Barbearia Premium 3",
    descricao:
      "Estilo dark-luxo: fundo preto, detalhes dourados, fotografia em destaque. Ideal para barbearias sofisticadas.",
    paleta: ["#0C0A09", "#292524", "#B88E4C", "#D4AF37", "#F3E5AB"],
    gradient: "from-stone-950 via-yellow-950 to-stone-950",
    imagem: "🏆",
  },
];

export default function ExemplosPage() {
  return (
    <div className="min-h-screen bg-ld-surface">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-ld-foreground mb-4">
            Exemplos de Páginas
          </h1>
          <p className="text-ld-on-surface-variant text-lg max-w-2xl mx-auto">
            Quatro landing pages completas para barbearia, cada uma com um
            estilo visual único. Use como inspiração para o que a IA pode gerar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {exemplos.map((ex) => (
            <Link
              key={ex.slug}
              href={`/exemplos/${ex.slug}`}
              className="group block"
            >
              <div className="bg-ld-surface-elevated rounded-2xl overflow-hidden shadow-sm border border-ld-border-subtle hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`h-48 bg-gradient-to-br ${ex.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <span className="text-6xl opacity-40 select-none">
                    {ex.imagem}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className="absolute bottom-4 right-4 text-white/60 text-xs font-mono">
                    {ex.paleta.length} cores
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex gap-1.5 mb-4">
                    {ex.paleta.map((cor, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-ld-border-subtle"
                        style={{ backgroundColor: cor }}
                        title={cor}
                      />
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-ld-foreground mb-2 group-hover:text-ld-primary transition-colors">
                    {ex.titulo}
                  </h2>
                  <p className="text-sm text-ld-on-surface-variant leading-relaxed">
                    {ex.descricao}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-ld-primary text-sm font-medium">
                    <span>Visualizar página</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
