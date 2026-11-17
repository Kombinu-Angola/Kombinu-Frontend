/**
 * Modelo de conteúdo dos documentos legais.
 * O texto vive em termos.ts / privacidade.ts, separado do layout:
 * a equipa jurídica edita os dados, o ecrã não muda.
 *
 * Texto rico mínimo: **negrito**; e-mails e rotas (/termos, /privacidade) viram ligações automaticamente.
 */
export type ListItem = { title?: string; text: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; marker?: "alpha"; items: ListItem[] }
  | { type: "callout"; tone: "info" | "warning" | "success"; title?: string; text: string }
  | { type: "facts"; items: { label: string; value: string }[] }
  | { type: "cards"; items: { title: string; fields: { label: string; value: string }[] }[] }
  | { type: "sub"; number?: string; title: string; blocks: Block[] };

export type Section = { id: string; number: string; title: string; blocks: Block[] };

export type SummaryItem = { icon: "user" | "wallet" | "refresh" | "store" | "shield" | "bolt" | "spark" | "lock" | "mail" | "users"; title: string; text: string; ref: string };

export type LegalDoc = {
  slug: "termos" | "privacidade";
  title: string;
  shortTitle: string;
  version: string;
  updated: string;
  framework: string[];
  intro?: string[];
  summary: SummaryItem[];
  sections: Section[];
  signoff?: string[];
};
