import type { ReactNode } from "react";
import { DataSaverBadge } from "../../components/ui/DataSaverBadge";
import { Icon } from "../../components/ui/Icon";
import { SegmentedProgress } from "../../components/ui/SegmentedProgress";
import { XpBadge } from "../../components/ui/XpBadge";
import { useGamification } from "../../contexts/GamificationContext";
import { ONBOARDING_STEPS } from "./steps";

type OnboardingShellProps = {
  stepIndex: number;
  onBack?: () => void;
  backLabel?: string;
  /** Substitui o selo de XP no canto (ex.: resultado do diagnóstico). */
  aside?: ReactNode;
  children: ReactNode;
};

/** Moldura dos quatro passos do onboarding do estudante: voltar, progresso, XP e selo de dados. */
export function OnboardingShell({ stepIndex, onBack, backLabel = "Voltar ao passo anterior", aside, children }: OnboardingShellProps) {
  const { xp } = useGamification();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-6 sm:px-6 sm:py-8">
      <main
        id="conteudo"
        className="relative w-full max-w-[740px] overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-10"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-cloud pb-6">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              className="flex size-11 items-center justify-center rounded-full border-2 border-border-cloud bg-surface-canvas text-text-secondary transition-[color,background-color] duration-150 hover:bg-surface-soft hover:text-brand-ocean"
            >
              <Icon name="arrow-left" size={20} />
            </button>
          ) : (
            <span className="size-11" aria-hidden="true" />
          )}

          <SegmentedProgress
            segments={ONBOARDING_STEPS}
            activeIndex={stepIndex}
            complete={stepIndex === ONBOARDING_STEPS.length - 1}
            label="Progresso do onboarding"
            className="order-last w-full sm:order-none sm:w-auto sm:max-w-[360px] sm:flex-1"
          />

          {aside ?? <XpBadge xp={xp} />}
        </header>
        {children}
      </main>
      <DataSaverBadge megabytesToday={1.2} />
    </div>
  );
}
