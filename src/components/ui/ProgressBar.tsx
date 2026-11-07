import { cn } from "@/lib/utils";

const TONES = {
  ocean: "bg-brand-ocean",
  streak: "bg-feedback-streak",
  gem: "bg-feedback-gem",
  success: "bg-feedback-success",
} as const;

type ProgressBarProps = {
  value: number;
  max?: number;
  /** Nome acessível: "Nível 3 em Macroeconomia". */
  label: string;
  /** Texto falado: "45 de 100 XP". */
  valueText?: string;
  tone?: keyof typeof TONES;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Barra de progresso acessível. O valor deve estar também em texto visível ao lado (não só a cor). */
export function ProgressBar({ value, max = 100, label, valueText, tone = "ocean", size = "md", className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-valuetext={valueText}
      className={cn(
        "w-full overflow-hidden rounded-full bg-border-cloud",
        size === "sm" && "h-2",
        size === "md" && "h-3",
        size === "lg" && "h-4",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out-quint", TONES[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
