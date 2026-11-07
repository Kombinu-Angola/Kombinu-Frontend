import { useState } from "react";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { OtpInput } from "../../components/ui/OtpInput";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { useCountdown } from "../../hooks/useCountdown";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { StateShell } from "./OfflineScreen";

type SessionExpiredScreenProps = { phone: string; onVerify?: (code: string) => Promise<boolean>; onUseAnother: () => void };

/** Sessão expirada: reentrada por código SMS, sem perder o sítio onde se estava. */
export function SessionExpiredScreen({ phone, onVerify, onUseAnother }: SessionExpiredScreenProps) {
  const headingRef = useFocusOnMount();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [resendAt, setResendAt] = useState(() => new Date(Date.now() + 45_000).toISOString());
  const resend = useCountdown(resendAt);
  const masked = maskAOPhone(phone);

  async function verify(value = code) {
    if (value.length < 6) {
      setError("Introduz os 6 dígitos do código.");
      return;
    }
    const ok = (await onVerify?.(value)) ?? true;
    if (!ok) {
      setError("Código errado. Pede um novo se este já expirou.");
      setCode("");
    }
  }

  return (
    <StateShell>
      <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 text-center shadow-clay sm:p-8">
        <span className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          <Icon name="lock" size={40} />
        </span>

        <p className="inline-flex items-center gap-2 rounded-full bg-surface-sky px-3.5 py-1 text-overline text-primary uppercase">
          <Icon name="shield" size={15} />
          Sessão terminada por segurança
        </p>

        <h1 ref={headingRef} tabIndex={-1} className="mt-3 font-montserrat text-headline-h2 text-on-surface outline-none">
          Confirma que és tu
        </h1>
        <p className="mx-auto mt-2 max-w-md text-body-md text-text-secondary">
          Por estares muito tempo sem atividade, fechámos a sessão. Enviámos um código para{" "}
          <strong className="text-on-surface tabular-nums" aria-hidden="true">
            {masked.visual}
          </strong>
          <span className="sr-only">{masked.spoken}</span>. O teu saldo e os teus rascunhos ficaram guardados.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
        >
          <div>
            <label htmlFor="session-code" className="sr-only">
              Código recebido por SMS
            </label>
            <OtpInput
              id="session-code"
              value={code}
              invalid={Boolean(error)}
              onChange={(v) => {
                setCode(v);
                setError(undefined);
              }}
              onComplete={(v) => void verify(v)}
            />
            {error && (
              <p role="alert" className="mt-2 text-caption font-bold text-feedback-error-ink">
                {error}
              </p>
            )}
          </div>

          <p className="flex flex-wrap items-center justify-between gap-2 text-caption text-text-secondary tabular-nums">
            <span className="flex items-center gap-1.5">
              <Icon name="clock" size={15} />
              {resend.ended ? "Já podes pedir um novo código." : `Novo código em ${resend.clock.slice(3)}`}
            </span>
            <button
              type="button"
              disabled={!resend.ended}
              onClick={() => setResendAt(new Date(Date.now() + 45_000).toISOString())}
              className="min-h-11 rounded-full px-3 text-button text-primary uppercase hover:bg-surface-sky disabled:text-text-disabled disabled:hover:bg-transparent"
            >
              Reenviar SMS
            </button>
          </p>

          <Button3D type="submit" size="lg" fullWidth trailingIcon={<Icon name="arrow-right" size={20} />}>
            Entrar e continuar de onde parei
          </Button3D>
        </form>

        <button
          type="button"
          onClick={onUseAnother}
          className="mt-4 min-h-11 text-caption font-bold text-text-secondary underline underline-offset-4 hover:text-primary"
        >
          Entrar com outro número
        </button>
      </div>
    </StateShell>
  );
}

type NotFoundScreenProps = { searchHref: string; homeHref: string; suggestions: Array<{ label: string; href: string }> };

/** 404: em vez de um beco sem saída, caminhos de volta ao conteúdo. */
export function NotFoundScreen({ searchHref, homeHref, suggestions }: NotFoundScreenProps) {
  const headingRef = useFocusOnMount();

  return (
    <StateShell>
      <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 text-center shadow-clay sm:p-8">
        <p className="font-montserrat text-display-l font-extrabold text-brand-sky-ink tabular-nums">404</p>
        <h1 ref={headingRef} tabIndex={-1} className="font-montserrat text-headline-h2 text-on-surface outline-none">
          Esta página já não existe
        </h1>
        <p className="mx-auto mt-2 max-w-md text-body-md text-text-secondary">
          A sebenta pode ter sido pausada pelo criador, ou o endereço está errado. Se já a tinhas comprado, continua na
          tua biblioteca.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <LinkButton3D href={searchHref} size="lg" fullWidth leadingIcon={<Icon name="search" size={20} />}>
            Procurar outra vez
          </LinkButton3D>
          <LinkButton3D href={homeHref} variant="ghost" fullWidth>
            Voltar ao início
          </LinkButton3D>
        </div>

        <div className="mt-7 border-t-2 border-border-cloud pt-5 text-left">
          <p className="mb-3 text-overline text-text-tertiary uppercase">Talvez procurasses</p>
          <ul className="flex flex-col gap-2">
            {suggestions.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-surface-soft px-4 text-body-md text-on-surface transition-[background-color] duration-150 hover:bg-surface-sky hover:text-primary"
                >
                  {s.label}
                  <Icon name="arrow-right" size={18} className="shrink-0 text-primary" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StateShell>
  );
}
