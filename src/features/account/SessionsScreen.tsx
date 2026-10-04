import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime } from "../../lib/format";

export type DeviceSession = {
  id: string;
  device: string;
  kind: "telemovel" | "computador" | "tablet";
  app: string;
  location: string;
  network: string;
  maskedIp: string;
  lastActiveAt: string;
  current?: boolean;
};

const ICON: Record<DeviceSession["kind"], IconName> = {
  telemovel: "phone",
  computador: "grid",
  tablet: "file",
};

const KIND_LABEL: Record<DeviceSession["kind"], string> = {
  telemovel: "Telemóvel",
  computador: "Computador",
  tablet: "Tablet",
};

type SessionsScreenProps = { sessions: DeviceSession[]; userName: string; securityHref: string };

/** Sessões ativas: onde a conta está aberta e como fechar o que não se reconhece. */
export default function SessionsScreen({ sessions: initial, userName, securityHref }: SessionsScreenProps) {
  const [sessions, setSessions] = useState(initial);
  const [confirmingAll, setConfirmingAll] = useState(false);
  const toast = useToast();

  const current = sessions.find((s) => s.current);
  const others = sessions.filter((s) => !s.current);

  function terminate(session: DeviceSession) {
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
    toast.show(`Sessão terminada em ${session.device}.`);
  }

  return (
    <AppShell active="painel" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[820px] px-4 py-6 md:px-6 lg:py-8">
        <a
          href={securityHref}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
        >
          <Icon name="arrow-left" size={16} />
          Voltar às definições
        </a>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Segurança da conta</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Sessões e dispositivos
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            Todos os aparelhos onde a tua conta está aberta. Se não reconheceres algum, fecha a sessão e muda o número
            de acesso.
          </p>
        </header>

        {current && (
          <section aria-labelledby="current-title" className="mb-8 rounded-3xl border-2 border-feedback-success bg-surface-canvas p-5 shadow-clay">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-forest text-feedback-success">
                  <Icon name={ICON[current.kind]} size={26} />
                </span>
                <div>
                  <h2 id="current-title" className="text-headline-h3 text-on-surface">
                    {current.device}
                  </h2>
                  <p className="text-caption text-feedback-success-ink">Sessão atual, iniciada com código SMS</p>
                </div>
              </div>
              <span className="rounded-full bg-secondary-container px-3 py-1 text-overline text-surface-ink uppercase">
                Este aparelho
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {[
                { label: "Onde", value: `${current.location} (${current.network})`, icon: "signal" as const },
                { label: "Aplicação", value: current.app, icon: "grid" as const },
                { label: "Última atividade", value: formatActivityTime(current.lastActiveAt), icon: "clock" as const },
              ].map((row) => (
                <div key={row.label} className="rounded-xl bg-surface-soft p-3">
                  <dt className="flex items-center gap-2 text-overline text-text-tertiary uppercase">
                    <Icon name={row.icon} size={16} className="shrink-0 text-feedback-success-ink" />
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 truncate text-caption font-bold text-on-surface">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 flex items-start gap-2 border-t-2 border-border-cloud pt-3 text-caption text-text-secondary">
              <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-feedback-success-ink" />A ligação é encriptada
              e o acesso é confirmado por código SMS. A Kombinu nunca pede o teu PIN do Multicaixa Express.
            </p>
          </section>
        )}

        <section aria-labelledby="others-title">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 id="others-title" className="font-montserrat text-headline-h2 text-on-surface tabular-nums">
                Outros aparelhos ({others.length})
              </h2>
              <p className="text-caption text-text-secondary">Podes fechar qualquer sessão que não reconheças.</p>
            </div>
            {others.length > 0 && !confirmingAll && (
              <Button3D
                variant="ghost"
                className="border-feedback-error text-feedback-error-ink"
                onClick={() => setConfirmingAll(true)}
                leadingIcon={<Icon name="lock" size={18} />}
              >
                Terminar todas as outras
              </Button3D>
            )}
          </div>

          {confirmingAll && (
            <div className="mb-4 rounded-2xl border-2 border-feedback-error bg-surface-canvas p-4">
              <p className="text-body-md text-on-surface tabular-nums">
                Fechar {others.length} sessões? Terás de confirmar por SMS quando voltares a entrar nesses aparelhos.
                Esta sessão continua aberta.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button3D variant="ghost" onClick={() => setConfirmingAll(false)}>
                  Cancelar
                </Button3D>
                <Button3D
                  className="bg-feedback-error-ink text-white shadow-none hover:brightness-110"
                  onClick={() => {
                    setSessions((prev) => prev.filter((s) => s.current));
                    setConfirmingAll(false);
                    toast.show("Todas as outras sessões foram terminadas.", "error");
                  }}
                >
                  Terminar todas
                </Button3D>
              </div>
            </div>
          )}

          {others.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
              A tua conta só está aberta neste aparelho.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {others.map((session) => (
                <li key={session.id}>
                  <article className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3.5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-text-secondary">
                        <Icon name={ICON[session.kind]} size={22} />
                      </span>
                      <div>
                        <h3 className="flex flex-wrap items-center gap-2 text-headline-h3 text-on-surface">
                          {session.device}
                          <span className="rounded-md bg-surface-soft px-2 py-0.5 text-overline text-text-secondary uppercase">
                            {KIND_LABEL[session.kind]}
                          </span>
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-caption text-text-secondary tabular-nums">
                          <Icon name="signal" size={14} className="shrink-0 text-text-tertiary" />
                          {session.location} · {session.network} · IP {session.maskedIp}
                        </p>
                        <p className="flex items-center gap-1.5 text-caption text-text-tertiary">
                          <Icon name="clock" size={14} className="shrink-0" />
                          {formatActivityTime(session.lastActiveAt)}
                        </p>
                      </div>
                    </div>

                    <Button3D
                      variant="ghost"
                      className="border-feedback-error text-feedback-error-ink sm:w-auto"
                      onClick={() => terminate(session)}
                    >
                      Terminar sessão
                      <span className="sr-only"> em {session.device}</span>
                    </Button3D>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8 flex items-start gap-3 rounded-2xl bg-surface-soft p-5">
          <Icon name="shield" size={22} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-body-md text-text-secondary">
            Se vires uma sessão que não reconheces, fecha-a e muda já o número de acesso. É o número que autoriza os
            pagamentos e recebe as tuas vendas.{" "}
            <a href="/v2/conta/telemovel" className="font-bold text-primary underline underline-offset-4">
              Alterar número
            </a>
            .
          </p>
        </section>
      </div>
    </AppShell>
  );
}
