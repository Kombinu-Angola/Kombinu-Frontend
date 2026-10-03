import { useEffect, useRef, useState } from "react";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D } from "../../components/ui/Button3D";
import { DataSaverBadge } from "../../components/ui/DataSaverBadge";
import { FieldError } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { OtpInput } from "../../components/ui/OtpInput";
import { isValidAOPhone, PhoneInputAO, formatAOPhone } from "../../components/ui/PhoneInputAO";
import { useCountdown } from "../../hooks/useCountdown";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";

const RESEND_SECONDS = 45;
const CODE_LENGTH = 6;

type AuthScreenProps = {
  /** Envia o código por SMS. Em produção: POST /api/auth/otp/. */
  onRequestCode?: (phone: string) => Promise<void>;
  /** Valida o código. Devolve false se estiver errado. */
  onVerifyCode?: (phone: string, code: string) => Promise<boolean>;
  onAuthenticated: (phone: string) => void;
  onGoogle?: () => void;
  onUniversityEmail?: () => void;
};

/** AUTH-01 — entrada por telemóvel com código SMS. */
export default function AuthScreen({
  onRequestCode,
  onVerifyCode,
  onAuthenticated,
  onGoogle,
  onUniversityEmail,
}: AuthScreenProps) {
  const headingRef = useFocusOnMount();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [resendAt, setResendAt] = useState<string>();
  const codeHeadingRef = useRef<HTMLHeadingElement>(null);

  const resend = useCountdown(resendAt ?? new Date());
  const canResend = !resendAt || resend.ended;

  useEffect(() => {
    if (step === "code") codeHeadingRef.current?.focus();
  }, [step]);

  async function requestCode() {
    if (!isValidAOPhone(phone)) {
      setError("O número tem de ter 9 dígitos e começar por 9, por exemplo 923 000 000.");
      document.getElementById("auth-phone")?.focus();
      return;
    }
    setError(undefined);
    setBusy(true);
    try {
      await onRequestCode?.(phone);
      setResendAt(new Date(Date.now() + RESEND_SECONDS * 1000).toISOString());
      setCode("");
      setStep("code");
    } catch {
      setError("Não foi possível enviar o código. Verifica a ligação e tenta de novo.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(submitted = code) {
    if (submitted.length < CODE_LENGTH) {
      setError("Introduz os 6 dígitos do código.");
      return;
    }
    setBusy(true);
    try {
      const ok = (await onVerifyCode?.(phone, submitted)) ?? true;
      if (ok) {
        onAuthenticated(phone);
      } else {
        setError("Código errado. Confirma o SMS ou pede um novo código.");
        setCode("");
        document.getElementById("auth-code")?.focus();
      }
    } catch {
      setError("Não foi possível validar o código. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-10">
      <main
        id="conteudo"
        className="flex w-full max-w-[440px] flex-col items-center rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 shadow-clay sm:p-10"
      >
        <Asset3D name="sms-code" alt="" size={72} priority className="mb-5" />

        {step === "phone" ? (
          <>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mb-2 text-center font-montserrat text-headline-h2 text-on-surface outline-none"
            >
              Entrar na Kombinu
            </h1>
            <p className="mb-7 text-center text-body-md text-text-secondary">
              Escreve o teu número e enviamos um código por SMS. Não precisas de dados móveis para o receber.
            </p>

            <form
              className="flex w-full flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!busy) void requestCode();
              }}
              noValidate
            >
              <PhoneInputAO
                id="auth-phone"
                label="Número de telemóvel"
                hint="Unitel ou Africell."
                value={phone}
                error={error}
                onChange={(v) => {
                  setPhone(v);
                  setError(undefined);
                }}
              />
              <Button3D
                type="submit"
                size="lg"
                fullWidth
                aria-disabled={busy || undefined}
                trailingIcon={busy ? undefined : <Icon name="arrow-right" size={20} />}
              >
                {busy ? "A enviar código…" : "Continuar com SMS"}
              </Button3D>
            </form>
          </>
        ) : (
          <>
            <h1
              ref={codeHeadingRef}
              tabIndex={-1}
              className="mb-2 text-center font-montserrat text-headline-h2 text-on-surface outline-none"
            >
              Confirma o código
            </h1>
            <p className="mb-6 text-center text-body-md text-text-secondary">
              Enviámos 6 dígitos para{" "}
              <strong className="text-on-surface tabular-nums">+244 {formatAOPhone(phone)}</strong>.{" "}
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setError(undefined);
                }}
                className="font-bold text-primary underline underline-offset-4"
              >
                Alterar número
              </button>
            </p>

            <form
              className="flex w-full flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!busy) void verify();
              }}
              noValidate
            >
              <div>
                <label htmlFor="auth-code" className="sr-only">
                  Código recebido por SMS
                </label>
                <OtpInput
                  id="auth-code"
                  value={code}
                  invalid={Boolean(error)}
                  describedBy={error ? "auth-code-error" : undefined}
                  onChange={(v) => {
                    setCode(v);
                    setError(undefined);
                  }}
                  onComplete={(v) => void verify(v)}
                />
                <div className="mt-2">
                  <FieldError id="auth-code" error={error} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-caption text-text-secondary tabular-nums">
                  <Icon name="clock" size={16} />
                  {canResend ? "Já podes pedir um novo código." : `Novo código em ${resend.clock.slice(3)}`}
                </p>
                <button
                  type="button"
                  disabled={!canResend || busy}
                  onClick={() => void requestCode()}
                  className="min-h-11 rounded-full px-3 text-button text-primary uppercase hover:bg-surface-sky disabled:text-text-disabled disabled:hover:bg-transparent"
                >
                  Reenviar SMS
                </button>
              </div>

              <Button3D
                type="submit"
                size="lg"
                fullWidth
                aria-disabled={busy || undefined}
                trailingIcon={busy ? undefined : <Icon name="check" size={20} strokeWidth={3} />}
              >
                {busy ? "A verificar…" : "Verificar e entrar"}
              </Button3D>
            </form>
          </>
        )}

        <div className="my-7 flex w-full items-center gap-3">
          <span aria-hidden="true" className="h-0.5 flex-1 bg-border-cloud" />
          <span className="text-overline text-text-tertiary uppercase">ou continuar com</span>
          <span aria-hidden="true" className="h-0.5 flex-1 bg-border-cloud" />
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <Button3D variant="ghost" fullWidth onClick={onGoogle}>
            Google
          </Button3D>
          <Button3D variant="ghost" fullWidth onClick={onUniversityEmail} leadingIcon={<Icon name="school" size={18} />}>
            E-mail académico
          </Button3D>
        </div>

        <p className="mt-7 flex items-start gap-2 border-t-2 border-border-cloud pt-4 text-caption text-text-secondary">
          <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-feedback-success-ink" />
          Ligação encriptada. A autenticação consome poucos kilobytes.
        </p>
      </main>

      <DataSaverBadge megabytesToday={1.2} />
    </div>
  );
}
