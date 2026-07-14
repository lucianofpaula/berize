# Multi-tenancy

## Modelo

Cada tenant (empresa) possui dados isolados pelo campo `tenantId` em todas as coleções.

## Isolamento

```
Coleção: Order
{
  _id: ObjectId,
  tenantId: ObjectId,   ← isolamento obrigatório
  clienteId: ObjectId,
  total: number,
  status: string
}
```

## Escopo

- Toda query de negócio inclui `tenantId`
- Sessão do usuário carrega o tenant ativo
- Troca de tenant altera todo o contexto da aplicação
- Dados de tenants diferentes nunca se misturam

## Planos

| Plano        | Usuários  | Commerce | IA  | Marketplace |
| ------------ | --------- | -------- | --- | ----------- |
| Starter      | 1         | —        | —   | —           |
| Professional | 3         | Básico   | —   | —           |
| Business     | 10        | Completo | —   | —           |
| Enterprise   | Ilimitado | Completo | Sim | Sim         |

## Ativação de Módulos

Módulos são ativados por plano. O tenant só acessa os módulos contratados.

```typescript
const modulosAtivos = await getTenantModules(tenantId);
// ["core", "commerce"]
```

## Regra

A arquitetura multi-tenant é obrigatória desde o início. Nunca desenvolver pensando em tenant único.
