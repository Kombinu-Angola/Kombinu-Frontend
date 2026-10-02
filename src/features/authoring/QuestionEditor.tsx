import { useMemo, useState } from "react";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { SlideOver } from "../../components/ui/SlideOver";
import { cn } from "@/lib/utils";
import type { Question, QuestionType, Topic } from "./types";

const TYPES: ReadonlyArray<{ value: QuestionType; label: string; hint: string }> = [
  { value: "escolha", label: "Escolha múltipla", hint: "3 a 5 alternativas, uma correta" },
  { value: "vf", label: "Verdadeiro ou falso", hint: "Rápida de responder e de calibrar" },
  { value: "numerico", label: "Resposta numérica", hint: "Cálculo com valor exato" },
];

const DIFFICULTIES = [
  { value: "1", label: "Fácil: fixação direta" },
  { value: "2", label: "Média: aplica um conceito" },
  { value: "3", label: "Difícil: cruza dois conceitos" },
];

const LABELS = ["A", "B", "C", "D", "E"];

type QuestionEditorProps = {
  question: Question;
  topics: Topic[];
  onClose: () => void;
  onSave: (question: Question) => void;
};

/**
 * Editor de questão. A explicação é por alternativa: quem erra recebe a correção
 * do erro que cometeu, não uma mensagem genérica.
 */
export function QuestionEditor({ question: initial, topics, onClose, onSave }: QuestionEditorProps) {
  const [question, setQuestion] = useState(initial);
  const update = (patch: Partial<Question>) => setQuestion((prev) => ({ ...prev, ...patch }));

  const checks = useMemo(() => {
    const trapWords = /(todas as anteriores|nenhuma das anteriores)/i;
    return [
      {
        id: "enunciado",
        label: "Enunciado claro e sem negação dupla",
        ok: question.stem.trim().length >= 15 && question.stem.length <= 220 && !/não.*não/i.test(question.stem),
        blocking: false,
      },
      {
        id: "alternativas",
        label: "Alternativas sem atalhos ('todas as anteriores')",
        ok: question.options.length >= 2 && !question.options.some((o) => trapWords.test(o.text)),
        blocking: false,
      },
      {
        id: "explicacoes",
        label: "Explicação escrita em todas as alternativas",
        ok: question.options.every((o) => o.explanation.trim().length >= 10),
        blocking: false,
      },
      { id: "gabarito", label: "Resposta certa indicada", ok: Boolean(question.correctOptionId), blocking: true },
      { id: "topico", label: "Pelo menos um tópico atribuído", ok: question.topicIds.length > 0, blocking: true },
    ];
  }, [question]);

  const score = checks.filter((c) => c.ok).length;
  const blockers = checks.filter((c) => c.blocking && !c.ok);
  const warnings = checks.filter((c) => !c.blocking && !c.ok);

  function setOption(id: string, patch: Partial<Question["options"][number]>) {
    update({ options: question.options.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  }

  function addOption() {
    const index = question.options.length;
    update({
      options: [...question.options, { id: `o${index}`, label: LABELS[index] ?? `${index + 1}`, text: "", explanation: "" }],
    });
  }

  function removeOption(id: string) {
    const options = question.options.filter((o) => o.id !== id).map((o, i) => ({ ...o, label: LABELS[i] ?? o.label }));
    update({ options, correctOptionId: question.correctOptionId === id ? (options[0]?.id ?? "") : question.correctOptionId });
  }

  function changeType(type: QuestionType) {
    if (type === question.type) return;
    if (type === "vf") {
      update({
        type,
        options: [
          { id: "v", label: "V", text: "Verdadeiro", explanation: question.options[0]?.explanation ?? "" },
          { id: "f", label: "F", text: "Falso", explanation: question.options[1]?.explanation ?? "" },
        ],
        correctOptionId: "v",
      });
      return;
    }
    if (type === "numerico") {
      update({
        type,
        options: [{ id: "n", label: "=", text: "", explanation: question.options[0]?.explanation ?? "" }],
        correctOptionId: "n",
      });
      return;
    }
    update({
      type,
      options: [
        { id: "a", label: "A", text: "", explanation: "" },
        { id: "b", label: "B", text: "", explanation: "" },
        { id: "c", label: "C", text: "", explanation: "" },
      ],
      correctOptionId: "a",
    });
  }

  return (
    <SlideOver
      open
      onClose={onClose}
      eyebrow={question.observed ? `${question.observed.answers} respostas registadas` : "Nova questão"}
      title={question.id === "nova" ? "Criar questão" : `Editar ${question.id}`}
      footer={
        <div className="flex flex-col gap-2">
          {blockers.length > 0 && (
            <p id="save-blockers" className="text-caption font-bold text-feedback-error-ink">
              Falta: {blockers.map((b) => b.label.toLowerCase()).join("; ")}.
            </p>
          )}
          {blockers.length === 0 && warnings.length > 0 && (
            <p className="text-caption text-text-secondary">
              Podes guardar assim, mas {warnings.length === 1 ? "há 1 recomendação" : `há ${warnings.length} recomendações`} por cumprir.
            </p>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button3D variant="ghost" onClick={onClose}>
              Cancelar
            </Button3D>
            <Button3D
              disabled={blockers.length > 0}
              aria-describedby={blockers.length > 0 ? "save-blockers" : undefined}
              onClick={() => onSave(question)}
              leadingIcon={<Icon name="check" size={18} strokeWidth={3} />}
            >
              Guardar no banco
            </Button3D>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <section
          aria-labelledby="quality-title"
          className={cn(
            "rounded-2xl border-2 p-4",
            blockers.length > 0 ? "border-feedback-error bg-surface-canvas" : score === checks.length ? "border-feedback-success bg-surface-canvas" : "border-feedback-streak bg-surface-canvas",
          )}
        >
          <h3 id="quality-title" className="flex items-center justify-between gap-2 text-body-md font-bold text-on-surface">
            Qualidade pedagógica
            <span className="text-caption tabular-nums">
              {score} de {checks.length}
            </span>
          </h3>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {checks.map((check) => (
              <li key={check.id} className="flex items-start gap-2 text-caption">
                <Icon
                  name={check.ok ? "check" : check.blocking ? "x" : "alert"}
                  size={15}
                  strokeWidth={3}
                  className={cn(
                    "mt-0.5 shrink-0",
                    check.ok ? "text-feedback-success-ink" : check.blocking ? "text-feedback-error-ink" : "text-feedback-streak-ink",
                  )}
                />
                <span className={check.ok ? "text-text-secondary" : "font-bold text-on-surface"}>
                  {check.label}
                  {!check.ok && !check.blocking && <span className="font-normal text-text-tertiary"> (recomendado)</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 text-body-md font-bold text-on-surface">Tipo de item</legend>
          <div className="flex flex-col gap-2">
            {TYPES.map((type) => (
              <label
                key={type.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-[border-color,background-color] duration-150",
                  "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
                  question.type === type.value ? "border-brand-ocean bg-surface-sky" : "border-border-cloud bg-surface-canvas hover:border-brand-ocean",
                )}
              >
                <input
                  type="radio"
                  name="question-type"
                  checked={question.type === type.value}
                  onChange={() => changeType(type.value)}
                  className="size-5 cursor-pointer accent-brand-ocean"
                />
                <span>
                  <span className="block text-body-md font-bold text-on-surface">{type.label}</span>
                  <span className="block text-caption text-text-tertiary">{type.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="question-stem" className="mb-2 block text-body-md font-bold text-on-surface">
            Enunciado
          </label>
          <textarea
            id="question-stem"
            rows={3}
            value={question.stem}
            onChange={(e) => update({ stem: e.target.value })}
            aria-describedby="stem-counter"
            className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
          />
          <p id="stem-counter" className="mt-1 text-caption text-text-tertiary tabular-nums">
            {question.stem.length} de 220 caracteres recomendados.
          </p>
        </div>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-1 text-body-md font-bold text-on-surface">
            {question.type === "numerico" ? "Resposta certa" : "Alternativas e explicações"}
          </legend>
          <p id="options-hint" className="mb-3 text-caption text-text-secondary">
            {question.type === "numerico"
              ? "Indica o valor exato e explica o cálculo."
              : "Marca a correta e escreve, em cada alternativa, o que o estudante precisa de perceber se a escolher."}
          </p>

          <div className="flex flex-col gap-3">
            {question.options.map((option) => {
              const correct = option.id === question.correctOptionId;
              return (
                <div
                  key={option.id}
                  className={cn(
                    "rounded-2xl border-2 p-3.5",
                    correct ? "border-feedback-success bg-surface-canvas" : "border-border-cloud bg-surface-soft",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {question.type !== "numerico" && (
                      <label className="mt-2.5 flex shrink-0 cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={correct}
                          aria-describedby="options-hint"
                          onChange={() => update({ correctOptionId: option.id })}
                          className="size-5 cursor-pointer accent-feedback-success-ink"
                        />
                        <span className="text-body-md font-bold text-on-surface">{option.label}</span>
                        <span className="sr-only">Marcar a alternativa {option.label} como correta</span>
                      </label>
                    )}

                    <div className="min-w-0 flex-1">
                      <label htmlFor={`opt-${option.id}`} className="sr-only">
                        Texto da alternativa {option.label}
                      </label>
                      <input
                        id={`opt-${option.id}`}
                        value={option.text}
                        readOnly={question.type === "vf"}
                        inputMode={question.type === "numerico" ? "decimal" : "text"}
                        onChange={(e) => setOption(option.id, { text: e.target.value })}
                        placeholder={question.type === "numerico" ? "Valor exato" : "Texto da alternativa"}
                        className={cn(
                          "min-h-11 w-full rounded-lg border-2 border-border-input bg-surface-canvas px-3 text-body-md text-on-surface",
                          question.type === "vf" && "border-transparent bg-transparent font-bold",
                        )}
                      />

                      <label htmlFor={`exp-${option.id}`} className="mt-2 block text-caption font-bold text-text-secondary">
                        {correct ? "Porque está certa" : "Porque está errada"}
                      </label>
                      <textarea
                        id={`exp-${option.id}`}
                        rows={2}
                        value={option.explanation}
                        onChange={(e) => setOption(option.id, { explanation: e.target.value })}
                        placeholder={correct ? "Justifica o raciocínio." : "Corrige o erro que leva a esta escolha."}
                        className="field-sizing-content mt-1 w-full resize-none rounded-lg border-2 border-border-input bg-surface-canvas p-2.5 text-caption text-on-surface"
                      />

                      {option.share !== undefined && (
                        <p className="mt-1.5 text-caption text-text-tertiary tabular-nums">
                          Escolhida por {option.share}% dos estudantes.
                        </p>
                      )}
                    </div>

                    {question.type === "escolha" && question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(option.id)}
                        aria-label={`Remover a alternativa ${option.label}`}
                        className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition-[color,background-color] duration-150 hover:bg-feedback-error-soft hover:text-feedback-error-ink"
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {question.type === "escolha" && question.options.length < 5 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button text-primary uppercase hover:bg-surface-sky"
            >
              <Icon name="plus" size={18} />
              Adicionar alternativa
            </button>
          )}
        </fieldset>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 text-body-md font-bold text-on-surface">Tópicos da cadeira</legend>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const checked = question.topicIds.includes(topic.id);
              return (
                <label
                  key={topic.id}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-3.5 text-caption font-bold transition-[border-color,background-color,color] duration-150",
                    "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
                    checked ? "border-brand-ocean bg-surface-sky text-primary" : "border-border-cloud bg-surface-canvas text-text-secondary",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      update({
                        topicIds: checked ? question.topicIds.filter((t) => t !== topic.id) : [...question.topicIds, topic.id],
                      })
                    }
                    className="size-4 cursor-pointer accent-brand-ocean"
                  />
                  {topic.name}
                  <span className="text-text-tertiary tabular-nums">{topic.examWeight}%</span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-caption text-text-secondary">
            O tópico é o que permite ao caderno de erros e à trilha mista trazerem esta questão de volta a quem precisa.
          </p>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            id="question-difficulty"
            label="Dificuldade esperada"
            options={DIFFICULTIES}
            value={String(question.declaredDifficulty)}
            onChange={(e) => update({ declaredDifficulty: Number(e.target.value) as 1 | 2 | 3 })}
          />
          <div>
            <label htmlFor="question-seconds" className="mb-2 block text-body-md font-bold text-on-surface">
              Tempo estimado (segundos)
            </label>
            <input
              id="question-seconds"
              type="number"
              min={15}
              max={300}
              step={15}
              value={question.estimatedSeconds}
              onChange={(e) => update({ estimatedSeconds: Number(e.target.value) })}
              className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface tabular-nums"
            />
          </div>
        </div>

        {question.observed && (
          <p className="flex items-start gap-2 rounded-2xl bg-surface-soft p-4 text-caption text-text-secondary tabular-nums">
            <Icon name="chart" size={18} className="mt-0.5 shrink-0 text-primary" />
            Observado em {question.observed.answers} respostas: {question.observed.accuracy}% de acerto. Declaraste
            dificuldade {question.declaredDifficulty} de 3
            {question.observed.accuracy < 45 && question.declaredDifficulty < 3
              ? ", mas o resultado indica que é mais difícil do que previsto."
              : "."}
          </p>
        )}
      </div>
    </SlideOver>
  );
}
