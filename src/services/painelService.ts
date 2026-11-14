import { api } from "./api";

export interface EstatisticasAprendiz {
  cursosConcluidos: number;
  /** XP ganho no workspace activo. */
  pontos: number;
  /** Nível da carteira global do utilizador. */
  nivel: number;
  simuladosFeitos: number;
}

export interface CursoAprendiz {
  id: string;
  titulo: string;
  progresso: number;
  ultimoAcesso: string;
  miniatura: string;
}

export interface EstatisticasCriador {
  estudantes: number;
  materiais: number;
}

function numero(valor: unknown): number {
  const n = typeof valor === "number" ? valor : Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor : "";
}

export const painelService = {
  /** `GET /dashboard/learner/stats/`: do workspace activo (`X-Workspace` segue no interceptor). */
  async estatisticasAprendiz(): Promise<EstatisticasAprendiz> {
    const { data } = await api.get("/dashboard/learner/stats/");
    return {
      cursosConcluidos: numero(data?.coursesCompleted),
      pontos: numero(data?.totalPoints),
      nivel: Math.max(1, numero(data?.currentLevel)),
      simuladosFeitos: numero(data?.quizzesTaken),
    };
  },

  /** `GET /dashboard/learner/courses/`: conteúdos em que o utilizador já fez simulados. */
  async cursosAprendiz(): Promise<CursoAprendiz[]> {
    const { data } = await api.get("/dashboard/learner/courses/");
    if (!Array.isArray(data)) return [];
    return data.map((c: Record<string, unknown>) => ({
      id: texto(c.id),
      titulo: texto(c.title),
      progresso: Math.min(100, Math.max(0, numero(c.progress))),
      ultimoAcesso: texto(c.lastAccessed),
      miniatura: texto(c.thumbnail),
    }));
  },

  /** `GET /dashboard/creator/stats/`. Avaliação e receita não existem no produto: ficam de fora. */
  async estatisticasCriador(): Promise<EstatisticasCriador> {
    const { data } = await api.get("/dashboard/creator/stats/");
    return { estudantes: numero(data?.totalStudents), materiais: numero(data?.totalCourses) };
  },
};
