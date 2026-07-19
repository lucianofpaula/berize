export default function ContemporaneoPage() {
  const servicos = [
    { nome: "Corte Urbano", preco: "R$ 65", duracao: "45 min" },
    { nome: "Degradê Master", preco: "R$ 75", duracao: "50 min" },
    { nome: "Barba Desenhada", preco: "R$ 40", duracao: "30 min" },
    { nome: "Corte + Degradê + Barba", preco: "R$ 120", duracao: "75 min" },
    { nome: "Hidratação + Corte", preco: "R$ 90", duracao: "50 min" },
    { nome: "Design Capilar", preco: "R$ 55", duracao: "35 min" },
  ]

  const equipe = [
    { nome: "Léo", estilo: "Degradê & Risco" },
    { nome: "Gabs", estilo: "Corte Texturizado" },
    { nome: "Dani", estilo: "Barba & Design" },
    { nome: "Tata", estilo: "Corte Feminino" },
  ]

  const depoimentos = [
    { nome: "Lucas V.", texto: "O melhor degradê que já fiz. O Léo é monstro!" },
    { nome: "Igor M.", texto: "Ambiente brabo, música boa e corte impecável." },
    { nome: "Felipe R.", texto: "Saí de lá me sentindo outro cara. Nota 10!" },
  ]

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] bg-[#080808] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B35] rounded-full blur-[200px] opacity-20" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#7C3AED] rounded-full blur-[200px] opacity-15" />
        <div className="relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/50 text-xs font-medium tracking-wide mb-6 uppercase border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
            Nova unidade — Agende já
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tight mb-6">
            <span>Seu estilo,</span><br />
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] bg-clip-text text-transparent">sua identidade</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-10 font-light">
            Estilo ousado, tendências urbanas e a atitude que só quem é de verdade tem. Chega pra somar.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#" className="inline-flex px-8 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#E85D20] text-white font-bold rounded-lg transition-all text-sm tracking-wider shadow-lg shadow-[#FF6B35]/30 hover:shadow-[#FF6B35]/50 hover:-translate-y-0.5">
              AGENDAR AGORA
            </a>
            <a href="#" className="inline-flex px-8 py-3.5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 rounded-lg transition-all text-sm tracking-wider backdrop-blur-sm">
              VER TRABALHOS
            </a>
          </div>
          <div className="flex gap-8 justify-center mt-12 text-white/40 text-xs font-mono tracking-wider">
            <span>12+ ANOS</span>
            <span className="w-1 h-1 rounded-full bg-white/20 mt-1.5" />
            <span>8.000+ CLIENTES</span>
            <span className="w-1 h-1 rounded-full bg-white/20 mt-1.5" />
            <span>4.9 ★</span>
          </div>
        </div>
      </section>

      {/* ─── SOBRE ─── */}
      <section className="px-6 py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 to-[#7C3AED]/10 flex items-center justify-center shrink-0 border border-white/5">
              <svg className="w-24 h-24 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Nossa Vibração</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] mb-6" />
              <p className="text-zinc-400 leading-relaxed mb-4">
                A Urban Cuts nasceu da vontade de criar um espaço onde estilo e atitude se encontram. Não somos uma barbearia tradicional — somos um estúdio de estilo urbano que entende as tendências e sabe traduzir personalidade em cada corte.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Aqui o degradê é afiado, a conversa é boa e a música é a nossa cara. Cada profissional tem sua especialidade e sua própria identidade, porque acreditamos que diversidade é o que faz um corte ser único.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section className="px-6 py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Serviços</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] mx-auto mb-4" />
            <p className="text-zinc-500">Tabela fixa, resultado variável</p>
          </div>
          <div className="space-y-2">
            {servicos.map((s, i) => (
              <div key={i} className="group flex items-center justify-between px-5 py-3.5 bg-white/5 hover:bg-white/[0.07] rounded-xl border border-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-600 w-6">0{i + 1}</span>
                  <span className="font-medium text-white group-hover:text-[#FF6B35] transition-colors">{s.nome}</span>
                  <span className="text-xs text-zinc-600">{s.duracao}</span>
                </div>
                <span className="font-semibold text-white/80">{s.preco}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EQUIPE ─── */}
      <section className="px-6 py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Team</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] mx-auto mb-4" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipe.map((m, i) => (
              <div key={i} className="group text-center p-6 rounded-xl bg-white/5 hover:bg-white/[0.07] border border-white/5 transition-all">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#7C3AED]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="text-2xl font-black text-white/80 group-hover:text-white transition-colors">{m.nome.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-white">{m.nome}</h3>
                <p className="text-xs text-zinc-500 mt-1">{m.estilo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section className="px-6 py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Feedback</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] mx-auto mb-4" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {depoimentos.map((d, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/5">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <span key={j} className="text-[#FF6B35] text-sm">★</span>)}</div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">&ldquo;{d.texto}&rdquo;</p>
                <span className="text-sm font-medium text-white">{d.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HORÁRIOS ─── */}
      <section className="px-6 py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Horários</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] mx-auto" />
          </div>
          <div className="space-y-2">
            {[
              { dia: "Seg—Sex", horario: "09:00 — 20:00" },
              { dia: "Sábado", horario: "09:00 — 18:00" },
              { dia: "Domingo", horario: "—" },
            ].map((h, i) => (
              <div key={i} className={`flex justify-between px-4 py-3 rounded-lg ${i === 2 ? "opacity-30" : "bg-white/5"}`}>
                <span className={`font-medium text-sm ${i === 2 ? "text-zinc-600" : "text-white"}`}>{h.dia}</span>
                <span className={`text-sm ${i === 2 ? "text-zinc-600" : "text-zinc-400"}`}>{h.horario}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTATO ─── */}
      <section className="px-6 py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 to-[#7C3AED]/10 mb-6 border border-white/5">
            <svg className="w-6 h-6 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Onde Estamos</h2>
          <p className="text-zinc-500 mb-2">Rua Augusta, 999 — Consolação, SP</p>
          <p className="text-zinc-500 mb-6">(11) 97777-6666</p>
          <a href="#" className="inline-flex px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-sm border border-white/5">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            ABRIR NO MAPS
          </a>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className="px-6 py-24 bg-gradient-to-r from-[#FF6B35]/10 via-[#7C3AED]/10 to-[#FF6B35]/10 border-t border-white/5 text-center">
        <h2 className="text-4xl font-black text-white mb-3">Bora marcar?</h2>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">Garanta seu horário com o melhor profissional.</p>
        <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#E85D20] text-white font-bold rounded-xl transition-all text-sm tracking-wider shadow-lg shadow-[#FF6B35]/30 hover:shadow-[#FF6B35]/50">
          AGENDAR
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
      </section>
    </>
  )
}
