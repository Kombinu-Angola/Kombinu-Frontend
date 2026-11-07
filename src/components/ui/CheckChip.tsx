import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

type CheckChipProps = {
  id?: string;
  name: string;
  value: string;
  label: string;
  icon: IconName;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
  describedBy?: string;
};

/** Chip de escolha múltipla (checkbox nativa). Marcado: borda, fundo e ✓ — nunca só cor. */
export function CheckChip({ id, name, value, label, icon, checked, onChange, describedBy }: CheckChipProps) {
  return (
    <label
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-body-md select-none",
        "transition-[border-color,background-color,color] duration-150",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
        checked
          ? "border-brand-ocean bg-surface-sky font-bold text-primary"
          : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
      )}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <Icon name={icon} size={18} />
      <span>{label}</span>
      <span aria-hidden="true" className={cn("flex size-5 items-center justify-center", !checked && "opacity-0")}>
        <Icon name="check" size={16} strokeWidth={3} />
      </span>
    </label>
  );
}
