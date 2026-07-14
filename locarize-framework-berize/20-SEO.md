# SEO — Otimização para Mecanismos de Busca

## Visão Geral

Toda aplicação do ecossistema Locarize deve ser construída com SEO como requisito funcional, não como camada posterior. A otimização para mecanismos de busca é responsabilidade compartilhada entre Core, módulos e aplicações.

---

# 1. Infraestrutura Técnica (Core)

## Server-Side Rendering (SSR)

- **Páginas públicas**: renderizadas no servidor via `generateStaticParams` (ISR) ou `dynamic = "force-static"`
- **Páginas de tenant**: usar `generateMetadata` dinâmico para injetar meta tags por tenant
- **Painéis administrativos**: sem necessidade de SEO (protegidos por auth)

## Sitemap

Arquivo em `app/sitemap.ts` (App Router):

```typescript
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenants = await prisma.tenant.findMany({
    where: { websiteAtivo: true },
    select: { slug: true, updatedAt: true },
  });

  const tenantEntries = tenants.map((t) => ({
    url: `https://locarize.com.br/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: "https://locarize.com.br", lastModified: new Date(), priority: 1.0 },
    { url: "https://locarize.com.br/barbearias", priority: 0.9 },
    ...tenantEntries,
  ];
}
```

## Robots

Arquivo em `app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/painel/" }],
    sitemap: "https://locarize.com.br/sitemap.xml",
  };
}
```

## Core Web Vitals

| Métrica | Alvo    | Como atingir                                   |
| ------- | ------- | ---------------------------------------------- |
| LCP     | < 2.5s  | Imagens otimizadas, SSR, ISR, fontes locais    |
| FID     | < 100ms | Bundle enxuto, lazy loading de JS              |
| CLS     | < 0.1   | Dimensões fixas em imagens, font-display: swap |

---

# 2. Meta Tags (Módulo Website)

## Por Página

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getTenant(params.slug);
  return {
    title: `${tenant.nome} | Locarize`,
    description: tenant.descricaoCurta,
    openGraph: {
      title: tenant.nome,
      description: tenant.descricaoCurta,
      images: [{ url: tenant.logo }],
    },
    twitter: {
      card: "summary_large_image",
      title: tenant.nome,
      description: tenant.descricaoCurta,
      images: [tenant.logo],
    },
  };
}
```

## Template Global

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: "%s | Locarize",
    default: "Locarize — Plataforma para Negócios Locais",
  },
  description: "A plataforma completa para digitalizar seu negócio local.",
  metadataBase: new URL("https://locarize.com.br"),
};
```

---

# 3. Structured Data (Schema.org)

## Produto (Módulo Commerce)

```tsx
import { jsonLdScriptProps } from "next/script";

function ProductJsonLd({ product }: { product: CommerceProduct }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nome,
    description: product.descricao,
    image: product.imagens,
    offers: {
      "@type": "Offer",
      price: product.preco,
      priceCurrency: "BRL",
      availability:
        product.estoque > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
  return <script {...jsonLdScriptProps({ json })} />;
}
```

## Negócio Local (Módulo Website)

```tsx
function LocalBusinessJsonLd({ tenant }: { tenant: Tenant }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: tenant.nome,
    description: tenant.descricao,
    url: `https://locarize.com.br/${tenant.slug}`,
    image: tenant.logo,
    address: {
      "@type": "PostalAddress",
      streetAddress: tenant.endereco,
      addressLocality: tenant.cidade,
      addressRegion: tenant.estado,
      addressCountry: "BR",
    },
    telephone: tenant.telefone,
    openingHours: tenant.horarios?.map((h: Horario) => `${h.dia} ${h.abertura}-${h.fechamento}`),
  };
  return <script {...jsonLdScriptProps({ json })} />;
}
```

## BreadcrumbList (Todas as Páginas)

```tsx
function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <script {...jsonLdScriptProps({ json })} />;
}
```

---

# 4. Performance (Todas as Aplicações)

## Imagens

```tsx
import Image from "next/image";

<Image
  src={product.imagens[0]}
  alt={product.nome}
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/webp;base64,..."
/>;
```

## Fontes

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });
```

## Cache e ISR

```typescript
// Páginas públicas com revalidação
export const revalidate = 3600; // 1 hora

// Páginas estáticas
export const dynamic = "force-static";
```

---

# 5. URLs Amigáveis (Módulo Website + Commerce)

| Padrão    | Exemplo                                                     |
| --------- | ----------------------------------------------------------- |
| Tenant    | `locarize.com.br/barbearia-elite`                           |
| Serviço   | `locarize.com.br/barbearia-elite/corte-degradê`             |
| Produto   | `locarize.com.br/barbearia-elite/loja/pomada-matizadora`    |
| Categoria | `locarize.com.br/barbearia-elite/loja/categoria/pomadas`    |
| Blog      | `locarize.com.br/barbearia-elite/blog/como-cuidar-da-barba` |

**Regra:** URLs em português, hifenizadas, sem IDs, sem parâmetros.

---

# 6. Redes Sociais (Open Graph / Twitter Cards)

Todas as páginas públicas devem implementar:

| Propriedade      | Obrigatório | Descrição                             |
| ---------------- | ----------- | ------------------------------------- |
| `og:title`       | Sim         | Título da página (máx. 60 caracteres) |
| `og:description` | Sim         | Descrição (máx. 160 caracteres)       |
| `og:image`       | Sim         | Imagem 1200×630px                     |
| `og:url`         | Sim         | URL canônica                          |
| `og:type`        | Sim         | `website` ou `product`                |
| `twitter:card`   | Sim         | `summary_large_image`                 |

---

# 7. Responsividade e Mobile

- Design mobile-first (ver 04-DESIGN-SYSTEM.md)
- Viewport configurado: `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- Botões com área de toque mínima de 44×44px
- Google Mobile-Friendly Test como critério de aceite

---

# 8. Acessibilidade e SEO

| Prática                              | Impacto SEO                     |
| ------------------------------------ | ------------------------------- |
| `alt` descritivo em todas as imagens | Direto                          |
| Hierarquia de headings (`h1` → `h6`) | Direto                          |
| Atributos `lang`                     | Direto                          |
| `aria-label` em links sem texto      | Indireto (UX + bounce rate)     |
| Contraste suficiente                 | Indireto (UX + tempo na página) |

---

# 9. Monitoramento

## Ferramentas

- **Google Search Console** — indexação, erros, queries
- **Lighthouse CI** — CWV no pipeline de CI/CD
- **Vercel Analytics** — métricas de performance real (RUM)

## Checklist de Deploy

- [ ] Sitemap atualizado
- [ ] Robots.txt correto
- [ ] Meta tags preenchendo todas as páginas públicas
- [ ] Structured data válido (testar no Rich Results Test)
- [ ] Nenhuma página canônica apontando para si mesma incorretamente
- [ ] Lighthouse ≥ 90 em todas as categorias
- [ ] Core Web Vitals dentro do alvo

---

# Regra SEO

Nenhuma página pública deve ser lançada sem:

1. `generateMetadata` com title, description e open graph
2. Structured data (Product, LocalBusiness ou BreadcrumbList)
3. Lighthouse ≥ 90
4. Teste no Google Rich Results Test
