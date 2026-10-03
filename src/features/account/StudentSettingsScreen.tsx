import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { CheckChip } from "../../components/ui/CheckChip";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { RadioCard } from "../../components/ui/RadioCard";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { CONTENT_FORMATS, DAILY_GOALS, REMINDER_SLOTS, UNIVERSITIES } from "../onboarding/catalog";
import type { ContentFormat, DailyGoal, ReminderSlot } from "../onboarding/types";
import { FACULTIES, SUBJECTS, YEARS } from "./mockAccount";
import type { StudentAccount } from "./types";

const NOTIFICATIONS = [
  { key: "streak" as const, label: "Lembrete diário da ofensiva", hint: "Um SMS por dia, à hora que escolheres." },
  { key: "newMaterials" as const, label: "Novos materiais da minha cadeira", hint: "Aviso quando sai uma sebenta nova da cadeira crítica." },
  { key: "leagues" as const, label: "Resultados da liga", hint: "Fecho de temporada e mudanças de divisão." },
];

type StudentSettingsScreenProps = {
  account: StudentAccount;
  phoneHref: string;
  downloadsHref: string;
  onSave?: (account: StudentAccount) => void;
};

/** PRF-05 do estudante: filiação, rotina, notificações, dados e conta. */
export default function StudentSettingsScreen({ account: initial, phoneHref, downloadsHref, onSave }: StudentSettingsScreenProps) {
  const [account, setAccount] = useState(initial);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const update = (patch: Partial<StudentAccount>) => setAccount((prev) => ({ ...prev, ...patch }));
  const phone = maskAOPhone(account.phone);

  function toggleFormat(value: string, checked: boolean) {
    const format = value as ContentFormat;
    update({ formats: checked ? [...account.formats, format] : account.formats.filter((f) => f !== format) });
  }

  return (
    <AppShell active="painel" userName={account.name} campus={`${account.university} · ${account.course}`}>
      <div className="mx-auto max-w-[960px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-primary uppercase">A minha conta</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">Definições</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            Ajusta a tua filiação, o ritmo de estudo e o que a Kombinu pode gastar dos teus dados.
          </p>
        </header>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSave?.(account);
            toast.show("Definições guardadas.");
          }}
        >
          <section aria-labelledby="affiliation-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="affiliation-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                  <Icon name="school" size={22} className="text-primary" />
                  Filiação universitária
                </h2>
                <p className="mt-1 text-caption text-text-secondary">
                  É daqui que saem os teus materiais, quizzes e a liga em que competes.
                </p>
              </div>
              {account.affiliationVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase">
                  <Icon name="seal" size={14} />
                  Verificada
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <SelectField
                id="settings-university"
                label="Universidade"
                options={UNIVERSITIES}
                value={account.university}
                onChange={(e) => update({ university: e.target.value })}
              />
              <SelectField
                id="settings-faculty"
                label="Faculdade ou polo"
                options={FACULTIES}
                value={FACULTIES.find((f) => f.label === account.faculty)?.value ?? FACULTIES[0].value}
                onChange={(e) => update({ faculty: FACULTIES.find((f) => f.value === e.target.value)?.label ?? account.faculty })}
              />
              <TextField
                id="settings-course"
                label="Curso"
                value={account.course}
                onChange={(e) => update({ course: e.target.value })}
              />
              <SelectField
                id="settings-year"
                label="Ano curricular"
                options={YEARS}
                value={account.year}
                onChange={(e) => update({ year: e.target.value })}
              />
              <div className="md:col-span-2">
                <SelectField
                  id="settings-subject"
                  label="Cadeira crítica do semestre"
                  hint="Recebes os quizzes diários e as resoluções desta cadeira primeiro."
                  options={SUBJECTS}
                  value={account.criticalSubject}
                  onChange={(e) => update({ criticalSubject: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="routine-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="routine-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
              <Icon name="flame" size={22} className="text-feedback-streak-ink" />
              Ritmo de estudo
            </h2>
            <p id="goal-hint" className="mt-1 mb-4 text-caption text-text-secondary">
              Define a meta que consegues cumprir todos os dias. Podes mudar quando quiseres.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
              {DAILY_GOALS.map((goal) => (
                <RadioCard
                  key={goal.value}
                  name="settings-goal"
                  describedBy="goal-hint"
                  checked={account.dailyGoal === goal.value}
                  onChange={(v) => update({ dailyGoal: v as DailyGoal })}
                  {...goal}
                />
              ))}
            </div>

            <fieldset className="m-0 mt-6 min-w-0 border-0 p-0">
              <legend className="mb-1 text-body-md font-bold text-on-surface">Formatos preferidos</legend>
              <p id="format-hint" className="mb-3 text-caption text-text-secondary">
                O teu feed diário segue esta escolha.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {CONTENT_FORMATS.map((f) => (
                  <CheckChip
                    key={f.value}
                    name="settings-formats"
                    value={f.value}
                    label={f.label}
                    icon={f.icon}
                    describedBy="format-hint"
                    checked={account.formats.includes(f.value)}
                    onChange={toggleFormat}
                  />
                ))}
              </div>
            </fieldset>

            <div className="mt-6 max-w-md">
              <SelectField
                id="settings-reminder"
                label="Hora do lembrete diário"
                options={REMINDER_SLOTS}
                value={account.reminder}
                onChange={(e) => update({ reminder: e.target.value as ReminderSlot })}
              />
            </div>
          </section>

          <section aria-labelledby="notif-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="notif-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
              <Icon name="bell" size={22} className="text-primary" />
              Notificações
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {NOTIFICATIONS.map((n) => (
                <li key={n.key} className="flex items-center justify-between gap-4 rounded-2xl bg-surface-soft p-4">
                  <span>
                    <span className="block text-body-md text-on-surface">{n.label}</span>
                    <span id={`${n.key}-hint`} className="block text-caption text-text-tertiary">
                      {n.hint}
                    </span>
                  </span>
                  <Switch
                    id={`notif-${n.key}`}
                    checked={account.notifications[n.key]}
                    label={n.label}
                    hideLabel
                    describedBy={`${n.key}-hint`}
                    onChange={(checked) => update({ notifications: { ...account.notifications, [n.key]: checked } })}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="data-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="data-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
              <Icon name="bolt" size={22} className="text-feedback-success-ink" />
              Dados móveis
            </h2>
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-surface-soft p-4">
              <span>
                <span className="block text-body-md text-on-surface">Modo de poupança de dados</span>
                <span id="saver-hint" className="block text-caption text-text-tertiary">
                  Imagens substituídas por diagramas leves e descargas só por Wi-Fi.
                </span>
              </span>
              <Switch
                id="data-saver"
                checked={account.dataSaver}
                label="Modo de poupança de dados"
                hideLabel
                describedBy="saver-hint"
                onChange={(checked) => update({ dataSaver: checked })}
              />
            </div>
            <LinkButton3D href={downloadsHref} variant="ghost" className="mt-4" trailingIcon={<Icon name="arrow-right" size={18} />}>
              Gerir descargas offline
            </LinkButton3D>
          </section>

          <div className="flex justify-end">
            <Button3D type="submit" size="lg" className="w-full sm:w-auto" leadingIcon={<Icon name="check" size={20} strokeWidth={3} />}>
              Guardar alterações
            </Button3D>
          </div>
        </form>

        <section aria-labelledby="security-title" className="mt-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="security-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
            <Icon name="lock" size={22} className="text-primary" />
            Conta e segurança
          </h2>

          <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl bg-surface-soft p-4 md:flex-row md:items-center">
            <p>
              <span className="block text-body-md font-bold text-on-surface tabular-nums" aria-hidden="true">
                {phone.visual}
              </span>
              <span className="sr-only">Número atual, {phone.spoken}</span>
              <span className="block text-caption text-text-tertiary">
                Serve para entrar na conta e para os pagamentos por Multicaixa Express.
              </span>
            </p>
            <LinkButton3D href={phoneHref} variant="secondary">
              Alterar número
            </LinkButton3D>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl bg-surface-soft p-4 md:flex-row md:items-center">
            <p>
              <span className="block text-body-md font-bold text-on-surface">{account.institutionalEmail}</span>
              <span className="block text-caption text-text-tertiary">
                {account.emailVerified ? "E-mail institucional verificado" : "E-mail por verificar"}
              </span>
            </p>
            {!account.emailVerified && (
              <Button3D variant="ghost" onClick={() => toast.show("Enviámos uma ligação de confirmação.")}>
                Verificar agora
              </Button3D>
            )}
          </div>

          <div className="mt-6 rounded-2xl border-2 border-border-cloud p-4">
            {deleting ? (
              <div className="flex flex-col gap-3">
                <p className="text-body-md text-on-surface">
                  Eliminar a conta apaga o teu progresso, as medalhas e o acesso às sebentas compradas. Esta ação não
                  tem retorno. Preferes exportar os teus dados primeiro?
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button3D variant="ghost" onClick={() => setDeleting(false)}>
                    Manter a conta
                  </Button3D>
                  <Button3D variant="ghost" onClick={() => toast.show("Vamos preparar o teu ficheiro de dados.")}>
                    Exportar dados
                  </Button3D>
                  <Button3D
                    className="bg-feedback-error-ink text-white shadow-none hover:brightness-110"
                    onClick={() => {
                      setDeleting(false);
                      toast.show("Pedido registado. Confirmamos por SMS antes de eliminar.", "error");
                    }}
                  >
                    Eliminar conta
                  </Button3D>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDeleting(true)}
                className="min-h-11 text-button text-text-secondary uppercase hover:text-feedback-error-ink"
              >
                Eliminar a minha conta
              </button>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
