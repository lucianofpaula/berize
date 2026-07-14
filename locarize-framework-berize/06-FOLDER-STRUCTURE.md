# Estrutura de Pastas

## Monorepo

```
locarize/
├── apps/                    # Aplicações verticais
│   ├── corterize/           # CorteRize
│   ├── foodrize/            # FoodRize
│   └── healthrize/          # HealthRize
├── src/
│   ├── core/                # Core Platform
│   ├── modules/             # Módulos de negócio
│   ├── shared/              # Recursos compartilhados
│   └── lib/                 # Utilitários globais
├── docs/                    # Documentação
├── design/                  # Tokens e assets
└── database/                # Migrations e seeds
```

## Core

```
core/
├── auth/               # Autenticação
├── tenant/             # Multi-tenancy
├── user/               # Usuários
├── permission/         # Permissões
├── billing/            # Faturamento
├── event/              # Eventos
└── audit/              # Auditoria
```

## Módulos

```
modules/
├── commerce/           # Commerce
│   ├── components/
│   ├── services/
│   ├── ai/
│   ├── permissions/
│   ├── events/
│   └── types/
├── booking/            # Agenda
├── crm/                # CRM
├── finance/            # Financeiro
├── marketing/          # Marketing
├── website/            # Website
└── marketplace/        # Marketplace
```

## Shared

```
shared/
├── components/         # Componentes UI
│   └── ui/             # shadcn/ui adaptados
├── hooks/              # Hooks reutilizáveis
├── utils/              # Utilitários
└── types/              # Tipos globais
```

## Apps

```
apps/corterize/
├── app/                # Next.js App Router
├── components/         # Componentes específicos
├── lib/                # Lógica específica
└── public/             # Assets
```
