# Commerce

## Visão Geral

Módulo comercial universal. Suporta qualquer tipo de item comercial, independente do segmento.

## Itens Suportados

- Produtos físicos
- Serviços
- Planos / Assinaturas
- Kits / Combos
- Gift Cards / Vouchers
- Cursos / Produtos digitais
- Eventos / Workshops
- Pacotes / Promoções

## Modelo Base

```typescript
interface CommerceProduct {
  id: string;
  tenantId: string;
  nome: string;
  descricao?: string;
  preco: number;
  custo?: number;
  tipo: "PRODUCT" | "SERVICE" | "KIT" | "GIFT_CARD" | "COURSE" | "EVENT";
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "OUT_OF_STOCK";
  categoriaId?: string;
  imagens: string[];
  estoque: number;
}
```

## Funcionalidades

- **Catálogo** — CRUD de produtos com categorias, marcas, variações
- **Pedidos** — Fluxo completo de pedidos com status
- **Estoque** — Controle de entrada, saída, inventário
- **Clientes** — Base própria de clientes do Commerce
- **Cupons** — Descontos percentuais ou fixos
- **Gift Cards** — Vale-presentes
- **Assinaturas** — Planos recorrentes

## Estrutura

```
modules/commerce/
├── components/       # Componentes de UI
│   ├── catalog/
│   ├── orders/
│   ├── cart/
│   └── shared/
├── services/         # Serviços de negócio
├── ai/               # Commerce IA
├── permissions/      # Permissões específicas
├── events/           # Eventos do módulo
└── types/            # Tipos
```

## API

`/api/commerce/*` — RESTful, protegido por permissões `commerce.*`

## Regra

O Commerce não conhece o segmento que o utiliza. Produtos, serviços e planos usam a mesma entidade base (`CommerceProduct`), diferenciados pelo campo `tipo`.
