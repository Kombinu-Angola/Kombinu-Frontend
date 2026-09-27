import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

export type LeaderEntry = { rank: number; name: string; xp: number; isYou?: boolean };

type LeaderboardRowProps = LeaderEntry & {
  /** Sem avatar, para colunas estreitas (widget do painel). */
  compact?: boolean;
};

const MEDAL = ["bg-brand-sunbeam text-surface-ink", "bg-border-cloud-strong text-surface-ink", "bg-feedback-streak text-surface-ink"];

/** Linha de classificação. "Tu" destacado com contorno — e com a palavra, não só a cor. */
export function LeaderboardRow({ rank, name, xp, isYou, compact }: LeaderboardRowProps) {
  return (
    <li
      aria-current={isYou ? "true" : undefined}
      className={cn(
        "flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2",
        isYou ? "border-2 border-brand-ocean bg-surface-sky" : "border-2 border-transparent",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-caption font-bold tabular-nums",
          rank <= 3 ? MEDAL[rank - 1] : "text-text-secondary",
        )}
      >
        <span className="sr-only">Posição </span>
        {rank}
      </span>
      {!compact && <Avatar name={name} size="sm" />}
      <span className={cn("min-w-0 flex-1 text-body-md", compact ? "leading-tight" : "truncate", isYou ? "font-bold text-primary" : "text-on-surface")}>
        {isYou ? "Tu" : name}
      </span>
      <span className="text-body-md font-bold text-on-surface tabular-nums">{formatInt(xp)} XP</span>
    </li>
  );
}
