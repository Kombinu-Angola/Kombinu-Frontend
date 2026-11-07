import type { IconName } from "../../components/ui/Icon";

/** Contrato esperado de GET /api/challenges/current/. */
export type Challenge = {
  id: string;
  title: string;
  subject: string;
  endsAt: string;
  prize: { title: string; description: string };
  rules: Array<{ id: string; icon: IconName; title: string; description: string }>;
  participants: number;
  /** O estudante já fez o desafio desta ronda. */
  completed: boolean;
};
