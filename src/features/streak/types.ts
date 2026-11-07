export type StreakDayState = "done" | "frozen" | "today" | "missed" | "future";

export type StreakDay = { day: number; state: StreakDayState };

/** Contrato esperado de GET /api/me/streak/?month= */
export type StreakMonth = {
  /** 1 = janeiro. */
  month: number;
  year: number;
  /** Dia da semana do dia 1 (1 = segunda … 7 = domingo). */
  firstWeekday: number;
  days: StreakDay[];
  currentStreak: number;
  bestStreak: number;
  freezesAvailable: number;
  freezePriceGems: number;
  todayDone: boolean;
  goalXp: number;
  goalDescription: string;
};
