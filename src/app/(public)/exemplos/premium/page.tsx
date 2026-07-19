export default function PremiumPage() {
  const servicos = [
    { nome: "Executive Cut", preco: "R$ 120", duracao: "60 min" },
    { nome: "Classic Shave", preco: "R$ 90", duracao: "45 min" },
    { nome: "Combo Premium", preco: "R$ 180", duracao: "90 min" },
    { nome: "Hair Treatment", preco: "R$ 110", duracao: "40 min" },
    { nome: "Beard Sculpt", preco: "R$ 70", duracao: "30 min" },
    { nome: "The Experience", preco: "R$ 250", duracao: "120 min" },
  ]

  const equipe = [
    { nome: "Vinicius", titulo: "Master Barber" },
    { nome: "Rafael", titulo: "Style Director" },
    { nome: "Gabriel", titulo: "Senior Barber" },
    { nome: "Matheus", titulo: "Shave Specialist" },
  ]

  const depoimentos = [
    { nome: "Dr. Fernando", texto: "Excelência é a palavra. Cada visita é uma experiência única." },
    { nome: "Marcelo A.", texto: "O cuidado com os detalhes é impressionante. Recomendo de olhos fechados." },
    { nome: "Ricardo L.", texto: "Desde que conheci, não deixo mais ninguém tocar no meu cabelo." },
  ]

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] bg-white flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1E3A5F]/[0.02]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E3A5F' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#1E3A5F]/20" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1E3A5F]/40 font-medium">Since 2015</span>
            <div className="w-8 h-px bg-[#1E3A5F]/20" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-light text-[#1A1A1A] leading-tight tracking-tight mb-4">
            <span>Elegância</span><br />
            <span className="font-bold">em cada detalhe</span>
          </h1>
          <p className="text-base text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed font-light">
            Um espaço pensado para o homem que valoriza tradição, sofisticação e o cuidado com a própria imagem.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#" className="inline-flex px-10 py-4 bg-[#1E3A5F] hover:bg-[#162D47] text-white font-medium tracking-wider rounded-sm transition-all text-sm uppercase">
              Agende sua visita
            </a>
            <a href="#" className="inline-flex px-10 py-4 border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-zinc-50 rounded-sm transition-all text-sm uppercase tracking-wider font-medium">
              Conheça
            </a>
          </div>
          <div className="flex gap-12 justify-center mt-14">
            <div className="text-center"><div className="text-3xl font-light text-[#1A1A1A]">10</div><div className="text-[10px] tracking-wider text-zinc-400 mt-1 uppercase">Anos</div></div>
            <div className="w-px bg-zinc-200" />
            <div className="text-center"><div className="text-3xl font-light text-[#1A1A1A]">5k+</div><div className="text-[10px] tracking-wider text-zinc-400 mt-1 uppercase">Clientes</div></div>
            <div className="w-px bg-zinc-200" />
            <div className="text-center"><div className="text-3xl font-light text-[#1A1A1A]">4.9</div><div className="text-[10px] tracking-wider text-zinc-400 mt-1 uppercase">Avaliação</div></div>
          </div>
        </div>
      </section>

      {/* ─── SOBRE ─── */}
      <section className="px-6 py-24 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-14 items-center">
            <div className="w-60 h-60 bg-white rounded-sm flex items-center justify-center shadow-sm shrink-0 border border-zinc-100">
              <svg className="w-28 h-28 text-[#1E3A5F]/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 3h18v18H3V3z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#1E3A5F]/40 font-medium mb-3 block">Sobre Nós</span>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Excelência que se renova</h2>
              <div className="w-10 h-0.5 bg-[#1E3A5F] mb-6" />
              <p className="text-zinc-500 leading-relaxed mb-4 font-light text-sm">
                Desde 2015 o Barber Elite Club vem redefinindo o conceito de barbearia de luxo em São Paulo. Mais do que cortes de cabelo, oferecemos experiências — do aroma amadeirado do ambiente ao toque quente da toalha no rosto.
              </p>
              <p className="text-zinc-500 leading-relaxed font-light text-sm">
                Cada profissional é selecionado a dedo e treinado continuamente nas técnicas mais refinadas da barbearia clássica e contemporânea. Aqui, tradição e modernidade caminham lado a lado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1E3A5F]/40 font-medium mb-3 block">Nossos Serviços</span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Cuidado em cada etapa</h2>
            <div className="w-10 h-0.5 bg-[#1E3A5F] mx-auto" />
          </div>
          <div className="space-y-1">
            {servicos.map((s, i) => (
              <div key={i} className="group flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-zinc-300">— 0{i + 1}</span>
                  <span className="font-medium text-[#1A1A1A]">{s.nome}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-300">{s.duracao}</span>
                  <span className="font-medium text-[#1E3A5F] w-16 text-right">{s.preco}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EQUIPE ─── */}
      <section className="px-6 py-24 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1E3A5F]/40 font-medium mb-3 block">Equipe</span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Mestres da navalha</h2>
            <div className="w-10 h-0.5 bg-[#1E3A5F] mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipe.map((m, i) => (
              <div key={i} className="text-center group">
                <div className="w-24 h-24 mx-auto rounded-sm bg-white border border-zinc-200 flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                  <span className="text-2xl font-bold text-[#1E3A5F]/40 group-hover:text-[#1E3A5F]/60 transition-colors">{m.nome.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-sm">{m.nome}</h3>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1">{m.titulo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1E3A5F]/40 font-medium mb-3 block">Depoimentos</span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">A voz de quem vive</h2>
            <div className="w-10 h-0.5 bg-[#1E3A5F] mx-auto" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => (
              <div key={i} className="p-6 bg-[#F8F8F8] rounded-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-zinc-300 text-sm">★</span>)}
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4 font-light">&ldquo;{d.texto}&rdquo;</p>
                <span className="text-sm font-medium text-[#1A1A1A]">{d.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HORÁRIOS ─── */}
      <section className="px-6 py-24 bg-[#F8F8F8]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1E3A5F]/40 font-medium mb-3 block">Horários</span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Quando atender</h2>
            <div className="w-10 h-0.5 bg-[#1E3A5F] mx-auto" />
          </div>
          <div className="space-y-0 border-t border-zinc-200">
            {[
              { dia: "Seg—Sex", horario: "09:00 — 20:00" },
              { dia: "Sábado", horario: "09:00 — 14:00" },
              { dia: "Domingo", horario: "Fechado" },
            ].map((h, i) => (
              <div key={i} className={`flex justify-between px-0 py-4 border-b border-zinc-100 ${i === 2 ? "opacity-30" : ""}`}>
                <span className={`text-sm font-medium ${i === 2 ? "text-zinc-400" : "text-[#1A1A1A]"}`}>{h.dia}</span>
                <span className={`text-sm ${i === 2 ? "text-zinc-300" : "text-zinc-500"}`}>{h.horario}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTATO ─── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-[#1E3A5F]/5 mb-6">
            <svg className="w-6 h-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#1E3A5F]/40 font-medium mb-3 block">Contato</span>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Venha nos conhecer</h2>
          <p className="text-zinc-400 text-sm mb-1">Al. dos Anapurus, 1200 — Moema, SP</p>
          <p className="text-zinc-400 text-sm mb-6">(11) 98888-7777</p>
          <a href="#" className="inline-flex px-6 py-3 bg-[#1E3A5F] hover:bg-[#162D47] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-all">
            VER NO MAPA
          </a>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className="px-6 py-20 bg-[#1E3A5F] text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Sua experiência começa aqui</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto text-sm font-light">Agende seu horário e descubra o verdadeiro significado de cuidado masculino.</p>
        <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1E3A5F] font-bold rounded-sm transition-all text-sm uppercase tracking-wider hover:bg-zinc-100">
          Agendar
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </section>
    </>
  )
}
