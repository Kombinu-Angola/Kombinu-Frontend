export type LeagueScope = "faculdade" | "luanda" | "angola";

export type LeagueEntry = {
  rank: number;
  name: string;
  university: string;
  course: string;
  streakDays: number;
  xp: number;
  isYou?: boolean;
};

/** Contrato esperado de GET /api/leagues/current/?scope= */
export type LeagueSeason = {
  season: string;
  week: number;
  division: string;
  campus: string;
  endsAt: string;
  totalStudents: number;
  promotionSlots: number;
  relegationSlots: number;
  entries: LeagueEntry[];
};
