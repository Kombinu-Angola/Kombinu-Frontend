import type { DocumentDetail } from "./types";

export const MOCK_DOCUMENT: DocumentDetail = {
  id: "seb-politica-cambial",
  title: "Sebenta de política cambial e o impacto no Kwanza",
  subject: "Macroeconomia I",
  faculty: "Faculdade de Economia",
  university: "UAN",
  author: { name: "Teresa Bento", role: "Cátedra de Macroeconomia · UAN", rating: 4.9, reviews: 420, verified: true },
  priceKz: 1500,
  anchorKz: 3500,
  pages: 45,
  freePages: 5,
  quizzes: 12,
  sizeKb: 780,
  sampleKb: 42,
  updatedAt: "2026-08-30",
  includes: [
    "45 páginas com esquemas e exemplos de exames anteriores",
    "12 quizzes interativos com explicação de cada resposta",
    "Leitura offline depois da compra, sem gastar dados outra vez",
  ],
  sample: [
    {
      id: "p1",
      heading: "2.1 Do câmbio administrado ao câmbio flutuante",
      paragraphs: [
        "A evolução do regime cambial em Angola acompanha a transição da dependência dos hidrocarbonetos para uma disciplina monetária conduzida pelo Banco Nacional de Angola.",
        "O abandono da fixação administrativa do Kwanza procura estabilizar as reservas internacionais líquidas e reduzir a distância entre a taxa oficial e a do mercado paralelo.",
      ],
      formula: {
        label: "Paridade do poder de compra (forma relativa) — Eq. 2.1",
        expression: "Δe = π(AO) − π(US) + μ(risco)",
        note: "Δe é a depreciação esperada do Kwanza, dada pela diferença de inflações mais o prémio de risco do país.",
      },
    },
    {
      id: "p2",
      heading: "2.2 A transmissão aos bens da cesta básica",
      paragraphs: [
        "Em economias com pauta de importação pouco elástica, como os alimentos e os medicamentos em Luanda, o repasse cambial para os preços internos ronda 0,65 num horizonte de 90 dias.",
      ],
      callout: {
        title: "Ponto que sai muito em exame",
        text: "Distingue sempre depreciação nominal (o efeito aritmético do mercado) de desvalorização real (já corrigida pela diferença de inflação).",
      },
    },
  ],
};
