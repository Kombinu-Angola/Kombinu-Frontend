import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type StepperProps = {
  steps: ReadonlyArray<{ id: string; label: string }>;
  /** Índice (base 0) do passo atual. */
  current: number;
  label: string;
  className?: string;
};

/**
 * Indicador de passos numerado. Lista ordenada com aria-current="step";
 * no telemóvel só o passo atual mostra o nome.
 */
export function Stepper({ steps, current, label, className }: StepperProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn("h-0.5 w-5 rounded-full sm:w-8", i <= current ? "bg-brand-ocean" : "bg-border-cloud")}
                />
              )}
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-caption font-bold tabular-nums",
                    done && "bg-brand-ocean text-white",
                    active && "bg-brand-ocean text-white ring-4 ring-primary-fixed",
                    !done && !active && "border-2 border-border-input bg-surface-canvas text-text-tertiary",
                  )}
                >
                  {done ? <Icon name="check" size={16} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-caption font-bold",
                    active ? "text-primary" : "sr-only md:not-sr-only",
                    done && "text-primary",
                    !done && !active && "text-text-tertiary",
                  )}
                >
                  {step.label}
                  <span className="sr-only">
                    {done ? " (concluído)" : active ? " (passo atual)" : " (por fazer)"}
                  </span>
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
