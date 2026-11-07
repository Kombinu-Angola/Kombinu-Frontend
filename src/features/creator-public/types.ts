import type { Asset3DName } from "../../lib/assets3d";

export type CreatorTab = "sebentas" | "quizzes" | "metodologia" | "comentarios";

export type CreatorMaterial = {
  id: string;
  title: string;
  subject: string;
  cover: Asset3DName;
  priceKz: number;
  rating: number;
  students: number;
  href: string;
};

export type CreatorReview = { id: string; student: string; course: string; rating: number; text: string; at: string };

/** Contrato esperado de GET /api/creators/<handle>/ */
export type CreatorPublicProfile = {
  name: string;
  handle: string;
  university: string;
  faculty: string;
  bio: string;
  verified: boolean;
  plan: "pro" | "free";
  stats: { students: number; rating: number; reviews: number; materials: number; passRate: number };
  methodology: string[];
  materials: CreatorMaterial[];
  quizzes: number;
  reviewList: CreatorReview[];
  subscriptionKz: number;
};
