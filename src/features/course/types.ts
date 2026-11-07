import type { Asset3DName } from "../../lib/assets3d";

/** Contrato esperado de GET /api/courses/<id>/ */
export type Course = {
  id: string;
  name: string;
  author: { name: string; role: string; verified: boolean };
  publishedAt: string;
  hero: {
    asset: Asset3DName;
    title: string;
    summary: string;
    minutes: number;
    quizXp: number;
    likes: number;
    comments: number;
    href: string;
  };
  modules: Array<{ id: string; title: string; summary: string; minutes: number; asset: Asset3DName; href: string }>;
  myCourses: Array<{ id: string; name: string; active?: boolean }>;
  suggestedAuthors: Array<{ id: string; name: string; subject: string }>;
};
