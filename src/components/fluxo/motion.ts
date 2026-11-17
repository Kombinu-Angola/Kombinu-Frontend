/**
 * Tokens de movimento: uma só família (ease-out forte) para todo o fluxo.
 * Valores retirados das tabelas do animate (não aproximar).
 */
import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const DUR = { press: 0.12, fast: 0.15, base: 0.22, sheet: 0.4 } as const;

export const base: Transition = { duration: DUR.base, ease: EASE_OUT };

/** Troca de ecrã do fluxo: o novo ecrã é o único "lead". */
export const page: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: base },
  exit: { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } },
};

/** Passos com direção: avançar entra pela direita, voltar entra pela esquerda. */
export const step: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  enter: { opacity: 1, x: 0, transition: base },
  exit: (dir: number) => ({ opacity: 0, x: dir * -28, transition: { duration: DUR.fast, ease: EASE_OUT } }),
};

export const fade: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: DUR.fast, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } },
};
