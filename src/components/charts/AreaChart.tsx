import { useId } from "react";

export type SeriesPoint = { label: string; value: number };

type AreaChartProps = {
  points: SeriesPoint[];
  /** Linha tracejada de limite (ex.: teto de 5 MB/h). */
  threshold?: { value: number; label: string };
  unit: string;
  /** Descrição para leitor de ecrã; a tabela equivalente fica escondida abaixo. */
  label: string;
  height?: number;
};

const W = 1000;

/**
 * Gráfico de área desenhado a partir dos dados (sem biblioteca: 0 KB de bundle).
 * Os mesmos dados aparecem numa tabela só para leitores de ecrã — o gráfico não é a única via.
 */
export function AreaChart({ points, threshold, unit, label, height = 260 }: AreaChartProps) {
  const gradientId = useId();
  const dataMax = Math.max(...points.map((p) => p.value));
  // Se o teto for muito acima do consumo real, a curva ficaria esmagada: mostramo-lo como nota.
  const thresholdInScale = threshold !== undefined && threshold.value <= dataMax * 2;
  const max = (thresholdInScale ? Math.max(threshold.value, dataMax) : dataMax) * 1.25 || 1;
  const H = 220;
  const x = (i: number) => (points.length === 1 ? W / 2 : (i / (points.length - 1)) * (W - 80) + 40);
  const y = (v: number) => H - (v / max) * (H - 20);

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(points.length - 1).toFixed(1)},${H} L ${x(0).toFixed(1)},${H} Z`;
  const peak = points.reduce((a, b) => (b.value > a.value ? b : a), points[0]);
  const peakIndex = points.indexOf(peak);

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H + 40}`}
        role="img"
        aria-label={label}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-ocean)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-brand-ocean)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--color-border-cloud)" strokeWidth="1" />
        ))}

        {threshold && thresholdInScale && (
          <>
            <line
              x1="0"
              x2={W}
              y1={y(threshold.value)}
              y2={y(threshold.value)}
              stroke="var(--color-feedback-error-ink)"
              strokeWidth="2"
              strokeDasharray="8 5"
            />
            <text x="8" y={y(threshold.value) - 8} className="fill-feedback-error-ink text-[13px] font-bold">
              {threshold.label}
            </text>
          </>
        )}

        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="var(--color-brand-ocean)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={x(peakIndex)} cy={y(peak.value)} r="6" fill="var(--color-brand-ocean)" />
        <circle cx={x(peakIndex)} cy={y(peak.value)} r="2.5" fill="#fff" />

        {points.map((p, i) =>
          i % Math.ceil(points.length / 6) === 0 || i === points.length - 1 ? (
            <text key={p.label} x={x(i)} y={H + 28} textAnchor="middle" className="fill-text-tertiary text-[13px]">
              {p.label}
            </text>
          ) : null,
        )}
      </svg>

      {threshold && !thresholdInScale && (
        <p className="mt-1 text-caption text-text-secondary">
          O teto de {threshold.label.replace("Teto ", "")} fica fora da escala: o consumo real não passa de {dataMax}{" "}
          {unit}.
        </p>
      )}

      <figcaption className="sr-only">
        <table>
          <caption>{label}</caption>
          <thead>
            <tr>
              <th scope="col">Hora</th>
              <th scope="col">Consumo ({unit})</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.label}>
                <th scope="row">{p.label}</th>
                <td>{p.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
