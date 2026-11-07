import type { StreakDay, StreakMonth } from "./types";

const now = new Date();
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const today = now.getDate();

const days: StreakDay[] = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1;
  if (day > today) return { day, state: "future" };
  if (day === today) return { day, state: "today" };
  if (day === today - 9) return { day, state: "frozen" };
  if (day === today - 15) return { day, state: "missed" };
  return { day, state: "done" };
});

export const MOCK_STREAK: StreakMonth = {
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  // getDay(): 0 = domingo; convertido para 1 = segunda
  firstWeekday: ((new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7) + 1,
  days,
  currentStreak: 14,
  bestStreak: 21,
  freezesAvailable: 2,
  freezePriceGems: 50,
  todayDone: false,
  goalXp: 30,
  goalDescription: "Responde a 3 perguntas da tua cadeira crítica (menos de 50 KB).",
};
