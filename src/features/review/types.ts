/** Níveis de fixação: cada acerto empurra a pergunta para o intervalo seguinte. */
export const REVIEW_INTERVALS = [1, 3, 7, 30] as const;

export type ReviewBucket = "hoje" | "3dias" | "7dias" | "dominadas";

export type ReviewItem = {
  id: string;
  subject: string;
  university: string;
  topic: string;
  question: string;
  chosenAnswer: string;
  correctAnswer: string;
  rationale: string;
  attempts: number;
  lastMissedDaysAgo: number;
  /** 1 a 4. */
  level: number;
  bucket: ReviewBucket;
  xp: number;
};

export type ReviewQueue = {
  multiplier: number;
  sessionMinutes: number;
  items: ReviewItem[];
  masteredCount: number;
};
