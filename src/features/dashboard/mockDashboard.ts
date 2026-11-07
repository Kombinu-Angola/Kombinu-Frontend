import type { DashboardData } from "./types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

/** Dados de exemplo alinhados com o onboarding (Macroeconomia I, UAN). */
export const MOCK_DASHBOARD: DashboardData = {
  user: { name: "João Kiala", firstName: "João", course: "Economia · 2.º ano · UAN" },
  stats: { accuracy: 85, accuracyDelta: 5, studyMinutesWeek: 105, lessonsCompleted: 24 },
  skills: [
    { id: "macro", subject: "Macroeconomia I", xp: 380 },
    { id: "calc", subject: "Cálculo Diferencial", xp: 190 },
    { id: "contab", subject: "Contabilidade Financeira", xp: 90 },
  ],
  activity: [
    { id: "a1", kind: "quiz", title: "Quiz: política monetária do BNA", at: hoursAgo(2), score: 90, xp: 15, href: "/v2/painel" },
    { id: "a2", kind: "reading", title: "Leitura: juros compostos", at: hoursAgo(27), xp: 10, href: "/v2/painel" },
  ],
  resume: { title: "Inflação e poder de compra", module: "Macroeconomia I · Módulo 2", done: 1, total: 3, href: "/v2/painel" },
  missions: [
    { id: "m1", title: "Completar 2 lições", icon: "book", progress: 1, goal: 2, gems: 10 },
    { id: "m2", title: "Acertar 5 seguidas", icon: "target", progress: 1, goal: 5, gems: 15 },
  ],
  league: {
    name: "Liga Bronze",
    href: "/v2/ligas",
    rows: [
      { rank: 3, name: "Esperança M.", xp: 720 },
      { rank: 4, name: "João Kiala", xp: 650, isYou: true },
      { rank: 5, name: "Nelson D.", xp: 610 },
    ],
  },
};
