import type { Draft } from "./useDraft";

export const MOCK_DRAFT: Draft = {
  title: "",
  subtitle: "",
  blocks: [
    {
      type: "paragraph",
      id: "b-intro",
      text: "A economia estuda como as sociedades usam recursos escassos para produzir bens e distribuí-los entre pessoas. Neste resumo vemos a oferta e a procura, os agentes económicos e o funcionamento básico dos mercados.",
    },
    {
      type: "callout",
      id: "b-callout",
      title: "Conceito fundamental em 30 segundos",
      text: "Escassez não é falta de dinheiro: é o facto de os recursos disponíveis nunca chegarem para todos os desejos ao mesmo tempo. É isso que obriga a fazer escolhas.",
    },
    {
      type: "checkpoint",
      id: "b-check",
      xp: 20,
      question: "Qual é o problema central que a economia estuda?",
      options: [
        { id: "o0", label: "A", text: "A escassez de recursos" },
        { id: "o1", label: "B", text: "A abundância de recursos" },
        { id: "o2", label: "C", text: "A distribuição desigual" },
      ],
      correctOptionId: "o0",
      explanation: {
        correct: "A escassez obriga a escolher entre alternativas, e é daí que nasce toda a análise económica.",
        incorrect: "O ponto de partida da economia é a escassez: os recursos não chegam para todos os desejos.",
      },
    },
  ],
};
