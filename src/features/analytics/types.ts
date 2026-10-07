export type FunnelStep = { id: string; order: number; title: string; readers: number; avgMinutes: number };

export type QuestionAudit = {
  id: string;
  order: number;
  prompt: string;
  anchor: string;
  answers: number;
  accuracy: number;
  topDistractor: { text: string; share: number };
};

/** Contrato esperado de GET /api/creators/materials/<id>/analytics/ */
export type MaterialAnalytics = {
  materialId: string;
  title: string;
  subject: string;
  university: string;
  buyers: { total: number; marketplace: number; directLink: number };
  rating: number;
  reviews: number;
  facultyAverageCompletion: number;
  funnel: FunnelStep[];
  questions: QuestionAudit[];
};
