import type { LeagueSeason } from "./types";

export const mockLeague = (): LeagueSeason => ({
  season: "Temporada académica 2026",
  week: 7,
  division: "Divisão Ouro",
  campus: "Polo Luanda",
  endsAt: new Date(Date.now() + (2 * 24 + 14) * 3_600_000 + 22 * 60_000).toISOString(),
  totalStudents: 450,
  promotionSlots: 3,
  relegationSlots: 2,
  entries: [
    { rank: 1, name: "Manuel Kiala", university: "ISPTEC", course: "Engenharia Informática · 4.º ano", streakDays: 34, xp: 3420 },
    { rank: 2, name: "Jandira Mateus", university: "UAN", course: "Gestão de Empresas · 2.º ano", streakDays: 28, xp: 3100 },
    { rank: 3, name: "Cláudio Bernardo", university: "UCAN", course: "Direito Público · 3.º ano", streakDays: 19, xp: 2650 },
    { rank: 4, name: "Orlando Fortuna", university: "UAN", course: "Engenharia Informática · 4.º ano", streakDays: 14, xp: 2450, isYou: true },
    { rank: 5, name: "Esperança Manuel", university: "ISAF", course: "Gestão Bancária · 3.º ano", streakDays: 11, xp: 2180 },
    { rank: 6, name: "Nelson Domingos", university: "UAN", course: "Economia · 2.º ano", streakDays: 7, xp: 1960 },
    { rank: 7, name: "Teresa Ngola", university: "UCAN", course: "Contabilidade · 1.º ano", streakDays: 4, xp: 1520 },
  ],
});
