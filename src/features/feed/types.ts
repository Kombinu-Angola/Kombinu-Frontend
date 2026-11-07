import type { Asset3DName } from "../../lib/assets3d";
import type { LeaderEntry } from "../../components/ui/LeaderboardRow";

export type TrailTab = "aprendizado" | "mista" | "biblioteca";

export type FeedPost = {
  id: string;
  trail: TrailTab;
  author: { name: string; role: string; badge: "verified" | "monitor" };
  publishedAt: string;
  title: string;
  excerpt: string;
  cover: Asset3DName;
  minutes: number;
  hasQuiz: boolean;
  completions: number;
  href: string;
};

/** Contrato esperado de GET /api/feed/ */
export type StudyFeed = {
  active: {
    subject: string;
    university: string;
    title: string;
    summary: string;
    sectionsDone: number;
    sectionsTotal: number;
    xp: number;
    reviewedBy: string;
    href: string;
  };
  posts: FeedPost[];
  totalModules: number;
  student: { name: string; course: string; year: string };
  league: { name: string; campus: string; rows: LeaderEntry[]; href: string };
  exams: { label: string; daysLeft: number };
};
