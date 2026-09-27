import type { Course } from "./types";

export const MOCK_COURSE: Course = {
  id: "macro-aplicada",
  name: "Macroeconomia Aplicada",
  author: { name: "Mateus Silva", role: "Faculdade de Economia · UAN", verified: true },
  publishedAt: "2026-08-28",
  hero: {
    asset: "cover-economia",
    title: "Equilíbrio cambial e políticas fiscais em Angola",
    summary:
      "Nesta sessão vemos como a política fiscal e a taxa de câmbio se influenciam em Angola, com dados recentes do mercado monetário local.",
    minutes: 8,
    quizXp: 60,
    likes: 124,
    comments: 32,
    href: "#/leitura",
  },
  modules: [
    {
      id: "m2",
      title: "Módulo 2: o mercado monetário",
      summary: "Oferta e procura de moeda, e o efeito nas taxas de juro e na inflação estrutural.",
      minutes: 12,
      asset: "cover-economia",
      href: "#/leitura",
    },
    {
      id: "m3",
      title: "Módulo 3: balança de pagamentos",
      summary: "As transações internacionais de Angola, as reservas cambiais e a dívida externa.",
      minutes: 15,
      asset: "cover-direito",
      href: "#/leitura",
    },
  ],
  myCourses: [
    { id: "macro", name: "Macroeconomia I", active: true },
    { id: "direito", name: "Direito das Obrigações" },
    { id: "prog", name: "Programação I" },
  ],
  suggestedAuthors: [
    { id: "ana", name: "Ana Costa", subject: "Matemática I" },
    { id: "joao", name: "João Mendes", subject: "Direito Penal" },
  ],
};
