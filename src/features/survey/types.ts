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

/** Ciclo de vida no servidor: rascunho -> activa -> encerrada. Só se vota em enquetes activas. */
export type SurveyState = "rascunho" | "activa" | "encerrada";

export type SurveyOption = {
  id: string;
  label: string;
  value: number | null;
};

/** Vista do criador (`POST /enquetes/` e transições): o rascunho mais o id e o estado. */
export type Survey = Omit<SurveyDraft, "options"> & {
  id: string;
  state: SurveyState;
  options: SurveyOption[];
  closedAt: string | null;
};

/** Vista de quem vota: nunca inclui a decisão do criador. */
export type SurveyListItem = {
  id: string;
  kind: SurveyKind;
  question: string;
  faculty: string;
  subject: string;
  trigger: SurveyTrigger;
  state: SurveyState;
  options: SurveyOption[];
  hasVoted: boolean;
  /** O utilizador é o criador desta enquete (decide o servidor): só ele gere e vê resultados. */
  isOwner: boolean;
};

export type SurveyResult = {
  question: string;
  decision: string;
  subject: string;
  /** `null` enquanto a enquete está activa. */
  closedAt: string | null;
  answers: number;
  dismissed: number;
  shown: number;
  distribution: Array<{ label: string; value: number }>;
  byYear: Array<{ year: string; answers: number; topChoice: string; share: number }>;
};
