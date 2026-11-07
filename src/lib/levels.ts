/** Regra única de níveis (onboarding, painel, ligas). 100 XP por nível — igual à fórmula do backend (total_points // 100) + 1. */
export const XP_PER_LEVEL = 100;

const TITLES = ["Caloiro", "Aprendiz", "Explorador", "Estudioso", "Mestre", "Doutor"];

export function levelInfo(xp: number) {
  const safe = Math.max(0, xp);
  const level = Math.floor(safe / XP_PER_LEVEL) + 1;
  const inLevel = safe % XP_PER_LEVEL;
  return {
    level,
    inLevel,
    perLevel: XP_PER_LEVEL,
    toNext: XP_PER_LEVEL - inLevel,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
  };
}
