export type DonutSlice = { label: string; value: number; color: string };

type DonutChartProps = { slices: DonutSlice[]; size?: number; centerLabel: string; centerValue: string };

/** Donut em SVG a partir dos dados (stroke-dasharray). A legenda com os valores fica ao lado. */
export function DonutChart({ slices, size = 150, centerLabel, centerValue }: DonutChartProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const r = 60;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true">
        {slices.map((s) => {
          const length = (s.value / total) * circumference;
          const dash = `${length} ${circumference - length}`;
          const el = (
            <circle
              key={s.label}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="26"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-montserrat text-headline-h2 font-extrabold text-primary tabular-nums">{centerValue}</span>
        <span className="text-overline text-text-tertiary uppercase">{centerLabel}</span>
      </div>
    </div>
  );
}
