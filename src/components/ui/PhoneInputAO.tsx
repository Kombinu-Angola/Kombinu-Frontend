import { cn } from "@/lib/utils";
import { describedBy, FieldShell } from "./Field";
import { Icon } from "./Icon";

/** "923000000" → "923 000 000" */
export const formatAOPhone = (digits: string) =>
  digits.replace(/\D/g, "").slice(0, 9).replace(/(\d{3})(?=\d)/g, "$1 ").trim();

/** Telemóveis angolanos: 9 dígitos a começar por 9. */
export const isValidAOPhone = (digits: string) => /^9\d{8}$/.test(digits);

/** "923000302" → "+244 923 ••• 302" (e texto legível para leitor de ecrã). */
export function maskAOPhone(digits: string) {
  return {
    visual: `+244 ${digits.slice(0, 3)} ••• ${digits.slice(6)}`,
    spoken: `número terminado em ${digits.slice(6).split("").join(" ")}`,
  };
}

type PhoneInputAOProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (digits: string) => void;
};

export function PhoneInputAO({ id, label, hint, error, value, onChange }: PhoneInputAOProps) {
  const valid = isValidAOPhone(value);
  const prefixId = `${id}-prefix`;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required>
      <div
        className={cn(
          "flex min-h-12 items-stretch overflow-hidden rounded-xl border-2 bg-surface-canvas transition-[border-color] duration-150",
          "has-[input:focus-visible]:border-brand-sky-ink has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
          error ? "border-feedback-error-ink" : "border-border-input hover:border-on-surface",
        )}
      >
        <span
          id={prefixId}
          className="flex items-center border-r-2 border-border-cloud bg-surface-soft px-3.5 text-body-md font-bold text-on-surface tabular-nums"
        >
          <span aria-hidden="true">+244</span>
          <span className="sr-only">Indicativo de Angola, mais 244</span>
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="923 000 000"
          value={formatAOPhone(value)}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
          aria-invalid={error ? true : undefined}
          aria-describedby={[prefixId, describedBy(id, hint, error)].filter(Boolean).join(" ")}
          className="w-full min-w-0 bg-transparent px-4 text-body-lg font-bold tracking-wider text-on-surface tabular-nums outline-none placeholder:font-medium placeholder:text-text-tertiary"
        />
        {valid && (
          <span className="flex items-center gap-1 pr-3 text-caption font-bold text-feedback-success-ink">
            <Icon name="check" size={18} strokeWidth={2.5} />
            <span className="sr-only sm:not-sr-only">Válido</span>
          </span>
        )}
      </div>
    </FieldShell>
  );
}
