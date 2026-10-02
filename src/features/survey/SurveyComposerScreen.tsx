import { useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import type { SurveyDraft, SurveyKind, SurveyTrigger } from "./types";

const MAX_QUESTION = 140;
const MIN_DECISION = 20;
/** Teto aplicado pelo servidor: uma enquete por sessão e duas por semana e por estudante. */
const WEEKLY_CAP = 2;

const KINDS: ReadonlyArray<{ value: SurveyKind; label: string; hint: string; options: string[] }> = [
  { value: "escala", label: "Escala de 1 a 5", hint: "Boa para intensidade: tempo, dificuldade, clareza", options: ["Muito curto", "Apertado", "Suficiente", "Folgado", "Excessivo"] },
  { value: "escolha", label: "Escolha única", hint: "Duas a quatro opções concretas", options: ["Opção A", "Opção B", "Opção C"] },
  { value: "binaria", label: "Sim ou não", hint: "A mais rápida de responder", options: ["Sim", "Não"] },
];

const TRIGGERS: ReadonlyArray<{ value: SurveyTrigger; label: string }> = [
  { value: "fim-simulado", label: "Depois do resultado de um simulado" },
  { value: "fim-leitura", label: "No fim de uma leitura" },
  { value: "fim-modulo", label: "Ao concluir um módulo da trilha" },
];

const FACULTIES = [
  { value: "uan-economia", label: "UAN — Faculdade de Economia" },
  { value: "uan-engenharia", label: "UAN — Faculdade de Engenharia" },
  { value: "todas", label: "Todas as faculdades onde publico" },
];

const SUBJECTS = [
  { value: "macro1", label: "Macroeconomia I" },
  { value: "macro2", label: "Macroeconomia II" },
  { value: "todas", label: "Todas as minhas cadeiras" },
];

type SurveyComposerScreenProps = { draft: SurveyDraft; creatorName: string };

/** Compositor de micro-enquete: uma pergunta, dez segundos, e uma decisão escrita à partida. */
export default function SurveyComposerScreen({ draft: initial, creatorName }: SurveyComposerScreenProps) {
  const [draft, setDraft] = useState(initial);
  const [preview, setPreview] = useState<number | null>(null);
  const toast = useToast();

  const update = (patch: Partial<SurveyDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const decisionOk = draft.decision.trim().length >= MIN_DECISION;
  const questionOk = draft.question.trim().length >= 10 && draft.question.length <= MAX_QUESTION;
  const canActivate = decisionOk && questionOk;

  // Estimativa de recolha: quantos veem a enquete por dia e qual a taxa de resposta esperada.
  const estimate = useMemo(() => {
    const dailyViews = Math.round(draft.segmentSize * 0.18);
    const expectedAnswers = Math.round(dailyViews * 0.55);
    const days = expectedAnswers === 0 ? 0 : Math.ceil(draft.sampleTarget / expectedAnswers);
    return { dailyViews, expectedAnswers, days };
  }, [draft.segmentSize, draft.sampleTarget]);

  return (
    <CreatorShell
      active="materiais"
      creatorName={creatorName}
      actions={
        <>
          <Button3D variant="ghost" onClick={() => toast.show("Rascunho guardado.")}>
            Guardar rascunho
          </Button3D>
          <Button3D
            disabled={!canActivate}
            aria-describedby={canActivate ? undefined : "activate-hint"}
            onClick={() => toast.show("Micro-enquete ativa. Começa a aparecer no próximo simulado concluído.")}
          >
            Ativar enquete
          </Button3D>
        </>
      }
    >
      <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Escuta rápida</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Compositor de micro-enquete
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            Uma pergunta só, no fim de um material. Demora dez segundos a responder e pode ser dispensada com um
            toque.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <section
              aria-labelledby="decision-title"
              className={cn(
                "rounded-3xl border-2 bg-surface-canvas p-5 sm:p-6",
                decisionOk ? "border-feedback-success" : "border-feedback-streak",
              )}
            >
              <h2 id="decision-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                1. O que vais fazer com a resposta
              </h2>
              <p id="decision-hint" className="mt-1 mb-3 text-caption text-text-secondary">
                Obrigatório. Escrever a decisão antes de perguntar é o melhor filtro contra perguntas que não levam a
                nada.
              </p>
              <label htmlFor="survey-decision" className="sr-only">
                Decisão associada à enquete
              </label>
              <textarea
                id="survey-decision"
                rows={2}
                value={draft.decision}
                aria-describedby="decision-hint"
                onChange={(e) => update({ decision: e.target.value })}
                placeholder="Ex.: se mais de metade disser que o tempo é curto, subo para 120 segundos e volto a medir."
                className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
              />
              {!decisionOk && draft.decision.length > 0 && (
                <p className="mt-1.5 text-caption font-bold text-feedback-streak-ink">
                  Descreve a decisão em pelo menos {MIN_DECISION} caracteres.
                </p>
              )}
            </section>

            <section aria-labelledby="question-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
              <h2 id="question-title" className="mb-4 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                2. A pergunta
              </h2>

              <fieldset className="m-0 mb-5 min-w-0 border-0 p-0">
                <legend className="mb-2 text-body-md font-bold text-on-surface">Tipo de resposta</legend>
                <div className="flex flex-col gap-2">
                  {KINDS.map((kind) => (
                    <label
                      key={kind.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-[border-color,background-color] duration-150",
                        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
                        draft.kind === kind.value ? "border-brand-ocean bg-surface-sky" : "border-border-cloud bg-surface-canvas hover:border-brand-ocean",
                      )}
                    >
                      <input
                        type="radio"
                        name="survey-kind"
                        checked={draft.kind === kind.value}
                        onChange={() => update({ kind: kind.value, options: kind.options })}
                        className="size-5 cursor-pointer accent-brand-ocean"
                      />
                      <span>
                        <span className="block text-body-md font-bold text-on-surface">{kind.label}</span>
                        <span className="block text-caption text-text-tertiary">{kind.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="survey-question" className="mb-2 block text-body-md font-bold text-on-surface">
                Pergunta
              </label>
              <textarea
                id="survey-question"
                rows={2}
                maxLength={MAX_QUESTION}
                value={draft.question}
                aria-describedby="question-counter"
                onChange={(e) => update({ question: e.target.value })}
                className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
              />
              <p
                id="question-counter"
                className={cn(
                  "mt-1 text-caption tabular-nums",
                  draft.question.length > MAX_QUESTION - 20 ? "font-bold text-feedback-streak-ink" : "text-text-tertiary",
                )}
              >
                {MAX_QUESTION - draft.question.length} caracteres restantes.
              </p>

              {draft.kind === "escolha" && (
                <fieldset className="m-0 mt-5 min-w-0 border-0 p-0">
                  <legend className="mb-2 text-body-md font-bold text-on-surface">Opções</legend>
                  <div className="flex flex-col gap-2">
                    {draft.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <label htmlFor={`opt-${index}`} className="sr-only">
                          Opção {index + 1}
                        </label>
                        <input
                          id={`opt-${index}`}
                          value={option}
                          onChange={(e) => update({ options: draft.options.map((o, i) => (i === index ? e.target.value : o)) })}
                          className="min-h-11 flex-1 rounded-lg border-2 border-border-input bg-surface-canvas px-3 text-body-md text-on-surface"
                        />
                        {draft.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => update({ options: draft.options.filter((_, i) => i !== index) })}
                            aria-label={`Remover a opção ${index + 1}`}
                            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:bg-feedback-error-soft hover:text-feedback-error-ink"
                          >
                            <Icon name="trash" size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {draft.options.length < 4 && (
                    <button
                      type="button"
                      onClick={() => update({ options: [...draft.options, ""] })}
                      className="mt-2 flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button text-primary uppercase hover:bg-surface-sky"
                    >
                      <Icon name="plus" size={18} />
                      Adicionar opção
                    </button>
                  )}
                </fieldset>
              )}
            </section>

            <section aria-labelledby="segment-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
              <h2 id="segment-title" className="mb-4 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                3. A quem aparece, e quando
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SelectField id="survey-faculty" label="Faculdade" options={FACULTIES} value={draft.faculty} onChange={(e) => update({ faculty: e.target.value })} />
                <SelectField id="survey-subject" label="Cadeira" options={SUBJECTS} value={draft.subject} onChange={(e) => update({ subject: e.target.value })} />
                <div className="md:col-span-2">
                  <SelectField
                    id="survey-trigger"
                    label="Momento"
                    hint="Nunca antes do resultado: primeiro o estudante vê o que fez, só depois é que lhe perguntamos."
                    options={TRIGGERS}
                    value={draft.trigger}
                    onChange={(e) => update({ trigger: e.target.value as SurveyTrigger })}
                  />
                </div>
                <div>
                  <label htmlFor="sample-target" className="mb-2 block text-body-md font-bold text-on-surface">
                    Amostra pretendida
                  </label>
                  <input
                    id="sample-target"
                    type="number"
                    min={30}
                    max={draft.segmentSize}
                    step={10}
                    value={draft.sampleTarget}
                    onChange={(e) => update({ sampleTarget: Number(e.target.value) })}
                    className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface tabular-nums"
                  />
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-surface-soft p-3.5 text-caption text-text-secondary tabular-nums">
                <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-primary" />
                O segmento tem {draft.segmentSize} estudantes. Pelo ritmo atual, chegas às {draft.sampleTarget}{" "}
                respostas em cerca de {estimate.days} {estimate.days === 1 ? "dia" : "dias"}.
              </p>

              <p className="mt-2 flex items-start gap-2 rounded-2xl bg-surface-soft p-3.5 text-caption text-text-secondary tabular-nums">
                <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                Limite da plataforma: no máximo uma enquete por sessão e {WEEKLY_CAP} por semana e por estudante. Se o
                teto for atingido, a tua enquete espera a vez.
              </p>
            </section>
          </div>

          <aside aria-labelledby="preview-title" className="lg:col-span-5 lg:sticky lg:top-24">
            <h2 id="preview-title" className="mb-3 text-overline text-text-tertiary uppercase">
              4. Como o estudante vai ver
            </h2>

            <div className="rounded-3xl border-2 border-border-cloud bg-surface-soft p-5">
              <div className="mx-auto max-w-[340px] rounded-3xl border-2 border-border-cloud bg-surface-canvas p-4 shadow-clay">
                <p className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sky px-2.5 py-1 text-overline text-primary uppercase">
                    <Icon name="comment" size={13} />
                    10 segundos
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full text-text-tertiary">
                    <Icon name="x" size={18} />
                  </span>
                </p>

                <p className="text-body-lg font-bold text-balance text-on-surface">
                  {draft.question || "A tua pergunta aparece aqui."}
                </p>

                <ul className="mt-3 flex flex-col gap-2">
                  {draft.options.map((option, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => setPreview(index)}
                        aria-pressed={preview === index}
                        className={cn(
                          "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border-2 px-3 text-caption transition-[border-color,background-color] duration-150",
                          preview === index
                            ? "border-brand-ocean bg-surface-sky font-bold text-primary"
                            : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean",
                        )}
                      >
                        {draft.kind === "escala" ? `${index + 1}. ${option}` : option}
                        {preview === index && <Icon name="check" size={16} strokeWidth={3} />}
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-center text-caption text-text-tertiary">
                  {preview === null ? "Dispensar sem responder" : "Obrigado. O resultado é partilhado contigo."}
                </p>
              </div>

              <p className="mt-4 text-center text-caption text-text-secondary">
                A pré-visualização é interativa: experimenta responder.
              </p>
            </div>

            {!canActivate && (
              <p id="activate-hint" className="mt-3 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-3 text-caption font-bold text-feedback-streak-ink">
                Para ativar: {!decisionOk && "escreve a decisão associada"}
                {!decisionOk && !questionOk && " e "}
                {!questionOk && "escreve a pergunta"}.
              </p>
            )}
          </aside>
        </div>
      </div>
    </CreatorShell>
  );
}
