import type { FormEvent } from "react";
import { Asset3D } from "../../components/ui/Asset3D";
import { FieldError } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { isValidAOPhone, PhoneInputAO } from "../../components/ui/PhoneInputAO";
import { PLANS } from "./constants";
import { CreatorStepLayout, StepFooter } from "./CreatorStepLayout";
import { EarningsSimulator } from "./EarningsSimulator";
import { PlanCard } from "./PlanCard";
import type { FieldErrors, StepProps } from "./types";
import { useFieldErrors } from "../../hooks/useFieldErrors";

const ORDER = ["express-phone", "plan-free"];

type StepMonetizationProps = StepProps & {
  submitting: boolean;
  progress: number;
  submitError?: string;
};

/** Creator-03 — Número Multicaixa Express e modelo de comissões. */
export function StepMonetization({
  application: app,
  update,
  onNext,
  onBack,
  submitting,
  progress,
  submitError,
}: StepMonetizationProps) {
  const { errors, check, clear } = useFieldErrors(ORDER);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const next: FieldErrors = {};
    if (!isValidAOPhone(app.expressPhone))
      next["express-phone"] = "O número tem de ter 9 dígitos e começar por 9, por exemplo 923 000 000.";
    if (!app.plan) next["plan-free"] = "Escolha um plano para continuar.";
    if (check(next)) onNext();
  }

  return (
    <CreatorStepLayout
      step={2}
      onBack={onBack}
      backLabel="Voltar ao passo 2: comprovativo e amostra"
      eyebrow="Etapa final · configuração financeira"
      title="Recebimentos por Multicaixa Express"
      lead="Indique onde quer receber o valor das suas vendas e escolha o modelo de comissões que mais lhe convém."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
        <section aria-labelledby="payout-title" className="rounded-2xl border-2 border-border-cloud p-5 sm:p-6">
          <div className="mb-5 flex items-start gap-4">
            <Asset3D name="wallet-express" alt="" size={48} priority className="shrink-0" />
            <div>
              <h2 id="payout-title" className="text-headline-h3 text-on-surface">
                Onde quer receber os ganhos?
              </h2>
              <p className="mt-1 text-body-md text-text-secondary">
                Os pagamentos vão diretamente para o número associado ao seu Multicaixa Express, pela rede EMIS.
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <PhoneInputAO
              id="express-phone"
              label="Número Multicaixa Express"
              value={app.expressPhone}
              error={errors["express-phone"]}
              onChange={(expressPhone) => {
                update({ expressPhone });
                clear("express-phone");
              }}
            />
          </div>
          <p className="mt-3 flex items-start gap-2 text-caption text-text-secondary">
            <Icon name="shield" size={16} className="mt-px shrink-0 text-feedback-success-ink" />
            Depois da aprovação enviamos 1 Kz para confirmar que a conta é sua.
          </p>
        </section>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="text-headline-h3 text-on-surface">Escolha o modelo de comissões</legend>
          <p id="plan-hint" className="mt-1 mb-6 text-body-md text-text-secondary">
            Pode mudar de plano quando quiser, no painel financeiro, sem penalizações.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                name="creator-plan"
                checked={app.plan === plan.id}
                highlight={plan.id === "pro" ? "0% de comissão" : undefined}
                describedBy={errors["plan-free"] ? "plan-hint plan-free-error" : "plan-hint"}
                invalid={Boolean(errors["plan-free"])}
                onSelect={(id) => {
                  update({ plan: id });
                  clear("plan-free");
                }}
              />
            ))}
          </div>
          <div className="mt-3">
            <FieldError id="plan-free" error={errors["plan-free"]} />
          </div>
        </fieldset>

        <EarningsSimulator />

        <StepFooter
          note="Ao submeter, aceita os Termos Comerciais da Kombinu e os repasses pela rede EMIS."
          submitLabel="Submeter candidatura"
          busy={submitting}
          busyLabel={`A enviar documentos… ${progress}%`}
          error={submitError}
        />
      </form>
    </CreatorStepLayout>
  );
}
