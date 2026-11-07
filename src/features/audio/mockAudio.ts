import type { AudioSummary } from "./types";

export const MOCK_AUDIO: AudioSummary = {
  articleId: "art-bna",
  title: "Áudio-síntese: o mecanismo de transmissão da taxa do BNA",
  subject: "Macroeconomia I",
  reviewedBy: { name: "Mateus Silva", role: "Docente verificado · UAN" },
  duration: 320,
  sizeKb: 640,
  bitrateKbps: 16,
  readingHref: "/v2/leitura",
  cues: [
    { id: "c1", start: 0, text: "Quando o Banco Nacional de Angola intervém no mercado cambial para estabilizar a cotação do Kwanza, mexe ao mesmo tempo com a liquidez dos bancos." },
    { id: "c2", start: 46, text: "O volume de reservas internacionais líquidas determina a capacidade de absorver um choque sem alterar a taxa de referência." },
    { id: "c3", start: 104, text: "O efeito chega depressa às taxas interbancárias de curto prazo, e daí ao crédito comercial." },
    { id: "c4", start: 158, text: "Os bancos ajustam os spreads de cedência para equilibrar as posições em divisas, e é aí que o custo chega às empresas." },
    { id: "c5", start: 212, text: "Para o exame, retém a ordem dos efeitos: reservas, liquidez, taxa interbancária, crédito." },
    { id: "c6", start: 268, text: "No resumo final, repara que o câmbio e a política monetária não são canais separados numa economia aberta como a angolana." },
  ],
};
