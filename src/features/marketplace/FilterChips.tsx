import { cn } from "@/lib/utils";

type FilterChipsProps<T extends string> = {
  label: string;
  options: ReadonlyArray<{ value: T | "all"; label: string }>;
  value: T | "all";
  onChange: (value: T | "all") => void;
};

/**
 * Grupo de filtros de escolha única como botões com aria-pressed.
 * Rola na horizontal no telemóvel sem esconder o rótulo do grupo.
 */
export function FilterChips<T extends string>({ label, options, value, onChange }: FilterChipsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <span className="shrink-0 text-overline text-text-tertiary uppercase" aria-hidden="true">
        {label}
      </span>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color,translate,box-shadow] duration-150",
              active
                ? "border-brand-ocean bg-brand-ocean text-white shadow-3d-primary active:translate-y-1 active:shadow-none"
                : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
