export type MaterialStatus = "publicado" | "rascunho" | "pausado" | "em-moderacao";

export type Visibility = "publico" | "link" | "faculdade";

export type CreatorMaterial = {
  id: string;
  title: string;
  subject: string;
  university: string;
  year: string;
  pages: number;
  quizzes: number;
  sizeKb: number;
  /** 0 = gratuito. */
  priceKz: number;
  visibility: Visibility;
  sales: number;
  rating: number | null;
  reviews: number;
  status: MaterialStatus;
  updatedAt: string;
  studioHref: string;
};
