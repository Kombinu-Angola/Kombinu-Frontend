export type QaAnswer = {
  id: string;
  author: { name: string; role: string; verified: boolean };
  body: string;
  at: string;
  /** Resposta assinalada pelo criador como a correta. */
  official: boolean;
  helpful: number;
};

export type QaThread = {
  id: string;
  author: { name: string; year: string };
  anchorId: string;
  anchorLabel: string;
  question: string;
  at: string;
  helpful: number;
  mine?: boolean;
  answers: QaAnswer[];
};

/** Contrato esperado de GET /api/materials/<id>/questions/ */
export type QaBoard = {
  materialId: string;
  materialTitle: string;
  subject: string;
  readingHref: string;
  anchors: Array<{ value: string; label: string }>;
  averageAnswerHours: number;
  threads: QaThread[];
};
