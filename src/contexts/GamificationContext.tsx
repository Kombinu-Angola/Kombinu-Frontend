import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type GamificationState = {
  xp: number;
  streakDays: number;
  gems: number;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
};

const GamificationContext = createContext<GamificationState | null>(null);

type ProviderProps = {
  children: ReactNode;
  /** Em produção, hidrate com os valores do utilizador vindos da API. */
  initialXp?: number;
  initialStreak?: number;
  initialGems?: number;
};

/**
 * Estado de gamificação partilhado entre ecrãs (atualizações pouco frequentes → Context chega).
 * Quando ligar ao back-end, sincronize `addXp`/`addGems` com a API e mantenha a atualização otimista.
 */
export function GamificationProvider({ children, initialXp = 0, initialStreak = 0, initialGems = 0 }: ProviderProps) {
  const [xp, setXp] = useState(initialXp);
  const [streakDays] = useState(initialStreak);
  const [gems, setGems] = useState(initialGems);

  const addXp = useCallback((amount: number) => setXp((prev) => Math.max(0, prev + amount)), []);
  const addGems = useCallback((amount: number) => setGems((prev) => Math.max(0, prev + amount)), []);
  const value = useMemo(() => ({ xp, streakDays, gems, addXp, addGems }), [xp, streakDays, gems, addXp, addGems]);

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification(): GamificationState {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification tem de ser usado dentro de <GamificationProvider>.");
  return ctx;
}
