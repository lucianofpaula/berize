import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Scissors,
  Crown,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Instagram } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Dados fictícios baseados na imagem
const teamMembers = [
  {
    name: "RAFAEL MENDES",
    role: "ESPECIALISTA EM CORTES CLÁSSICOS",
    bio: "Apaixonado por cortes tradicionais e modernos. Mais de 8 anos de experiência entregando precisão e elegância em cada detalhe.",
    image:
      "https://i.pinimg.com/736x/9c/dc/5d/9cdc5d309f828f106c2f756f75baf25d.jpg", // Substitua pelo caminho real da sua imagem
    icon: Scissors,
    featured: false,
  },
  {
    name: "GABRIEL SILVA",
    role: "ESPECIALISTA EM BARBA E DESIGN",
    bio: "Especialista em barbas e visagismo masculino. Detalhista, criativo e referência em desenho de barba e acabamento premium.",
    image:
      "https://i.pinimg.com/736x/74/b1/6a/74b16a2ea6decd72115c9a75a688942b.jpg", // Substitua pelo caminho real da sua imagem
    icon: Crown,
    featured: true, // Card do meio em destaque
    tag: "MAIS EXPERIENTE",
  },
  {
    name: "LUCAS PEREIRA",
    role: "ESPECIALISTA EM DEGRADÊ",
    bio: "Mestre do degradê e tendências modernas. Técnicas avançadas para entregar um visual único e cheio de personalidade.",
    image:
      "https://i.pinimg.com/736x/88/3f/1d/883f1d2e5575fd346556f27a171c04d7.jpg", // Substitua pelo caminho real da sua imagem
    icon: ShieldCheck, // Usando como substituto visual para o ícone de navalha/ferramenta
    featured: false,
  },
];

export default function OurTeam() {
  return (
    <section className="bg-[#0c0c0c] text-zinc-100 py-16 px-4 md:px-8 flex flex-col items-center justify-center font-sans select-none">
      {/* Header da Seção */}
      <div className="text-center max-w-2xl mb-12 flex flex-col items-center">
        <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">
          Nossa Equipe
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-zinc-150 uppercase">
          <span>Profissionais </span><span className="text-amber-500">que Elevam</span>
        </h2>
        <Crown className="text-amber-500 w-5 h-5 mb-4 fill-amber-500/20" />
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Cada barbeiro é um artista. Conheça os profissionais que transformam
          estilo em identidade todos os dias.
        </p>
      </div>

      {/* Carrossel de Profissionais */}
      <div className="w-full max-w-5xl relative px-12 mb-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card
                    className={`bg-[#121212] overflow-hidden relative transition-all duration-300 rounded-2xl group
                      ${
                        member.featured
                          ? "border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                          : "border border-zinc-800 hover:border-zinc-700"
                      }`}
                  >
                    {/* Tag de Destaque (Mais Experiente) */}
                    {member.featured && member.tag && (
                      <div className="absolute top-0 right-6 bg-amber-500 text-black font-black text-[9px] tracking-wider px-2 py-3 flex flex-col items-center z-10 rounded-b-sm shadow-md">
                        <span className="text-[12px] mb-0.5">★</span>
                        <span className="text-center leading-none max-w-[60px]">
                          {member.tag}
                        </span>
                      </div>
                    )}

                    {/* Imagem do Barbeiro */}
                    <div className="relative h-72 w-full bg-zinc-900 overflow-hidden">
                      {/* Overlay gradiente escuro embaixo da foto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10" />
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Conteúdo do Card */}
                    <CardContent className="p-6 pt-0 flex flex-col items-center text-center relative z-20">
                      {/* Ícone Redondo Flutuante */}
                      <div
                        className={`p-3 rounded-full border mb-4 bg-[#121212] -mt-7 shadow-lg
                        ${member.featured ? "border-amber-500 text-amber-500" : "border-zinc-700 text-amber-500/80"}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Nome e Cargo */}
                      <h3 className="text-xl font-bold tracking-wide mb-1 text-zinc-100">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4 w-full justify-center">
                        <span className="h-[1px] w-4 bg-amber-500/50"></span>
                        <p className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">
                          {member.role}
                        </p>
                        <span className="h-[1px] w-4 bg-amber-500/50"></span>
                      </div>

                      {/* Descrição */}
                      <p className="text-zinc-400 text-xs min-h-[64px] leading-relaxed mb-6 px-2">
                        {member.bio}
                      </p>

                      {/* Redes Sociais / Ações */}
                      <div className="flex gap-3">
                        <button className="p-2 rounded-full border border-zinc-800 text-amber-500/80 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-900/50">
                          <Instagram className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-full border border-zinc-800 text-amber-500/80 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-900/50">
                          {/* Ícone de WhatsApp simulado */}
                          <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.451 5.438 1.453 5.494 0 9.961-4.47 9.964-9.97.002-2.666-1.033-5.174-2.907-7.05-1.876-1.877-4.374-2.912-7.043-2.913-5.499 0-9.966 4.47-9.969 9.971-.001 1.995.521 3.946 1.512 5.66l-.98 3.58 3.673-.963zm10.741-7.345c-.29-.145-1.714-.846-1.979-.942-.266-.096-.459-.145-.653.146-.193.29-.748.942-.917 1.134-.169.192-.338.217-.628.072-.29-.145-1.223-.45-2.33-1.439-.86-.767-1.44-1.716-1.609-2.007-.169-.29-.018-.447.127-.591.13-.13.29-.338.435-.507.145-.169.193-.29.29-.483.096-.193.048-.361-.024-.507-.072-.145-.653-1.573-.895-2.152-.236-.569-.475-.492-.653-.501-.17-.008-.363-.01-.556-.01-.193 0-.507.072-.772.361-.266.29-1.014.99-1.014 2.415 0 1.425 1.038 2.801 1.182 2.994.145.193 2.043 3.12 4.949 4.373.691.298 1.232.476 1.653.61.694.22 1.326.19 1.825.115.556-.083 1.714-.7 1.956-1.374.242-.675.242-1.253.169-1.374-.073-.121-.266-.193-.556-.338z" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-full border border-zinc-800 text-amber-500/80 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-900/50">
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Botões de Navegação customizados do Shadcn */}
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#121212] border-zinc-800 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 w-10 h-10 rounded-full" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#121212] border-zinc-800 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 w-10 h-10 rounded-full" />
        </Carousel>
      </div>

      {/* Banner de Agendamento Inferior */}
      <div className="w-full max-w-5xl border border-zinc-800/80 bg-[#121212]/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-amber-500 shadow-md">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-wide uppercase text-zinc-100">
              Agende com seu barbeiro preferido
            </h4>
            <p className="text-zinc-400 text-sm mt-1">
              Escolha o profissional e o horário ideal para você.
            </p>
          </div>
        </div>

        <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-8 py-6 rounded-xl transition-all duration-300 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/10 w-full md:w-auto justify-center group">
          Agendar Agora
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
}
