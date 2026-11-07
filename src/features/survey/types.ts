export type SurveyKind = "escala" | "escolha" | "binaria";

export type SurveyTrigger = "fim-simulado" | "fim-leitura" | "fim-modulo";

export type SurveyDraft = {
  /** Obrigatório: enquete sem decisão associada é ruído. */
  decision: string;
  kind: SurveyKind;
  question: string;
  options: string[];
  faculty: string;
  subject: string;
  trigger: SurveyTrigger;
  sampleTarget: number;
  /** Tamanho do segmento, para estimar o tempo de recolha. */
  segmentSize: number;
};

export type SurveyResult = {
  question: string;
  decision: string;
  subject: string;
  closedAt: string;
  answers: number;
  dismissed: number;
  shown: number;
  distribution: Array<{ label: string; value: number }>;
  byYear: Array<{ year: string; answers: number; topChoice: string; share: number }>;
};
