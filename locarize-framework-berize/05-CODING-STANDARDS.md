# Locarize Coding Standards

## Overview

Este documento define as convenções de código para todo o ecossistema Locarize. O objetivo é manter a base de código limpa, consistente, escalável e fácil de manter por qualquer desenvolvedor, além de facilitar a colaboração com ferramentas de IA.

---

## Language & Syntax

- **TypeScript** em modo estrito (`strict: true`).
- Use `interface` para definições de objetos públicos, `type` para uniões, mapeamentos e utilitários.
- Prefira `const` e `let`, evite `var`.
- Use `arrow functions` para funções anônimas e callbacks.
- Use `template literals` para concatenação de strings.
- Use `async/await` para operações assíncronas, evite callbacks.

---

## Naming Conventions

| Entidade                 | Convenção                   | Exemplo                  |
| ------------------------ | --------------------------- | ------------------------ |
| Arquivos de componentes  | PascalCase                  | `UserProfile.tsx`        |
| Arquivos de hooks        | camelCase com prefixo `use` | `useAuth.ts`             |
| Arquivos de serviços     | camelCase                   | `paymentService.ts`      |
| Arquivos de utilitários  | camelCase                   | `formatDate.ts`          |
| Classes (DDD)            | PascalCase                  | `Customer`               |
| Interfaces               | PascalCase, sem prefixo `I` | `UserRepository`         |
| Tipos                    | PascalCase                  | `PaymentStatus`          |
| Enum                     | PascalCase                  | `Role`                   |
| Variáveis/funções        | camelCase                   | `getUserById`            |
| Constantes globais       | UPPER_SNAKE_CASE            | `MAX_RETRIES`            |
| Variáveis de ambiente    | UPPER_SNAKE_CASE            | `NEXT_PUBLIC_API_URL`    |
| Pastas                   | kebab-case                  | `user-profile/`          |
| Arquivos de rota Next.js | kebab-case                  | `page.tsx`, `layout.tsx` |

---

## File Organization

Cada arquivo deve conter uma única exportação principal (default), exceto para utilitários ou hooks que exportam múltiplas funções.

Estrutura típica de um componente:

```tsx
// Imports (externos, internos, relativos)
import { React } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Types
interface UserCardProps { ... }

// Component
export const UserCard = ({ ... }: UserCardProps) => { ... }

// Default export
export default UserCard;
```

## Imports

Ordene imports: bibliotecas externas → aliases internos (@/) → relativos.

Evite imports relativos profundos (../../../); use aliases (@/modules/customers).

Use import type para tipos.

Componentes React
Componentes devem ser funções (não classes).

Use React.memo somente quando necessário.

Use use client apenas em componentes que precisam de interatividade.

Prefira Server Components (Next.js) para dados estáticos ou que não precisam de estado.

Nomeie os componentes com o mesmo nome do arquivo.

Desestruturar props no parâmetro.

Hooks
Hooks devem começar com use.

Hooks customizados devem ser puros e reutilizáveis.

Nunca chame hooks dentro de loops, condicionais ou funções aninhadas.

Use useCallback e useMemo para otimização quando houver dependências pesadas.

Estado
Prefira estado local com useState.

Para estado complexo, use useReducer.

Estado global: use zustand ou jotai (avaliar posteriormente) – não use Context API para estado global pesado.

Mantenha o estado o mais próximo possível de onde é usado.

Estilos (Tailwind)
Use classes utilitárias diretamente no JSX.

Para componentes reutilizáveis, use cn() para mesclar classes.

Evite CSS-in-JS ou arquivos CSS globais, exceto para reset e variáveis.

Prefira tailwind-merge para evitar conflitos.

Tratamento de Erros
Use try/catch em operações assíncronas.

Em Server Actions, retorne { success: boolean, message: string, data?: any }.

Em APIs, use códigos HTTP apropriados.

Logs: use console.error apenas em desenvolvimento; em produção, envie para serviço de monitoramento.

Testes
Escreva testes unitários para funções puras e serviços.

Use vitest e @testing-library/react.

Testes de integração para fluxos críticos.

Cobertura mínima: 80% para módulos core.

Comentários
Comente apenas quando o código não for autoexplicativo.

Use // para comentários de linha, /\* \*/ para blocos.

Documente funções complexas com JSDoc.

Git
Commits semânticos: feat, fix, docs, style, refactor, perf, test, chore.

Mensagens no imperativo: "Add user authentication", não "Added".

Branches: main (produção), develop (desenvolvimento), feature/_, fix/_, release/\*.

Ferramentas
ESLint com configuração Next.js e TypeScript.

Prettier para formatação automática.

Husky + lint-staged para pré-commit.

Commitlint para validar mensagens.

Regra Final
Todo código deve passar pelo linter e formatador antes de ser commitado. Revisões de código são obrigatórias para qualquer mudança que não seja trivial.
