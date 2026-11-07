import { useReducer } from "react";
import type { DiagnosticQuizData } from "./types";

type State = { index: number; answers: Record<string, string>; finished: boolean };

type Action =
  | { type: "answer"; questionId: string; optionId: string }
  | { type: "next"; total: number }
  | { type: "previous" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "answer":
      // Uma resposta por questão: depois de respondida fica bloqueada (feedback imediato).
      if (state.answers[action.questionId]) return state;
      return { ...state, answers: { ...state.answers, [action.questionId]: action.optionId } };
    case "next":
      return state.index + 1 >= action.total
        ? { ...state, finished: true }
        : { ...state, index: state.index + 1 };
    case "previous":
      return state.finished ? { ...state, finished: false } : { ...state, index: Math.max(0, state.index - 1) };
  }
}

/** Máquina de estados do quiz. Tudo o que é derivável calcula-se no render. */
export function useQuizSession(quiz: DiagnosticQuizData) {
  const [state, dispatch] = useReducer(reducer, { index: 0, answers: {}, finished: false });

  const question = quiz.questions[state.index];
  const selectedId = state.answers[question.id];
  const isAnswered = selectedId !== undefined;
  const isCorrect = isAnswered && selectedId === question.correctOptionId;
  const isLast = state.index === quiz.questions.length - 1;

  const correctCount = quiz.questions.filter((q) => state.answers[q.id] === q.correctOptionId).length;
  const xpEarned = quiz.questions.reduce(
    (sum, q) => (state.answers[q.id] === q.correctOptionId ? sum + q.xp : sum),
    0,
  );

  return {
    index: state.index,
    total: quiz.questions.length,
    question,
    selectedId,
    isAnswered,
    isCorrect,
    isLast,
    finished: state.finished,
    answers: state.answers,
    correctCount,
    xpEarned,
    answer: (optionId: string) => dispatch({ type: "answer", questionId: question.id, optionId }),
    next: () => dispatch({ type: "next", total: quiz.questions.length }),
    previous: () => dispatch({ type: "previous" }),
  };
}
