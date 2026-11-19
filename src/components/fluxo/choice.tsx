import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "./motion";
import { CheckIcon } from "./icons";

/**
 * Cartões de escolha única. Usa rádios nativos (setas do teclado e leitores de ecrã sem trabalho extra)
 * com aspecto de cartão.
 */
export type RadioOption<T extends string> = {
  value: T;
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
};

type RadioCardGroupProps<T extends string> = {
  legend: string;
  hideLegend?: boolean;
  options: RadioOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  columns?: 1 | 2;
  error?: string;
};

export function RadioCardGroup<T extends string>({ legend, hideLegend, options, value, onChange, columns = 1, error }: RadioCardGroupProps<T>) {
  const name = useId();
  const cols = columns === 2 ? "grid-cols-2" : "";
  return (
    <fieldset aria-describedby={error ? `${name}-err` : undefined}>
      <legend className={hideLegend ? "sr-only" : "mb-3 text-[0.8rem] font-bold tracking-[0.06em] uppercase"}>{legend}</legend>
      <div className={`grid gap-3 ${cols}`}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl bg-white p-4 ring-inset transition-[background-color] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kombinu-blue ${
                checked ? "bg-kombinu-blue-soft ring-2 ring-kombinu-blue" : "ring-1 ring-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {o.icon && (
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${checked ? "bg-kombinu-blue text-white" : "bg-kombinu-surface text-kombinu-blue"}`}>
                  {o.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 font-display font-bold">
                  {o.title}
                  {o.badge && <span className="rounded-full bg-kombinu-yellow px-2 py-0.5 font-sans text-[0.7rem] font-bold text-kombinu-ink">{o.badge}</span>}
                </span>
                {o.description && <span className="mt-1 block text-sm leading-snug text-neutral-600">{o.description}</span>}
              </span>
              <span
                aria-hidden="true"
                className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${checked ? "bg-kombinu-blue text-white" : "ring-2 ring-neutral-300 ring-inset"}`}
              >
                <motion.span initial={false} animate={{ scale: checked ? 1 : 0.6, opacity: checked ? 1 : 0 }} transition={{ duration: 0.15, ease: EASE_OUT }}>
                  <CheckIcon className="size-3.5" strokeWidth={3} />
                </motion.span>
              </span>
            </label>
          );
        })}
      </div>
      {error && <p id={`${name}-err`} className="mt-2 text-sm font-medium text-kombinu-danger">{error}</p>}
    </fieldset>
  );
}
