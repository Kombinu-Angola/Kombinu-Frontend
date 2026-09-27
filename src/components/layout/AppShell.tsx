import type { ReactNode } from "react";
import { useGamification } from "../../contexts/GamificationContext";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import { Avatar } from "../ui/Avatar";
import { DataSaverBadge } from "../ui/DataSaverBadge";
import { Icon, type IconName } from "../ui/Icon";

export type AppSection = "trilhas" | "simulados" | "ligas" | "sebentas" | "painel";

const NAV: ReadonlyArray<{ id: AppSection; label: string; href: string; icon: IconName }> = [
  { id: "trilhas", label: "Trilhas", href: "#/trilhas", icon: "book" },
  { id: "simulados", label: "Simulados", href: "#/desafio", icon: "bolt" },
  { id: "ligas", label: "Ligas", href: "#/ligas", icon: "trophy" },
  { id: "sebentas", label: "Sebentas", href: "#/marketplace", icon: "bag" },
];

type AppShellProps = {
  active: AppSection;
  userName: string;
  /** Cadeira em curso, mostrada ao lado da marca. */
  campus?: string;
  /** Conteúdo extra no cabeçalho (ex.: pesquisa do marketplace). */
  headerSlot?: ReactNode;
  children: ReactNode;
};

/**
 * Moldura da app com sessão iniciada: navegação em pílula no desktop, barra de separadores
 * fixa no telemóvel (polegar), sequência e gemas sempre visíveis, rodapé e selo de dados.
 */
export function AppShell({ active, userName, campus, headerSlot, children }: AppShellProps) {
  const { streakDays, gems } = useGamification();

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-brand-ocean px-4 py-2 text-button text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar para o conteúdo
      </a>

      <header className="sticky top-0 z-50 border-b-2 border-border-cloud bg-surface-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 md:h-20 md:px-6">
          <span className="flex min-w-0 items-center gap-3">
            <a href="#/trilhas" className="font-montserrat text-headline-h2 font-extrabold tracking-tight text-primary">
              Kombinu
            </a>
            {campus && (
              <span className="hidden items-center gap-1.5 rounded-full bg-surface-sky px-3 py-1 text-caption font-bold text-primary sm:inline-flex">
                <Icon name="school" size={16} />
                {campus}
              </span>
            )}
          </span>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex gap-1 rounded-full border-2 border-border-cloud bg-surface-soft p-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={item.id === active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-2 rounded-full px-5 text-body-md font-bold transition-[background-color,color,box-shadow] duration-150",
                      item.id === active
                        ? "bg-surface-canvas text-primary shadow-elevation-1"
                        : "text-text-secondary hover:text-on-surface",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            {headerSlot}
            <p className="flex items-center gap-1.5 text-body-lg font-bold text-feedback-streak-ink tabular-nums">
              <Icon name="flame" size={20} className="text-feedback-streak" />
              <span aria-hidden="true">{streakDays}</span>
              <span className="sr-only">Sequência de {streakDays} dias</span>
            </p>
            <p className="flex items-center gap-1.5 text-body-lg font-bold text-feedback-gem-ink tabular-nums">
              <Icon name="gem" size={20} />
              <span aria-hidden="true">{formatInt(gems)}</span>
              <span className="sr-only">{formatInt(gems)} gemas</span>
            </p>
            <a href="#/painel" aria-label={`Painel e perfil de ${userName}`} className="relative rounded-full">
              <Avatar name={userName} />
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-feedback-success"
              />
            </a>
          </div>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <footer className="mt-16 border-t-2 border-border-cloud bg-surface-soft">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <span className="font-montserrat text-headline-h3 font-extrabold text-primary">Kombinu</span>
          <ul className="flex flex-wrap justify-center gap-x-6 text-caption">
            {["Sobre nós", "Termos de uso", "Privacidade", "Ajuda"].map((l) => (
              <li key={l}>
                <a href="#" className="flex min-h-11 items-center font-bold text-text-secondary hover:text-primary">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <DataSaverBadge megabytesToday={1.2} />
            <p className="text-caption text-text-tertiary">© {new Date().getFullYear()} Kombinu</p>
          </div>
        </div>
      </footer>

      {/* Telemóvel: separadores fixos no fundo, ao alcance do polegar */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-border-cloud bg-surface-canvas pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-4">
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                aria-current={item.id === active ? "page" : undefined}
                className={cn(
                  "flex min-h-[64px] flex-col items-center justify-center gap-1 text-[12px] font-bold",
                  item.id === active ? "text-primary" : "text-text-tertiary",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-[background-color] duration-150",
                    item.id === active && "bg-primary-fixed",
                  )}
                >
                  <Icon name={item.icon} size={20} />
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
