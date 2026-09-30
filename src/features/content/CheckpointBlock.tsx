import { useState } from "react";
import { Icon } from "../../components/ui/Icon";
import { useFeedbackSound } from "../../hooks/useFeedbackSound";
import { QuizFeedback } from "../quiz/QuizFeedback";
import { QuizOption, type OptionState } from "../quiz/QuizOption";
import type { ContentBlock } from "./blocks";

type CheckpointBlockProps = {
  block: Extract<ContentBlock, { type: "checkpoint" }>;
  mode: "read" | "preview";
  onAnswer: (correct: boolean) => void;
};

/** Checkpoint dentro do artigo. Reutiliza as alternativas e o feedback do quiz diagnóstico. */
export function CheckpointBlock({ block, mode, onAnswer }: CheckpointBlockProps) {
  const [selected, setSelected] = useState<string>();
  const playSound = useFeedbackSound();
  const answered = selected !== undefined;
  const correct = selected === block.correctOptionId;

  function handleSelect(optionId: string) {
    if (answered) return;
    setSelected(optionId);
    const isCorrect = optionId === block.correctOptionId;
    playSound(isCorrect ? "correct" : "wrong");
    onAnswer(isCorrect);
  }

  function optionState(optionId: string): OptionState {
    if (!answered) return "idle";
    if (optionId === selected) return correct ? "correct" : "wrong";
    if (optionId === block.correctOptionId) return "reveal";
    return "muted";
  }

  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-question`}
      className="my-4 scroll-mt-28 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-6"
    >
      <header className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b-2 border-border-cloud pb-4">
        <p className="flex items-center gap-2 text-overline text-on-surface uppercase">
          <Icon name="bolt" size={18} className="text-feedback-streak-ink" />
          Checkpoint de retenção
        </p>
        <span className="rounded-full bg-secondary-fixed px-2.5 py-0.5 text-overline text-on-secondary-fixed-variant tabular-nums">
          +{block.xp} XP{mode === "preview" && " (pré-visualização)"}
        </span>
      </header>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend id={`${block.id}-question`} className="mb-5 font-montserrat text-headline-h3 font-extrabold text-on-surface">
          {block.question}
        </legend>
        <div className="space-y-3">
          {block.options.map((option) => (
            <QuizOption
              key={option.id}
              name={`checkpoint-${block.id}`}
              option={option}
              state={optionState(option.id)}
              checked={selected === option.id}
              disabled={answered && selected !== option.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </fieldset>

      <QuizFeedback
        result={answered ? (correct ? "correct" : "wrong") : null}
        message={answered ? (correct ? block.explanation.correct : block.explanation.incorrect) : undefined}
        xp={mode === "read" ? block.xp : undefined}
      />
    </section>
  );
}
