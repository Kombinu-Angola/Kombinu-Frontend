export type SearchKind = "sebenta" | "simulado" | "explicador" | "cadeira";

export type SearchHit = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  university: string;
  year?: string;
  /** 0 = gratuito; ausente nos tipos sem preço. */
  priceKz?: number;
  rating?: number;
  reviews?: number;
  sizeKb?: number;
  minutes?: number;
  xp?: number;
  attempts?: number;
  verified?: boolean;
  href: string;
};

export type CurriculumMatch = {
  subject: string;
  university: string;
  faculty: string;
  year: string;
  semester: string;
  materials: number;
  students: number;
  href: string;
};

/** Contrato esperado de GET /api/search/?q= */
export type SearchResults = { query: string; best?: CurriculumMatch; hits: SearchHit[] };
