import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { isValidAOPhone, PhoneInputAO } from "../../components/ui/PhoneInputAO";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { formatKz } from "../../lib/format";
import type { SubscriptionPlan } from "./types";

type ExpressCheckoutScreenProps = {
  plan: SubscriptionPlan;
  creatorName: string;
  defaultPhone?: string;
  onCancel: () => void;
  onSubmit: (phone: string) => void;
};

/** FIN-02 — checkout do plano por Multicaixa Express: confirma o que é cobrado e para onde vai o pedido. */
export default function ExpressCheckoutScreen({
  plan,
  creatorName,
  defaultPhone = "",
  onCancel,
  onSubmit,
}: ExpressCheckoutScreenProps) {
  const headingRef = useFocusOnMount();
  const [phone, setPhone] = useState(defaultPhone);
  const [error, setError] = useState<string>();

  function submit() {
    if (!isValidAOPhone(phone)) {
      setError("O número tem de ter 9 dígitos e começar por 9, por exemplo 923 000 000.");
      document.getElementById("checkout-phone")?.focus();
      return;
    }
    onSubmit(phone);
  }

  return (
    <CreatorShell active="definicoes" creatorName={creatorName}>
      <div className="mx-auto max-w-xl px-4 py-8 md:py-12">
        <div className="overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas shadow-clay">
          <p className="flex items-center gap-2 bg-brand-ocean px-5 py-2.5 text-overline text-white uppercase">
            <Icon name="lock" size={16} />
            Ligação segura à rede EMIS
          </p>

          <div className="flex flex-col gap-6 p-5 sm:p-8">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-overline text-primary uppercase">Multicaixa Express</p>
                <h1 ref={headingRef} tabIndex={-1} className="font-montserrat text-headline-h2 text-on-surface outline-none">
                  Confirmar a subscrição
                </h1>
              </div>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Cancelar e voltar aos planos"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-container-low hover:text-on-surface"
              >
                <Icon name="x" size={20} />
              </button>
            </header>

            <section aria-labelledby="summary-title" className="rounded-2xl bg-surface-soft p-5">
              <h2 id="summary-title" className="text-overline text-text-tertiary uppercase">
                O que estás a subscrever
              </h2>
              <p className="mt-1 text-headline-h3 text-on-surface">{plan.name}</p>

              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {plan.features
                  .filter((f) => f.included)
                  .slice(0, 3)
                  .map((f) => (
                    <li key={f.text} className="flex items-center gap-1.5 text-caption text-text-secondary">
                      <Icon name="check" size={15} strokeWidth={3} className="text-feedback-success-ink" />
                      {f.text}
                    </li>
                  ))}
              </ul>

              <p className="mt-4 flex items-baseline justify-between gap-3 rounded-xl bg-surface-canvas p-3">
                <span className="text-body-md text-text-secondary">Total a pagar agora</span>
                <span className="text-right">
                  <span className="block font-montserrat text-headline-h1-mobile font-extrabold text-primary tabular-nums">
                    {formatKz(plan.priceKz)}
                  </span>
                  <span className="block text-caption text-text-tertiary">Renova todos os meses; cancelas quando quiseres</span>
                </span>
              </p>
            </section>

            <form
              className="flex flex-col gap-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <PhoneInputAO
                id="checkout-phone"
                label="Número associado ao Multicaixa Express"
                value={phone}
                error={error}
                onChange={(v) => {
                  setPhone(v);
                  setError(undefined);
                }}
              />

              <p className="flex items-start gap-3 rounded-2xl bg-surface-sky p-3.5 text-caption text-text-secondary">
                <Icon name="bell" size={18} className="mt-0.5 shrink-0 text-primary" />
                Vais receber um pedido de débito no telemóvel. A autorização é feita com o teu PIN, dentro da aplicação
                do Multicaixa Express.
              </p>

              <Button3D type="submit" size="lg" fullWidth leadingIcon={<Icon name="phone" size={20} />}>
                Pagar {formatKz(plan.priceKz)} com Express
              </Button3D>
            </form>

            <section aria-labelledby="security-title" className="rounded-2xl bg-surface-soft p-4">
              <h2 id="security-title" className="flex items-center gap-2 text-overline text-text-secondary uppercase">
                <Icon name="shield" size={16} className="text-feedback-success-ink" />
                Rede Multicaixa Express · EMIS
              </h2>
              <p className="mt-2 text-caption text-text-tertiary">
                O teu PIN nunca é pedido nem guardado pela Kombinu: a autorização acontece inteiramente nos canais da
                EMIS. Guardamos apenas a referência da transação.
              </p>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-caption text-text-secondary">
          Dúvidas no pagamento?{" "}
          <a
            href="https://wa.me/244900000000"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary underline underline-offset-4"
          >
            Fala com o suporte pelo WhatsApp
            <span className="sr-only"> (abre numa nova janela)</span>
          </a>
        </p>
      </div>
    </CreatorShell>
  );
}
