export type TrailNodeStatus = "concluido" | "ativo" | "bloqueado";

export type TrailNode = {
  id: string;
  order: number;
  title: string;
  summary: string;
  minutes: number;
  xp: number;
  status: TrailNodeStatus;
  /** Estrelas obtidas em 3, apenas nos módulos concluídos. */
  stars?: number;
  href: string;
};

export type LearningTrail = {
  subject: string;
  headline: string;
  year: string;
  semester: string;
  nodes: TrailNode[];
  finalExam: { title: string; minutes: number; xp: number; href: string };
};

export type AdaptiveStepKind = "reforco" | "simulado" | "checkpoint";

export type AdaptiveStep = {
  id: string;
  kind: AdaptiveStepKind;
  title: string;
  summary: string;
  minutes: number;
  /** XP antes do multiplicador da trilha. */
  baseXp: number;
  dataMb: number;
  failureRate?: number;
  badge?: string;
  status: "disponivel" | "bloqueado" | "concluido";
  href: string;
};

export type AdaptiveTrail = {
  subject: string;
  course: string;
  university: string;
  initialAccuracy: number;
  multiplier: number;
  gaps: string[];
  strengths: string[];
  steps: AdaptiveStep[];
};
