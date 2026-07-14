# Aplicações

## Visão Geral

Aplicações (Apps) são produtos verticais construídos sobre o Core e os Módulos. Cada App adiciona regras de negócio específicas do segmento.

## CorteRize

Segmento: Beleza (barbearias, salões)

Módulos ativos:

- Core (obrigatório)
- Commerce (produtos, planos)
- Booking (agenda)
- CRM (clientes)
- Website (site público)
- IA (assistente, insights)

Regras específicas:

- Profissionais vinculados a serviços
- Comissão por profissional
- Agenda por profissional
- Planos de assinatura para clientes

## FoodRize

Segmento: Alimentação (restaurantes, lanchonetes)

Módulos previstos:

- Core
- Commerce (cardápio, pedidos)
- CRM
- Website
- Delivery

## HealthRize

Segmento: Saúde (clínicas, consultórios)

Módulos previstos:

- Core
- Commerce (planos, procedimentos)
- Booking (agenda médica)
- CRM (prontuário)
- Website

## Estrutura de um App

```
apps/corterize/
├── app/              # Next.js App Router
│   ├── [slug]/       # Tenant routes
│   └── (public)/     # Public routes
├── components/       # Componentes específicos
├── lib/              # Regras de negócio específicas
└── public/           # Assets
```

## Regra

Nenhuma aplicação deve reinventar funcionalidades que já existem em módulos. Apps apenas adicionam regras específicas do segmento.
