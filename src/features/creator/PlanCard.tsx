import { Icon } from "../../components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Plan } from "./constants";
import type { PlanId } from "./types";

const kz = new Intl.NumberFormat("pt-AO");

type PlanCardProps = {
  plan: Plan;
  name: string;
  checked: boolean;
  onSelect: (id: PlanId) => void;
  highlight?: string;
  describedBy?: string;
  invalid?: boolean;
};

/** Cartão de plano = rádio nativo dentro de <label>. Selecionado: contorno de 3px brand-ocean. */
export function PlanCard({ plan, name, checked, onSelect, highlight, describedBy, invalid }: PlanCardProps) {
  const keepPercent = Math.round((1 - plan.commission) * 100);

  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col rounded-2xl border-2 bg-surface-canvas p-5",
        "transition-[translate,border-color,background-color,box-shadow] duration-150 ease-out-quint",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
        checked
          ? "border-brand-ocean bg-surface-sky shadow-[inset_0_0_0_1px_var(--color-brand-ocean)]"
          : "border-border-cloud hover:-translate-y-0.5 hover:border-brand-ocean hover:shadow-elevation-1",
        invalid && !checked && "border-feedback-error-ink",
      )}
    >
      {highlight && (
        <span className="absolute -top-3 right-4 rounded-full bg-secondary-container px-3 py-0.5 text-overline text-surface-ink uppercase">
          {highlight}
        </span>
      )}

      <span className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2.5">
          <input
            type="radio"
            id={`plan-${plan.id}`}
            name={name}
            value={plan.id}
            checked={checked}
            onChange={() => onSelect(plan.id)}
            aria-describedby={describedBy}
            className="size-5 cursor-pointer accent-brand-ocean"
          />
          <span className="text-headline-h3 text-on-surface">{plan.name}</span>
        </span>
        <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-0.5 text-caption font-bold whitespace-nowrap text-text-secondary tabular-nums">
          {plan.monthlyFeeKz === 0 ? "0 Kz" : `${kz.format(plan.monthlyFeeKz)} Kz`}/mês
        </span>
      </span>

      <span className="mb-4 block border-t border-border-cloud pt-3">
        <span className="block text-overline text-text-tertiary uppercase">Recebe por venda</span>
        <span className="mt-0.5 block font-montserrat text-headline-h2 text-on-surface tabular-nums">
          {keepPercent}%
          <span className="ml-1.5 font-lato text-caption font-medium text-text-secondary">
            {plan.commission === 0
              ? "sem comissão da Kombinu"
              : `(a Kombinu retém ${Math.round(plan.commission * 100)}%)`}
          </span>
        </span>
      </span>

      <span className="block space-y-2.5">
        {plan.features.map((f) => (
          <span key={f.text} className="flex items-start gap-2 text-body-md">
            <Icon
              name={f.included ? "check" : "x"}
              size={18}
              strokeWidth={2.5}
              className={cn("mt-0.5 shrink-0", f.included ? "text-feedback-success-ink" : "text-text-tertiary")}
            />
            <span className={f.included ? "text-text-secondary" : "text-text-tertiary"}>
              {f.text}
              {!f.included && <span className="sr-only"> (não incluído)</span>}
            </span>
          </span>
        ))}
      </span>
    </label>
  );
}
