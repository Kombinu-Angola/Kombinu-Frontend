import type { SurveyDraft, SurveyResult } from "./types";

export const SURVEY_DRAFT: SurveyDraft = {
  decision: "",
  kind: "escala",
  question: "O tempo de 90 segundos por questão foi suficiente neste simulado?",
  options: ["Muito curto", "Apertado", "Suficiente", "Folgado", "Excessivo"],
  faculty: "uan-economia",
  subject: "macro1",
  trigger: "fim-simulado",
  sampleTarget: 120,
  segmentSize: 540,
};

export const SURVEY_RESULT: SurveyResult = {
  question: "O tempo de 90 segundos por questão foi suficiente no Simulado 1?",
  decision: "Se mais de metade disser que é curto, subo para 120 segundos e volto a medir.",
  subject: "Macroeconomia I · UAN",
  closedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  answers: 138,
  dismissed: 46,
  shown: 184,
  distribution: [
    { label: "Muito curto", value: 12 },
    { label: "Apertado", value: 28 },
    { label: "Suficiente", value: 45 },
    { label: "Folgado", value: 10 },
    { label: "Excessivo", value: 5 },
  ],
  byYear: [
    { year: "1.º ano", answers: 32, topChoice: "Apertado", share: 41 },
    { year: "2.º ano", answers: 71, topChoice: "Suficiente", share: 52 },
    { year: "3.º ano", answers: 35, topChoice: "Suficiente", share: 57 },
  ],
};
