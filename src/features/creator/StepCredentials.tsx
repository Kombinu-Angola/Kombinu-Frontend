import type { FormEvent } from "react";
import { SelectField, TextField } from "../../components/ui/Field";
import { TagInput } from "../../components/ui/TagInput";
import { AFFILIATIONS, INSTITUTIONS } from "./constants";
import { CreatorStepLayout, StepFooter } from "./CreatorStepLayout";
import type { FieldErrors, StepProps } from "./types";
import { useFieldErrors } from "../../hooks/useFieldErrors";

const ORDER = ["full-name", "institution-other", "specialties"];

/** Creator-01 — Dados e vínculo académico. */
export function StepCredentials({ application: app, update, onNext, onBack }: StepProps) {
  const { errors, check, clear } = useFieldErrors(ORDER);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: FieldErrors = {};
    if (app.fullName.trim().split(/\s+/).length < 2)
      next["full-name"] = "Indique o nome e o apelido, tal como constam no documento de identificação.";
    if (app.institution === "other" && !app.institutionOther.trim())
      next["institution-other"] = "Indique o nome da instituição.";
    if (app.specialties.length === 0) next.specialties = "Adicione pelo menos uma cadeira que pretende ensinar.";
    if (check(next)) onNext();
  }

  return (
    <CreatorStepLayout
      step={0}
      onBack={onBack}
      backLabel="Voltar à escolha de perfil"
      eyebrow="Credenciamento de criador"
      title="Credenciais académicas e cadeiras que ensina"
      lead="Todos os autores passam por uma auditoria antes de publicar. Assim, os estudantes sabem que cada sebenta vem de quem domina a matéria."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <TextField
          id="full-name"
          label="Nome completo"
          hint="Tal como consta no documento que vai carregar no passo seguinte."
          required
          autoComplete="name"
          placeholder="Ex.: António Manuel da Costa"
          value={app.fullName}
          error={errors["full-name"]}
          onChange={(e) => {
            update({ fullName: e.target.value });
            clear("full-name");
          }}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            id="institution"
            label="Instituição de ensino"
            options={INSTITUTIONS}
            value={app.institution}
            onChange={(e) => update({ institution: e.target.value })}
          />
          <SelectField
            id="affiliation"
            label="Vínculo académico"
            options={AFFILIATIONS}
            value={app.affiliation}
            onChange={(e) => update({ affiliation: e.target.value })}
          />
        </div>

        {app.institution === "other" && (
          <TextField
            id="institution-other"
            label="Nome da instituição"
            required
            value={app.institutionOther}
            error={errors["institution-other"]}
            onChange={(e) => {
              update({ institutionOther: e.target.value });
              clear("institution-other");
            }}
          />
        )}

        <TagInput
          id="specialties"
          label="Cadeiras que pretende ensinar"
          hint="Escreva o nome da cadeira e prima Enter. Até 8."
          required
          itemName="cadeira"
          placeholder="Ex.: Economia Monetária"
          values={app.specialties}
          error={errors.specialties}
          onChange={(specialties) => {
            update({ specialties });
            clear("specialties");
          }}
        />

        <StepFooter
          note="Os seus dados são confidenciais e tratados ao abrigo da Lei de Proteção de Dados Pessoais."
          submitLabel="Continuar"
        />
      </form>
    </CreatorStepLayout>
  );
}
