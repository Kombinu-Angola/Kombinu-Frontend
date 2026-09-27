import type { ProgressSegment } from "../../components/ui/SegmentedProgress";

export const ONBOARDING_STEPS: ProgressSegment[] = [
  { id: "affiliation", label: "Universidade e cadeira" },
  { id: "diagnostic", label: "Diagnóstico inicial" },
  { id: "routine", label: "Rotina e lembretes" },
  { id: "activation", label: "Perfil ativo" },
];

/** Recompensas do onboarding (XP). O saldo inicial é o "progresso concedido". */
export const ONBOARDING_XP = { welcome: 50, completion: 50, perLevel: 200 } as const;
