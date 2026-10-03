import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { formatAOPhone } from "../../components/ui/PhoneInputAO";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";

const BIO_MAX = 280;

const INSTITUTIONS = [
  { value: "uan-economia", label: "Universidade Agostinho Neto (UAN) — Economia" },
  { value: "ucan-direito", label: "Universidade Católica de Angola (UCAN) — Direito e Gestão" },
  { value: "ula", label: "Universidade Lusíada de Angola — Ciências Económicas" },
  { value: "isptec", label: "ISPTEC — Engenharias" },
];

const NOTIFICATIONS = [
  { id: "streak", label: "Lembretes de ofensiva e prazos por SMS", hint: "Chegam ao número registado, sem gastar dados." },
  { id: "questions", label: "Dúvidas novas dos estudantes", hint: "Aviso no estúdio assim que alguém pergunta." },
  { id: "sales", label: "Vendas e repasses Multicaixa Express", hint: "Notificação a cada compra aprovada." },
] as const;

export type AccountSettings = {
  name: string;
  institution: string;
  bio: string;
  phone: string;
  phoneVerified: boolean;
  plan: "pro" | "free";
  planPriceKz: number;
  renewsAt: string;
  notifications: Record<string, boolean>;
};

type AccountSettingsScreenProps = {
  settings: AccountSettings;
  onSave?: (settings: AccountSettings) => void;
  onChangePlan: () => void;
};

/** PRF-05 — definições da conta e subscrição, em modo criador. */
export default function AccountSettingsScreen({ settings: initial, onSave, onChangePlan }: AccountSettingsScreenProps) {
  const [settings, setSettings] = useState(initial);
  const [cancelling, setCancelling] = useState(false);
  const toast = useToast();

  const update = (patch: Partial<AccountSettings>) => setSettings((prev) => ({ ...prev, ...patch }));
  const bioLeft = BIO_MAX - settings.bio.length;
  const renewsLabel = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(settings.renewsAt),
  );

  return (
    <CreatorShell active="definicoes" creatorName={settings.name}>
      <div className="mx-auto flex max-w-[1000px] flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
        <header>
          <p className="text-overline text-text-tertiary uppercase">Conta e subscrição</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Definições da conta
          </h1>
        </header>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSave?.(settings);
            toast.show("Definições guardadas.");
          }}
        >
          <section aria-labelledby="profile-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-3xl border-b-2 border-border-cloud bg-surface-soft p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                  <Icon name="school" size={22} />
                </span>
                <div>
                  <h2 id="profile-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                    Perfil académico
                  </h2>
                  <p className="text-caption text-text-tertiary">Visível na tua vitrine e antes de cada compra.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase">
                <Icon name="seal" size={14} />
                Autor verificado
              </span>
            </div>

            <div className="flex flex-col gap-6 p-5 sm:p-6">
              <div className="flex flex-col items-start gap-4 rounded-2xl bg-surface-soft p-4 sm:flex-row sm:items-center">
                <Avatar name={settings.name} size="lg" />
                <div className="flex-1">
                  <p className="text-body-md font-bold text-on-surface">Fotografia de perfil</p>
                  <p className="text-caption text-text-tertiary">JPG ou PNG até 2 MB. Aparece ao lado de cada material.</p>
                </div>
                <div className="flex gap-2">
                  <Button3D variant="ghost" onClick={() => toast.show("Escolha de fotografia em breve.")}>
                    Alterar
                  </Button3D>
                  <Button3D variant="ghost" onClick={() => toast.show("Fotografia removida.")}>
                    Remover
                  </Button3D>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <TextField
                  id="account-name"
                  label="Nome como aparece aos estudantes"
                  value={settings.name}
                  autoComplete="name"
                  onChange={(e) => update({ name: e.target.value })}
                />
                <SelectField
                  id="account-institution"
                  label="Instituição e faculdade"
                  options={INSTITUTIONS}
                  value={settings.institution}
                  onChange={(e) => update({ institution: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="account-bio" className="mb-2 block text-body-md font-bold text-on-surface">
                  Bio académica
                </label>
                <textarea
                  id="account-bio"
                  rows={3}
                  maxLength={BIO_MAX}
                  value={settings.bio}
                  aria-describedby="bio-counter"
                  onChange={(e) => update({ bio: e.target.value })}
                  className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
                />
                <p
                  id="bio-counter"
                  className={cn("mt-1 text-caption tabular-nums", bioLeft < 20 ? "font-bold text-feedback-streak-ink" : "text-text-tertiary")}
                >
                  Faltam {bioLeft} caracteres de {BIO_MAX}.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="notif-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="notif-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Notificações
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {NOTIFICATIONS.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-4 rounded-2xl bg-surface-soft p-4">
                  <span>
                    <span className="block text-body-md text-on-surface">{n.label}</span>
                    <span id={`${n.id}-hint`} className="block text-caption text-text-tertiary">
                      {n.hint}
                    </span>
                  </span>
                  <Switch
                    id={`notif-${n.id}`}
                    checked={settings.notifications[n.id] ?? false}
                    describedBy={`${n.id}-hint`}
                    label={n.label}
                    hideLabel
                    onChange={(checked) => update({ notifications: { ...settings.notifications, [n.id]: checked } })}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="phone-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <Icon name="phone" size={22} />
              </span>
              <div>
                <h2 id="phone-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                  Telemóvel e Multicaixa Express
                </h2>
                <p className="text-caption text-text-tertiary">Serve para entrar na conta e para receber as vendas.</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl bg-surface-soft p-4 md:flex-row md:items-center">
              <p className="flex flex-wrap items-center gap-3">
                <span className="rounded-xl bg-surface-canvas px-3 py-2 text-body-lg font-bold text-on-surface tabular-nums">
                  +244 {formatAOPhone(settings.phone)}
                </span>
                {settings.phoneVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-forest px-3 py-1 text-caption font-bold text-feedback-success">
                    <Icon name="check" size={15} strokeWidth={3} />
                    Verificado por SMS
                  </span>
                )}
              </p>
              <Button3D variant="ghost" onClick={() => toast.show("Enviámos um código para confirmar o novo número.")}>
                Atualizar número
              </Button3D>
            </div>
          </section>

          <div className="flex justify-end">
            <Button3D type="submit" size="lg" className="w-full sm:w-auto" leadingIcon={<Icon name="check" size={20} strokeWidth={3} />}>
              Guardar alterações
            </Button3D>
          </div>
        </form>

        <section aria-labelledby="plan-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="plan-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
            Subscrição
          </h2>

          <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl bg-surface-sky p-5 md:flex-row md:items-center">
            <div>
              <p className="flex items-center gap-2">
                <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-overline text-surface-ink uppercase">
                  {settings.plan === "pro" ? "Kombinu Pro" : "Plano grátis"}
                </span>
                {settings.plan === "pro" && (
                  <span className="text-body-md font-bold text-primary tabular-nums">
                    {formatKz(settings.planPriceKz)}/mês
                  </span>
                )}
              </p>
              <p className="mt-1 text-caption text-text-secondary">
                {settings.plan === "pro"
                  ? `Renova a ${renewsLabel}, por Multicaixa Express.`
                  : "A Kombinu retém 30% de cada venda no plano grátis."}
              </p>
            </div>
            <Button3D variant={settings.plan === "pro" ? "ghost" : "primary"} onClick={onChangePlan}>
              {settings.plan === "pro" ? "Mudar de plano" : "Ver o plano Pro"}
            </Button3D>
          </div>

          {settings.plan === "pro" && (
            <div className="mt-4 rounded-2xl border-2 border-border-cloud p-4">
              {cancelling ? (
                <div className="flex flex-col gap-3">
                  <p className="text-body-md text-on-surface">
                    Ao cancelar, ficas no plano Pro até {renewsLabel}. Depois passas ao plano grátis, com 30% de
                    comissão. Os materiais já publicados continuam no marketplace.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button3D variant="ghost" onClick={() => setCancelling(false)}>
                      Manter o Pro
                    </Button3D>
                    <Button3D
                      className="bg-feedback-error-ink text-white shadow-none hover:brightness-110"
                      onClick={() => {
                        setCancelling(false);
                        toast.show(`Subscrição cancelada. Tens o Pro até ${renewsLabel}.`, "error");
                      }}
                    >
                      Confirmar cancelamento
                    </Button3D>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCancelling(true)}
                  className="min-h-11 text-button text-text-secondary uppercase hover:text-feedback-error-ink"
                >
                  Cancelar subscrição
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </CreatorShell>
  );
}
