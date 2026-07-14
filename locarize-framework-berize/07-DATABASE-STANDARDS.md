# Padrões de Banco de Dados

## Tecnologia

- **MongoDB 7+** — banco de dados oficial
- **Prisma 6+** — ORM oficial

## Modelagem

Todos os modelos seguem:

```prisma
model Tenant {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  nome      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Convenções

- `_id` como ObjectId (MongoDB)
- `createdAt` / `updatedAt` em todos os modelos
- `tenantId` para isolamento multi-tenant
- Campos booleanos prefixados com `is`: `isActive`, `isDeleted`
- Relacionamentos nomeados no singular

## Índices

```prisma
model Product {
  tenantId String @db.ObjectId
  nome     String
  preco    Float

  @@index([tenantId])
  @@index([tenantId, nome])
}
```

- `tenantId` sempre indexado
- Campos de busca frequente indexados
- Compostos para queries comuns de listagem

## Migrações

```
Desenvolvimento: prisma db push
Produção:       prisma db push --accept-data-loss
```

## Regra

Nenhuma query deve ser feita sem o filtro `tenantId`, exceto em operações administrativas globais.
