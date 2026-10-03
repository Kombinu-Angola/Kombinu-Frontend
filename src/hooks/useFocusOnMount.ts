import { useEffect, useRef } from "react";

/**
 * Para ecrãs dentro de um fluxo: ao montar, volta ao topo e põe o foco no título
 * (com tabIndex={-1}), para o leitor de ecrã anunciar a mudança de "página".
 */
export function useFocusOnMount<T extends HTMLElement = HTMLHeadingElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}
