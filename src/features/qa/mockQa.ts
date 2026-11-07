import type { QaBoard } from "./types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const MOCK_QA: QaBoard = {
  materialId: "m-macro",
  materialTitle: "Modelo IS-LM e câmbio flutuante",
  subject: "Macroeconomia I",
  readingHref: "/v2/leitura",
  averageAnswerHours: 4,
  anchors: [
    { value: "mod1", label: "Módulo 1 — equilíbrio no mercado de bens" },
    { value: "mod2", label: "Módulo 2 — moeda e taxa de juro" },
    { value: "mod3", label: "Módulo 3 — deslocamento da curva IS" },
    { value: "quiz4", label: "Checkpoint 4 — curva BP e câmbio fixo" },
  ],
  threads: [
    {
      id: "t1",
      author: { name: "Hamilton Fortuna", year: "2.º ano" },
      anchorId: "mod3",
      anchorLabel: "Módulo 3",
      question:
        "Porque é que a curva IS se desloca para a direita com o aumento dos gastos públicos, se a taxa de juro sobe?",
      at: hoursAgo(48),
      helpful: 8,
      answers: [
        {
          id: "a1",
          author: { name: "Mateus Silva", role: "Autor da sebenta · UAN", verified: true },
          body: "O aumento dos gastos públicos eleva a procura agregada para cada nível de taxa de juro, e é isso que desloca a curva IS. A subida da taxa acontece depois, no cruzamento com a curva LM: é o efeito de crowding out, que reduz parte do estímulo, mas não desfaz o deslocamento.",
          at: hoursAgo(24),
          official: true,
          helpful: 14,
        },
        {
          id: "a2",
          author: { name: "Jandira Mateus", role: "Colega · 2.º ano", verified: false },
          body: "A mim ajudou pensar assim: a IS desloca-se por causa da despesa; a taxa de juro é o resultado do equilíbrio, não a causa.",
          at: hoursAgo(20),
          official: false,
          helpful: 5,
        },
      ],
    },
    {
      id: "t2",
      author: { name: "Esperança Manuel", year: "3.º ano" },
      anchorId: "quiz4",
      anchorLabel: "Checkpoint 4",
      question: "No checkpoint 4, porque é que a política fiscal perde eficácia com câmbio flutuante?",
      at: hoursAgo(30),
      helpful: 4,
      answers: [
        {
          id: "a3",
          author: { name: "Mateus Silva", role: "Autor da sebenta · UAN", verified: true },
          body: "Com mobilidade de capitais, a expansão fiscal atrai capital, o Kwanza aprecia e as exportações líquidas caem. O efeito cambial anula boa parte do estímulo inicial.",
          at: hoursAgo(26),
          official: true,
          helpful: 9,
        },
      ],
    },
    {
      id: "t3",
      author: { name: "João Kiala", year: "2.º ano" },
      anchorId: "mod2",
      anchorLabel: "Módulo 2",
      question: "A curva LM fica vertical quando a procura de moeda é insensível à taxa de juro?",
      at: hoursAgo(6),
      helpful: 2,
      mine: true,
      answers: [],
    },
    {
      id: "t4",
      author: { name: "Nelson Domingos", year: "1.º ano" },
      anchorId: "mod1",
      anchorLabel: "Módulo 1",
      question: "Qual é a diferença prática entre poupança privada e poupança nacional no exemplo do módulo 1?",
      at: hoursAgo(3),
      helpful: 1,
      answers: [],
    },
  ],
};
