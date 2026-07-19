export default function FotograficoPage() {
  const servicos = [
    { nome: "Corte Personalizado", preco: "R$ 85", duracao: "50 min" },
    { nome: "Barba Completa", preco: "R$ 50", duracao: "30 min" },
    { nome: "Combo Completo", preco: "R$ 120", duracao: "80 min" },
    { nome: "Terapia Capilar", preco: "R$ 95", duracao: "45 min" },
    { nome: "Corte Infantil", preco: "R$ 60", duracao: "35 min" },
    { nome: "Sobrancelha", preco: "R$ 25", duracao: "15 min" },
  ]

  const equipe = [
    { nome: "Ricardo", cargo: "Fundador & Master Barber" },
    { nome: "Thiago", cargo: "Senior Stylist" },
    { nome: "Juliana", cargo: "Barbeira Profissional" },
    { nome: "Marcos", cargo: "Especialista em Degradê" },
  ]

  const depoimentos = [
    { nome: "André Santos", texto: "Sai de lá me sentindo um novo homem. O cuidado com cada detalhe é absurdo." },
    { nome: "Paulo Oliveira", texto: "Ambiente incrível, equipe talentosa. Virei cliente fiel depois da primeira visita." },
    { nome: "Gustavo Lima", texto: "Finalmente encontrei uma barbearia que entende do que eu preciso. Nota máxima!" },
  ]

  return (
    <>
      {/* ─── HERO COM IMAGEM DE FUNDO ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Background image com overlay gradiente */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1600&q=85")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.5'%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-xs font-medium tracking-widest mb-8 border border-white/10 uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Premium Barbershop
          </div>

          <h1 className="text-6xl sm:text-8xl font-black text-white leading-none tracking-tight mb-6 drop-shadow-lg">
            <span>O corte que</span><br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent">define você</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-light drop-shadow-md">
            Cada visita é uma experiência pensada nos mínimos detalhes. Ambiente premium, profissionais experts e o cuidado que você merece.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#" className="inline-flex px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all text-sm tracking-wider shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5">
              AGENDAR HORÁRIO
            </a>
            <a href="#" className="inline-flex px-10 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl transition-all text-sm tracking-wider border border-white/10">
              VER GALERIA
            </a>
          </div>

          <div className="flex items-center justify-center gap-10 mt-16">
            {[
              { value: "15+", label: "Anos" },
              { value: "22k+", label: "Clientes" },
              { value: "4.9★", label: "Avaliação" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white drop-shadow-md">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">{stat.label}</div>
                </div>
                {i < 2 && <div className="w-px h-10 bg-white/10" />}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-widest">Role</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── SOBRE ─── */}
      <section className="px-6 py-24 bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-medium mb-4 block">Nossa História</span>
              <h2 className="text-4xl font-bold text-white mb-2">Tradição que se reinventa</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 mb-6" />
              <p className="text-zinc-400 leading-relaxed mb-4 text-sm">
                Há 15 anos a Barber House nasceu de um sonho: criar um espaço onde o homem pudesse cuidar da aparência sem pressa, com qualidade de verdade e um atendimento que faz diferença.
              </p>
              <p className="text-zinc-400 leading-relaxed text-sm">
                De lá pra cá, mais de 22 mil clientes passaram por nossas cadeiras. Cada um saiu não apenas com um corte impecável, mas com a sensação de ter vivido uma experiência única.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/5">
                  <svg className="w-32 h-32 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl font-black text-amber-500">15</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section className="px-6 py-24 bg-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-medium mb-4 block">Tabela</span>
            <h2 className="text-4xl font-bold text-white mb-2">Nossos Serviços</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {servicos.map((s, i) => (
              <div key={i} className="group flex items-center justify-between px-6 py-4 bg-zinc-800 hover:bg-zinc-750 rounded-xl border border-white/5 hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono text-zinc-600 w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium text-white group-hover:text-amber-400 transition-colors">{s.nome}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-600">{s.duracao}</span>
                  <span className="font-semibold text-amber-400">{s.preco}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EQUIPE ─── */}
      <section className="px-6 py-24 bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-medium mb-4 block">Equipe</span>
            <h2 className="text-4xl font-bold text-white mb-2">Quem faz acontecer</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipe.map((m, i) => (
              <div key={i} className="group text-center p-6 rounded-2xl bg-zinc-800/50 border border-white/5 hover:border-amber-500/20 transition-all hover:-translate-y-1">
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ring-1 ring-white/5">
                  <span className="text-3xl font-black text-amber-400/80">{m.nome.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-white">{m.nome}</h3>
                <p className="text-xs text-zinc-500 mt-1">{m.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section className="px-6 py-24 bg-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-medium mb-4 block">Depoimentos</span>
            <h2 className="text-4xl font-bold text-white mb-2">O que falam de nós</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {depoimentos.map((d, i) => (
              <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-white/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5 font-light">&ldquo;{d.texto}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-bold text-white">
                    {d.nome.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{d.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HORÁRIOS ─── */}
      <section className="px-6 py-24 bg-zinc-900">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-medium mb-4 block">Horários</span>
            <h2 className="text-4xl font-bold text-white mb-2">Quando atender</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto" />
          </div>
          <div className="rounded-2xl bg-zinc-800/50 border border-white/5 overflow-hidden">
            {[
              { dia: "Seg—Sex", horario: "08:00 — 20:00" },
              { dia: "Sábado", horario: "08:00 — 18:00" },
              { dia: "Domingo", horario: "Fechado", fechado: true },
            ].map((h, i) => (
              <div key={i} className={`flex justify-between px-6 py-4 ${i < 2 ? "border-b border-white/5" : ""} ${h.fechado ? "opacity-30" : ""}`}>
                <span className={`font-medium text-sm ${h.fechado ? "text-zinc-500" : "text-white"}`}>{h.dia}</span>
                <span className={`text-sm ${h.fechado ? "text-zinc-500" : "text-zinc-400"}`}>{h.horario}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTATO ─── */}
      <section className="px-6 py-24 bg-zinc-800/50">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/10 mb-6">
            <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-medium mb-4 block">Contato</span>
          <h2 className="text-3xl font-bold text-white mb-2">Venha nos visitar</h2>
          <p className="text-zinc-500 mb-1">Rua Oscar Freire, 900 — Jardins, SP</p>
          <p className="text-zinc-500 mb-8">(11) 96666-5555</p>
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-all text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            ABRIR NO MAPS
          </a>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className="px-6 py-24 bg-zinc-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1600&q=85")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div className="relative z-10 max-w-lg mx-auto">
          <h2 className="text-4xl font-black text-white mb-3">Seu estilo espera</h2>
          <p className="text-zinc-400 mb-8 font-light">Agende online e garanta o melhor horário para você.</p>
          <a href="#" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all text-sm tracking-wider shadow-2xl shadow-amber-500/30">
            AGENDAR AGORA
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </a>
        </div>
      </section>
    </>
  )
}
