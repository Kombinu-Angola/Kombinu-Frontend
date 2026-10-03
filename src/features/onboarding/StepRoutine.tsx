import type { FormEvent } from "react";
import { Button3D } from "../../components/ui/Button3D";
import { CheckChip } from "../../components/ui/CheckChip";
import { FieldError, SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { isValidAOPhone, PhoneInputAO } from "../../components/ui/PhoneInputAO";
import { RadioCard } from "../../components/ui/RadioCard";
import { useFieldErrors, type FieldErrors } from "../../hooks/useFieldErrors";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { CONTENT_FORMATS, DAILY_GOALS, REMINDER_SLOTS } from "./catalog";
import { OnboardingShell } from "./OnboardingShell";
import type { ContentFormat, DailyGoal, ReminderSlot, StudentProfile } from "./types";

type StepRoutineProps = {
  profile: StudentProfile;
  update: (patch: Partial<StudentProfile>) => void;
  onNext: () => void;
  onBack: () => void;
  /** Resultado do diagnóstico, para o selo do cabeçalho. */
  accuracy?: number;
};

const ORDER = ["format-text", "sms-phone"];

/** Onboarding, passo 3 — meta diária, formatos preferidos e lembrete. */
export function StepRoutine({ profile, update, onNext, onBack, accuracy }: StepRoutineProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const { errors, check, clear } = useFieldErrors(ORDER);

  function toggleFormat(value: string, checked: boolean) {
    const format = value as ContentFormat;
    update({ formats: checked ? [...profile.formats, format] : profile.formats.filter((f) => f !== format) });
    clear("format-text");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: FieldErrors = {};
    if (profile.formats.length === 0) next["format-text"] = "Escolhe pelo menos um formato.";
    if (profile.smsReminder && !isValidAOPhone(profile.phone))
      next["sms-phone"] = "O número tem de ter 9 dígitos e começar por 9, por exemplo 923 000 000.";
    if (check(next)) onNext();
  }

  const accuracyBadge =
    accuracy === undefined ? undefined : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sky px-3 py-1 text-overline text-primary uppercase">
        <Icon name="target" size={14} />
        Diagnóstico: {accuracy}%
      </span>
    );

  return (
    <OnboardingShell
      stepIndex={2}
      onBack={onBack}
      backLabel="Voltar ao diagnóstico (o teste recomeça)"
      aside={accuracyBadge}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-10">
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="w-full">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
            >
              Quanto tempo queres estudar por dia?
            </h1>
          </legend>
          <p id="goal-hint" className="mt-2 mb-6 text-body-lg text-text-secondary">
            Escolhe uma meta realista. Podes ajustá-la quando quiseres.
          </p>
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
            {DAILY_GOALS.map((goal) => (
              <RadioCard
                key={goal.value}
                name="daily-goal"
                describedBy="goal-hint"
                checked={profile.dailyGoal === goal.value}
                onChange={(v) => update({ dailyGoal: v as DailyGoal })}
                {...goal}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="text-headline-h3 text-on-surface">Como preferes aprender?</legend>
          <p id="format-hint" className="mt-1 mb-4 text-body-md text-text-secondary">
            Escolhe um ou mais formatos. O teu feed diário segue esta escolha.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {CONTENT_FORMATS.map((f, i) => (
              <CheckChip
                  key={f.value}
                  id={i === 0 ? "format-text" : undefined}
                  name="formats"
                  value={f.value}
                  label={f.label}
                  icon={f.icon}
                  checked={profile.formats.includes(f.value)}
                  onChange={toggleFormat}
                  describedBy={errors["format-text"] ? "format-hint format-text-error" : "format-hint"}
                />
            ))}
          </div>
          <div className="mt-3">
            <FieldError id="format-text" error={errors["format-text"]} />
          </div>
        </fieldset>

        <fieldset className="m-0 min-w-0 rounded-2xl border-0 bg-surface-soft p-5 sm:p-6">
          <legend className="float-left mb-1 flex w-full items-center gap-2 text-headline-h3 text-on-surface">
            <Icon name="flame" size={22} className="text-feedback-streak-ink" />
            Lembrete para manter a sequência
          </legend>
          <p className="clear-both mb-5 text-body-md text-text-secondary">
            Enviamos um lembrete por dia, só à hora que escolheres.
          </p>
          <div className="grid gap-5">
            <SelectField
              id="reminder"
              label="Hora do lembrete"
              options={REMINDER_SLOTS}
              value={profile.reminder}
              onChange={(e) => update({ reminder: e.target.value as ReminderSlot })}
            />
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={profile.smsReminder}
                onChange={(e) => {
                  update({ smsReminder: e.target.checked });
                  clear("sms-phone");
                }}
                className="mt-0.5 size-6 shrink-0 cursor-pointer accent-brand-ocean"
              />
              <span className="text-body-md text-on-surface">
                Receber também por SMS <span className="font-bold text-feedback-success-ink">(gratuito)</span>
                <span className="block text-caption text-text-tertiary">
                  Útil quando não tens dados móveis ativos.
                </span>
              </span>
            </label>
            {profile.smsReminder && (
              <div className="max-w-md">
                <PhoneInputAO
                  id="sms-phone"
                  label="Número de telemóvel"
                  value={profile.phone}
                  error={errors["sms-phone"]}
                  onChange={(phone) => {
                    update({ phone });
                    clear("sms-phone");
                  }}
                />
              </div>
            )}
          </div>
        </fieldset>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-border-cloud pt-6 sm:flex-row">
          <p className="text-caption text-text-tertiary">
            Ao concluir, desbloqueias a tua <strong className="text-on-surface">árvore de competências</strong>.
          </p>
          <Button3D
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            trailingIcon={<Icon name="arrow-right" size={20} />}
          >
            Concluir perfil
          </Button3D>
        </footer>
      </form>
    </OnboardingShell>
  );
}
