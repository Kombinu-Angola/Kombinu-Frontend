import { useEffect, useReducer, useRef, useState } from "react";
import type { ContentBlock } from "../content/blocks";

export type Draft = { title: string; subtitle: string; blocks: ContentBlock[] };

export type BlockKind = "paragraph" | "callout" | "figure" | "checkpoint" | "quote" | "takeaways";

type Action =
  | { type: "field"; field: "title" | "subtitle"; value: string }
  | { type: "add"; kind: BlockKind }
  | { type: "update"; block: ContentBlock }
  | { type: "remove"; id: string }
  | { type: "move"; id: string; direction: -1 | 1 };

const newId = () => `b-${Math.random().toString(36).slice(2, 8)}`;

function emptyBlock(kind: BlockKind): ContentBlock {
  const id = newId();
  switch (kind) {
    case "paragraph":
      return { type: "paragraph", id, text: "" };
    case "callout":
      return { type: "callout", id, title: "Conceito fundamental em 30 segundos", text: "" };
    case "figure":
      return { type: "figure", id, asset: "figure-escassez", alt: "", caption: "" };
    case "quote":
      return { type: "quote", id, text: "", source: "" };
    case "takeaways":
      return {
        type: "takeaways",
        id,
        title: "Princípios-chave desta sessão",
        items: [
          { term: "", text: "" },
          { term: "", text: "" },
        ],
      };
    case "checkpoint":
      return {
        type: "checkpoint",
        id,
        xp: 20,
        question: "",
        options: ["A", "B", "C"].map((label, i) => ({ id: `o${i}`, label, text: "" })),
        correctOptionId: "o0",
        explanation: { correct: "", incorrect: "" },
      };
  }
}

function reducer(draft: Draft, action: Action): Draft {
  switch (action.type) {
    case "field":
      return { ...draft, [action.field]: action.value };
    case "add":
      return { ...draft, blocks: [...draft.blocks, emptyBlock(action.kind)] };
    case "update":
      return { ...draft, blocks: draft.blocks.map((b) => (b.id === action.block.id ? action.block : b)) };
    case "remove":
      return { ...draft, blocks: draft.blocks.filter((b) => b.id !== action.id) };
    case "move": {
      const i = draft.blocks.findIndex((b) => b.id === action.id);
      const j = i + action.direction;
      if (i < 0 || j < 0 || j >= draft.blocks.length) return draft;
      const blocks = [...draft.blocks];
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
      return { ...draft, blocks };
    }
  }
}

/**
 * Rascunho do estúdio com guardar automático. O `savedAt` só avança quando a gravação
 * termina; em produção, troque o temporizador pelo PATCH ao servidor.
 */
export function useDraft(initial: Draft, save?: (draft: Draft) => Promise<void>) {
  const [draft, dispatch] = useReducer(reducer, initial);
  const [savedAt, setSavedAt] = useState<Date | null>(new Date());
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    // O rascunho acabou de ser carregado: ainda não há nada por guardar.
    if (!dirty.current) {
      dirty.current = true;
      return;
    }
    setSavedAt(null);
    const id = window.setTimeout(async () => {
      setSaving(true);
      try {
        await save?.(draft);
        setSavedAt(new Date());
      } finally {
        setSaving(false);
      }
    }, 1200);
    return () => window.clearTimeout(id);
  }, [draft, save]);

  return { draft, dispatch, savedAt, saving };
}

/** "agora mesmo" · "há 2 min" */
export function useSavedLabel(savedAt: Date | null, saving: boolean) {
  const [, tick] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (saving) return "A guardar…";
  if (!savedAt) return "Alterações por guardar";
  const minutes = Math.floor((Date.now() - savedAt.getTime()) / 60_000);
  return minutes < 1 ? "Guardado agora mesmo" : `Guardado há ${minutes} min`;
}
