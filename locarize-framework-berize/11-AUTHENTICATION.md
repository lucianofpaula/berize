# Autenticação

## Tecnologia

**Auth.js** (NextAuth v5+) com Prisma adapter.

## Fluxo

1. Usuário se cadastra (email + senha ou OAuth)
2. Login com credenciais ou provedor externo
3. Sessão gerenciada pelo Auth.js
4. Middleware protege rotas do painel
5. Sessão carrega dados do usuário e tenant ativo

## Provedores

- Credentials (email + senha)
- Google OAuth
- Apple OAuth (futuro)

## Modelo

```prisma
model User {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  email    String @unique
  nome     String
  imagem   String?
  tenantId String @db.ObjectId
  role     Role   @default("OWNER")
}
```

## Segurança

- Senhas hasheadas com bcrypt
- CSRF protection nativo do Auth.js
- Rate limiting nas rotas de login
- Sessão com HTTP-only cookies
- Logout invalida sessão

## Regra

Nenhuma rota do painel deve ser acessível sem autenticação. Rotas públicas devem ser explicitamente marcadas.
