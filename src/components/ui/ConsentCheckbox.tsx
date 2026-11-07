import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { describedBy, FieldError } from "./Field";

type ConsentCheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  error?: string;
};

/** Declaração com checkbox nativa (24px, cor da marca) e texto completo como rótulo. */
export function ConsentCheckbox({ id, checked, onChange, title, children, error }: ConsentCheckboxProps) {
  const bodyId = `${id}-body`;
  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-5 sm:p-6 transition-[border-color] duration-150",
        error ? "border-feedback-error-ink bg-surface-canvas" : "border-primary-fixed bg-surface-sky",
      )}
    >
      <div className="flex items-start gap-3.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[bodyId, describedBy(id, undefined, error)].filter(Boolean).join(" ")}
          className="mt-0.5 size-6 shrink-0 cursor-pointer accent-brand-ocean"
        />
        <div>
          <label htmlFor={id} className="block cursor-pointer text-body-md font-bold text-on-surface">
            {title}
          </label>
          <p id={bodyId} className="mt-1 text-body-md text-text-secondary">
            {children}
          </p>
        </div>
      </div>
      {error && (
        <div className="mt-3 pl-[38px]">
          <FieldError id={id} error={error} />
        </div>
      )}
    </div>
  );
}
