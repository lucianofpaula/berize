# Roadmap — Berize (CorteRize)

> **Atualizado em:** 15/07/2026
> **Status:** Em desenvolvimento ativo (Fase 1 + parte da Fase 2)

---

## Fase 1 — Fundação (Q2–Q3 2026)

**Objetivo:** Estabelecer a base tecnológica do ecossistema.

### Core Platform

- [x] Autenticação (next-auth, credentials, bcrypt, JWT)
- [x] Multi-tenancy (Company + TenantMember + roles)
- [x] Sidebar com navegação e breadcrumbs
- [x] Tema Dark/Light (next-themes + Tailwind v4)
- [x] Rate limiter + proxy + headers de segurança
- [x] Página de login com validação (zod + react-hook-form)
- [x] Design System (shadcn/ui + @base-ui/react + Tailwind v4)
- [x] Upload de imagens (Cloudinary)

### Módulo Clientes (CRM básico)

- [x] Listagem com dados reais
- [x] Busca por nome/email/whatsapp
- [x] Infinite scroll com IntersectionObserver
- [x] Exibição de foto com hover expansivo

### Módulo Barbeiros

- [x] CRUD completo com dados reais
- [x] Upload de foto
- [x] Máscara de WhatsApp
- [x] Tags de especialidade
- [x] Disponibilidade semanal (múltiplos horários por dia)

### Módulo Planos

- [x] Listagem com cards, busca, filtros
- [x] Página de edição com comissões e serviços inclusos
- [x] Geração por IA (Groq API)

### Módulo Serviços

- [x] Listagem com cards, busca, filtros por categoria/status
- [x] Página de edição com comissões
- [x] Geração por IA (Groq API)

### Módulo Agenda (Booking)

- [x] Modelo Agendamento no Prisma
- [x] API REST (GET por data, POST, PUT com detecção de conflito)
- [x] Slots de 30min (08:00–18:00)
- [x] Card único ocupando múltiplos slots (merge de horários)
- [x] Serviços exibidos como badges no slot
- [x] Foto do cliente com hover expansivo

**Visões da Agenda:**

- [x] Visão Individual (carrossel de barbeiros + grade de horários)
- [x] Visão em Colunas (todos os barbeiros lado a lado)
- [x] Alternância entre visões (toggle Individual/Colunas)

**Drawer de Agendamento:**

- [x] Criação com busca de cliente, seleção de serviços, observações
- [x] Edição de horário, serviços e observações
- [x] Alteração de status (Cancelar / Não Compareceu)
- [x] Resumo com tempo total, valor total e horário
- [x] Drawer não-modal com swipe

**Painel do Barbeiro:**

- [x] Estatísticas da semana e do mês (cortes, faturamento, comissão)
- [x] Drawer controlado para todos os tamanhos de tela
- [x] Botão no desktop + FAB no mobile
- [ ] Filtro por período no painel do barbeiro: Hoje, Esta Semana, data personalizada (date picker)
- [ ] Gráfico de evolução de faturamento por período
- [ ] Comparativo entre períodos (semana atual vs semana anterior)
- [ ] Ranking de serviços mais prestados por barbeiro no período

**IA na Agenda:**

- [ ] **Sugerir próximo horário disponível** — IA busca o primeiro slot livre no barbeiro preferido do cliente com base na duração real dos serviços
- [ ] **Resumo do dia em linguagem natural** — "Hoje você tem 8 agendamentos, faturamento estimado de R$ 420" com insights rápidos
- [ ] **Previsão de horários de pico** — Com base no histórico, mostrar ao dono quais dias/horários costumam lotar
- [ ] **Detecção de risco de no-show** — Clientes com padrão de cancelamento em cima da hora, sugerir confirmação antecipada
- [ ] **Sugestão de blocos ideais** — Ajustar abertura de slots baseado na duração real (não só teórica) dos serviços de cada barbeiro
- [ ] **Preenchimento automático de cancelamentos** — Notificar clientes em lista de espera quando um horário abrir
- [ ] **Diferenciação visual de clientes Premium** — Clientes com plano de assinatura ativo destacados na agenda (cor, ícone, badge) para tratamento prioritário

**Fila de Espera Inteligente:**

- [ ] Lista de espera por barbeiro com priorização por cliente VIP/fidelidade
- [ ] Notificação automática ao abrir horário
- [ ] Aceite do cliente com confirmação em tempo real

### Módulo Financeiro (parcial)

- [ ] Fluxo de caixa
- [ ] Comissões por período
- [ ] Relatórios financeiros
- [ ] Extrato por barbeiro

---

## Fase 2 — CorteRize (Q3–Q4 2026)

**Objetivo:** Primeira aplicação vertical completa para barbearias.

### Meu Negócio

- [x] Menu expansível na sidebar com seção NEGÓCIO
- [x] Página Configuração (placeholder)
- [x] Página Website (placeholder)
- [x] Página Meios de Pagamento (placeholder)
- [x] Página Agente de IA (placeholder)
- [x] Página Commerce Hub (placeholder)

### Website Builder

- [ ] Landing page personalizável
- [ ] Página de serviços
- [ ] Página da equipe
- [ ] Galeria de fotos
- [ ] Agendamento online público
- [ ] SEO otimizado
- [ ] Templates por segmento

### Commerce Hub (E-commerce)

- [ ] Catálogo de produtos (produtos físicos da barbearia)
- [ ] Pedidos e checkout
- [ ] Estoque e inventário
- [ ] Cupons e descontos
- [ ] Gift Cards / Vale-presentes
- [ ] Integração com meios de pagamento
- [ ] Produtos digitais (planos, cursos)

### Fila de Atendimento

- [ ] Painel visual da fila
- [ ] Chamar próximo cliente
- [ ] Notificação ao barbeiro
- [ ] Histórico da fila

### Comandas (Ordem de Serviço)

- [ ] Abertura de comanda por cliente
- [ ] Adição de serviços/produtos
- [ ] Fechamento e pagamento
- [ ] Impressão/Compartilhamento
- [ ] Histórico de comandas

### CRM Completo

- [ ] Perfil detalhado do cliente
- [ ] Histórico completo de agendamentos e compras
- [ ] Segmentação e campanhas
- [ ] Programa de fidelidade (pontos, visitas)
- [ ] Aniversariantes do mês

### Notificações

- [ ] Lembrete de agendamento (WhatsApp)
- [ ] Confirmação automática
- [ ] Atraso / Não compareceu
- [ ] Campanhas de marketing

### Check-in

- [ ] Cliente agenda online e faz check-in ao chegar no estabelecimento
- [ ] Notificação ao barbeiro quando cliente faz check-in
- [ ] Painel visual de clientes que chegaram (check-in realizado)
- [ ] Check-in por QR Code (cliente escaneia na recepção)
- [ ] Check-in por WhatsApp / link na confirmação
- [ ] Fila automática: check-in → posiciona na fila de espera
- [ ] Histórico de check-in (horário agendado vs horário real de chegada)
- [ ] Métricas: taxa de check-in, tempo de espera médio

### Relatórios e Analytics

- [ ] Dashboard gerencial
- [ ] Relatório de horários mais movimentados
- [ ] Serviços mais vendidos
- [ ] Ticket médio por cliente
- [ ] Taxa de comparecimento vs não comparecimento
- [ ] Performance por barbeiro

---

## Fase 3 — Expansão (Q1 2027)

**Objetivo:** Novos segmentos, marketplace e mobile.

### Novos Segmentos

- [ ] FoodRize (restaurantes) — primeiro protótipo
- [ ] HealthRize (clínicas) — primeiro protótipo
- [ ] PetRize ( petshops )
- [ ] EducationRize (cursos e escolas)

### Marketplace

- [ ] Listagem pública de barbearias
- [ ] Perfil público com avaliações
- [ ] Agendamento direto pelo marketplace
- [ ] Marketplace público nacional
- [ ] API pública

### App Mobile

- [ ] App CorteRize (clientes) — agendamento, histórico, push
- [ ] App CorteRize (barbeiros) — agenda, notificações, comissões
- [ ] App Berize (gestão) — indicadores, aprovações

---

## Fase 4 — Escala (Q2 2027)

**Objetivo:** Plataforma completa e madura.

- [ ] Checkout próprio (sem redirecionamento)
- [ ] Pagamento recorrente (assinaturas)
- [ ] Programa de afiliados (indicação com comissão)
- [ ] Cashback e gamificação
- [ ] IA Avançada (recomendação, predição, agendamento inteligente)
- [ ] Multimoeda / Multidioma
- [ ] White Label (revenda da plataforma)
- [ ] Enterprise (redes com centenas de unidades)

---

## Funcionalidades extras sugeridas (a validar)

- **PDV (Ponto de Venda):** Venda rápida de produtos avulsos sem agendamento
- **Estoque:** Controle de insumos (produtos usados nos serviços: pomadas, shampoos)
- **Marketing Automático:** Campanhas de aniversário, recuperação de clientes inativos
- **Enquetes e Feedback:** Coleta de satisfação pós-serviço
- **Agenda Online Pública:** Cliente agenda direto pelo site/instagram sem cadastro
- **Integração Instagram/Facebook:** Importação de clientes, postagem automática
- **Multi-unidade:** Gestão de múltiplas filiais em um só painel
