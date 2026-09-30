import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { FieldError } from "../../components/ui/Field";
import { FileDropzone } from "../../components/ui/FileDropzone";
import { Icon } from "../../components/ui/Icon";
import { OtpInput } from "../../components/ui/OtpInput";
import { isValidAOPhone, maskAOPhone, PhoneInputAO } from "../../components/ui/PhoneInputAO";
import { useCountdown } from "../../hooks/useCountdown";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";

const RESEND_SECONDS = 48;
const MAX_ATTEMPTS = 3;

type Flow = "tenho-sim" | "perdi-sim";

type PhoneSecurityScreenProps = {
  currentPhone: string;
  institutionalEmail: string;
  emailVerified: boolean;
  university: string;
  userName: string;
  settingsHref: string;
  onChangePhone?: (newPhone: string, codeNew: string, codeCurrent: string) => Promise<boolean>;
};

/** Alteração de número com dupla confirmação e recuperação sem acesso ao SIM. */
export default function PhoneSecurityScreen({
  currentPhone,
  institutionalEmail,
  emailVerified,
  university,
  userName,
  settingsHref,
  onChangePhone,
}: PhoneSecurityScreenProps) {
  const [flow, setFlow] = useState<Flow>("tenho-sim");
  const [newPhone, setNewPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [codeNew, setCodeNew] = useState("");
  const [codeCurrent, setCodeCurrent] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [resendAt, setResendAt] = useState<string>();
  const [recoveryDoc, setRecoveryDoc] = useState<File | null>(null);
  const toast = useToast();

  const resend = useCountdown(resendAt ?? new Date());
  const canResend = !resendAt || resend.ended;
  const current = maskAOPhone(currentPhone);
  const blocked = attemptsLeft === 0;
  const ready = codeNew.length === 6 && codeCurrent.length === 6;

  function sendCodes() {
    if (!isValidAOPhone(newPhone)) {
      setError("O número tem de ter 9 dígitos e começar por 9, por exemplo 923 000 000.");
      document.getElementById("new-phone")?.focus();
      return;
    }
    if (newPhone === currentPhone) {
      setError("Este já é o teu número atual. Indica o número novo.");
      return;
    }
    setError(undefined);
    setSent(true);
    setResendAt(new Date(Date.now() + RESEND_SECONDS * 1000).toISOString());
    toast.show("Enviámos um código para cada número.");
  }

  async function confirm() {
    if (!ready || blocked) return;
    setBusy(true);
    try {
      const ok = (await onChangePhone?.(newPhone, codeNew, codeCurrent)) ?? true;
      if (ok) {
        toast.show("Número atualizado. Os pagamentos passam a usar o novo número.");
        setSent(false);
        setCodeNew("");
        setCodeCurrent("");
      } else {
        const left = attemptsLeft - 1;
        setAttemptsLeft(left);
        setCodeNew("");
        setCodeCurrent("");
        setError(
          left > 0
            ? `Códigos errados. Restam ${left} tentativas antes de bloquearmos a alteração por 30 minutos.`
            : "Demasiadas tentativas. A alteração fica bloqueada durante 30 minutos, por segurança.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell active="painel" userName={userName} campus={university}>
      <div className="mx-auto max-w-[720px] px-4 py-6 md:px-6 lg:py-8">
        <a
          href={settingsHref}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
        >
          <Icon name="arrow-left" size={16} />
          Voltar às definições
        </a>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Segurança da conta</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Número de telemóvel e acesso
          </h1>
          <p className="mt-1 text-body-md text-text-secondary">
            O teu número é a chave da conta e o destino dos pagamentos por Multicaixa Express.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface-soft px-3 py-1.5 text-caption text-text-secondary">
            <Icon name="phone" size={16} className="text-primary" />
            <span aria-hidden="true" className="tabular-nums">Número atual: {current.visual}</span>
            <span className="sr-only">Número atual: {current.spoken}</span>
          </p>
        </header>

        <div role="tablist" aria-label="Como queres alterar o número" className="mb-6 flex gap-2 rounded-full border-2 border-border-cloud bg-surface-soft p-1">
          {[
            { value: "tenho-sim" as const, label: "Tenho o SIM atual" },
            { value: "perdi-sim" as const, label: "Perdi o SIM ou o telemóvel" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={flow === tab.value}
              onClick={() => setFlow(tab.value)}
              className={cn(
                "min-h-11 flex-1 rounded-full px-3 text-body-md font-bold transition-[background-color,color,box-shadow] duration-150",
                flow === tab.value ? "bg-surface-canvas text-primary shadow-elevation-1" : "text-text-secondary hover:text-on-surface",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {flow === "tenho-sim" ? (
          <section aria-label="Alteração com dupla confirmação" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-6">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-sky px-3 py-1.5 text-caption font-bold text-primary">
              <Icon name="lock" size={16} />
              Dupla confirmação: código no número novo e no atual
            </p>

            <form
              className="flex flex-col gap-5"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (sent) void confirm();
                else sendCodes();
              }}
            >
              <PhoneInputAO
                id="new-phone"
                label="Novo número de telemóvel"
                hint="Enviamos um código de 6 dígitos para este número."
                value={newPhone}
                error={!sent ? error : undefined}
                onChange={(v) => {
                  setNewPhone(v);
                  setError(undefined);
                }}
              />

              {sent && (
                <div className="flex flex-col gap-5 rounded-2xl bg-surface-soft p-4 sm:p-5">
                  <div>
                    <label htmlFor="code-new" className="mb-2 block text-body-md font-bold text-on-surface">
                      1. Código enviado para o número <span className="text-primary">novo</span>
                    </label>
                    <OtpInput id="code-new" value={codeNew} onChange={setCodeNew} invalid={Boolean(error)} />
                  </div>

                  <div className="border-t-2 border-border-cloud pt-5">
                    <label htmlFor="code-current" className="mb-2 block text-body-md font-bold text-on-surface">
                      2. Código de autorização enviado para o número{" "}
                      <span aria-hidden="true" className="tabular-nums">atual ({current.visual})</span>
                      <span className="sr-only">atual, {current.spoken}</span>
                    </label>
                    <OtpInput id="code-current" value={codeCurrent} onChange={setCodeCurrent} invalid={Boolean(error)} />
                  </div>

                  <FieldError id="code-current" error={error} />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-caption tabular-nums">
                    <p className="flex items-center gap-1.5 text-text-secondary">
                      <Icon name="clock" size={16} />
                      {canResend ? "Podes pedir códigos novos." : `Reenviar em ${resend.clock.slice(3)}`}
                    </p>
                    <p className={cn(attemptsLeft <= 1 ? "font-bold text-feedback-error-ink" : "text-text-tertiary")}>
                      {attemptsLeft} de {MAX_ATTEMPTS} tentativas restantes
                    </p>
                  </div>

                  {canResend && (
                    <button
                      type="button"
                      onClick={sendCodes}
                      className="min-h-11 self-start rounded-full px-3 text-button text-primary uppercase hover:bg-surface-sky"
                    >
                      Reenviar os dois códigos
                    </button>
                  )}
                </div>
              )}

              <Button3D
                type="submit"
                size="lg"
                fullWidth
                disabled={blocked || (sent && !ready)}
                aria-disabled={busy || undefined}
                trailingIcon={<Icon name="arrow-right" size={20} />}
              >
                {busy ? "A verificar…" : sent ? "Confirmar e atualizar o número" : "Enviar códigos"}
              </Button3D>

              <p className="flex items-start gap-2 text-caption text-text-secondary">
                <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                Enquanto a alteração não for confirmada, os pagamentos continuam a ir para o número atual.
              </p>
            </form>
          </section>
        ) : (
          <section aria-label="Recuperação sem acesso ao SIM" className="flex flex-col gap-5">
            <div className="rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-5">
              <h2 className="flex items-center gap-2 text-headline-h3 text-feedback-streak-ink">
                <Icon name="shield" size={20} />
                Porque é mais demorado
              </h2>
              <p className="mt-2 text-body-md text-text-secondary">
                Sem o cartão SIM, qualquer pessoa com o teu número poderia ficar com os teus materiais e o teu saldo.
                Por isso confirmamos a identidade por outra via antes de mudar a chave da conta.
              </p>
            </div>

            <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-6">
              <h2 className="text-headline-h3 text-on-surface">Via 1: e-mail institucional</h2>
              <p className="mt-1 mb-4 text-body-md text-text-secondary">
                A mais rápida. Recebes uma ligação de confirmação e o número muda em poucos minutos.
              </p>

              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-surface-soft p-4 sm:flex-row sm:items-center">
                <p className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-canvas text-primary">
                    <Icon name="school" size={22} />
                  </span>
                  <span>
                    <span className="block text-body-md font-bold text-on-surface">{institutionalEmail}</span>
                    <span className="block text-caption text-text-tertiary">{university}</span>
                  </span>
                </p>
                {emailVerified ? (
                  <Button3D onClick={() => toast.show("Ligação de recuperação enviada para o teu e-mail institucional.")}>
                    Enviar ligação
                  </Button3D>
                ) : (
                  <p className="text-caption font-bold text-feedback-streak-ink">
                    E-mail por verificar: esta via não está disponível.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
              <h2 className="text-headline-h3 text-on-surface">Via 2: auditoria institucional</h2>
              <p className="mt-1 mb-4 text-body-md text-text-secondary">
                Para quem não tem o e-mail da instituição. A equipa responde em até 48 horas úteis.
              </p>

              <FileDropzone
                id="recovery-doc"
                headingLevel="h3"
                title="Documento de identificação"
                description="Bilhete de identidade, passaporte ou cartão de estudante, com o nome legível."
                extensions={["pdf", "jpg", "jpeg", "png"]}
                maxBytes={10 * 1024 * 1024}
                buttonLabel="Escolher documento"
                file={recoveryDoc}
                onChange={setRecoveryDoc}
              />

              <Button3D
                className="mt-5"
                fullWidth
                disabled={!recoveryDoc}
                onClick={() => toast.show("Pedido enviado. Recebes a resposta por e-mail em até 48 horas úteis.")}
              >
                Enviar pedido de recuperação
              </Button3D>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
