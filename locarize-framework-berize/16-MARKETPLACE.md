# Marketplace

## Visão Geral

Módulo para integração entre unidades do mesmo grupo e marketplace público nacional.

## Capacidades

### Marketplace Interno

- Locação/transferência de itens entre filiais
- Visualização de estoque de outras unidades
- Pedidos entre filiais

### Marketplace Público

- Vitrine nacional por segmento
  - Locarize.com.br/barbearias
  - Locarize.com.br/restaurantes
  - Locarize.com.br/clinicas
- Página pública de cada empresa
- Geração de leads para os parceiros

## Modelo

```typescript
interface MarketplaceListing {
  id: string;
  tenantId: string;
  productId: string;
  preco: number;
  estoqueDisponivel: number;
  unidadeOrigem: string;
  visivel: boolean;
}
```

## Estrutura

```
modules/marketplace/
├── components/
├── services/
├── permissions/
├── events/
└── types/
```

## API

`/api/marketplace/*` — protegido por permissões `marketplace.*`

## Regra

O Marketplace é um módulo opcional. Sua ativação não deve impactar outros módulos do sistema.
