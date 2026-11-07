/** Contrato JSON esperado da API (ex.: GET /api/diagnostics/<id>/). */
export type QuizOptionData = {
  id: string;
  /** Letra mostrada no indicador: "A", "B"… */
  label: string;
  text: string;
};

export type QuizQuestionData = {
  id: string;
  stem: string;
  options: QuizOptionData[];
  correctOptionId: string;
  explanation: { correct: string; incorrect: string };
  xp: number;
};

export type DiagnosticQuizData = {
  id: string;
  course: { name: string; institution: string };
  questions: QuizQuestionData[];
};

export type DiagnosticResult = {
  quizId: string;
  answers: Record<string, string>;
  correctCount: number;
  total: number;
  xpEarned: number;
};
