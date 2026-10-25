import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { Kpi } from "./types";

/** Cartão de indicador do backoffice. A variação usa ícone + sinal, não só cor. */
export function KpiCard({ kpi }: { kpi: Kpi }) {
  const trendDown = kpi.trend && kpi.trend.value < 0;
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
      <p className="text-overline text-text-tertiary uppercase">{kpi.label}</p>
      <p className="flex flex-wrap items-baseline gap-2">
        <span className="font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums">{kpi.value}</span>
        {kpi.trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-caption font-bold tabular-nums",
              trendDown ? "bg-feedback-error-soft text-feedback-error-ink" : "bg-feedback-success-soft text-feedback-success-ink",
            )}
          >
            <Icon name={trendDown ? "trend-down" : "trend-up"} size={14} />
            <span className="sr-only">{trendDown ? "desceu " : "subiu "}</span>
            {trendDown ? "" : "+"}{kpi.trend.value}% {kpi.trend.label}
          </span>
        )}
      </p>
      {kpi.note && <p className="text-caption text-text-secondary">{kpi.note}</p>}
      {kpi.progress && (
        <ProgressBar
          value={kpi.progress.value}
          max={kpi.progress.max}
          size="sm"
          label={kpi.label}
          valueText={`${kpi.value} de ${kpi.progress.max}`}
        />
      )}
    </div>
  );
}
