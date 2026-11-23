import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react";
import { EASE_DRAWER } from "./motion";
import { XIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** false impede fechar ao tocar fora / arrastar (ex.: pagamento em curso) */
  dismissible?: boolean;
};

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Folha inferior (telemóvel) / diálogo centrado (desktop).
 * Entra e sai pelo mesmo caminho (baixo), curva de drawer iOS, 400ms.
 * Arrastar para baixo fecha; a pega é a superfície do gesto, o conteúdo continua a fazer scroll.
 */
export function BottomSheet({ open, onClose, title, description, children, dismissible = true }: Props) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus() ?? panelRef.current?.focus(), 50);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && dismissible) onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      restoreRef.current?.focus?.();
    };
  }, [open, dismissible, onClose]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (dismissible && (info.offset.y > 120 || info.velocity.y > 600)) onClose();
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.div aria-hidden="true" className="absolute inset-0 bg-kombinu-ink/45"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_DRAWER }}
            onClick={() => dismissible && onClose()} />
          <motion.div
            ref={panelRef}
            role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: EASE_DRAWER }}
            drag={dismissible ? "y" : false} dragListener={false} dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.04, bottom: 0.6 }} onDragEnd={onDragEnd}
            className="relative flex max-h-[92dvh] w-full max-w-[560px] flex-col rounded-t-[28px] bg-white shadow-2xl outline-none sm:rounded-[28px]"
          >
            <div onPointerDown={(e) => dismissible && drag.start(e)} className="shrink-0 cursor-grab touch-none px-6 pt-3 pb-2 active:cursor-grabbing">
              <div aria-hidden="true" className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-neutral-300" />
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 id={titleId} className="font-display text-xl leading-tight font-bold text-balance">{title}</h2>
                  {description && <p id={descId} className="mt-1.5 text-[0.95rem] text-neutral-600">{description}</p>}
                </div>
                {dismissible && (
                  <button type="button" onClick={onClose} aria-label="Fechar"
                    className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-xl text-neutral-500 hover:bg-kombinu-surface hover:text-kombinu-ink focus-ring">
                    <XIcon className="size-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-2 pb-safe">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
