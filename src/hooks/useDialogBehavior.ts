import { useEffect, useRef } from "react";

/**
 * Comportamento partilhado por modais e gavetas sobrepostas: foco inicial dentro
 * do painel ao abrir, Escape fecha, bloqueia o scroll do fundo enquanto está
 * aberto, e devolve o foco a quem a abriu ao fechar. Não implementa um focus
 * trap completo (Tab ainda consegue saír do painel por desenho, ver PricingModal).
 */
export function useDialogBehavior<T extends HTMLElement = HTMLDivElement>(onClose: () => void) {
  const panelRef = useRef<T>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement;
    panelRef.current?.querySelector<HTMLElement>("button, input, a, select, textarea")?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      openerRef.current?.focus();
    };
  }, [onClose]);

  return panelRef;
}
