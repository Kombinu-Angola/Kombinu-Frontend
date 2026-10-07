import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/** ids de ajuda/erro para aria-describedby. */
export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;
export function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? hintId(id) : null, error ? errorId(id) : null].filter(Boolean).join(" ") || undefined;
}

export const inputClasses = cn(
  "min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface",
  "placeholder:text-text-tertiary transition-[border-color] duration-150",
  "hover:border-on-surface focus-visible:border-brand-sky-ink",
  "aria-invalid:border-feedback-error-ink",
);

type ShellProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  /** Para grupos (tag input) em que o <label> aponta para o campo de texto. */
  className?: string;
  children: ReactNode;
};

/** Rótulo + ajuda + erro. O erro diz o que aconteceu e como corrigir, numa frase. */
export function FieldShell({ id, label, hint, error, required, className, children }: ShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-body-md font-bold text-on-surface">
        {label}
        {required && (
          <span className="ml-1 text-feedback-error-ink" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId(id)} className="-mt-1 text-caption text-text-tertiary">
          {hint}
        </p>
      )}
      {children}
      <FieldError id={id} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={errorId(id)} className="flex items-start gap-1.5 text-caption font-bold text-feedback-error-ink">
      <Icon name="alert" size={16} className="mt-px shrink-0" />
      {error}
    </p>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
};

export function TextField({ id, label, hint, error, required, className, ...rest }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(inputClasses, className)}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  /** Opção inicial vazia, não selecionável ("Escolhe…"). */
  placeholder?: string;
};

export function SelectField({ id, label, hint, error, required, options, placeholder, className, ...rest }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(inputClasses, "appearance-auto pr-3", className)}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
