import type { StudyFeed } from "./types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const MOCK_FEED: StudyFeed = {
  active: {
    subject: "Macroeconomia I",
    university: "UAN",
    title: "Equilíbrio cambial e mercado monetário em Angola",
    summary:
      "Diferenciais de taxa de juro, regime cambial e o efeito na inflação e no poder de compra.",
    sectionsDone: 6,
    sectionsTotal: 7,
    xp: 40,
    reviewedBy: "Prof. Kiala · UAN",
    href: "/v2/leitura",
  },
  totalModules: 28,
  posts: [
    {
      id: "p1",
      trail: "aprendizado",
      author: { name: "Manuel Van-Dúnem", role: "Faculdade de Direito — UCAN", badge: "verified" },
      publishedAt: hoursAgo(2),
      title: "O controlo de constitucionalidade e a separação de poderes na CRA",
      excerpt:
        "Leitura do artigo 225.º da Constituição, com jurisprudência do Tribunal Constitucional e casos de fiscalização abstrata.",
      cover: "cover-direito",
      minutes: 5,
      hasQuiz: true,
      completions: 42,
      href: "/v2/leitura",
    },
    {
      id: "p2",
      trail: "aprendizado",
      author: { name: "Nzuzi Garcia", role: "ISPTEC — Engenharia Informática", badge: "monitor" },
      publishedAt: hoursAgo(26),
      title: "Estruturas de dados dinâmicas: árvores B+ e índices",
      excerpt:
        "Resumo para o exame de Bases de Dados II: particionamento de nós, balanceamento de índices e o que costuma sair na prova.",
      cover: "cover-engenharia",
      minutes: 8,
      hasQuiz: true,
      completions: 118,
      href: "/v2/leitura",
    },
    {
      id: "p3",
      trail: "mista",
      author: { name: "Esperança Domingos", role: "Faculdade de Medicina — UAN", badge: "verified" },
      publishedAt: hoursAgo(72),
      title: "Protocolo terapêutico da malária complicada",
      excerpt:
        "Quadro comparativo dos derivados da artemisinina, ajuste de dose pediátrica e critérios de alta do Ministério da Saúde.",
      cover: "cover-saude",
      minutes: 6,
      hasQuiz: true,
      completions: 203,
      href: "/v2/leitura",
    },
    {
      id: "p4",
      trail: "biblioteca",
      author: { name: "Teresa Bento", role: "Economia e Finanças — UAN", badge: "verified" },
      publishedAt: hoursAgo(120),
      title: "Como a flutuação cambial afeta a importação de bens",
      excerpt: "O pass-through cambial explicado a partir do Porto de Luanda, com um checkpoint no fim.",
      cover: "cover-economia",
      minutes: 6,
      hasQuiz: true,
      completions: 311,
      href: "/v2/leitura",
    },
  ],
  student: { name: "João Kiala", course: "Economia", year: "2.º ano" },
  league: {
    name: "Liga Ouro",
    campus: "UAN · Luanda",
    href: "/v2/ligas",
    rows: [
      { rank: 1, name: "Indira C.", xp: 3820 },
      { rank: 2, name: "Hélio M.", xp: 3410 },
      { rank: 3, name: "João Kiala", xp: 650, isYou: true },
    ],
  },
  exams: { label: "Exames finais UAN", daysLeft: 14 },
};
