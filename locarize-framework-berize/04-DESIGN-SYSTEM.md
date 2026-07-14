# Locarize Design System

## Overview

O Design System do Locarize é a base visual e interativa de toda a plataforma. Ele garante consistência, acessibilidade e experiência premium em todos os produtos do ecossistema.

O sistema é composto por tokens (cores, tipografia, espaçamento, sombras, bordas), componentes reutilizáveis e padrões de interação. Tudo é desenvolvido com Tailwind CSS e Shadcn UI, mas customizado para refletir a identidade da Locarize.

---

## Design Principles

1. **Clareza** – Cada elemento deve comunicar sua função de forma imediata.
2. **Eficiência** – A interface deve acelerar o trabalho do usuário, nunca atrapalhá-lo.
3. **Consistência** – Padrões visuais e comportamentais se repetem em todo o ecossistema.
4. **Acessibilidade** – Contraste, tamanhos de fonte e navegação por teclado são obrigatórios.
5. **Modernidade** – Design limpo, com muito espaço em branco, microinterações e motion sutil.
6. **Adaptabilidade** – Suporte a Light e Dark Mode, responsividade e múltiplos dispositivos.

---

## Tokens

### Cores (Paleta Base)

| Token                      | Light Mode           | Dark Mode            | Uso                                  |
| -------------------------- | -------------------- | -------------------- | ------------------------------------ |
| `--background`             | `#ffffff`            | `#0a0a0a`            | Fundo geral                          |
| `--foreground`             | `#171717`            | `#ededed`            | Texto principal                      |
| `--card`                   | `#ffffff`            | `#121212`            | Fundo de cards                       |
| `--card-foreground`        | `#171717`            | `#ededed`            | Texto em cards                       |
| `--popover`                | `#ffffff`            | `#121212`            | Fundo de popovers                    |
| `--popover-foreground`     | `#171717`            | `#ededed`            | Texto em popovers                    |
| `--primary`                | `#2563eb` (azul 600) | `#3b82f6` (azul 500) | Ações principais, links              |
| `--primary-foreground`     | `#ffffff`            | `#0a0a0a`            | Texto sobre primary                  |
| `--brand`                  | `#f97316` (laranja)  | `#fb923c` (laranja)  | Cor da marca, landing pages          |
| `--secondary`              | `#f3f4f6`            | `#1f2937`            | Elementos secundários                |
| `--secondary-foreground`   | `#1f2937`            | `#f9fafb`            | Texto sobre secondary                |
| `--muted`                  | `#f3f4f6`            | `#1f2937`            | Fundo de elementos menos importantes |
| `--muted-foreground`       | `#6b7280`            | `#9ca3af`            | Texto secundário                     |
| `--accent`                 | `#f3f4f6`            | `#1f2937`            | Destaques pontuais                   |
| `--accent-foreground`      | `#1f2937`            | `#f9fafb`            | Texto em accent                      |
| `--destructive`            | `#ef4444`            | `#ef4444`            | Erros, ações perigosas               |
| `--destructive-foreground` | `#ffffff`            | `#ffffff`            | Texto sobre destructive              |
| `--border`                 | `#e5e7eb`            | `#374151`            | Bordas de componentes                |
| `--input`                  | `#e5e7eb`            | `#374151`            | Bordas de inputs                     |
| `--ring`                   | `#2563eb`            | `#3b82f6`            | Foco de teclado                      |
| `--radius`                 | `0.5rem`             | `0.5rem`             | Raio de borda padrão                 |

---

### Tipografia

Família principal: **Inter** (variável, carregada via Google Fonts).

| Estilo    | Tamanho         | Peso | Line-height | Uso                        |
| --------- | --------------- | ---- | ----------- | -------------------------- |
| `h1`      | 2.5rem (40px)   | 700  | 1.2         | Títulos de página          |
| `h2`      | 2rem (32px)     | 600  | 1.25        | Seções principais          |
| `h3`      | 1.5rem (24px)   | 600  | 1.3         | Subtítulos                 |
| `h4`      | 1.25rem (20px)  | 500  | 1.4         | Títulos de card            |
| `body`    | 1rem (16px)     | 400  | 1.5         | Texto corrido              |
| `small`   | 0.875rem (14px) | 400  | 1.5         | Texto auxiliar             |
| `caption` | 0.75rem (12px)  | 400  | 1.5         | Legendas, métricas menores |
| `button`  | 0.875rem (14px) | 500  | 1           | Botões                     |

---

### Espaçamento

Base `4px`.

| Token | Valor | Uso                     |
| ----- | ----- | ----------------------- |
| `0`   | 0     | Sem espaçamento         |
| `1`   | 4px   | Ícones, margens mínimas |
| `2`   | 8px   | Padding pequeno, gaps   |
| `3`   | 12px  | Padding médio           |
| `4`   | 16px  | Padding padrão          |
| `5`   | 20px  | Separadores             |
| `6`   | 24px  | Margens entre seções    |
| `8`   | 32px  | Espaçamento maior       |
| `10`  | 40px  | Seções                  |
| `12`  | 48px  | Quebras de página       |

---

### Sombras

Utilizadas para elevação.

| Nível | Light Mode                     | Dark Mode                     | Uso                 |
| ----- | ------------------------------ | ----------------------------- | ------------------- |
| `sm`  | `0 1px 2px rgba(0,0,0,0.05)`   | `0 1px 2px rgba(0,0,0,0.3)`   | Cards, botões leves |
| `md`  | `0 4px 6px rgba(0,0,0,0.07)`   | `0 4px 6px rgba(0,0,0,0.4)`   | Dropdowns, modais   |
| `lg`  | `0 10px 15px rgba(0,0,0,0.1)`  | `0 10px 15px rgba(0,0,0,0.5)` | Overlays, diálogos  |
| `xl`  | `0 20px 25px rgba(0,0,0,0.15)` | `0 20px 25px rgba(0,0,0,0.6)` | Popups grandes      |

---

### Bordas

- Raio padrão: `0.5rem` (8px)
- Raio de botões e inputs: `0.375rem` (6px)
- Raio de elementos circulares: `9999px`

---

## Componentes Core

### Botões

- **Primary**: fundo primary, texto branco, hover com escurecimento.
- **Secondary**: fundo secondary, texto secondary-foreground.
- **Outline**: borda border, texto foreground, hover com background muted.
- **Ghost**: sem fundo, hover com background muted.
- **Destructive**: fundo destructive, texto branco.

Todos os botões possuem `transition-colors` e `focus-visible:ring-2`.

---

### Inputs

- Altura: `2.5rem` (40px)
- Borda: `border`, foco com `ring-primary`.
- Placeholder com `muted-foreground`.
- Label acima com `text-sm font-medium`.

---

### Cards

- Fundo: `card`
- Borda: `border`
- Sombra: `sm` (opcional)
- Padding: `6` (24px)
- Título em `h4`, conteúdo em `body`.

---

### Tabelas

- Cabeçalho com `muted` e `text-xs uppercase`.
- Linhas com `border-b`.
- Hover na linha com `muted/50`.

---

### Badges

- Pequenos, com `rounded-full`.
- Variantes: `default` (primary), `secondary`, `destructive`, `outline`.

---

### Modais / Dialogs

- Fundo escuro semi-transparente (`bg-black/50`).
- Card centralizado com `lg` shadow.
- Título e descrição seguem hierarquia.

---

### Navegação (Sidebar + Topbar)

- Sidebar com largura `240px` (colapsável para `64px`).
- Topbar com altura `64px`, com logo, busca, avatar e notificações.
- Itens de menu com ícone + texto, highlight com primary.

---

## Light Mode vs Dark Mode

O Locarize suporta ambos os modos nativamente, com detecção de preferência do sistema e alternância manual.

- **Light Mode**: fundos claros, contraste alto, cores mais saturadas.
- **Dark Mode**: fundos escuros, contraste suave, cores levemente dessaturadas para reduzir cansaço visual.

Todas as cores são definidas como variáveis CSS e aplicadas via `dark:` nos componentes Tailwind.

---

## Motion & Microinterações

- Transições suaves (`duration-200`, `ease-in-out`).
- Hover: leve escala (1.02) em cards e botões.
- Foco: anel de foco com `ring`.
- Loading: spinners ou skeleton screens.
- Rolagem suave (`scroll-behavior: smooth`).

---

## Responsividade

Breakpoints do Tailwind:

| Breakpoint | Largura | Alvo            |
| ---------- | ------- | --------------- |
| `sm`       | 640px   | Mobile          |
| `md`       | 768px   | Tablets         |
| `lg`       | 1024px  | Desktop pequeno |
| `xl`       | 1280px  | Desktop grande  |
| `2xl`      | 1536px  | Telas grandes   |

O design é mobile-first.

---

## Acessibilidade

- Contraste mínimo de 4.5:1 para texto normal.
- Todos os componentes interativos possuem `role` e `aria-*`.
- Navegação via teclado (Tab, Enter, Esc).
- `focus-visible` visível em todos os elementos focáveis.

---

## Iconografia

Utilizamos **Lucide Icons** como conjunto padrão. Ícones são importados individualmente para manter o bundle leve.

---

## Ferramentas

- **Tailwind CSS** – estilos utilitários.
- **Shadcn UI** – componentes base.
- **Framer Motion** – animações avançadas.
- **class-variance-authority** – variantes de componentes.
- **clsx / tailwind-merge** – combinação de classes.

---

## Regra do Design System

Nenhum componente customizado deve ser criado sem antes verificar se já existe no Shadcn UI ou no design system local. Toda nova variação deve ser documentada e aprovada pelo time de produto/design.
