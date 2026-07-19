import React from "react";
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button"; // Importação padrão do Shadcn UI

// Simulando o JSON importado ou recebido via Props
const data = {
  tagline: "BARBEARIA DO CANHOTO",
  titleLine1: "ESTILO QUE IMPÕE.",
  titleLine2: "CONFIANÇA QUE FICA.",
  subtitle:
    "Mais que um corte, uma experiência completa pensada para homens que valorizam sua imagem.",
  backgroundImage:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070", // Imagem placeholder premium do Unsplash se preferir testar
  primaryButton: {
    text: "AGENDAR",
    variant: "default" as const,
    className:
      "bg-gradient-to-b from-[#b88e4c] to-[#86612d] hover:brightness-110 text-stone-900 border border-[#cfa666]/30 font-semibold tracking-widest text-sm rounded-sm px-6 h-12 transition-all shadow-lg",
  },
  secondaryButton: {
    text: "ACESSAR",
    variant: "outline" as const,
    className:
      "border-[#4a3f35] text-stone-200 hover:bg-stone-900/50 hover:text-white font-semibold tracking-widest text-sm rounded-sm px-6 h-12 bg-black/20 backdrop-blur-sm transition-all",
  },
};

export default function BarberHero() {
  return (
    <section className="relative w-full min-h-[600px] lg:h-[100vh] flex items-center bg-stone-950 overflow-hidden select-none">
      {/* Imagem de Fundo com Overlay Escuro para Legibilidade */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('${data.backgroundImage}')`,
          // Se você usar a imagem exata com a cadeira do lado direito:
          backgroundPosition: "right center",
        }}
      >
        {/* Camada gradiente escura da esquerda para a direita para destacar o texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent lg:block hidden" />
        <div className="absolute inset-0 bg-black/60 lg:hidden block" />
      </div>

      {/* Conteúdo Principal */}
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 max-w-7xl w-full hierarchical-text">
        <div className="max-w-2xl flex flex-col items-start gap-4">
          {/* Tagline / Categoria superior */}
          <div className="flex items-center gap-3">
            <span className="text-[#c59b5f] text-xs font-bold tracking-[0.3em] uppercase">
              {data.tagline}
            </span>
            <div className="w-12 h-[1px] bg-[#c59b5f]/40" />
          </div>

          {/* Título Principal de Impacto */}
          <h1 className="font-serif tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white">
            <span className="block font-medium drop-shadow-md">
              {data.titleLine1}
            </span>
            <span className="block font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#f3e5ab] drop-shadow-md mt-1">
              {data.titleLine2}
            </span>
          </h1>

          {/* Subtítulo descritivo */}
          <p className="text-stone-400 text-sm sm:text-base lg:text-lg max-w-lg mt-2 leading-relaxed font-light">
            {data.subtitle}
          </p>

          {/* Grupo de Botões (Shadcn UI Button adaptado) */}
          <div className="flex flex-wrap items-center gap-4 mt-6 w-full sm:w-auto">
            {/* Botão Primário - Agendar */}
            <Button
              variant={data.primaryButton.variant}
              className={data.primaryButton.className}
            >
              <Calendar className="mr-2 h-4 w-4 stroke-[2.5]" />
              {data.primaryButton.text}
            </Button>

            {/* Botão Secundário - Acessar */}
            <Button
              variant={data.secondaryButton.variant}
              className={data.secondaryButton.className}
            >
              <User className="mr-2 h-4 w-4 stroke-[2.5]" />
              {data.secondaryButton.text}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
