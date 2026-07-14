# Permissões

## Modelo

RBAC (Role-Based Access Control) com permissões granulares.

## Estrutura

```
Permission: {module}.{resource}.{action}

Exemplo: commerce.products.create
```

## Core

| Código          | Descrição                   |
| --------------- | --------------------------- |
| `core.view`     | Visualizar Core             |
| `core.manage`   | Gerenciar Core              |
| `core.users`    | Gerenciar usuários          |
| `core.settings` | Configurações da plataforma |

## Commerce

| Código               | Descrição              |
| -------------------- | ---------------------- |
| `commerce.view`      | Visualizar Commerce    |
| `commerce.manage`    | Gerenciar Commerce     |
| `commerce.products`  | Gerenciar produtos     |
| `commerce.orders`    | Gerenciar pedidos      |
| `commerce.inventory` | Gerenciar estoque      |
| `commerce.customers` | Gerenciar clientes     |
| `commerce.coupons`   | Gerenciar cupons       |
| `commerce.analytics` | Visualizar análises    |
| `commerce.ai`        | Acessar Commerce IA    |
| `commerce.admin`     | Acesso total ao módulo |

## Booking (Agenda)

| Código             | Descrição              |
| ------------------ | ---------------------- |
| `booking.view`     | Visualizar agenda      |
| `booking.manage`   | Gerenciar agendamentos |
| `booking.services` | Gerenciar serviços     |

## Website

| Código           | Descrição          |
| ---------------- | ------------------ |
| `website.view`   | Visualizar website |
| `website.manage` | Gerenciar website  |
| `website.seo`    | Gerenciar SEO      |

## Verificação

```typescript
const podeGerenciar = await checkPermission(userId, tenantId, "commerce.products");
```

## Regra

Toda ação no sistema deve ser protegida por permissão. Nenhum acesso deve ser concedido por padrão.
