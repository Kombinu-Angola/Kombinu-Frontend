import { Icon } from "../../components/ui/Icon";
import { cn } from "@/lib/utils";
import type { QuizOptionData } from "./types";

export type OptionState = "idle" | "selected" | "correct" | "wrong" | "reveal" | "muted";

type QuizOptionProps = {
  name: string;
  option: QuizOptionData;
  state: OptionState;
  checked: boolean;
  disabled: boolean;
  onSelect: (optionId: string) => void;
};

const CARD: Record<OptionState, string> = {
  idle: "border-border-cloud bg-surface-canvas hover:-translate-y-0.5 hover:border-brand-ocean hover:shadow-elevation-1 cursor-pointer",
  selected: "border-brand-ocean bg-surface-sky shadow-[inset_0_0_0_1px_var(--color-brand-ocean)] cursor-pointer",
  correct: "border-feedback-success bg-feedback-success-soft shadow-3d-success",
  wrong: "border-feedback-error bg-feedback-error-soft",
  reveal: "border-feedback-success-ink border-dashed bg-surface-canvas",
  muted: "border-border-cloud bg-surface-canvas",
};

const INDICATOR: Record<OptionState, string> = {
  idle: "border-border-cloud bg-surface-soft text-text-tertiary group-hover:border-brand-ocean group-hover:text-brand-ocean",
  selected: "border-brand-ocean bg-brand-ocean text-white",
  correct: "border-feedback-success bg-feedback-success text-surface-ink",
  wrong: "border-feedback-error bg-feedback-error text-surface-ink",
  reveal: "border-feedback-success-ink bg-surface-canvas text-feedback-success-ink",
  muted: "border-border-cloud bg-surface-soft text-text-tertiary",
};

const SR_STATUS: Partial<Record<OptionState, string>> = {
  correct: " — resposta certa",
  wrong: " — resposta errada",
  reveal: " — esta era a resposta certa",
};

/**
 * Alternativa de quiz: rádio nativo (teclado com setas, leitor de ecrã) com cartão tátil.
 * O estado nunca depende só da cor: há ícone (✓ / ✕) e texto para leitores de ecrã.
 */
export function QuizOption({ name, option, state, checked, disabled, onSelect }: QuizOptionProps) {
  const icon = state === "correct" || state === "reveal" ? "check" : state === "wrong" ? "x" : null;

  return (
    <label
      className={cn(
        "group relative flex min-h-14 items-center gap-3.5 rounded-2xl border-2 p-4 select-none",
        "transition-[translate,border-color,background-color,box-shadow] duration-150 ease-out-quint",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
        CARD[state],
      )}
    >
      <input
        type="radio"
        name={name}
        value={option.id}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(option.id)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-caption font-bold",
          "transition-[border-color,background-color,color] duration-150",
          INDICATOR[state],
        )}
      >
        {icon ? (
          <Icon key={icon} name={icon} size={16} strokeWidth={3} className="motion-safe:animate-pop-in" />
        ) : (
          option.label
        )}
      </span>
      <span
        className={cn(
          "text-body-md",
          state === "idle" && "text-text-secondary group-hover:text-on-surface",
          state === "selected" && "font-bold text-on-surface",
          (state === "correct" || state === "wrong") && "font-bold text-surface-ink",
          (state === "reveal" || state === "muted") && "text-text-secondary",
        )}
      >
        <span className="sr-only">{option.label}. </span>
        {option.text}
        {SR_STATUS[state] && <span className="sr-only">{SR_STATUS[state]}</span>}
      </span>
    </label>
  );
}
