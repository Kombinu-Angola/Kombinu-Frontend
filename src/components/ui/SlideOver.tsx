import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type SlideOverProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  footer?: ReactNode;
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Painel lateral modal: fecha com Escape ou com o fundo, prende o foco enquanto
 * está aberto e devolve-o ao elemento que o abriu.
 */
export function SlideOver({ open, onClose, title, eyebrow, footer, children }: SlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      openerRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[55]">
      <button
        type="button"
        aria-label="Fechar painel"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-surface-ink/40 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-surface-canvas shadow-clay-hover",
          "motion-safe:animate-feedback-in",
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b-2 border-border-cloud px-5 py-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-overline text-text-tertiary uppercase">{eyebrow}</p>}
            <h2 className="truncate font-montserrat text-headline-h3 font-extrabold text-on-surface">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel de inspeção"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-container-low hover:text-on-surface"
          >
            <Icon name="x" size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && <div className="border-t-2 border-border-cloud px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
