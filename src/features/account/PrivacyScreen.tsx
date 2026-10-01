import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";

const CONSENTS = [
  {
    key: "ranking" as const,
    label: "Mostrar o meu nome no ranking da liga",
    hint: "Se desligares, apareces como estudante anónimo, mas continuas a competir.",
  },
  {
    key: "recommendations" as const,
    label: "Receber recomendações de explicadores",
    hint: "Materiais sugeridos com base no teu curso e cadeira crítica.",
  },
  {
    key: "telemetry" as const,
    label: "Partilhar diagnósticos de consumo de dados",
    hint: "Ajuda a manter o tráfego abaixo de 5 MB por hora. Não inclui o conteúdo do que lês.",
  },
];

export type PrivacySettings = { ranking: boolean; recommendations: boolean; telemetry: boolean };

type PrivacyScreenProps = {
  userName: string;
  settings: PrivacySettings;
  exportContents: string[];
  /** Saldo do criador; bloqueia a eliminação enquanto houver dinheiro por levantar. */
  walletKz: number;
  settingsHref: string;
  financeHref: string;
};

/** Privacidade, portabilidade e eliminação de conta, nos termos da Lei n.º 22/11. */
export default function PrivacyScreen({
  userName,
  settings: initial,
  exportContents,
  walletKz,
  settingsHref,
  financeHref,
}: PrivacyScreenProps) {
  const [settings, setSettings] = useState(initial);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [confirmation, setConfirmation] = useState("");
  const toast = useToast();

  const blocked = walletKz > 0;
  const typedCorrectly = confirmation.trim().toUpperCase() === "ELIMINAR";

  return (
    <AppShell active="painel" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[820px] px-4 py-6 md:px-6 lg:py-8">
        <a
          href={settingsHref}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
        >
          <Icon name="arrow-left" size={16} />
          Voltar às definições
        </a>

        <header className="mb-7">
          <p className="flex items-center gap-2 text-overline text-primary uppercase">
            <Icon name="shield" size={16} />
            Direitos sobre os teus dados
          </p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Privacidade e dados pessoais
          </h1>
          <p className="mt-2 max-w-2xl text-body-md text-text-secondary">
            Podes descarregar o teu histórico, escolher o que é público e pedir a eliminação da conta, nos termos da
            Lei n.º 22/11, de proteção de dados pessoais.
          </p>
        </header>

        <section aria-labelledby="export-title" className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-primary">
              <Icon name="download" size={22} />
            </span>
            <div>
              <h2 id="export-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Descarregar os meus dados
              </h2>
              <p className="text-caption text-text-tertiary">Ficheiro ZIP com JSON e os comprovativos em PDF.</p>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-2.5 rounded-2xl bg-surface-soft p-4 md:grid-cols-2">
            {exportContents.map((item) => (
              <li key={item} className="flex items-start gap-2 text-caption text-text-secondary">
                <Icon name="check" size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Button3D
              variant="secondary"
              onClick={() => toast.show("Pedido registado. Avisamos por SMS quando o ficheiro estiver pronto.")}
              leadingIcon={<Icon name="download" size={18} />}
            >
              Pedir o meu ficheiro de dados
            </Button3D>
            <p className="text-caption text-text-tertiary">A ligação de descarga expira 48 horas depois de gerada.</p>
          </div>
        </section>

        <section aria-labelledby="consent-title" className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="consent-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
            O que é público
          </h2>
          <p className="mt-1 text-caption text-text-tertiary">Podes mudar estas escolhas quando quiseres.</p>

          <ul className="mt-4 divide-y-2 divide-border-cloud">
            {CONSENTS.map((consent) => (
              <li key={consent.key} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-body-md font-bold text-on-surface">{consent.label}</p>
                  <p id={`${consent.key}-hint`} className="mt-0.5 text-caption text-text-secondary">
                    {consent.hint}
                  </p>
                </div>
                <Switch
                  id={`consent-${consent.key}`}
                  checked={settings[consent.key]}
                  label={consent.label}
                  hideLabel
                  describedBy={`${consent.key}-hint`}
                  onChange={(checked) => {
                    setSettings((prev) => ({ ...prev, [consent.key]: checked }));
                    toast.show("Preferência guardada.");
                  }}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="delete-title" className="rounded-3xl border-2 border-feedback-error bg-surface-canvas p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-feedback-error-soft text-feedback-error-ink">
              <Icon name="alert" size={24} />
            </span>
            <div>
              <h2 id="delete-title" className="font-montserrat text-headline-h3 font-extrabold text-feedback-error-ink">
                Eliminar a conta
              </h2>
              <p className="text-caption text-text-secondary">Esta ação não tem retorno.</p>
            </div>
          </div>

          {blocked && (
            <p className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-4 text-body-md text-on-surface tabular-nums">
              <Icon name="wallet" size={20} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
              <span>
                Tens <strong>{formatKz(walletKz)}</strong> por levantar na carteira. Levanta o saldo antes de eliminar
                a conta.{" "}
                <a href={financeHref} className="font-bold text-primary underline underline-offset-4">
                  Ir ao painel financeiro
                </a>
                .
              </span>
            </p>
          )}

          <div className="mt-4 rounded-2xl bg-surface-soft p-4">
            <p className="text-overline text-text-secondary uppercase">O que acontece</p>
            <ul className="mt-2.5 flex flex-col gap-2 text-caption text-text-secondary">
              {[
                "Perdes o acesso às sebentas compradas, incluindo as guardadas offline.",
                "O XP, as medalhas e a posição na liga são apagados e não podem ser recuperados.",
                "Os materiais que publicaste deixam de estar à venda; quem já comprou mantém o acesso.",
                "Os registos de faturação ficam guardados pelo prazo legal de retenção fiscal.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="x" size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-error-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            {step === 0 && (
              <Button3D
                variant="ghost"
                disabled={blocked}
                className={cn("border-feedback-error text-feedback-error-ink", blocked && "opacity-100")}
                onClick={() => setStep(1)}
              >
                {blocked ? "Levanta o saldo para poder eliminar" : "Quero eliminar a minha conta"}
              </Button3D>
            )}

            {step === 1 && (
              <div className="rounded-2xl border-2 border-border-cloud p-4">
                <p className="text-body-md text-on-surface">
                  Antes de continuares: queres descarregar os teus dados? Depois de eliminada, a conta não pode ser
                  recuperada.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button3D variant="ghost" onClick={() => setStep(0)}>
                    Manter a conta
                  </Button3D>
                  <Button3D variant="secondary" onClick={() => toast.show("Pedido de exportação registado.")}>
                    Descarregar primeiro
                  </Button3D>
                  <Button3D variant="ghost" className="border-feedback-error text-feedback-error-ink" onClick={() => setStep(2)}>
                    Continuar a eliminar
                  </Button3D>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-2xl border-2 border-feedback-error p-4">
                <label htmlFor="delete-confirmation" className="block text-body-md font-bold text-on-surface">
                  Escreve ELIMINAR para confirmar
                </label>
                <p id="delete-hint" className="mt-1 mb-2 text-caption text-text-secondary">
                  Vamos pedir também uma confirmação por SMS antes de apagar seja o que for.
                </p>
                <input
                  id="delete-confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  aria-describedby="delete-hint"
                  autoComplete="off"
                  className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button3D
                    variant="ghost"
                    onClick={() => {
                      setStep(0);
                      setConfirmation("");
                    }}
                  >
                    Cancelar
                  </Button3D>
                  <Button3D
                    disabled={!typedCorrectly}
                    className="bg-feedback-error-ink text-white shadow-none hover:brightness-110"
                    onClick={() => {
                      setStep(0);
                      setConfirmation("");
                      toast.show("Pedido registado. Confirma por SMS para concluir a eliminação.", "error");
                    }}
                  >
                    Eliminar definitivamente
                  </Button3D>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
