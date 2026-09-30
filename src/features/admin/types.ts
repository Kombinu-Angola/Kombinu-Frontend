export type Trend = { value: number; label: string };

export type Kpi = {
  id: string;
  label: string;
  value: string;
  trend?: Trend;
  note?: string;
  progress?: { value: number; max: number };
};

export type CampusRow = {
  id: string;
  short: string;
  name: string;
  campus: string;
  district: string;
  students: number;
  topSubjects: string[];
  retention: number;
  gmvKz: number;
  status: "ativo" | "crescimento" | "pausado";
};

export type StudentRow = {
  id: string;
  name: string;
  handle: string;
  university: string;
  course: string;
  phone: string;
  xp: number;
  plan: "pro" | "free";
  joinedAt: string;
  verified: boolean;
  status: "ativo" | "suspenso";
  detail: {
    streakDays: number;
    bestStreak: number;
    quizzes: number;
    accuracy: number;
    gems: number;
    league: string;
    purchases: Array<{ id: string; title: string; at: string; amountKz: number }>;
  };
};

export type Submission = {
  id: string;
  title: string;
  author: string;
  authorPlan: string;
  university: string;
  faculty: string;
  submittedHoursAgo: number;
  sizeKb: number;
  pages: number;
  queueLength: number;
  excerpt: string;
  quiz: { question: string; options: string[]; correctIndex: number };
  criteria: Array<{ id: string; title: string; detail: string; prechecked: boolean }>;
};

export type Transaction = {
  id: string;
  at: string;
  phone: string;
  item: string;
  grossKz: number;
  /** null quando a receita é 100% da Kombinu (subscrições). */
  creatorNetKz: number | null;
  status: "sucesso" | "pendente" | "falhou";
};

export type Payout = {
  id: string;
  creator: string;
  phone: string;
  amountKz: number;
  requestedAt: string;
  materials: number;
};

export type LeagueSettings = {
  season: string;
  promotionPct: number;
  relegationPct: number;
  xpMultiplier: number;
  weekendBoost: boolean;
};

export type FlashChallengeDraft = {
  startsAt: string;
  question: string;
  correct: string;
  distractors: [string, string];
  reward: string;
};
