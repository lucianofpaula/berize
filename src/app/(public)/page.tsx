import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturedBusinesses } from "@/components/landing/featured-businesses"
import { CategoriesSection } from "@/components/landing/categories-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { CTASection } from "@/components/landing/cta-section"

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://localize.com.br"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "localize.com.br",
      url: siteUrl,
      description: "Plataforma de descoberta local. Encontre empresas e profissionais perto de você.",
      areaServed: "BR",
    },
    {
      "@type": "WebSite",
      url: siteUrl,
      name: "localize.com.br",
      description: "Plataforma de descoberta local.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/buscar?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <StatsSection />
      <FeaturedBusinesses />
      <CategoriesSection />
      <HowItWorks />
      <CTASection />
    </>
  )
}
