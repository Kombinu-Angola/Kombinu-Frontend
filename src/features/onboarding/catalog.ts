import type { IconName } from "../../components/ui/Icon";
import type { ContentFormat, DailyGoal, ReminderSlot } from "./types";

/** Listas fixas por agora; prontas para virem de /api/catalog/. */
export const UNIVERSITIES = [
  { value: "UAN", label: "Universidade Agostinho Neto (UAN)" },
  { value: "UCAN", label: "Universidade Católica de Angola (UCAN)" },
  { value: "ISAF", label: "Instituto Superior de Administração e Finanças (ISAF)" },
  { value: "UGS", label: "Universidade Gregório Semedo (UGS)" },
  { value: "ISPTEC", label: "ISPTEC" },
] as const;

export const COURSES = [
  { value: "contabilidade", label: "Contabilidade e Administração" },
  { value: "direito", label: "Direito" },
  { value: "informatica", label: "Engenharia Informática" },
  { value: "economia", label: "Economia e Gestão de Empresas" },
] as const;

export const YEARS = [
  { value: "1", label: "1.º ano" },
  { value: "2", label: "2.º ano" },
  { value: "3", label: "3.º ano" },
  { value: "4", label: "4.º ano" },
  { value: "5", label: "5.º ano (conclusão)" },
] as const;

export const SUBJECT_SUGGESTIONS = [
  "Macroeconomia I",
  "Microeconomia I",
  "Cálculo Diferencial",
  "Álgebra Linear",
  "Contabilidade Financeira",
  "Direito das Obrigações",
  "Estatística I",
  "Programação I",
];

export const DAILY_GOALS: ReadonlyArray<{ value: DailyGoal; eyebrow: string; title: string; description: string; badge?: string }> = [
  { value: "5", eyebrow: "Casual", title: "5 min por dia", description: "1 resumo rápido" },
  { value: "15", eyebrow: "Regular", title: "15 min por dia", description: "2 resumos e 1 simulado", badge: "Recomendado" },
  { value: "30", eyebrow: "Intensivo", title: "30 min por dia", description: "Preparação para exames" },
];

export const CONTENT_FORMATS: ReadonlyArray<{ value: ContentFormat; label: string; icon: IconName }> = [
  { value: "text", label: "Resumos em texto", icon: "file" },
  { value: "visual", label: "Esquemas e infográficos", icon: "chart" },
  { value: "quizzes", label: "Quizzes práticos", icon: "bolt" },
  { value: "audio", label: "Áudio explicativo (até 1 MB)", icon: "headphones" },
];

export const REMINDER_SLOTS: ReadonlyArray<{ value: ReminderSlot; label: string; time: string }> = [
  { value: "0730", label: "07:30 — antes das aulas", time: "07:30" },
  { value: "1330", label: "13:30 — intervalo do almoço", time: "13:30" },
  { value: "2000", label: "20:00 — depois das aulas", time: "20:00" },
  { value: "2200", label: "22:00 — revisão antes de dormir", time: "22:00" },
];
