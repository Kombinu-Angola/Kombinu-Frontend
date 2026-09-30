import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type OtpInputProps = {
  id: string;
  length?: number;
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

/**
 * Código SMS em caixas separadas. Aceita colar o código inteiro, avança e recua
 * com as setas e o backspace, e o primeiro campo aceita o preenchimento automático do SMS.
 */
export function OtpInput({ id, length = 6, value, onChange, onComplete, invalid, describedBy }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  function setDigit(index: number, digit: string) {
    const next = digits.map((d, i) => (i === index ? digit || " " : d)).join("").trimEnd();
    onChange(next.replace(/\s/g, ""));
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
    const complete = next.replace(/\s/g, "");
    if (complete.length === length) onComplete?.(complete);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === "Backspace" && !digits[index].trim() && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
    if (pasted.length === length) onComplete?.(pasted);
  }

  return (
    <div role="group" aria-label={`Código de ${length} dígitos`} aria-describedby={describedBy} className="flex justify-between gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          id={i === 0 ? id : `${id}-${i}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Dígito ${i + 1} de ${length}`}
          aria-invalid={invalid || undefined}
          value={digit.trim()}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => onKeyDown(e, i)}
          onPaste={onPaste}
          className={cn(
            "size-12 rounded-xl border-2 bg-surface-canvas text-center font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums",
            "transition-[border-color,background-color] duration-150",
            invalid ? "border-feedback-error-ink bg-feedback-error-soft" : "border-border-input focus-visible:border-brand-sky-ink",
            digit.trim() && !invalid && "border-brand-ocean bg-surface-sky",
          )}
        />
      ))}
    </div>
  );
}
