import type { FormEvent } from "react";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { Pill } from "../../components/ui/Pill";
import { useFieldErrors, type FieldErrors } from "../../hooks/useFieldErrors";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { COURSES, SUBJECT_SUGGESTIONS, UNIVERSITIES, YEARS } from "./catalog";
import { OnboardingShell } from "./OnboardingShell";
import type { StudentProfile } from "./types";

type StepAffiliationProps = {
  profile: StudentProfile;
  update: (patch: Partial<StudentProfile>) => void;
  onNext: () => void;
  onBack: () => void;
};

const ORDER = ["university", "course", "year", "critical-subject"];

/** Onboarding, passo 1 — universidade, curso, ano e cadeira crítica. */
export function StepAffiliation({ profile, update, onNext, onBack }: StepAffiliationProps) {
  const headingRef = useFocusOnMount();
  const { errors, check, clear } = useFieldErrors(ORDER);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: FieldErrors = {};
    if (!profile.university) next.university = "Escolhe a tua universidade.";
    if (!profile.course) next.course = "Escolhe o teu curso.";
    if (!profile.year) next.year = "Escolhe o ano que estás a frequentar.";
    if (!profile.criticalSubject.trim())
      next["critical-subject"] = "Indica uma cadeira. Usamo-la para montar o teu diagnóstico.";
    if (check(next)) onNext();
  }

  const field = <K extends keyof StudentProfile>(key: K, errorKey: string) => ({
    error: errors[errorKey],
    onChange: (e: { target: { value: string } }) => {
      update({ [key]: e.target.value } as Partial<StudentProfile>);
      clear(errorKey);
    },
  });

  return (
    <OnboardingShell stepIndex={0} onBack={onBack} backLabel="Voltar à escolha de perfil">
      <div className="mt-8 mb-8">
        <Pill tone="sky" icon={<Icon name="school" size={14} />} className="mb-3">
          Onboarding académico
        </Pill>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
        >
          Onde estudas e que cadeira te tira o sono?
        </h1>
        <p className="mt-3 text-body-lg text-pretty text-text-secondary">
          Montamos os teus resumos e desafios a partir do plano curricular do teu curso.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <SelectField
          id="university"
          label="Universidade"
          placeholder="Escolhe a tua universidade"
          options={UNIVERSITIES}
          required
          value={profile.university}
          autoComplete="organization"
          {...field("university", "university")}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            id="course"
            label="Curso"
            placeholder="Escolhe o curso"
            options={COURSES}
            required
            value={profile.course}
            {...field("course", "course")}
          />
          <SelectField
            id="year"
            label="Ano curricular"
            placeholder="Ano atual"
            options={YEARS}
            required
            value={profile.year}
            {...field("year", "year")}
          />
        </div>
        <TextField
          id="critical-subject"
          label="A cadeira que mais te preocupa"
          hint="É por ela que começamos. Podes mudar depois."
          required
          list="subject-suggestions"
          placeholder="Ex.: Macroeconomia I"
          autoComplete="off"
          value={profile.criticalSubject}
          {...field("criticalSubject", "critical-subject")}
        />
        <datalist id="subject-suggestions">
          {SUBJECT_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>

        <footer className="mt-2 flex flex-col items-center justify-between gap-4 border-t border-border-cloud pt-6 sm:flex-row">
          <p className="flex items-center gap-2 text-caption text-text-tertiary">
            <Icon name="lock" size={16} className="shrink-0 text-primary" />
            Só usamos estes dados para personalizar os teus conteúdos.
          </p>
          <Button3D
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            trailingIcon={<Icon name="arrow-right" size={20} />}
          >
            Fazer o diagnóstico
          </Button3D>
        </footer>
      </form>
    </OnboardingShell>
  );
}
