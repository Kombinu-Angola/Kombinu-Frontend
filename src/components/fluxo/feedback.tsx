import type { ReactNode } from "react";
import { AlertIcon, CheckIcon } from "./icons";

type Tom = "info" | "success" | "danger" | "warning";

const TOM: Record<Tom, string> = {
  info: "bg-kombinu-blue-soft text-kombinu-blue-dark ring-kombinu-blue/15",
  success: "bg-kombinu-success-soft text-neutral-800 ring-black/5",
  danger: "bg-kombinu-danger-soft text-kombinu-danger ring-kombinu-danger/20",
  warning: "bg-kombinu-yellow-soft text-neutral-800 ring-kombinu-yellow/50",
};

export function Alert({ tone = "info", title, children, icon, action }: { tone?: Tom; title?: string; children?: ReactNode; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm ring-1 ring-inset motion-safe:animate-fade-in ${TOM[tone]}`}
    >
      <span className="mt-0.5 shrink-0">{icon ?? (tone === "success" ? <CheckIcon className="size-4" strokeWidth={3} /> : <AlertIcon className="size-4" />)}</span>
      <div className="min-w-0 flex-1 leading-relaxed">
        {title && <p className="font-bold">{title}</p>}
        {children && <div className={title ? "mt-0.5 font-medium opacity-90" : "font-medium"}>{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}

export function Badge({ tone = "neutral", children, icon }: { tone?: "neutral" | "blue" | "yellow" | "green"; children: ReactNode; icon?: ReactNode }) {
  const mapa = {
    neutral: "bg-kombinu-surface text-neutral-700",
    blue: "bg-kombinu-blue-soft text-kombinu-blue",
    yellow: "bg-kombinu-yellow-soft text-neutral-800",
    green: "bg-kombinu-success-soft text-neutral-800",
  };
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold whitespace-nowrap ${mapa[tone]}`}>
      {icon}
      {children}
    </span>
  );
}

export function Spinner({ className = "size-5" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block rounded-full border-2 border-current/30 border-t-current motion-safe:animate-spin ${className}`} />;
}
