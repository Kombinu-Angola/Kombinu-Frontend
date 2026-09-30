import { useEffect, useRef, type FormEvent } from "react";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useGamification } from "../../contexts/GamificationContext";
import { useFeedbackSound } from "../../hooks/useFeedbackSound";
import { OnboardingShell } from "../onboarding/OnboardingShell";
import { DiagnosticSummary } from "./DiagnosticSummary";
import { QuizFeedback } from "./QuizFeedback";
import { QuizOption, type OptionState } from "./QuizOption";
import type { DiagnosticQuizData, DiagnosticResult } from "./types";
import { useQuizSession } from "./useQuizSession";

type DiagnosticQuizScreenProps = {
  quiz: DiagnosticQuizData;
  onBack: () => void;
  onComplete: (result: DiagnosticResult) => void;
  soundEnabled?: boolean;
};

/** Onboarding, passo 2 — quiz diagnóstico da cadeira crítica. */
export default function DiagnosticQuizScreen({
  quiz,
  onBack,
  onComplete,
  soundEnabled = true,
}: DiagnosticQuizScreenProps) {
  const session = useQuizSession(quiz);
  const { addXp } = useGamification();
  const playSound = useFeedbackSound(soundEnabled);
  const legendRef = useRef<HTMLLegendElement>(null);
  const prevIndex = useRef(0);

  const { question, selectedId, isAnswered, isCorrect } = session;

  // Ao mudar de questão, o foco vai para o novo enunciado (nunca no primeiro render).
  useEffect(() => {
    if (prevIndex.current === session.index) return;
    prevIndex.current = session.index;
    legendRef.current?.focus();
  }, [session.index]);

  function handleSelect(optionId: string) {
    if (isAnswered) return;
    const correct = optionId === question.correctOptionId;
    session.answer(optionId);
    playSound(correct ? "correct" : "wrong");
    if (correct) addXp(question.xp);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isAnswered) session.next();
  }

  function handleBack() {
    if (session.index === 0 && !session.finished) onBack();
    else session.previous();
  }

  function optionState(optionId: string): OptionState {
    if (!isAnswered) return "idle";
    if (optionId === selectedId) return isCorrect ? "correct" : "wrong";
    if (optionId === question.correctOptionId) return "reveal";
    return "muted";
  }

  const legendId = `stem-${question.id}`;

  return (
    <OnboardingShell
      stepIndex={1}
      onBack={handleBack}
      backLabel={session.index === 0 && !session.finished ? "Voltar ao passo anterior" : "Voltar à questão anterior"}
    >

        {session.finished ? (
          <DiagnosticSummary
            courseName={quiz.course.name}
            correctCount={session.correctCount}
            total={session.total}
            xpEarned={session.xpEarned}
            onContinue={() =>
              onComplete({
                quizId: quiz.id,
                answers: session.answers,
                correctCount: session.correctCount,
                total: session.total,
                xpEarned: session.xpEarned,
              })
            }
          />
        ) : (
          <>
            <section
              aria-labelledby="diag-context"
              className="mt-6 flex items-start gap-3.5 rounded-2xl bg-surface-sky p-4 sm:p-5"
            >
              <Asset3D name="diagnostic-target" alt="" size={40} priority className="shrink-0" />
              <div>
                <h2 id="diag-context" className="text-overline uppercase text-primary">
                  Teste rápido de sondagem · {session.total} questões
                </h2>
                <p className="mt-1 text-body-md text-text-secondary">
                  Responde para calibrarmos os resumos da tua cadeira crítica:{" "}
                  <strong className="font-bold text-on-surface">
                    {quiz.course.name} — {quiz.course.institution}
                  </strong>
                  .
                </p>
              </div>
            </section>

            <form className="mt-8" onSubmit={handleSubmit} noValidate>
              <fieldset className="m-0 border-0 p-0">
                <legend
                  id={legendId}
                  ref={legendRef}
                  tabIndex={-1}
                  className="mb-5 w-full font-montserrat text-xl leading-snug font-extrabold text-on-surface outline-none"
                >
                  <span className="mr-1 text-brand-ocean tabular-nums">{session.index + 1}.</span>
                  {question.stem}
                </legend>

                <div className="space-y-3">
                  {question.options.map((option) => (
                    <QuizOption
                      key={option.id}
                      name={`diag-${question.id}`}
                      option={option}
                      state={optionState(option.id)}
                      checked={selectedId === option.id}
                      disabled={isAnswered && selectedId !== option.id}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </fieldset>

              <QuizFeedback
                result={isAnswered ? (isCorrect ? "correct" : "wrong") : null}
                message={isAnswered ? (isCorrect ? question.explanation.correct : question.explanation.incorrect) : undefined}
                xp={question.xp}
              />

              <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-cloud pt-6 sm:flex-row">
                <p className="text-body-md text-text-tertiary">
                  Questão{" "}
                  <strong className="text-on-surface tabular-nums">
                    {session.index + 1} de {session.total}
                  </strong>
                  {isAnswered ? " respondida" : ""}
                </p>
                <Button3D
                  type="submit"
                  size="lg"
                  disabled={!isAnswered}
                  className="w-full sm:w-auto sm:min-w-[260px]"
                  trailingIcon={<Icon name="arrow-right" size={20} />}
                >
                  {session.isLast ? "Concluir diagnóstico" : "Próxima questão"}
                </Button3D>
              </div>
            </form>
          </>
        )}
    </OnboardingShell>
  );
}
