import type { IconName } from "../../components/ui/Icon";

export type ProfileTab = "cadeiras" | "sebentas" | "simulados" | "badges";

export type ActivityItem = {
  id: string;
  icon: IconName;
  title: string;
  detail: string;
  at: string;
  score: string;
  xp: number;
  href: string;
};

export type SavedDoc = { id: string; title: string; subject: string; sizeKb: number; offline: boolean; href: string };

export type MockExam = { id: string; title: string; at: string; accuracy: number; minutes: number; href: string };

export type StudentProfile = {
  name: string;
  handle: string;
  university: string;
  course: string;
  year: string;
  bio: string;
  plan: "pro" | "free";
  verified: boolean;
  accuracy: number;
  answered: number;
  league: string;
  counts: { cadeiras: number; sebentas: number; badges: number };
  activity: ActivityItem[];
  saved: SavedDoc[];
  exams: MockExam[];
};

export type BadgeCategory = "streaks" | "quizzes" | "cadeiras" | "comunidade";

export type Badge = {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: IconName;
  /** Data de desbloqueio; ausente = por conquistar. */
  unlockedAt?: string;
  /** Progresso para os bloqueados. */
  progress?: { value: number; goal: number; unit: string };
  proof?: string;
};
