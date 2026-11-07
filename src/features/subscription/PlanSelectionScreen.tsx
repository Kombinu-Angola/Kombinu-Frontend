import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { PlanId, SubscriptionPlan } from "./types";

type PlanSelectionScreenProps = {
  plans: SubscriptionPlan[];
  currentPlan: PlanId;
  creatorName: string;
  onChoose: (plan: PlanId) => void;
};

/** FIN-01 — escolha de plano. O plano atual aparece marcado, sem CTA a repetir o que já tens. */
export default function PlanSelectionScreen({ plans, currentPlan, creatorName, onChoose }: PlanSelectionScreenProps) {
  return (
    <CreatorShell active="definicoes" creatorName={creatorName}>
      <div className="mx-auto max-w-[1000px] px-4 py-8 md:px-6 lg:py-12">
        <header className="mb-10 text-center">
          <p className="text-overline text-primary uppercase">Planos e subscrições</p>
          <h1 className="mt-2 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            Escolhe como queres usar a Kombinu
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-body-lg text-pretty text-text-secondary">
            Podes trocar de plano quando quiseres, no painel financeiro. O que já compraste continua teu.
          </p>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const featured = Boolean(plan.recommended);
            return (
              <section
                key={plan.id}
                aria-labelledby={`plan-${plan.id}`}
                className={cn(
                  "relative flex flex-col justify-between rounded-3xl border-2 bg-surface-canvas p-6 sm:p-8",
                  featured ? "border-brand-ocean shadow-clay" : "border-border-cloud",
                )}
              >
                {plan.recommended && (
                  <p className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-secondary-container px-4 py-1 text-overline text-surface-ink uppercase">
                    {plan.recommended}
                  </p>
                )}

                <div>
                  <p className={cn("text-overline uppercase", featured ? "text-primary" : "text-text-tertiary")}>
                    {plan.eyebrow}
                  </p>
                  <h2
                    id={`plan-${plan.id}`}
                    className={cn("mt-1 font-montserrat text-headline-h2", featured ? "text-primary" : "text-on-surface")}
                  >
                    {plan.name}
                  </h2>

                  <p className="mt-6 flex items-baseline gap-2">
                    <span
                      className={cn(
                        "font-montserrat text-display-l font-extrabold tabular-nums",
                        featured ? "text-primary" : "text-on-surface",
                      )}
                    >
                      {plan.priceKz === 0 ? "0 Kz" : formatKz(plan.priceKz)}
                    </span>
                    {plan.priceKz > 0 && <span className="text-body-md text-text-secondary">/mês</span>}
                  </p>
                  <p className="mt-1 text-caption text-text-secondary">{plan.note}</p>

                  <ul className="mt-8 flex flex-col gap-4">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-3 text-body-md">
                        <Icon
                          name={f.included ? "check" : "x"}
                          size={20}
                          strokeWidth={2.5}
                          className={cn("mt-0.5 shrink-0", f.included ? "text-feedback-success-ink" : "text-text-tertiary")}
                        />
                        <span
                          className={cn(
                            f.highlight && "font-bold text-feedback-success-ink",
                            !f.highlight && (f.included ? "text-text-secondary" : "text-text-tertiary"),
                          )}
                        >
                          {f.text}
                          {!f.included && <span className="sr-only"> (não incluído)</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  {isCurrent ? (
                    <p className="flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-border-cloud bg-surface-soft text-button text-text-secondary uppercase">
                      <Icon name="check" size={18} strokeWidth={3} className="text-feedback-success-ink" />
                      O teu plano atual
                    </p>
                  ) : (
                    <Button3D
                      variant={featured ? "primary" : "secondary"}
                      size={featured ? "lg" : "md"}
                      fullWidth
                      onClick={() => onChoose(plan.id)}
                      trailingIcon={featured ? <Icon name="arrow-right" size={20} /> : undefined}
                    >
                      {plan.cta}
                    </Button3D>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mx-auto mt-10 flex max-w-2xl items-start justify-center gap-3 border-t-2 border-border-cloud pt-6 text-caption text-text-secondary">
          <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-primary" />
          O pagamento é processado pela rede Multicaixa Express (EMIS). O teu PIN é introduzido no telemóvel e nunca
          passa pela Kombinu. Podes cancelar quando quiseres.
        </p>
      </div>
    </CreatorShell>
  );
}
