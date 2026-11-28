import { LogoMark } from "../ui/LogoMark";

/**
 * Esqueleto de página para o que carrega sob pedido (ficheiro da tela, sessão): barra do topo e blocos
 * cinzentos que pulsam. Não mostra dados nem números, só a forma de uma página, e tira o ecrã inteiro ao círculo a rodar.
 * Com `prefers-reduced-motion` os blocos ficam parados (`motion-safe`).
 */
export function EsqueletoPagina() {
  return (
    <div role="status" aria-label="A carregar" className="min-h-dvh bg-background">
      <div className="flex h-16 items-center justify-between border-b-2 border-border-cloud bg-surface-canvas px-4 md:px-6">
        <LogoMark />
        <span aria-hidden="true" className="size-10 rounded-full bg-border-cloud/60 motion-safe:animate-pulse" />
      </div>
      <div aria-hidden="true" className="mx-auto flex max-w-[1080px] flex-col gap-5 px-4 py-8 md:px-6">
        <span className="h-9 w-2/3 max-w-sm rounded-xl bg-border-cloud/60 motion-safe:animate-pulse" />
        <span className="h-4 w-1/2 max-w-xs rounded-lg bg-border-cloud/60 motion-safe:animate-pulse" />
        <span className="h-32 rounded-3xl bg-border-cloud/60 motion-safe:animate-pulse" />
        <span className="h-32 rounded-3xl bg-border-cloud/60 motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
