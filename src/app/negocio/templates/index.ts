import type { WebsiteSection } from "../website-types";

export type Template = {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  previewIcon: string;
  palette: string[];
  sections: WebsiteSection[];
};

const templates: Template[] = [
  {
    id: "classic",
    name: "Clássico Acolhedor",
    description:
      "Tons terrosos, aconchego rústico. Ideal para barbearias tradicionais.",
    previewGradient: "from-amber-800 via-amber-700 to-amber-600",
    previewIcon: "✂️",
    palette: ["#FFF8F0", "#F5F0E8", "#C8673C", "#D97706", "#783F1D"],
    sections: [
      {
        id: "full-page",
        type: "full-page",
        title: "Template Completo",
        enabled: true,
        content: { templateId: "classic" },
      },
    ],
  },
  {
    id: "urban",
    name: "Urbano Contemporâneo",
    description:
      "Dark mode, acentos laranja/roxo, tipografia ousada. Para estúdios jovens.",
    previewGradient: "from-zinc-900 via-purple-900 to-orange-900",
    previewIcon: "⚡",
    palette: ["#080808", "#1A1A1A", "#FF6B35", "#7C3AED", "#FFFFFF"],
    sections: [
      {
        id: "full-page",
        type: "full-page",
        title: "Template Completo",
        enabled: true,
        content: { templateId: "urban" },
      },
    ],
  },
  {
    id: "premium",
    name: "Premium Elegante",
    description:
      "Branco, azul navy, minimalista. Para barbearias de alto padrão.",
    previewGradient: "from-slate-800 via-blue-900 to-slate-900",
    previewIcon: "✦",
    palette: ["#FFFFFF", "#F8F8F8", "#1E3A5F", "#1A1A1A", "#E2E8F0"],
    sections: [
      {
        id: "full-page",
        type: "full-page",
        title: "Template Completo",
        enabled: true,
        content: { templateId: "premium" },
      },
    ],
  },
  {
    id: "photographic",
    name: "Fotográfico Impactante",
    description:
      "Hero com imagem de fundo, dark premium, acentos âmbar. Máximo impacto visual.",
    previewGradient: "from-zinc-900 via-amber-950 to-zinc-900",
    previewIcon: "📸",
    palette: ["#000000", "#18181B", "#F59E0B", "#FFFFFF", "#D97706"],
    sections: [
      {
        id: "full-page",
        type: "full-page",
        title: "Template Completo",
        enabled: true,
        content: { templateId: "photographic" },
      },
    ],
  },
  {
    id: "gpt-dark",
    name: "Premium Noturno",
    description:
      "Fundo #0c0c0c, cards #121212, acentos âmbar/dourado. Design luxuoso e sofisticado.",
    previewGradient: "from-zinc-950 via-amber-950 to-zinc-950",
    previewIcon: "✦",
    palette: ["#0c0c0c", "#121212", "#F59E0B", "#FFFFFF", "#A1A1AA"],
    sections: [
      {
        id: "full-page",
        type: "full-page",
        title: "Template Completo",
        enabled: true,
        content: { templateId: "gpt-dark" },
      },
    ],
  },
  {
    id: "completo-2",
    name: "Premium 2",
    description:
      "Design dark/âmbar com navbar, hero imagem, serviços, planos, equipe, galeria, depoimentos, horários e contato.",
    previewGradient: "from-zinc-950 via-amber-900 to-zinc-950",
    previewIcon: "✦",
    palette: ["#0c0c0c", "#121212", "#F59E0B", "#FFFFFF", "#27272A"],
    sections: [
      {
        id: "full-page",
        type: "full-page",
        title: "Template Completo",
        enabled: true,
        content: { templateId: "gpt-completo" },
      },
    ],
  },
  {
    id: "premium-3",
    name: "Premium 3",
    description:
      "Design dark/âmbar com navbar, hero imagem, serviços, planos, equipe, galeria, depoimentos, horários e contato.",
    previewGradient: "from-zinc-950 via-amber-900 to-zinc-950",
    previewIcon: "✦",
    palette: ["#0c0c0c", "#121212", "#F59E0B", "#FFFFFF", "#27272A"],
    sections: [
      {
        id: "full-page",
        type: "full-page",
        title: "Template Premium 3",
        enabled: true,
        content: { templateId: "premium-3" },
      },
    ],
  },
];

export function getTemplates(): Template[] {
  return templates;
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function applyTemplateData(
  template: Template,
  companyData: {
    name: string;
    description: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    address: Record<string, string> | null;
    socialMedia: Record<string, string> | null;
    services: { name: string; price: number | null }[];
    barbers: { name: string; image: string | null }[];
    hours: {
      dayOfWeek: number;
      openTime: string | null;
      closeTime: string | null;
      isOpen: boolean;
    }[];
  },
): WebsiteSection[] {
  return template.sections.map((section) => {
    const content = { ...section.content };

    switch (section.type) {
      case "hero": {
        content.title = content.title || companyData.name || "Sua Barbearia";
        break;
      }
      case "about": {
        content.title = content.title || "Sobre Nós";
        content.text = companyData.description || "";
        break;
      }
    }

    return { ...section, content };
  });
}
