import type { PlanId } from "./types";

export const CREATOR_STEPS = [
  { id: "data", label: "Dados e vínculo" },
  { id: "documents", label: "Comprovativo e amostra" },
  { id: "payouts", label: "Monetização" },
] as const;

export const INSTITUTIONS = [
  { value: "UAN", label: "Universidade Agostinho Neto (UAN)" },
  { value: "UCAN", label: "Universidade Católica de Angola (UCAN)" },
  { value: "ULA", label: "Universidade Lusíada de Angola" },
  { value: "ISPTEC", label: "ISPTEC" },
  { value: "other", label: "Outra instituição de ensino superior" },
] as const;

export const AFFILIATIONS = [
  { value: "finalist", label: "Estudante de honra ou finalista" },
  { value: "lecturer", label: "Docente ou monitor universitário" },
  { value: "tutor", label: "Explicador independente" },
] as const;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export type Plan = {
  id: PlanId;
  name: string;
  monthlyFeeKz: number;
  /** Fração retida pela Kombinu em cada venda. */
  commission: number;
  features: Array<{ text: string; included: boolean }>;
};

/** Pronto para vir de /api/creators/plans/. */
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Plano Grátis",
    monthlyFeeKz: 0,
    commission: 0.3,
    features: [
      { text: "Sem mensalidade nem custos fixos", included: true },
      { text: "Até 3 materiais gerados com IA por mês", included: true },
      { text: "Sem destaque nas pesquisas", included: false },
    ],
  },
  {
    id: "pro",
    name: "Criador Pro",
    monthlyFeeKz: 5000,
    commission: 0,
    features: [
      { text: "Materiais gerados com IA sem limite", included: true },
      { text: "Selo Criador Pro verificado no marketplace", included: true },
      { text: "Destaque nas cadeiras da sua faculdade", included: true },
    ],
  },
];
