"use client"

import { useState } from "react"
import { Scissors, Crown, ShieldCheck, Calendar, ArrowRight, Star, MapPin, Phone, ChevronRight, Menu, X, Check, ChevronDown, Quote } from "lucide-react"
import { Instagram } from "@/components/ui/icons"

const HERO_BG = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"

const navItems = [
  { label: "Início", href: "#hero" },
  { label: "Serviços", href: "#servicos" },
  { label: "Planos", href: "#planos" },
  { label: "Produtos", href: "#produtos" },
  { label: "Equipe", href: "#equipe" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
]

const servicos = [
  { nome: "Corte Clássico", preco: "R$ 65", duracao: "45 min" },
  { nome: "Degradê Master", preco: "R$ 75", duracao: "50 min" },
  { nome: "Barba Desenhada", preco: "R$ 40", duracao: "30 min" },
  { nome: "Corte + Barba", preco: "R$ 95", duracao: "60 min" },
  { nome: "Hidratação Capilar", preco: "R$ 70", duracao: "35 min" },
  { nome: "Hot Towel Experience", preco: "R$ 30", duracao: "20 min" },
]

const planos = [
  {
    nome: "Essential",
    preco: "R$ 79",
    periodo: "/mês",
    desc: "Para quem quer manter o visual sempre em dia.",
    destaque: false,
    beneficios: [
      "1 corte por mês",
      "Barba tradicional",
      "5% off em produtos",
      "Agendamento VIP",
    ],
  },
  {
    nome: "Premium",
    preco: "R$ 149",
    periodo: "/mês",
    desc: "O plano mais popular. Cuidado completo todo mês.",
    destaque: true,
    beneficios: [
      "2 cortes por mês",
      "Barba designer",
      "Hidratação mensal",
      "15% off em produtos",
      "Agendamento prioritário",
    ],
  },
  {
    nome: "VIP",
    preco: "R$ 249",
    periodo: "/mês",
    desc: "Experiência completa para quem exige o melhor.",
    destaque: false,
    beneficios: [
      "Cortes ilimitados",
      "Barba toda visita",
      "Hidratação semanal",
      "30% off em produtos",
      "Acesso a eventos exclusivos",
      "Convidado +1",
    ],
  },
]

const equipe = [
  {
    nome: "RAFAEL MENDES",
    cargo: "ESPECIALISTA EM CORTES CLÁSSICOS",
    bio: "Apaixonado por cortes tradicionais e modernos. Mais de 8 anos de experiência entregando precisão e elegância em cada detalhe.",
    imagem: null,
    featured: false,
    icone: Scissors,
  },
  {
    nome: "GABRIEL SILVA",
    cargo: "ESPECIALISTA EM BARBA E DESIGN",
    bio: "Especialista em barbas e visagismo masculino. Detalhista, criativo e referência em desenho de barba e acabamento premium.",
    imagem: null,
    featured: true,
    tag: "MAIS EXPERIENTE",
    icone: Crown,
  },
  {
    nome: "LUCAS PEREIRA",
    cargo: "MESTRE DO DEGRADÊ",
    bio: "Mestre do degradê e tendências modernas. Técnicas avançadas para entregar um visual único e cheio de personalidade.",
    imagem: null,
    featured: false,
    icone: ShieldCheck,
  },
]

const depoimentos = [
  { nome: "Carlos A.", texto: "Melhor barbearia da cidade. O Gabriel é um verdadeiro artista com a barba. Saí de lá me sentindo um novo homem.", estrelas: 5 },
  { nome: "Rafael M.", texto: "Ambiente incrível, equipe talentosa e atendimento nota 10. O café é um plus que faz toda a diferença.", estrelas: 5 },
  { nome: "Pedro S.", texto: "Corte perfeito toda vez. O degradê do Lucas é impecável. Virei cliente fiel.", estrelas: 5 },
]

const produtos = [
  { nome: "Pomada Modeladora", desc: "Fixação forte e brilho moderado. Ideal para cortes clássicos.", preco: "R$ 49,90", imagem: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&q=80" },
  { nome: "Óleo para Barba", desc: "Hidrata e macia os fios. Fragrância amadeirada premium.", preco: "R$ 39,90", imagem: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&q=80" },
  { nome: "Shampoo Premium", desc: "Limpeza profunda com pH balanceado para todos os tipos.", preco: "R$ 59,90", imagem: "https://images.unsplash.com/photo-1634302089571-5c2c96342a64?w=300&q=80" },
  { nome: "Pente Profissional", desc: "Cabral de fibra de carbono. Anti-estático e resistente.", preco: "R$ 29,90", imagem: "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=300&q=80" },
  { nome: "Navalha Clássica", desc: "Aço inoxidável com cabo de madeira. Tradição e precisão.", preco: "R$ 89,90", imagem: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&q=80" },
  { nome: "Kit Completo", desc: "Pomada, óleo, shampoo e pente. O essencial do dia a dia.", preco: "R$ 199,90", imagem: "https://images.unsplash.com/photo-1593702288056-2c16045a1f5b?w=300&q=80" },
]

const galeria = [
  "https://images.unsplash.com/photo-1585747861115-d4e6d9c9e5d0?w=400&q=80",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80",
  "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&q=80",
  "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&q=80",
  "https://images.unsplash.com/photo-1593702288056-2c16045a1f5b?w=400&q=80",
  "https://images.unsplash.com/photo-1634302089571-5c2c96342a64?w=400&q=80",
]

const horarios = [
  { dia: "Segunda", horario: "09:00 — 20:00" },
  { dia: "Terça", horario: "09:00 — 20:00" },
  { dia: "Quarta", horario: "09:00 — 20:00" },
  { dia: "Quinta", horario: "09:00 — 21:00" },
  { dia: "Sexta", horario: "09:00 — 21:00" },
  { dia: "Sábado", horario: "09:00 — 17:00" },
  { dia: "Domingo", horario: "Fechado" },
]

const ICONS = [Scissors, Crown, ShieldCheck]

export default function GptCompletoPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="bg-[#0c0c0c] text-zinc-100 font-sans min-h-screen">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-lg tracking-tight">BARBEARIA</span>
            <span className="text-amber-500 font-bold">PREMIUM</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-xs font-medium tracking-widest uppercase text-zinc-400 hover:text-amber-500 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => scrollTo("#contato")} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs tracking-wider rounded-lg transition-all shadow-lg shadow-amber-500/20">
              AGENDAR
            </button>
          </div>
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-[#0c0c0c]">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="block w-full text-left text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <button onClick={() => scrollTo("#contato")} className="w-full px-5 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs tracking-wider rounded-lg transition-all">
                AGENDAR
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/95 via-[#0c0c0c]/80 to-[#0c0c0c]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Premium Barbershop
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none tracking-tight mb-6">
            <span>Onde o Estilo</span>
            <br />
            <span className="text-amber-500">Encontra a Arte</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Tradição, cuidado e bom papo. Venha viver a experiência de quem entende do ofício há mais de uma década.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => scrollTo("#contato")} className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5">
              AGENDAR AGORA
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo("#servicos")} className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 hover:border-amber-500/50 text-zinc-300 hover:text-amber-500 rounded-xl transition-all text-sm tracking-wider">
              VER SERVIÇOS
            </button>
          </div>
          <div className="flex gap-8 justify-center mt-16">
            <div className="text-center">
              <div className="text-3xl font-black text-amber-500">15+</div>
              <div className="text-xs text-zinc-500 mt-1 tracking-wider">ANOS</div>
            </div>
            <div className="w-px bg-zinc-800" />
            <div className="text-center">
              <div className="text-3xl font-black text-amber-500">12k+</div>
              <div className="text-xs text-zinc-500 mt-1 tracking-wider">CLIENTES</div>
            </div>
            <div className="w-px bg-zinc-800" />
            <div className="text-center">
              <div className="text-3xl font-black text-amber-500">4.9</div>
              <div className="text-xs text-zinc-500 mt-1 tracking-wider">ESTRELAS</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOBRE ─── */}
      <section id="sobre" className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-14 items-center">
            <div className="w-full md:w-80 h-80 rounded-2xl overflow-hidden shrink-0 border border-zinc-800">
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" alt="" className="w-full h-full object-cover grayscale contrast-125" />
            </div>
            <div>
              <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Sobre Nós</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                <span>Tradição que</span><span className="text-amber-500"> se Reinventa</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4 text-base">
                A Barbearia Premium nasceu da paixão pela arte da barbearia clássica combinada com técnicas modernas. Somos um espaço pensado para homens que valorizam estilo, qualidade e um atendimento personalizado.
              </p>
              <p className="text-zinc-500 leading-relaxed text-sm">
                Cada visita é uma experiência completa — do café fresquinho ao corte impecável. Nossa equipe é formada por profissionais que respiram barbearia e transformam cada serviço em uma obra de arte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section id="servicos" className="px-6 py-24 bg-[#121212] border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Nossos Serviços</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span>Excelência em</span><span className="text-amber-500"> Cada Corte</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {servicos.map((s, i) => (
              <div key={i} className="group flex items-center justify-between px-6 py-5 bg-[#0c0c0c] hover:bg-zinc-900/80 rounded-xl border border-zinc-800 hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-amber-500/30 group-hover:text-amber-500/60 transition-colors w-8">{(i + 1).toString().padStart(2, "0")}</span>
                  <div>
                    <span className="font-semibold text-zinc-100 group-hover:text-amber-500 transition-colors">{s.nome}</span>
                    <span className="text-xs text-zinc-600 ml-2">{s.duracao}</span>
                  </div>
                </div>
                <span className="font-bold text-amber-500">{s.preco}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANOS ─── */}
      <section id="planos" className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Planos de Assinatura</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span>Escolha Seu</span><span className="text-amber-500"> Plano</span>
            </h2>
            <p className="text-zinc-500 mt-3 max-w-lg mx-auto">Assine e transforme sua experiência. Cuidado premium todo mês.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {planos.map((plano, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plano.destaque
                    ? "bg-gradient-to-b from-amber-500/10 to-[#121212] border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                    : "bg-[#121212] border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black text-[10px] font-black tracking-widest uppercase rounded-full">
                    MAIS POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plano.nome}</h3>
                  <p className="text-xs text-zinc-500">{plano.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plano.preco}</span>
                  <span className="text-zinc-500 text-sm ml-1">{plano.periodo}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plano.beneficios.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-zinc-400">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plano.destaque ? "text-amber-500" : "text-zinc-600"}`} />
                      {b}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider transition-all ${
                  plano.destaque
                    ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}>
                  ASSINAR AGORA
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EQUIPE ─── */}
      <section id="equipe" className="px-6 py-24 bg-[#121212] border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 flex flex-col items-center">
            <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">Nossa Equipe</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
              <span>Profissionais </span><span className="text-amber-500">que Elevam</span>
            </h2>
            <Crown className="text-amber-500 w-5 h-5 mb-4 fill-amber-500/20" />
            <p className="text-zinc-500 text-sm max-w-lg">
              Cada barbeiro é um artista. Conheça os profissionais que transformam estilo em identidade todos os dias.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {equipe.map((m, index) => {
              const Icon = m.icone
              return (
                <div
                  key={index}
                  className={`overflow-hidden relative transition-all duration-300 rounded-2xl ${
                    m.featured ? "border-2 shadow-[0_0_20px_rgba(245,158,11,0.15)]" : "border hover:border-zinc-700"
                  }`}
                  style={{
                    backgroundColor: "#0c0c0c",
                    borderColor: m.featured ? "#F59E0B" : "#27272A",
                  }}
                >
                  {m.featured && m.tag && (
                    <div className="absolute top-0 right-6 bg-amber-500 text-black font-black text-[9px] tracking-wider px-2 py-3 flex flex-col items-center z-10 rounded-b-sm shadow-md">
                      <span className="text-[12px] mb-0.5">★</span>
                      <span className="text-center leading-none max-w-[60px]">{m.tag}</span>
                    </div>
                  )}
                  <div className="relative h-72 w-full bg-zinc-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent z-10" />
                    {m.imagem ? (
                      <img src={m.imagem} alt={m.nome} className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500" style={{ filter: "grayscale(1) contrast(1.25)" }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-16 h-16 text-zinc-800" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 pt-0 flex flex-col items-center text-center relative z-20">
                    <div className="p-3 rounded-full border border-zinc-700 mb-4 -mt-7 shadow-lg bg-[#0c0c0c] text-amber-500/80">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold tracking-wide mb-1 text-zinc-100">{m.nome}</h3>
                    <div className="flex items-center gap-2 mb-4 w-full justify-center">
                      <span className="h-[1px] w-4 bg-amber-500/50" />
                      <p className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">{m.cargo}</p>
                      <span className="h-[1px] w-4 bg-amber-500/50" />
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed mb-6 px-2">{m.bio}</p>
                    <div className="flex gap-3">
                      <button className="p-2 rounded-full border border-zinc-800 text-amber-500/80 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-900/50">
                        <Instagram className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-full border border-zinc-800 text-amber-500/80 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-900/50">
                        <Instagram className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-full border border-zinc-800 text-amber-500/80 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-900/50">
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Team CTA Banner */}
          <div className="mt-12 w-full border border-zinc-800/80 bg-[#121212]/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
            <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-amber-500 shadow-md">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold tracking-wide uppercase text-zinc-100">Agende com seu barbeiro preferido</h4>
                <p className="text-zinc-500 text-sm mt-1">Escolha o profissional e o horário ideal para você.</p>
              </div>
            </div>
            <button onClick={() => scrollTo("#contato")} className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all duration-300 uppercase tracking-wider text-xs md:text-sm shadow-lg shadow-amber-500/10 w-full md:w-auto justify-center group">
              Agendar Agora
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── GALERIA ─── */}
      <section id="galeria" className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Galeria</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span>Nosso</span><span className="text-amber-500"> Ambiente</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galeria.map((url, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl group cursor-pointer ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <img src={url} alt="" className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUTOS ─── */}
      <section id="produtos" className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Produtos</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                <span>Nossa</span><span className="text-amber-500"> Linha</span>
              </h2>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-amber-500 text-xs font-bold tracking-widest uppercase hover:text-amber-400 transition-colors">
              VER TODOS
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent" style={{ scrollbarWidth: "thin" }}>
            {produtos.map((p, i) => (
              <div key={i} className="min-w-[220px] w-[220px] shrink-0 bg-[#0c0c0c] rounded-2xl border border-zinc-800 hover:border-amber-500/30 transition-all overflow-hidden group">
                <div className="h-32 overflow-hidden bg-zinc-900">
                  <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-zinc-100 mb-0.5 truncate">{p.nome}</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 mb-2">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-500 font-bold text-sm">{p.preco}</span>
                    <button className="py-1.5 px-3 bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 text-[9px] font-bold tracking-widest uppercase rounded-lg transition-all">
                      ADICIONAR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="sm:hidden mt-6 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold tracking-widest uppercase rounded-xl transition-all">
            VER TODOS OS PRODUTOS
          </button>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section id="depoimentos" className="px-6 py-24 bg-[#121212] border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Depoimentos</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span>O Que Nossos</span><span className="text-amber-500"> Clientes Dizem</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => (
              <div key={i} className="bg-[#0c0c0c] rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-all">
                <Quote className="w-8 h-8 text-amber-500/30 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(d.estrelas)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">&ldquo;{d.texto}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-500">
                    {d.nome.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{d.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HORÁRIOS ─── */}
      <section id="horarios" className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Horários</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span>Quando</span><span className="text-amber-500"> Atender</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {horarios.map((h, i) => (
              <div
                key={i}
                className={`rounded-xl p-5 ${
                  h.horario === "Fechado"
                    ? "bg-red-500/5 border border-red-500/20 col-span-2 lg:col-span-1"
                    : "bg-[#121212] border border-zinc-800"
                }`}
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className={`font-bold text-xs tracking-widest uppercase ${
                    h.horario === "Fechado" ? "text-red-400" : "text-zinc-200"
                  }`}>
                    {h.dia}
                  </span>
                  {h.horario === "Fechado" ? (
                    <span className="text-sm font-bold text-red-400">FECHADO</span>
                  ) : (
                    <span className="text-sm text-zinc-400">{h.horario}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTATO ─── */}
      <section id="contato" className="px-6 py-24 bg-[#121212] border-t border-zinc-800/50">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <MapPin className="w-7 h-7 text-amber-500" />
          </div>
          <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Contato</span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            <span>Venha nos</span><span className="text-amber-500"> Conhecer</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-zinc-400">Rua Augusta, 999 — Consolação, SP</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-zinc-400">(11) 99999-8888</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mb-8">
            {[Instagram, Instagram, Calendar].map((Icon, i) => (
              <button key={i} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-500/80 hover:text-amber-500 hover:border-amber-500/50 transition-all">
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all text-sm tracking-wider shadow-lg shadow-amber-500/25"
            >
              ABRIR NO MAPS
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:+5511999998888"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-zinc-700 hover:border-amber-500/50 text-zinc-300 hover:text-amber-500 rounded-xl transition-all text-sm tracking-wider"
            >
              LIGAR AGORA
            </a>
          </div>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className="px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            <span>Pronto para</span><span className="text-amber-500"> Transformar</span><span> seu Visual?</span>
          </h2>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">Agende seu horário online e garanta o melhor atendimento com nossos profissionais.</p>
          <button onClick={() => scrollTo("#contato")} className="inline-flex items-center gap-2 px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 group">
            AGENDAR AGORA
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-6 py-8 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span className="text-zinc-500">BARBEARIA</span>
            <span className="text-amber-500 font-bold">PREMIUM</span>
          </div>
          <p className="text-xs text-zinc-700">&copy; 2026 Barbearia Premium. Todos os direitos reservados.</p>
          <div className="flex gap-4 text-zinc-600 text-xs">
            <button onClick={() => scrollTo("#hero")} className="hover:text-amber-500 transition-colors">Início</button>
            <button onClick={() => scrollTo("#servicos")} className="hover:text-amber-500 transition-colors">Serviços</button>
            <button onClick={() => scrollTo("#planos")} className="hover:text-amber-500 transition-colors">Planos</button>
            <button onClick={() => scrollTo("#produtos")} className="hover:text-amber-500 transition-colors">Produtos</button>
            <button onClick={() => scrollTo("#equipe")} className="hover:text-amber-500 transition-colors">Equipe</button>
            <button onClick={() => scrollTo("#contato")} className="hover:text-amber-500 transition-colors">Contato</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
