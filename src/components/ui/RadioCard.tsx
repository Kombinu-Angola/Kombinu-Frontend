import { cn } from "@/lib/utils";

type RadioCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  describedBy?: string;
};

/**
 * Cartão de escolha única (rádio nativo). Selecionado: contorno de 3px brand-ocean
 * (2px de borda + 1px interior, sem mexer no layout) e ponto preenchido — não só cor.
 */
export function RadioCard({ name, value, checked, onChange, eyebrow, title, description, badge, describedBy }: RadioCardProps) {
  return (
    <label
      className={cn(
        "group relative flex min-h-24 cursor-pointer flex-col justify-between rounded-2xl border-2 p-4 select-none",
        "transition-[translate,border-color,background-color,box-shadow] duration-150 ease-out-quint",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
        checked
          ? "border-brand-ocean bg-surface-sky shadow-[inset_0_0_0_1px_var(--color-brand-ocean)]"
          : "border-border-cloud bg-surface-canvas hover:-translate-y-0.5 hover:border-brand-ocean hover:shadow-elevation-1",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      {badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-secondary-container px-2.5 py-0.5 text-overline text-surface-ink uppercase">
          {badge}
        </span>
      )}
      <span className="mb-2 flex items-center justify-between">
        <span className={cn("text-overline uppercase", checked ? "text-primary" : "text-text-tertiary")}>{eyebrow}</span>
        <span
          aria-hidden="true"
          className={cn(
            "flex size-5 items-center justify-center rounded-full border-2 transition-[border-color,background-color] duration-150",
            checked ? "border-brand-ocean bg-brand-ocean" : "border-border-input bg-surface-canvas",
          )}
        >
          {checked && <span className="size-2 rounded-full bg-white" />}
        </span>
      </span>
      <span className="block">
        <span className={cn("block font-montserrat text-headline-h3 font-extrabold", checked ? "text-primary" : "text-on-surface")}>
          {title}
        </span>
        <span className="mt-0.5 block text-caption text-text-secondary">{description}</span>
      </span>
    </label>
  );
}

