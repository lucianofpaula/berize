export default function TradicionalPage() {
  const servicos = [
    { nome: "Corte Clássico", preco: "R$ 55", duracao: "40 min" },
    { nome: "Barba Tradicional", preco: "R$ 35", duracao: "25 min" },
    { nome: "Corte + Barba", preco: "R$ 80", duracao: "60 min" },
    { nome: "Hidratação Capilar", preco: "R$ 65", duracao: "30 min" },
    { nome: "Corte Infantil", preco: "R$ 45", duracao: "30 min" },
    { nome: "Hot Towel", preco: "R$ 25", duracao: "15 min" },
  ]

  const equipe = [
    { nome: "Seu Madruga", cargo: "Mestre Barbeiro", desde: "Desde 2010" },
    { nome: "Seu Barriga", cargo: "Barbeiro Sênior", desde: "Desde 2014" },
    { nome: "Chaves", cargo: "Barbeiro Junior", desde: "Desde 2021" },
    { nome: "Seu Faker", cargo: "Especialista em Barba", desde: "Desde 2017" },
  ]

  const depoimentos = [
    { nome: "Carlos A.", texto: "Melhor barbearia da região. O Seu Madruga é um artista com a tesoura." },
    { nome: "Rafael M.", texto: "Ambiente acolhedor, café fresquinho e um atendimento nota 10." },
    { nome: "Pedro S.", texto: "Corte perfeito toda vez. Virou tradição aqui em casa." },
  ]

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] bg-[#F5F0E8] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8673C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/10 text-amber-800 text-xs font-medium tracking-wide mb-6 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse" />
            Tradição desde 2010
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-[#783F1D] leading-tight tracking-tight mb-6">
            <span>Onde a navalha</span><br /><span>encontra a arte</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#A15C33] max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Tradição, cuidado e bom papo. Venha viver a experiência de quem entende do ofício há mais de uma década.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#" className="inline-flex px-8 py-3.5 bg-[#C8673C] hover:bg-[#B85A30] text-white font-semibold rounded-lg transition-all text-sm tracking-wider shadow-lg shadow-[#C8673C]/25">
              AGENDAR HORÁRIO
            </a>
            <a href="#" className="inline-flex px-8 py-3.5 border-2 border-[#C8673C]/30 text-[#783F1D] hover:border-[#C8673C]/60 rounded-lg transition-all text-sm tracking-wider font-medium">
              CONHECER A EQUIPE
            </a>
          </div>
          <div className="flex gap-8 justify-center mt-12">
            <div className="text-center"><div className="text-2xl font-bold text-[#783F1D]">15+</div><div className="text-xs text-[#A15C33] mt-0.5">Anos de História</div></div>
            <div className="w-px bg-[#C8673C]/20" />
            <div className="text-center"><div className="text-2xl font-bold text-[#783F1D]">12.000+</div><div className="text-xs text-[#A15C33] mt-0.5">Clientes Atendidos</div></div>
            <div className="w-px bg-[#C8673C]/20" />
            <div className="text-center"><div className="text-2xl font-bold text-[#783F1D]">98%</div><div className="text-xs text-[#A15C33] mt-0.5">Satisfação</div></div>
          </div>
        </div>
      </section>

      {/* ─── SOBRE ─── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-[#F5F0E8] to-[#E8DCCC] flex items-center justify-center text-[#C8673C] shrink-0 shadow-inner">
              <svg className="w-24 h-24 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#783F1D] mb-2">Nossa História</h2>
              <div className="w-12 h-0.5 bg-[#C8673C] mb-6" />
              <p className="text-[#A15C33] leading-relaxed mb-4">
                A Barbearia Tradicional nasceu em 2010 da paixão de Seu Madruga pela arte da barbearia clássica. O que começou como uma pequena cadeira em um salão alugado, hoje é um ponto de encontro para homens que valorizam tradição, qualidade e bom atendimento.
              </p>
              <p className="text-[#A15C33] leading-relaxed">
                Aqui cada corte é feito com calma, cada barba é aparada com respeito ao formato do rosto, e cada cliente é tratado como parte da família. Nosso diferencial não está apenas na tesoura, mas no cuidado em cada detalhe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section className="px-6 py-20 bg-[#FFF8F0]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#783F1D] mb-2">Nossos Serviços</h2>
            <div className="w-12 h-0.5 bg-[#C8673C] mx-auto mb-4" />
            <p className="text-[#A15C33]">Tradição e qualidade em cada serviço</p>
          </div>
          <div className="space-y-3">
            {servicos.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-[#F5F0E8] hover:border-[#C8673C]/20 hover:shadow-sm transition-all">
                <div>
                  <span className="font-medium text-[#783F1D]">{s.nome}</span>
                  <span className="text-xs text-[#A15C33] ml-2">{s.duracao}</span>
                </div>
                <span className="font-semibold text-[#C8673C]">{s.preco}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EQUIPE ─── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#783F1D] mb-2">Nossa Equipe</h2>
            <div className="w-12 h-0.5 bg-[#C8673C] mx-auto mb-4" />
            <p className="text-[#A15C33]">Mestres na arte da barbearia</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipe.map((m, i) => (
              <div key={i} className="text-center group">
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#F5F0E8] to-[#E8DCCC] flex items-center justify-center mb-4 shadow-inner group-hover:shadow-md transition-all">
                  <span className="text-3xl font-bold text-[#C8673C]">{m.nome.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-[#783F1D]">{m.nome}</h3>
                <p className="text-xs text-[#A15C33]">{m.cargo}</p>
                <p className="text-[10px] text-[#C8673C]/60 mt-0.5">{m.desde}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section className="px-6 py-20 bg-[#FFF8F0]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#783F1D] mb-2">O Que Nossos Clientes Dizem</h2>
            <div className="w-12 h-0.5 bg-[#C8673C] mx-auto mb-4" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {depoimentos.map((d, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-[#F5F0E8]">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-[#D97706] text-sm">★</span>)}
                </div>
                <p className="text-sm text-[#A15C33] leading-relaxed mb-4">&ldquo;{d.texto}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center text-xs font-bold text-[#C8673C]">{d.nome.charAt(0)}</div>
                  <span className="text-sm font-medium text-[#783F1D]">{d.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HORÁRIOS ─── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#783F1D] mb-2">Horários</h2>
            <div className="w-12 h-0.5 bg-[#C8673C] mx-auto" />
          </div>
          <div className="space-y-3">
            {[
              { dia: "Segunda", horario: "08:00 às 18:00" },
              { dia: "Terça", horario: "08:00 às 18:00" },
              { dia: "Quarta", horario: "08:00 às 18:00" },
              { dia: "Quinta", horario: "08:00 às 18:00" },
              { dia: "Sexta", horario: "08:00 às 18:00" },
              { dia: "Sábado", horario: "08:00 às 13:00" },
              { dia: "Domingo", horario: "Fechado" },
            ].map((h, i) => (
              <div key={i} className={`flex justify-between px-4 py-2.5 rounded-lg ${
                i === 6 ? "opacity-50" : "bg-[#FFF8F0]"
              }`}>
                <span className={`font-medium text-sm ${i === 6 ? "text-red-400" : "text-[#783F1D]"}`}>{h.dia}</span>
                <span className="text-sm text-[#A15C33]">{h.horario}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTATO ─── */}
      <section className="px-6 py-20 bg-[#F5F0E8]">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C8673C]/10 mb-6">
            <svg className="w-6 h-6 text-[#C8673C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-[#783F1D] mb-2">Visite a Gente</h2>
          <p className="text-[#A15C33] mb-2">Rua das Barbearias, 42 — Centro</p>
          <p className="text-[#A15C33] mb-6">(11) 99999-8888</p>
          <a href="#" className="inline-flex px-6 py-3 bg-[#C8673C] hover:bg-[#B85A30] text-white font-semibold rounded-lg transition-all text-sm tracking-wider">
            VER NO MAPA
          </a>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className="px-6 py-20 bg-[#783F1D] text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Pronto para o próximo corte?</h2>
        <p className="text-[#E8DCCC]/80 mb-8 max-w-md mx-auto">Agende seu horário online e garanta o melhor atendimento.</p>
        <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D97706] hover:bg-[#C8673C] text-white font-bold rounded-lg transition-all text-sm tracking-wider shadow-lg">
          AGENDAR AGORA
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </section>
    </>
  )
}
