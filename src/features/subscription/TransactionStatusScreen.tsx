import { useEffect, useState } from "react";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { useCountdown } from "../../hooks/useCountdown";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { AuthorizationResult, SubscriptionPlan } from "./types";

const WINDOW_SECONDS = 90;

export type TransactionState =
  | { status: "waiting" }
  | { status: "approved"; result: AuthorizationResult }
  | { status: "failed"; message: string };

type TransactionStatusScreenProps = {
  plan: SubscriptionPlan;
  phone: string;
  state: TransactionState;
  onExpire: () => void;
  onRetry: () => void;
  onCancel: () => void;
  studioHref: string;
};

const STEPS = [
  { id: "push", title: "Abre a notificação no telemóvel", detail: "Enviámos agora o pedido de débito." },
  { id: "app", title: "Entra no Multicaixa Express", detail: "Pela notificação ou pelo menu de pagamentos pendentes." },
  { id: "pin", title: "Confirma com o teu PIN", detail: "O PIN é introduzido só na aplicação do Express." },
];

/** FIN-03 — estado da transação: à espera da autorização ou concluída. */
export default function TransactionStatusScreen({
  plan,
  phone,
  state,
  onExpire,
  onRetry,
  onCancel,
  studioHref,
}: TransactionStatusScreenProps) {
  const headingRef = useFocusOnMount();
  const [deadline] = useState(() => new Date(Date.now() + WINDOW_SECONDS * 1000).toISOString());
  const countdown = useCountdown(deadline);
  const masked = maskAOPhone(phone);
  const waiting = state.status === "waiting";
  const secondsLeft = countdown.totalSeconds;
  const ratio = waiting ? Math.max(0, secondsLeft / WINDOW_SECONDS) : 0;

  useEffect(() => {
    if (waiting && countdown.ended) onExpire();
  }, [waiting, countdown.ended, onExpire]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <main id="conteudo" className="w-full max-w-xl">
        <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 shadow-clay sm:p-10">
          {state.status === "waiting" && (
            <section aria-live="polite" className="flex flex-col items-center text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-3.5 py-1 text-overline text-on-secondary-fixed-variant uppercase">
                <Icon name="clock" size={15} />
                Pedido enviado
              </p>

              <div className="relative my-6 flex size-36 items-center justify-center">
                <svg viewBox="0 0 144 144" className="size-full -rotate-90" aria-hidden="true">
                  <circle cx="72" cy="72" r="60" fill="none" stroke="var(--color-border-cloud)" strokeWidth="8" />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    fill="none"
                    stroke="var(--color-feedback-streak)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${ratio * 377} 377`}
                  />
                </svg>
                <span className="absolute flex flex-col items-center">
                  <span className="font-montserrat text-[34px] leading-none font-extrabold text-on-surface tabular-nums">
                    {secondsLeft}s
                  </span>
                  <span className="mt-1 text-overline text-text-tertiary uppercase">Tempo limite</span>
                </span>
              </div>

              <h1 ref={headingRef} tabIndex={-1} className="font-montserrat text-headline-h2 text-on-surface outline-none">
                Confirma no teu telemóvel
              </h1>
              <p className="mt-2 max-w-md text-body-md text-text-secondary">
                Autoriza o débito de{" "}
                <strong className="text-on-surface tabular-nums">{formatKz(plan.priceKz)}</strong> no número{" "}
                <strong className="text-on-surface tabular-nums" aria-hidden="true">
                  {masked.visual}
                </strong>
                <span className="sr-only">{masked.spoken}</span>.
              </p>

              <ol className="mt-6 flex w-full flex-col gap-4 rounded-2xl bg-surface-soft p-5 text-left">
                {STEPS.map((step, i) => (
                  <li key={step.id} className="flex items-start gap-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-ocean text-caption font-bold text-white tabular-nums">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-body-md font-bold text-on-surface">{step.title}</span>
                      <span className="block text-caption text-text-secondary">{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-5 flex items-center gap-2 rounded-full bg-surface-soft px-4 py-2 text-caption text-text-secondary">
                <span aria-hidden="true" className="size-2.5 rounded-full bg-feedback-streak motion-safe:animate-pulse" />
                À espera da confirmação da rede EMIS
              </p>

              <Button3D variant="ghost" className="mt-6" onClick={onCancel} leadingIcon={<Icon name="x" size={18} />}>
                Cancelar e usar outro número
              </Button3D>
            </section>
          )}

          {state.status === "approved" && (
            <section aria-live="polite" className="flex flex-col items-center text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-feedback-success-soft px-3.5 py-1 text-overline text-feedback-success-ink uppercase">
                <Icon name="check" size={15} strokeWidth={3} />
                Pagamento confirmado
              </p>

              <Asset3D name="trophy-complete" alt="" size={104} priority className="my-5 motion-safe:animate-pop-in" />

              <h1 ref={headingRef} tabIndex={-1} className="font-montserrat text-headline-h1-mobile text-on-surface outline-none sm:text-headline-h1">
                O {plan.name} já está ativo
              </h1>
              <p className="mt-2 max-w-md text-body-md text-text-secondary">
                A partir de agora ficas com 0% de comissão nas vendas e sem limite de materiais gerados com IA.
              </p>

              <dl className="mt-6 w-full rounded-2xl bg-surface-soft p-5 text-left">
                {[
                  { label: "Valor debitado", value: formatKz(plan.priceKz) },
                  { label: "Número", value: masked.visual, spoken: masked.spoken },
                  { label: "Referência EMIS", value: state.result.reference },
                  { label: "Próxima cobrança", value: new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "long" }).format(new Date(Date.now() + 30 * 86_400_000)) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 border-b-2 border-border-cloud py-2 last:border-0">
                    <dt className="text-caption text-text-secondary">{row.label}</dt>
                    <dd className="text-body-md font-bold text-on-surface tabular-nums">
                      <span aria-hidden={row.spoken ? "true" : undefined}>{row.value}</span>
                      {row.spoken && <span className="sr-only">{row.spoken}</span>}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex w-full flex-col gap-3">
                <LinkButton3D href={studioHref} size="lg" fullWidth trailingIcon={<Icon name="arrow-right" size={20} />}>
                  Voltar ao estúdio
                </LinkButton3D>
                <LinkButton3D href="/v2/estudio/financeiro" variant="ghost" fullWidth>
                  Ver o comprovativo no painel financeiro
                </LinkButton3D>
              </div>
            </section>
          )}

          {state.status === "failed" && (
            <section className="flex flex-col items-center text-center">
              <p className="inline-flex items-center gap-2 rounded-full border-2 border-feedback-error bg-surface-canvas px-3.5 py-1 text-overline text-feedback-error-ink uppercase">
                <Icon name="alert" size={15} />
                Pagamento não concluído
              </p>
              <span className={cn("my-6 flex size-20 items-center justify-center rounded-full bg-feedback-error-soft text-feedback-error-ink")}>
                <Icon name="x" size={40} strokeWidth={2.5} />
              </span>
              <h1 ref={headingRef} tabIndex={-1} className="font-montserrat text-headline-h2 text-on-surface outline-none">
                Não recebemos a autorização
              </h1>
              <p className="mt-2 max-w-md text-body-md text-text-secondary">{state.message}</p>
              <p className="mt-3 text-caption text-text-tertiary">Nada foi debitado da tua conta.</p>

              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                <Button3D variant="ghost" fullWidth onClick={onCancel}>
                  Mudar de número
                </Button3D>
                <Button3D fullWidth onClick={onRetry} leadingIcon={<Icon name="refresh" size={18} />}>
                  Tentar de novo
                </Button3D>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
