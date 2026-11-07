import { cn } from "@/lib/utils";

export type ProgressSegment = { id: string; label: string };

type SegmentedProgressProps = {
  segments: ProgressSegment[];
  /** Índice (base 0) do segmento ativo. Os anteriores contam como concluídos. */
  activeIndex: number;
  /** Nome acessível, ex.: "Progresso do onboarding". */
  label: string;
  /** Fluxo terminado: todos os segmentos cheios. */
  complete?: boolean;
  className?: string;
};

/**
 * Barra segmentada (onboarding, player de conteúdo). Um único progressbar acessível
 * com aria-valuetext legível; os segmentos visuais ficam escondidos do leitor de ecrã.
 */
export function SegmentedProgress({ segments, activeIndex, label, complete, className }: SegmentedProgressProps) {
  const total = segments.length;
  const current = Math.min(activeIndex + 1, total);
  const active = segments[activeIndex];

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-overline uppercase text-primary tabular-nums">
          Passo {current} de {total}
        </span>
        {active && <span className="truncate text-caption text-text-tertiary">{active.label}</span>}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={complete ? "Todos os passos concluídos" : `Passo ${current} de ${total}${active ? `: ${active.label}` : ""}`}
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {segments.map((segment, i) => (
          <span
            key={segment.id}
            aria-hidden="true"
            title={segment.label}
            className={cn(
              "h-2.5 rounded-full transition-[background-color] duration-150",
              (complete || i < activeIndex) && "bg-brand-ocean",
              !complete && i === activeIndex && "bg-brand-ocean/70",
              i > activeIndex && "bg-border-cloud",
            )}
          />
        ))}
      </div>
    </div>
  );
}
