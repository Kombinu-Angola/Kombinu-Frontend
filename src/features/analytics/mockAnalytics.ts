import type { MaterialAnalytics } from "./types";

/** Os 94 compradores são os mesmos que a gestão de materiais mostra para esta sebenta. */
export const MOCK_ANALYTICS: MaterialAnalytics = {
  materialId: "m-macro",
  title: "Manual de exercícios: Macroeconomia I",
  subject: "Economia",
  university: "UAN",
  buyers: { total: 94, marketplace: 71, directLink: 23 },
  rating: 4.9,
  reviews: 42,
  facultyAverageCompletion: 54,
  funnel: [
    { id: "f1", order: 1, title: "Introdução à macroeconomia aberta", readers: 94, avgMinutes: 8 },
    { id: "f2", order: 2, title: "Balanço de pagamentos e reservas cambiais", readers: 83, avgMinutes: 14 },
    { id: "f3", order: 3, title: "Equilíbrio IS-LM com câmbio flutuante", readers: 76, avgMinutes: 22 },
    { id: "f4", order: 4, title: "Modelo Mundell-Fleming e política fiscal", readers: 72, avgMinutes: 18 },
  ],
  questions: [
    {
      id: "q4",
      order: 4,
      prompt: "Impacto da desvalorização cambial no saldo da balança comercial",
      anchor: "Módulo 2 · checkpoint 4",
      answers: 83,
      accuracy: 38,
      topDistractor: { text: "O saldo melhora de imediato, sem efeito de curva J", share: 44 },
    },
    {
      id: "q7",
      order: 7,
      prompt: "Efeito de uma subida da taxa de referência do BNA sobre o investimento",
      anchor: "Módulo 3 · checkpoint 2",
      answers: 76,
      accuracy: 57,
      topDistractor: { text: "O investimento sobe porque o crédito fica mais atrativo", share: 28 },
    },
    {
      id: "q11",
      order: 11,
      prompt: "Mobilidade de capitais no modelo Mundell-Fleming",
      anchor: "Módulo 4 · checkpoint 1",
      answers: 72,
      accuracy: 71,
      topDistractor: { text: "A política fiscal é sempre mais eficaz com câmbio flutuante", share: 19 },
    },
    {
      id: "q13",
      order: 13,
      prompt: "Identificação das contas do balanço de pagamentos",
      anchor: "Módulo 2 · checkpoint 1",
      answers: 83,
      accuracy: 92,
      topDistractor: { text: "Remessas de emigrantes entram na conta de capital", share: 6 },
    },
  ],
};
