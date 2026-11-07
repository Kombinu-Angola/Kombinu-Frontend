import { cn } from "@/lib/utils";

type SwitchProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Esconde o rótulo visualmente (quando o texto já está ao lado), mantendo-o para leitores de ecrã. */
  hideLabel?: boolean;
  describedBy?: string;
  tone?: "ocean" | "error";
};

/** Interruptor acessível: checkbox nativa com role="switch" (teclado e leitor de ecrã incluídos). */
export function Switch({ id, checked, onChange, label, hideLabel, describedBy, tone = "ocean" }: SwitchProps) {
  return (
    <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer items-center gap-3">
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-[background-color] duration-150",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-sky-ink",
          "after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-[translate] after:duration-150",
          checked ? (tone === "error" ? "bg-feedback-error-ink" : "bg-brand-ocean") : "bg-border-cloud-strong",
          checked && "after:translate-x-5",
        )}
      />
      <span className={cn("text-body-md text-on-surface", hideLabel && "sr-only")}>{label}</span>
    </label>
  );
}
