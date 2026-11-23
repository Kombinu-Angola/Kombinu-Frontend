import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { EASE_OUT } from "./motion";
import { ChevronLeftIcon } from "./icons";
import { Logo } from "./layout";

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      className="h-2.5 w-full overflow-hidden rounded-full bg-kombinu-surface"
    >
      <motion.div
        className="h-full origin-left rounded-full bg-kombinu-blue"
        initial={false}
        animate={{ scaleX: v / 100 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      />
    </div>
  );
}

type FlowLayoutProps = {
  children: ReactNode;
  back?: { href?: string; onClick?: () => void; label?: string };
  progress?: { value: number; label: string };
  aside?: ReactNode;
  /** Acção fixa no fundo (telemóvel), com safe-area. */
  footer?: ReactNode;
  width?: "narrow" | "wide";
};

const BOTAO_VOLTAR = "-ml-2 grid size-11 shrink-0 place-items-center rounded-xl hover:bg-kombinu-surface focus-ring";

/** Moldura dos ecrãs de onboarding: topo com voltar e progresso, conteúdo centrado e acção fixa no fundo. */
export function FlowLayout({ children, back, progress, aside, footer, width = "narrow" }: FlowLayoutProps) {
  const max = width === "narrow" ? "max-w-[520px]" : "max-w-[720px]";
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="sticky top-0 z-20 border-b border-transparent bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className={`mx-auto flex h-16 w-full items-center gap-3 px-5 ${max}`}>
          {back ? (
            back.href ? (
              <Link to={back.href} aria-label={back.label ?? "Voltar"} className={BOTAO_VOLTAR}>
                <ChevronLeftIcon className="size-6" />
              </Link>
            ) : (
              <button type="button" onClick={back.onClick} aria-label={back.label ?? "Voltar"} className={BOTAO_VOLTAR}>
                <ChevronLeftIcon className="size-6" />
              </button>
            )
          ) : (
            <Link to="/" className="rounded-md focus-ring" aria-label="Kombinu — início">
              <Logo size="sm" />
            </Link>
          )}
          <div className="min-w-0 flex-1">{progress && <ProgressBar value={progress.value} label={progress.label} />}</div>
          {aside}
        </div>
      </div>
      <main className={`mx-auto w-full flex-1 px-5 pt-6 pb-10 ${max}`}>{children}</main>
      {footer && (
        <div className="sticky bottom-0 z-20 border-t border-neutral-100 bg-white/95 backdrop-blur">
          <div className={`mx-auto w-full px-5 pt-3 pb-safe ${max}`}>{footer}</div>
        </div>
      )}
    </div>
  );
}
