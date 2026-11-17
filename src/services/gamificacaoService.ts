import { api } from "./api";

export interface GamificacaoMe {
  /** XP da carteira global do utilizador (todos os espaços). */
  xpTotal: number;
  /** XP do workspace activo; no marketplace, o XP sem organização. */
  xpEspaco: number;
  nivel: number;
  /** Sequência actual de dias com XP. Sem gemas: o backend não as tem. */
  ofensiva: number;
  melhorOfensiva: number;
  /** `YYYY-MM-DD` do último XP, ou `null`. */
  ultimaActividade: string | null;
}

function numero(valor: unknown): number {
  const n = typeof valor === "number" ? valor : Number(valor);
  return Number.isFinite(n) ? n : 0;
}

export const gamificacaoService = {
  /** `GET /rankings/me/`: `X-Workspace` segue no interceptor, por isso `xpEspaco` é do espaço activo. */
  async me(): Promise<GamificacaoMe> {
    const { data } = await api.get("/rankings/me/");
    return {
      xpTotal: numero(data?.xp_total),
      xpEspaco: numero(data?.xp_workspace),
      nivel: Math.max(1, numero(data?.level)),
      ofensiva: numero(data?.streak),
      melhorOfensiva: numero(data?.best_streak),
      ultimaActividade: typeof data?.last_activity_date === "string" ? data.last_activity_date : null,
    };
  },
};
