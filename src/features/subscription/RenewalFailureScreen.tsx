import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { useToast } from "../../components/ui/Toast";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { AuthorizePayment } from "./types";

const dayFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "long", year: "numeric" });

type RenewalFailureScreenProps = {
  creatorName: string;
  priceKz: number;
  phone: string;
  /** Fim do período de tolerância (ISO). Os dias restantes são calculados daqui. */
  graceEndsAt: string;
  failedAt: string;
  authorize: AuthorizePayment;
  onDowngrade: () => void;
  changePhoneHref: string;
};

/** FIN-DUN-01 — falha de renovação do Pro, com período de tolerância e nova tentativa. */
export default function RenewalFailureScreen({
  creatorName,
  priceKz,
  phone,
  graceEndsAt,
  failedAt,
  authorize,
  onDowngrade,
  changePhoneHref,
}: RenewalFailureScreenProps) {
  const headingRef = useFocusOnMount();
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");
  const [confirmingDowngrade, setConfirmingDowngrade] = useState(false);
  const toast = useToast();

  // Os dias de tolerância saem sempre da data, nunca de um número escrito à mão.
  const daysLeft = Math.max(0, Math.ceil((new Date(graceEndsAt).getTime() - Date.now()) / 86_400_000));
  const expired = daysLeft === 0;
  const masked = maskAOPhone(phone);

  async function retry() {
    setState("pending");
    try {
      await authorize(phone, priceKz);
      setState("done");
      toast.show("Pagamento confirmado. O Criador Pro continua ativo.");
    } catch {
      setState("error");
    }
  }

  return (
    <CreatorShell active="definicoes" creatorName={creatorName}>
      <div className="mx-auto max-w-[780px] px-4 py-6 md:px-6 lg:py-10">
        <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-8">
          <header className="flex flex-col items-center text-center">
            <span
              className={cn(
                "mb-4 flex size-14 items-center justify-center rounded-full",
                expired ? "bg-feedback-error-soft text-feedback-error-ink" : "bg-secondary-fixed text-feedback-streak-ink",
              )}
            >
              <Icon name="alert" size={28} />
            </span>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="max-w-xl font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
            >
              {state === "done"
                ? "Subscrição regularizada"
                : "Não conseguimos renovar o teu Criador Pro"}
            </h1>
            {state !== "done" && (
              <p className="mt-2.5 max-w-xl text-body-lg text-pretty text-text-secondary">
                O débito mensal de <strong className="text-on-surface tabular-nums">{formatKz(priceKz)}</strong> no
                número <span aria-hidden="true" className="tabular-nums">{masked.visual}</span>
                <span className="sr-only">{masked.spoken}</span> não foi autorizado a tempo, em{" "}
                {dayFormat.format(new Date(failedAt))}. Nada foi debitado.
              </p>
            )}
          </header>

          {state === "done" ? (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border-2 border-feedback-success bg-surface-canvas p-6 text-center">
              <Icon name="check" size={32} strokeWidth={3} className="text-feedback-success-ink" />
              <p className="text-body-lg text-text-secondary tabular-nums">
                Debitámos {formatKz(priceKz)}. A próxima cobrança é daqui a 30 dias e mantens 0% de comissão.
              </p>
              <Button3D onClick={() => (window.location.assign("/v2/estudio/financeiro"))} trailingIcon={<Icon name="arrow-right" size={20} />}>
                Ver no painel financeiro
              </Button3D>
            </div>
          ) : (
            <>
              <section
                aria-labelledby="grace-title"
                className={cn(
                  "mt-6 rounded-2xl border-2 p-5",
                  expired ? "border-feedback-error bg-surface-canvas" : "border-feedback-streak bg-surface-canvas",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="grace-title" className="flex items-center gap-2 text-headline-h3 text-on-surface tabular-nums">
                    <Icon name="shield" size={20} className="text-feedback-streak-ink" />
                    {expired ? "O período de tolerância terminou" : `Tolerância ativa: faltam ${daysLeft} dias`}
                  </h2>
                  <span className="rounded-full border-2 border-border-cloud px-3 py-1 text-caption font-bold text-text-secondary tabular-nums">
                    Até {dayFormat.format(new Date(graceEndsAt))}
                  </span>
                </div>
                <p className="mt-2.5 text-body-md text-text-secondary">
                  {expired
                    ? "A tua conta passou ao plano grátis. Podes reativar o Pro a qualquer momento."
                    : "Até essa data mantens tudo: 0% de comissão, materiais com IA sem limite e o selo de Criador Pro."}
                </p>
              </section>

              <section aria-labelledby="retry-title" className="mt-6 rounded-2xl border-2 border-border-cloud p-5 sm:p-6">
                <h2 id="retry-title" className="flex items-center gap-2 text-headline-h3 text-on-surface">
                  <Icon name="phone" size={22} className="text-primary" />
                  Tentar outra vez agora
                </h2>

                <p className="mt-3 flex items-center justify-between gap-3 border-b-2 border-border-cloud pb-3 text-body-md text-text-secondary">
                  Mensalidade do Pro
                  <strong className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                    {formatKz(priceKz)} / mês
                  </strong>
                </p>

                <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl bg-surface-soft p-4 sm:flex-row sm:items-center">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-body-lg font-bold text-on-surface tabular-nums" aria-hidden="true">
                      {masked.visual}
                    </span>
                    <span className="sr-only">{masked.spoken}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-forest px-2.5 py-0.5 text-caption font-bold text-feedback-success">
                      <Icon name="check" size={14} strokeWidth={3} />
                      Registado na EMIS
                    </span>
                  </p>
                  <a href={changePhoneHref} className="flex min-h-11 items-center text-button text-primary uppercase hover:underline">
                    Usar outro número
                  </a>
                </div>

                {state === "pending" && (
                  <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border-2 border-feedback-streak bg-surface-canvas p-3.5 text-caption text-text-secondary">
                    <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
                    Confirma o débito no telemóvel. Tens 90 segundos para autorizar com o teu PIN.
                  </p>
                )}

                {state === "error" && (
                  <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border-2 border-feedback-error bg-surface-canvas p-3.5 text-caption font-bold text-feedback-error-ink">
                    <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
                    Não recebemos a autorização. Confirma se tens saldo e tenta de novo. Nada foi debitado.
                  </p>
                )}

                <Button3D
                  size="lg"
                  fullWidth
                  className="mt-4"
                  aria-disabled={state === "pending" || undefined}
                  onClick={() => state !== "pending" && void retry()}
                  leadingIcon={state === "pending" ? undefined : <Icon name="bolt" size={20} />}
                >
                  {state === "pending" ? "À espera da confirmação…" : `Autorizar ${formatKz(priceKz)} por Express`}
                </Button3D>

                <p className="mt-3 text-caption text-text-tertiary">
                  O pedido chega à aplicação do Multicaixa Express. O PIN é introduzido lá e nunca passa pela Kombinu.
                </p>
              </section>

              <section aria-labelledby="consequences-title" className="mt-6 rounded-2xl bg-surface-soft p-5 sm:p-6">
                <h2 id="consequences-title" className="border-b-2 border-border-cloud pb-3 text-overline text-text-secondary uppercase">
                  O que muda se não regularizares
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border-2 border-feedback-success bg-surface-canvas p-4">
                    <p className="flex items-center gap-1.5 text-overline text-feedback-success-ink uppercase">
                      <Icon name="shield" size={16} />
                      Continua igual
                    </p>
                    <ul className="mt-2.5 flex flex-col gap-2 text-caption text-text-secondary">
                      {[
                        "As tuas sebentas continuam publicadas e os estudantes continuam a comprar.",
                        "O saldo da carteira mantém-se disponível para levantamento.",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Icon name="check" size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border-2 border-feedback-error bg-surface-canvas p-4">
                    <p className="flex items-center gap-1.5 text-overline text-feedback-error-ink uppercase">
                      <Icon name="trend-up" size={16} className="rotate-180" />
                      Passa a ser assim
                    </p>
                    <ul className="mt-2.5 flex flex-col gap-2 text-caption text-text-secondary">
                      {[
                        "A Kombinu volta a reter 30% de comissão em cada venda.",
                        "Os materiais gerados com IA voltam ao limite de 3 por mês.",
                        "O selo de Criador Pro deixa de aparecer na tua vitrine.",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Icon name="x" size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-error-ink" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <div className="mt-6 border-t-2 border-border-cloud pt-5">
                {confirmingDowngrade ? (
                  <div className="rounded-2xl border-2 border-border-cloud p-4">
                    <p className="text-body-md text-on-surface tabular-nums">
                      Ao passar já para o plano grátis, perdes os {daysLeft} dias de tolerância que ainda tens com 0% de
                      comissão. A partir daí, a Kombinu retém 30% de cada venda.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button3D variant="ghost" onClick={() => setConfirmingDowngrade(false)}>
                        Manter o Pro
                      </Button3D>
                      <Button3D
                        className="bg-feedback-error-ink text-white shadow-none hover:brightness-110"
                        onClick={onDowngrade}
                      >
                        Passar ao plano grátis
                      </Button3D>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingDowngrade(true)}
                    className="min-h-11 w-full text-center text-caption font-bold text-text-secondary underline underline-offset-4 hover:text-feedback-error-ink"
                  >
                    Prefiro passar ao plano grátis, com 30% de comissão
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </CreatorShell>
  );
}
