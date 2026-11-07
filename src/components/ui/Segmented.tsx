import { cn } from "@/lib/utils";

type SegmentedProps<T extends string> = {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** Controlo segmentado (períodos, separadores de relatório). Botões com aria-pressed. */
export function Segmented<T extends string>({ label, options, value, onChange, className }: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex gap-1 rounded-xl border-2 border-border-cloud bg-surface-soft p-1", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-11 rounded-lg px-4 text-button whitespace-nowrap transition-[background-color,color,box-shadow] duration-150",
              active ? "bg-surface-canvas text-primary shadow-elevation-1" : "text-text-secondary hover:text-on-surface",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
