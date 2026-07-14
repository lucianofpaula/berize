# Website

## Visão Geral

Módulo para site público do tenant. Toda empresa na plataforma pode ter seu próprio website sem sair do ecossistema.

## Capacidades

- Landing page personalizável
- Página de serviços/produtos
- Página da equipe
- Galeria de fotos
- Blog
- Contato / WhatsApp
- Agendamento online
- SEO otimizado

## Templates por Segmento

Cada segmento possui templates específicos:

- Barbearias → visual masculino, serviços de corte
- Restaurantes → cardápio, delivery
- Clínicas → especialidades, agendamento
- Lojas → catálogo, carrinho

## Estrutura

```
modules/website/
├── components/
│   ├── hero/
│   ├── services/
│   ├── team/
│   ├── gallery/
│   ├── blog/
│   └── contact/
├── services/
├── permissions/
└── types/
```

## Regra

O Website faz parte da plataforma, não é um produto separado. Toda empresa na plataforma pode ativar seu site.
