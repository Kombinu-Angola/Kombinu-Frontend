import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/**
 * Rota mínima por hash ("#/painel") para a demonstração, sem dependências.
 * Com react-router, troque por useLocation() — os ecrãs recebem só props e hrefs.
 */
export function useHashRoute(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash.replace(/^#/, "") || "/",
    () => "/",
  );
}
