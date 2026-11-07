export type TranscriptCue = { id: string; start: number; text: string };

/** Contrato esperado de GET /api/articles/<id>/audio/ */
export type AudioSummary = {
  articleId: string;
  title: string;
  subject: string;
  reviewedBy: { name: string; role: string };
  /** Duração em segundos. */
  duration: number;
  /** Tamanho do ficheiro completo, em KB (mono, 16 kbps). */
  sizeKb: number;
  bitrateKbps: number;
  /** Ausente na demonstração: o leitor mostra o modo de pré-visualização. */
  src?: string;
  cues: TranscriptCue[];
  readingHref: string;
};
