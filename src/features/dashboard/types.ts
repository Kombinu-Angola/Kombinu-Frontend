import type { IconName } from "../../components/ui/Icon";
import type { LeaderEntry } from "../../components/ui/LeaderboardRow";

/** Contrato esperado de GET /api/me/dashboard/ (XP, sequência e gemas vêm do GamificationContext). */
export type DashboardData = {
  user: { name: string; firstName: string; course: string };
  stats: {
    accuracy: number;
    accuracyDelta: number;
    studyMinutesWeek: number;
    lessonsCompleted: number;
  };
  skills: Array<{ id: string; subject: string; xp: number }>;
  activity: Array<{
    id: string;
    kind: "quiz" | "reading";
    title: string;
    at: string;
    score?: number;
    xp: number;
    href: string;
  }>;
  resume: { title: string; module: string; done: number; total: number; href: string };
  missions: Array<{ id: string; title: string; icon: IconName; progress: number; goal: number; gems: number }>;
  league: { name: string; href: string; rows: LeaderEntry[] };
};
