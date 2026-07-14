# Arquitetura

## Clean Architecture

```
┌─────────────────────────────┐
│      Interface (UI)         │  Components, Pages
├─────────────────────────────┤
│      Application            │  Hooks, Services, Stores
├─────────────────────────────┤
│      Domain                 │  Entities, Types, Regras
├─────────────────────────────┤
│      Infrastructure         │  API, Database, Providers
└─────────────────────────────┘
```

## Modular Monolith

Todos os módulos vivem no mesmo monorepo, mas são isolados por pastas e imports.

```
src/
├── core/          # Core module
├── commerce/      # Commerce module
├── marketplace/   # Marketplace module
└── website/       # Website module
```

## Separação por Produto

Cada produto (Corterize, Locarize) é um app dentro do monorepo que importa os módulos necessários.

````
apps/
├── corterize/     # Corterize app
└── locarize/      # Locarize app
```# Locarize Architecture

## Overview

A arquitetura do Locarize foi projetada para suportar um ecossistema de aplicações independentes utilizando uma base tecnológica compartilhada.

O objetivo principal é permitir crescimento sustentável através de:

* modularidade;
* reutilização;
* separação de responsabilidades;
* escalabilidade;
* segurança;
* evolução contínua.

A arquitetura deve permitir que novos produtos sejam adicionados ao ecossistema sem necessidade de reconstruir a base existente.

---

# Architectural Principles

## 1. Modular First

O Locarize deve ser desenvolvido seguindo uma abordagem modular.

Cada domínio de negócio deve possuir suas próprias responsabilidades, evitando dependências desnecessárias.

Exemplo:

````

modules/
├── customers
├── billing
├── commerce
├── notifications
└── referrals

```

Cada módulo deve possuir:

* regras de negócio;
* serviços;
* validações;
* componentes;
* eventos.

---

# 2. Domain Driven Design

O sistema deve seguir princípios de Domain Driven Design (DDD) quando fizer sentido.

O domínio deve ser o centro da aplicação.

A estrutura deve refletir conceitos reais do negócio.

Exemplo:

Negócio:

"Uma barbearia possui profissionais, serviços e clientes."

Sistema:

```

Barbershop
├── Professionals
├── Services
├── Customers
└── Appointments

```

---

# 3. Clean Architecture

O Locarize deve separar regras de negócio das tecnologias externas.

Camadas principais:

```

Presentation Layer

        ↓

Application Layer

        ↓

Domain Layer

        ↓

Infrastructure Layer

```

---

# Architecture Layers

## Core Layer

Responsável pelas funcionalidades fundamentais do ecossistema.

Local:

```

core/

```

Contém:

* autenticação;
* usuários;
* tenants;
* permissões;
* configurações;
* billing;
* auditoria.

O Core não deve depender de aplicações específicas.

---

# Shared Layer

Local:

```

shared/

```

Contém recursos reutilizáveis.

Exemplos:

* componentes UI;
* hooks;
* helpers;
* validações;
* tipos;
* constantes.

---

# Modules Layer

Local:

```

modules/

```

Representa capacidades de negócio compartilhadas.

Exemplos:

```

modules/

customers/
commerce/
payments/
notifications/
analytics/
marketing/

```

Um módulo pode ser utilizado por várias aplicações.

---

# Apps Layer

Local:

```

apps/

```

Representa produtos verticais do ecossistema.

Exemplo:

```

apps/

corte-rize/
food-rize/
health-rize/

```

Cada aplicação possui:

* regras específicas;
* telas;
* configurações;
* fluxos próprios.

---

# Dependency Rule

As dependências devem seguir uma única direção:

```

Apps

↓

Modules

↓

Core

↓

Infrastructure

```

Nunca:

* Core dependendo de App.
* Module dependendo de uma aplicação específica.
* Aplicações compartilhando regras diretamente.

---

# Multi-Tenant Architecture

O Locarize deve ser construído como uma plataforma multi-tenant desde o início.

Cada recurso de negócio deve considerar:

```

Tenant Context
|
|
Business Data

```

Exemplo:

Um cliente pertence a:

```

Customer

tenantId
name
email
phone

```

Isso garante isolamento entre empresas.

---

# Event Driven Architecture

O ecossistema deve utilizar eventos para comunicação entre módulos.

Exemplo:

Quando um pagamento é aprovado:

```

PaymentApproved Event

        ↓

Billing Module

        ↓

Notification Module

        ↓

Customer Module

```

Benefícios:

* baixo acoplamento;
* escalabilidade;
* extensibilidade.

---

# API Architecture

A comunicação deve seguir padrões:

* REST APIs;
* Server Actions quando aplicável;
* eventos internos;
* integrações externas através de adapters.

---

# Repository Pattern

O acesso aos dados deve ser abstraído.

Exemplo:

```

UserRepository

        ↓

Prisma Implementation

        ↓

MongoDB

```

Isso permite troca de infraestrutura sem alterar regras de negócio.

---

# Service Layer

As regras de negócio não devem ficar:

* em componentes;
* em controllers;
* em actions diretamente.

Devem estar em serviços.

Exemplo:

```

CreateSubscriptionService

ValidatePlan
CalculatePrice
ProcessPayment
ActivateSubscription

```

---

# Adapter Pattern

Integrações externas devem utilizar adapters.

Exemplo:

```

PaymentGateway

        |

---

| | |
Mercado Stripe Asaas
Pago

```

A aplicação não deve conhecer detalhes do fornecedor.

---

# Security Architecture

A arquitetura deve considerar:

* autenticação segura;
* autorização por permissões;
* isolamento multi-tenant;
* validação de entrada;
* auditoria;
* proteção contra abuso.

---

# Scalability Principles

O sistema deve estar preparado para:

* crescimento de usuários;
* múltiplos aplicativos;
* múltiplos países;
* múltiplos idiomas;
* múltiplas moedas.

---

# Architecture Rule

Antes de implementar qualquer funcionalidade, deve ser definido:

1. Qual domínio ela pertence?
2. É Core, Module ou App?
3. Pode ser reutilizada?
4. Deve gerar eventos?
5. Possui impacto multi-tenant?

Essa regra evita crescimento desorganizado e mantém o ecossistema sustentável.

```
