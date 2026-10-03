import { Icon } from "../../components/ui/Icon";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "../content/blocks";

type Checkpoint = Extract<ContentBlock, { type: "checkpoint" }>;

type QuizBuilderProps = { block: Checkpoint; onChange: (block: Checkpoint) => void };

const LABELS = ["A", "B", "C", "D", "E"];

/** Construtor de checkpoint: pergunta, alternativas, resposta certa e explicações. */
export function QuizBuilder({ block, onChange }: QuizBuilderProps) {
  const update = (patch: Partial<Checkpoint>) => onChange({ ...block, ...patch });

  function setOptionText(id: string, text: string) {
    update({ options: block.options.map((o) => (o.id === id ? { ...o, text } : o)) });
  }

  function addOption() {
    const id = `o${block.options.length}`;
    update({ options: [...block.options, { id, label: LABELS[block.options.length] ?? id, text: "" }] });
  }

  function removeOption(id: string) {
    const options = block.options
      .filter((o) => o.id !== id)
      .map((o, i) => ({ ...o, label: LABELS[i] ?? o.label }));
    update({
      options,
      correctOptionId: block.correctOptionId === id ? (options[0]?.id ?? "") : block.correctOptionId,
    });
  }

  return (
    <div className="rounded-2xl border-2 border-border-cloud bg-surface-soft p-4 sm:p-5">
      <p className="mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-headline-h3 text-on-surface">
          <Icon name="bolt" size={20} className="text-primary" />
          Checkpoint interativo
        </span>
        <span className="rounded-full bg-secondary-fixed px-2.5 py-0.5 text-overline text-on-secondary-fixed-variant tabular-nums">
          +{block.xp} XP
        </span>
      </p>

      <label className="mb-2 block text-body-md font-bold text-on-surface" htmlFor={`${block.id}-q`}>
        Pergunta
      </label>
      <input
        id={`${block.id}-q`}
        value={block.question}
        onChange={(e) => update({ question: e.target.value })}
        placeholder="O que queres testar depois desta secção?"
        className="mb-5 min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-lg font-bold text-on-surface placeholder:font-medium placeholder:text-text-tertiary focus-visible:border-brand-sky-ink"
      />

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2 text-body-md font-bold text-on-surface">
          Alternativas
          <span className="ml-1 font-medium text-text-tertiary">(marca a correta)</span>
        </legend>
        <ul className="flex flex-col gap-2">
          {block.options.map((option) => {
            const isCorrect = option.id === block.correctOptionId;
            return (
              <li
                key={option.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 bg-surface-canvas p-2 pl-3 transition-[border-color] duration-150",
                  isCorrect ? "border-feedback-success" : "border-border-cloud",
                )}
              >
                <input
                  type="radio"
                  name={`correct-${block.id}`}
                  checked={isCorrect}
                  onChange={() => update({ correctOptionId: option.id })}
                  aria-label={`Marcar a alternativa ${option.label} como correta`}
                  className="size-5 shrink-0 cursor-pointer accent-feedback-success-ink"
                />
                <label htmlFor={`${block.id}-${option.id}`} className="sr-only">
                  Texto da alternativa {option.label}
                </label>
                <input
                  id={`${block.id}-${option.id}`}
                  value={option.text}
                  onChange={(e) => setOptionText(option.id, e.target.value)}
                  placeholder={`Alternativa ${option.label}`}
                  className="min-h-11 w-full min-w-0 bg-transparent text-body-md text-on-surface placeholder:text-text-tertiary focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  disabled={block.options.length <= 2}
                  aria-label={`Remover a alternativa ${option.label}`}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-[color,background-color] duration-150 hover:bg-feedback-error-soft hover:text-feedback-error-ink disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-tertiary"
                >
                  <Icon name="x" size={18} />
                </button>
              </li>
            );
          })}
        </ul>
        {block.options.length < LABELS.length && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button text-primary uppercase transition-[background-color] duration-150 hover:bg-surface-sky"
          >
            <Icon name="plus" size={18} />
            Adicionar alternativa
          </button>
        )}
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${block.id}-ok`} className="mb-1.5 block text-body-md font-bold text-on-surface">
            Explicação quando acerta
          </label>
          <textarea
            id={`${block.id}-ok`}
            value={block.explanation.correct}
            onChange={(e) => update({ explanation: { ...block.explanation, correct: e.target.value } })}
            rows={2}
            className="w-full field-sizing-content resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface focus-visible:border-brand-sky-ink"
          />
        </div>
        <div>
          <label htmlFor={`${block.id}-ko`} className="mb-1.5 block text-body-md font-bold text-on-surface">
            Explicação quando erra
          </label>
          <textarea
            id={`${block.id}-ko`}
            value={block.explanation.incorrect}
            onChange={(e) => update({ explanation: { ...block.explanation, incorrect: e.target.value } })}
            rows={2}
            className="w-full field-sizing-content resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface focus-visible:border-brand-sky-ink"
          />
        </div>
      </div>
    </div>
  );
}
