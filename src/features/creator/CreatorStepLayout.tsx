import type { ReactNode } from "react";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { Button3D } from "../../components/ui/Button3D";
import { DataSaverBadge } from "../../components/ui/DataSaverBadge";
import { Icon } from "../../components/ui/Icon";
import { Pill } from "../../components/ui/Pill";
import { Stepper } from "../../components/ui/Stepper";
import { CREATOR_STEPS } from "./constants";

type CreatorStepLayoutProps = {
  step: number;
  onBack: () => void;
  backLabel: string;
  eyebrow: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
};

/** Moldura comum aos três passos: voltar, indicador de passos, selo de confiança e título. */
export function CreatorStepLayout({ step, onBack, backLabel, eyebrow, title, lead, children }: CreatorStepLayoutProps) {
  // Cada passo é um "ecrã": o foco vai para o título e a página volta ao topo.
  const headingRef = useFocusOnMount();

  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-background px-4 py-6 sm:px-6 sm:py-10">
      <main
        id="conteudo"
        className="w-full max-w-[780px] rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-10"
      >
        <header className="mb-8 flex items-center gap-4 border-b border-border-cloud pb-6">
          <button
            type="button"
            onClick={onBack}
            aria-label={backLabel}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border-cloud bg-surface-canvas text-text-secondary transition-[color,background-color] duration-150 hover:bg-surface-soft hover:text-primary"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <Stepper steps={CREATOR_STEPS} current={step} label="Etapas do credenciamento" />
        </header>

        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Pill tone="sunbeam">{eyebrow}</Pill>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase">
              <Icon name="shield" size={14} />
              Auditoria oficial
            </span>
          </div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mb-3 font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
          >
            {title}
          </h1>
          <div className="max-w-[680px] text-body-lg text-pretty text-text-secondary">{lead}</div>
        </div>

        {children}
      </main>
      <DataSaverBadge megabytesToday={1.2} />
    </div>
  );
}

type StepFooterProps = {
  note: ReactNode;
  submitLabel: string;
  busyLabel?: string;
  busy?: boolean;
  error?: string;
};

export function StepFooter({ note, submitLabel, busyLabel, busy, error }: StepFooterProps) {
  return (
    <footer className="mt-8 border-t border-border-cloud pt-6">
      {error && (
        <p role="alert" className="mb-4 flex items-start gap-2 text-body-md font-bold text-feedback-error-ink">
          <Icon name="alert" size={20} className="shrink-0" />
          {error}
        </p>
      )}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex items-start gap-2 text-caption text-text-tertiary">
          <Icon name="shield" size={16} className="mt-px shrink-0 text-primary" />
          <span>{note}</span>
        </p>
        <Button3D
          type="submit"
          size="lg"
          aria-disabled={busy || undefined}
          className="w-full shrink-0 sm:w-auto"
          trailingIcon={busy ? undefined : <Icon name="arrow-right" size={20} />}
        >
          <span aria-live="polite">{busy ? busyLabel : submitLabel}</span>
        </Button3D>
      </div>
    </footer>
  );
}
