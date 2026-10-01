import type { Asset3DName } from "../../lib/assets3d";

/**
 * Modelo de conteúdo partilhado pelo leitor, pelo editor do estúdio e pela pré-visualização.
 * O que o criador escreve é exatamente o que o estudante lê.
 */
export type CheckpointOption = { id: string; label: string; text: string };

export type ContentBlock =
  | { type: "paragraph"; id: string; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "callout"; id: string; title: string; text: string }
  | { type: "figure"; id: string; asset: Asset3DName; alt: string; caption: string }
  | { type: "takeaways"; id: string; title: string; items: Array<{ term: string; text: string }> }
  | { type: "quote"; id: string; text: string; source?: string }
  | {
      type: "flow";
      id: string;
      title: string;
      caption: string;
      steps: Array<{ label: string; title: string; text: string }>;
    }
  | {
      type: "checkpoint";
      id: string;
      xp: number;
      question: string;
      options: CheckpointOption[];
      correctOptionId: string;
      explanation: { correct: string; incorrect: string };
    };

export type Article = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  author: { name: string; role: string };
  publishedAt: string;
  minutes: number;
  audioMinutes?: number;
  completionXp: number;
  keyPoints: string[];
  blocks: ContentBlock[];
  next?: { title: string; author: string; minutes: number; href: string };
};

/** Entradas do índice: títulos, destaques e checkpoints ganham âncora. */
export type TocEntry = { id: string; label: string; kind: "heading" | "callout" | "checkpoint" };

export function tableOfContents(blocks: ContentBlock[]): TocEntry[] {
  return blocks.flatMap<TocEntry>((b) =>
    b.type === "heading"
      ? [{ id: b.id, label: b.text, kind: "heading" as const }]
      : b.type === "callout"
        ? [{ id: b.id, label: b.title, kind: "callout" as const }]
      : b.type === "takeaways"
        ? [{ id: b.id, label: b.title, kind: "callout" as const }]
        : b.type === "checkpoint"
          ? [{ id: b.id, label: `Checkpoint (+${b.xp} XP)`, kind: "checkpoint" as const }]
          : [],
  );
}

export const countCheckpoints = (blocks: ContentBlock[]) => blocks.filter((b) => b.type === "checkpoint").length;
