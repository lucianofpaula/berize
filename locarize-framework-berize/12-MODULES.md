# Módulos

## Visão Geral

Módulos são capacidades de negócio independentes e reutilizáveis. Cada módulo possui suas próprias regras, serviços, componentes e eventos.

## Módulos Existentes

### Commerce

Motor comercial universal.

Capacidades:

- Catálogo de produtos
- Pedidos e checkout
- Estoque e inventário
- Cupons e descontos
- Clientes
- Gift Cards
- Assinaturas

Usado por: CorteRize, FoodRize, HealthRize

### Booking (Agenda)

Gestão de agendamentos.

Capacidades:

- Agenda visual
- Profissionais
- Serviços
- Horários
- Notificações

Usado por: CorteRize, HealthRize

### CRM

Gestão de relacionamento com clientes.

Capacidades:

- Perfil de clientes
- Histórico de compras
- Segmentação
- Campanhas

### Financeiro

Gestão financeira.

Capacidades:

- Fluxo de caixa
- Comissões
- Faturamento
- Relatórios

### Marketing

Automação de marketing.

Capacidades:

- Campanhas
- Email marketing
- WhatsApp
- Cupons inteligentes

### Website

Site público do tenant.

Capacidades:

- Landing page
- Páginas de serviços
- Galeria
- Blog
- Contato

### Marketplace

Integração entre unidades e marketplace público.

Capacidades:

- Listagem entre unidades
- Transferência de estoque
- Marketplace nacional

## Regra

Um módulo nunca deve depender de uma aplicação específica. Módulos se comunicam apenas por eventos.
