# Contribuindo

## Princípios

1. **Modularidade** — Todo código novo deve ser modular e reutilizável
2. **Desacoplamento** — Nenhum módulo importa diretamente de outro
3. **Eventos** — Comunique-se por eventos, não por imports
4. **Reutilização** — Antes de criar, verifique se já existe
5. **Qualidade** — Código limpo, tipado, testado e documentado

## Pull Requests

- Descreva o que faz, por que faz e como testar
- Mantenha PRs pequenos e focados em uma única mudança
- Siga os coding standards (05-CODING-STANDARDS.md)
- Passe no linter e no build antes de abrir

## Código

- Siga a arquitetura definida em 02-ARCHITECTURE.md
- Use componentes do Design System (04-DESIGN-SYSTEM.md)
- Respeite a estrutura de pastas (06-FOLDER-STRUCTURE.md)
- Não acople a provedores específicos (use interfaces)
- Documente módulos novos em `docs/modules/`

## Commits

```
feat: add product catalog
fix: resolve pagination overflow
docs: update commerce api
refactor: extract payment adapter
```

## Branches

- `main` — produção
- `develop` — desenvolvimento
- `feature/*` — novas funcionalidades
- `fix/*` — correções
- `release/*` — preparação de release

## Regra Final

Sempre pergunte antes de codificar: "Isso pode ser reaproveitado por outro segmento?" Se sim, deve ser um módulo.
