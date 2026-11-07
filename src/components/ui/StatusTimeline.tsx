import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

export type TimelineStatus = "done" | "active" | "pending";

export type TimelineItem = {
  id: string;
  title: string;
  detail?: ReactNode;
  status: TimelineStatus;
};

const STATUS: Record<TimelineStatus, { icon: IconName; label: string; dot: string; chip: string }> = {
  done: {
    icon: "check",
    label: "Concluído",
    dot: "bg-feedback-success text-surface-ink",
    chip: "border-feedback-success text-feedback-success-ink",
  },
  active: {
    icon: "hourglass",
    label: "Em análise",
    dot: "bg-feedback-streak text-surface-ink",
    chip: "border-feedback-streak text-feedback-streak-ink",
  },
  pending: {
    icon: "lock",
    label: "Pendente",
    dot: "border-2 border-border-input bg-surface-canvas text-text-tertiary",
    chip: "border-border-cloud text-text-tertiary",
  },
};

/** Estado de um processo em etapas. Cada estado tem ícone + palavra, não só cor. */
export function StatusTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-1">
      {items.map((item, i) => {
        const s = STATUS[item.status];
        const last = i === items.length - 1;
        return (
          <li
            key={item.id}
            aria-current={item.status === "active" ? "step" : undefined}
            className={cn(
              "relative flex items-start gap-3.5 rounded-2xl p-3",
              item.status === "active" && "bg-surface-canvas shadow-elevation-1 ring-2 ring-feedback-streak/40",
            )}
          >
            {!last && (
              <span aria-hidden="true" className="absolute top-12 bottom-[-4px] left-[26px] w-0.5 bg-border-cloud" />
            )}
            <span className={cn("relative flex size-7 shrink-0 items-center justify-center rounded-full", s.dot)}>
              <Icon name={s.icon} size={16} strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-md font-bold text-on-surface">{item.title}</p>
              {item.detail && <p className="mt-0.5 text-caption text-text-tertiary">{item.detail}</p>}
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full border bg-surface-canvas px-2.5 py-0.5 text-overline uppercase",
                s.chip,
              )}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
