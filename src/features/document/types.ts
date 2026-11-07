export type DocumentPage = { id: string; heading?: string; paragraphs: string[]; formula?: { label: string; expression: string; note: string }; callout?: { title: string; text: string } };

/** Contrato esperado de GET /api/materials/<id>/ */
export type DocumentDetail = {
  id: string;
  title: string;
  subject: string;
  faculty: string;
  university: string;
  author: { name: string; role: string; rating: number; reviews: number; verified: boolean };
  priceKz: number;
  /** Preço de referência para ancoragem (ex.: cópia impressa). */
  anchorKz?: number;
  pages: number;
  freePages: number;
  quizzes: number;
  sizeKb: number;
  sampleKb: number;
  updatedAt: string;
  sample: DocumentPage[];
  includes: string[];
};

export type PurchaseState =
  | { status: "idle" }
  | { status: "pending"; reference: string }
  | { status: "done"; reference: string }
  | { status: "error"; message: string };
