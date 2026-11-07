export type QuestionType = "escolha" | "vf" | "numerico";

export type QuestionOption = {
  id: string;
  label: string;
  text: string;
  /** Explicação específica desta alternativa: a correta justifica, as erradas corrigem. */
  explanation: string;
  /** Percentagem de estudantes que a escolheu (vem das tentativas). */
  share?: number;
};

export type Question = {
  id: string;
  type: QuestionType;
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  topicIds: string[];
  /** 1 fácil, 2 média, 3 difícil, declarada pelo criador. */
  declaredDifficulty: 1 | 2 | 3;
  estimatedSeconds: number;
  /** Observado a partir das respostas; ausente enquanto não houver dados. */
  observed?: { answers: number; accuracy: number };
  usedIn: number;
  updatedAt: string;
};

export type Topic = { id: string; name: string; subjectId: string; examWeight: number };

export type ExamSettings = {
  shuffleOptions: boolean;
  shuffleQuestions: boolean;
  /** Minutos; 0 = sem limite. */
  timeLimitMinutes: number;
  feedback: "imediato" | "final";
  attempts: 1 | 2 | 0;
};

export type TrailNodeDraft = {
  id: string;
  kind: "artigo" | "simulado" | "vazio";
  title: string;
  materialId?: string;
  minutes: number;
  xp: number;
  checkpoints: number;
  topicIds: string[];
};

export type VersionEntry = {
  id: string;
  label: string;
  status: "publicada" | "rascunho" | "arquivada";
  at: string;
  author: string;
  summary: string;
  changes: Array<{ kind: "adicionado" | "alterado" | "removido"; text: string }>;
  readersOnVersion: number;
};

export type ImportedRow = {
  id: string;
  line: number;
  stem: string;
  options: string[];
  correctIndex: number | null;
  topicId: string | null;
  issues: Array<{ field: "gabarito" | "topico" | "alternativas" | "enunciado"; message: string }>;
};
