import { LinkButton3D } from "../ui/Button3D";
import kombinuMark from "../assets/kombinu-mark.svg";

const NAV = [
  { href: "#epocas", label: "Épocas" },
  { href: "#como", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#pagamento", label: "Pagamento" },
  { href: "#perguntas", label: "Perguntas" },
] as const;

/** Cabeçalho fixo da landing "Passe de Provas" — navegação por âncoras desta página. */
export function PasseHeader() {
  return (
    <>
      <a
        href="#topo"
        className="sr-only z-[60] rounded-full bg-surface-ink px-4.5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-4"
      >
        Saltar para o conteúdo
      </a>
      <header className="sticky top-0 z-30 border-b-2 border-border-cloud bg-surface-canvas">
        <div className="mx-auto flex min-h-[72px] max-w-[1240px] items-center gap-4 px-4 sm:px-6">
          <a href="#topo" className="inline-flex items-center rounded-lg p-1.5">
            <img src={kombinuMark} alt="Kombinu" className="size-9" />
          </a>

          <nav aria-label="Principal" className="mx-auto hidden items-center gap-1 min-[1100px]:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center rounded-md px-3.5 font-medium text-on-surface transition-[color,background-color] duration-150 hover:bg-surface-container-low hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="#entrar"
              className="hidden min-h-11 items-center rounded-md px-3.5 font-medium text-on-surface transition-[color,background-color] duration-150 hover:bg-surface-container-low hover:text-primary min-[480px]:inline-flex"
            >
              Entrar
            </a>
            <LinkButton3D href="#simulado" size="md" className="text-sm">
              Começar grátis
            </LinkButton3D>
          </div>
        </div>
      </header>
    </>
  );
}
