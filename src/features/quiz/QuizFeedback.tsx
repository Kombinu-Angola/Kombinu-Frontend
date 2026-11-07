import { Icon } from "../../components/ui/Icon";
import { cn } from "@/lib/utils";

type QuizFeedbackProps = {
  /** null = ainda sem resposta (a região fica montada para o aria-live funcionar). */
  result: "correct" | "wrong" | null;
  message?: string;
  xp?: number;
};

/**
 * Feedback imediato (< 100 ms: o estado muda no mesmo evento de clique).
 * Fundo branco para o texto -ink manter ≥ 4,5:1; a cor vive na borda e no ícone.
 */
export function QuizFeedback({ result, message, xp }: QuizFeedbackProps) {
  return (
    <div role="status" aria-live="polite" className="mt-4 min-h-0">
      {result && (
        <div
          key={`${result}-${message}`}
          className={cn(
            "flex items-start gap-3 rounded-2xl border-2 border-l-8 bg-surface-canvas p-4 motion-safe:animate-feedback-in",
            result === "correct" ? "border-feedback-success" : "border-feedback-error",
          )}
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-surface-ink",
              result === "correct" ? "bg-feedback-success" : "bg-feedback-error",
            )}
          >
            <Icon name={result === "correct" ? "check" : "x"} size={16} strokeWidth={3} />
          </span>
          <p className="text-body-md text-text-secondary">
            <strong
              className={cn(
                "mr-1 font-bold",
                result === "correct" ? "text-feedback-success-ink" : "text-feedback-error-ink",
              )}
            >
              {result === "correct" ? "Exato!" : "Ainda não."}
            </strong>
            {message}
            {result === "correct" && xp ? (
              <span className="ml-2 inline-flex rounded-full bg-secondary-fixed px-2 py-0.5 align-middle text-overline text-on-secondary-fixed-variant tabular-nums">
                +{xp} XP
              </span>
            ) : null}
          </p>
        </div>
      )}
    </div>
  );
}
