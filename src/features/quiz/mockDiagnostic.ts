import type { DiagnosticQuizData } from "./types";

/** Dados de exemplo (Macroeconomia I — UAN). Substituir pela resposta da API. */
export const MOCK_DIAGNOSTIC: DiagnosticQuizData = {
  id: "diag-macro-1-uan",
  course: { name: "Macroeconomia I", institution: "UAN" },
  questions: [
    {
      id: "q1",
      stem: "Qual é a consequência direta do aumento da taxa de reservas obrigatórias imposta pelo BNA aos bancos comerciais?",
      options: [
        { id: "a", label: "A", text: "Aumento imediato do crédito disponível para empresas e famílias." },
        { id: "b", label: "B", text: "Redução da liquidez bancária e contenção da oferta monetária." },
        { id: "c", label: "C", text: "Eliminação da dívida pública interna no curto prazo." },
        { id: "d", label: "D", text: "Isenção automática de impostos alfandegários na importação." },
      ],
      correctOptionId: "b",
      explanation: {
        correct: "Menos reservas livres reduzem a criação de moeda escritural pelo efeito multiplicador.",
        incorrect: "Reservas obrigatórias mais altas retêm fundos no BNA e reduzem o crédito que os bancos conseguem conceder.",
      },
      xp: 10,
    },
    {
      id: "q2",
      stem: "Se o BNA subir a Taxa BNA, qual é o efeito esperado no curto prazo?",
      options: [
        { id: "a", label: "A", text: "O crédito fica mais barato e o consumo acelera." },
        { id: "b", label: "B", text: "O Kwanza desvaloriza de imediato face ao dólar." },
        { id: "c", label: "C", text: "O crédito fica mais caro e a procura agregada abranda." },
        { id: "d", label: "D", text: "O défice orçamental desaparece automaticamente." },
      ],
      correctOptionId: "c",
      explanation: {
        correct: "Uma taxa de referência mais alta encarece o crédito, trava a procura e ajuda a conter a inflação.",
        incorrect: "Subir a taxa de referência encarece o crédito; o efeito é abrandar a procura, não acelerá-la.",
      },
      xp: 10,
    },
    {
      id: "q3",
      stem: "O PIB nominal cresceu 20% e a inflação foi de 15%. Qual foi, aproximadamente, o crescimento do PIB real?",
      options: [
        { id: "a", label: "A", text: "Cerca de 35%" },
        { id: "b", label: "B", text: "Cerca de 20%" },
        { id: "c", label: "C", text: "Cerca de 15%" },
        { id: "d", label: "D", text: "Cerca de 4,3%" },
      ],
      correctOptionId: "d",
      explanation: {
        correct: "Crescimento real = 1,20 ÷ 1,15 − 1 ≈ 4,3%. A inflação \"come\" a maior parte do crescimento nominal.",
        incorrect: "Retira o efeito dos preços: 1,20 ÷ 1,15 − 1 ≈ 4,3% de crescimento real.",
      },
      xp: 10,
    },
  ],
};
