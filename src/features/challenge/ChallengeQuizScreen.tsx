import { useMemo, useState } from "react";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { QuizOption, type OptionState } from "../quiz/QuizOption";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useFeedbackSound } from "../../hooks/useFeedbackSound";
import { useQuestionTimer } from "../../hooks/useQuestionTimer";
import { useGamification } from "../../contexts/GamificationContext";
import { cn } from "@/lib/utils";
import type { ChallengeQuestion } from "./challengeQuestions";

const SECONDS_PER_QUESTION = 45;

export type ChallengeResult = {
  correct: number;
  total: number;
  xpEarned: number;
  answers: Record<string, string | null>;
};

type ChallengeQuizScreenProps = {
  questions: ChallengeQuestion[];
  /** Multiplicador do desafio (ex.: 3 = XP a triplicar). */
  multiplier?: number;
  prizeLabel: string;
  onExit: () => void;
  onFinish: (result: ChallengeResult) => void;
};

/** Desafio relâmpago a decorrer: uma questão de cada vez, com cronómetro próprio. */
export default function ChallengeQuizScreen({
  questions,
  multiplier = 3,
  prizeLabel,
  onExit,
  onFinish,
}: ChallengeQuizScreenProps) {
  const [queue, setQueue] = useState(() => questions.map((q) => q.id));
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [selected, setSelected] = useState<string>();
  const [paused, setPaused] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const playSound = useFeedbackSound();
  const { addXp } = useGamification();

  const byId = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const question = byId.get(queue[position]);
  const answeredCount = Object.keys(answers).length;

  const { remaining, ratio } = useQuestionTimer(SECONDS_PER_QUESTION, {
    paused: paused || confirmExit,
    key: `${queue[position]}-${position}`,
    onExpire: () => advance(null),
  });

  function finish(finalAnswers: Record<string, string | null>) {
    const correct = questions.filter((q) => finalAnswers[q.id] === q.correctOptionId).length;
    const xpEarned = questions.reduce(
      (sum, q) => (finalAnswers[q.id] === q.correctOptionId ? sum + q.xp * multiplier : sum),
      0,
    );
    addXp(xpEarned);
    onFinish({ correct, total: questions.length, xpEarned, answers: finalAnswers });
  }

  function advance(optionId: string | null) {
    if (!question) return;
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    setSelected(undefined);
    if (optionId) playSound(optionId === question.correctOptionId ? "correct" : "wrong");
    if (position + 1 >= queue.length) finish(next);
    else setPosition((p) => p + 1);
  }

  /** Marcar para revisão: a questão volta no fim da fila, uma única vez. */
  function postpone() {
    if (!question) return;
    const rest = queue.filter((_, i) => i !== position);
    if (queue.filter((id) => id === question.id).length === 1 && position < queue.length - 1) {
      setQueue([...rest, question.id]);
    } else {
      advance(null);
      return;
    }
    setSelected(undefined);
  }

  if (!question) return null;

  const optionState = (optionId: string): OptionState => (selected === optionId ? "selected" : "idle");
  const lowTime = remaining <= 10;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main id="conteudo" className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="sr-only">Desafio relâmpago em curso</h1>
        <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-7">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-cloud pb-5">
            <button
              type="button"
              onClick={() => setConfirmExit(true)}
              className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-soft hover:text-on-surface"
            >
              <Icon name="x" size={18} />
              Sair do simulado
            </button>

            <div className="flex flex-col items-center gap-1.5">
              <p className="text-body-md font-bold text-on-surface tabular-nums">
                Questão {position + 1} de {queue.length}
              </p>
              <div
                role="progressbar"
                aria-label="Progresso do simulado"
                aria-valuemin={0}
                aria-valuemax={queue.length}
                aria-valuenow={answeredCount}
                aria-valuetext={`${answeredCount} de ${queue.length} questões respondidas`}
                className="h-2 w-36 overflow-hidden rounded-full bg-border-cloud"
              >
                <div
                  className="h-full rounded-full bg-brand-ocean transition-[width] duration-300"
                  style={{ width: `${(position / queue.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border-2 border-border-cloud px-3 py-1.5">
              <span className="relative flex size-8 items-center justify-center">
                <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden="true">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-border-cloud)" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={lowTime ? "var(--color-feedback-error)" : "var(--color-feedback-streak)"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.max(0, ratio) * 100.5} 100.5`}
                  />
                </svg>
                <span
                  className={cn(
                    "absolute text-caption font-bold tabular-nums",
                    lowTime ? "text-feedback-error-ink" : "text-on-surface",
                  )}
                >
                  {remaining}
                </span>
              </span>
              <span aria-live="off" className="sr-only">
                {remaining} segundos restantes nesta questão
              </span>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? "Retomar o cronómetro" : "Pausar o cronómetro"}
                className="flex size-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft hover:text-on-surface"
              >
                <Icon name={paused ? "play" : "pause"} size={18} />
              </button>
            </div>
          </header>

          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-3 py-1 text-overline text-on-secondary-fixed-variant uppercase">
            <Icon name="bolt" size={14} />
            Desafio relâmpago · {prizeLabel} · XP a {multiplier}×
          </p>

          {paused && (
            <p role="status" className="mt-4 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-4 text-body-md text-on-surface">
              Cronómetro em pausa. As alternativas voltam quando retomares.
            </p>
          )}

          <form
            className={cn("mt-5", paused && "pointer-events-none opacity-40")}
            aria-hidden={paused || undefined}
            onSubmit={(e) => {
              e.preventDefault();
              if (selected) advance(selected);
            }}
          >
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-4 font-montserrat text-headline-h3 font-extrabold text-balance text-on-surface">
                {question.stem}
              </legend>

              {question.table && (
                <TableScroll label="Dados da questão" className="mb-5">
                  <table className={cn(table, "min-w-[520px]")}>
                    <caption className="sr-only">{question.table.caption}</caption>
                    <thead>
                      <tr>
                        {question.table.columns.map((c, i) => (
                          <th key={c} scope="col" className={cn(th, i > 0 && "text-right")}>
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {question.table.rows.map((row) => (
                        <tr key={row[0]} className={tr}>
                          <th scope="row" className={cn(td, "font-medium")}>
                            {row[0]}
                          </th>
                          <td className={cn(td, "text-right tabular-nums")}>{row[1]}</td>
                          <td className={cn(td, "text-right tabular-nums")}>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableScroll>
              )}

              <div className="space-y-3">
                {question.options.map((option) => (
                  <QuizOption
                    key={option.id}
                    name={`challenge-${question.id}`}
                    option={option}
                    state={optionState(option.id)}
                    checked={selected === option.id}
                    disabled={false}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            </fieldset>

            <footer className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 border-t-2 border-border-cloud pt-5 sm:flex-row sm:items-center">
              <Button3D variant="ghost" onClick={postpone} leadingIcon={<Icon name="clock" size={18} />}>
                Deixar para o fim
              </Button3D>
              <Button3D type="submit" size="lg" disabled={!selected} trailingIcon={<Icon name="arrow-right" size={20} />}>
                Confirmar resposta
              </Button3D>
            </footer>
          </form>

          <p className="mt-4 text-caption text-text-tertiary">
            O resultado e as explicações aparecem no fim do simulado.
          </p>
        </div>
      </main>

      {confirmExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-ink/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="exit-title" className="w-full max-w-sm rounded-3xl bg-surface-canvas p-6 shadow-clay">
            <h2 id="exit-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Sair do simulado?
            </h2>
            <p className="mt-2 text-body-md text-text-secondary">
              As respostas já dadas perdem-se e o desafio conta como não concluído.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button3D variant="ghost" onClick={() => setConfirmExit(false)}>
                Continuar a responder
              </Button3D>
              <Button3D onClick={onExit}>Sair mesmo assim</Button3D>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
