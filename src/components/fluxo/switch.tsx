import { useId, type ReactNode } from "react";

/** Interruptor com rótulo e descrição (checkbox nativo com `role="switch"`). */
export function Switch({ label, description, icon, checked, onChange }: { label: string; description?: string; icon?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kombinu-blue">
      {icon && <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-kombinu-surface text-kombinu-blue">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-display font-bold">{label}</span>
        {description && <span className="block text-sm leading-snug text-neutral-600">{description}</span>}
      </span>
      <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-neutral-300 transition-colors duration-150 peer-checked:bg-kombinu-blue">
        <span className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-sm transition-transform duration-150 ${checked ? "translate-x-5" : ""}`} />
      </span>
    </label>
  );
}
