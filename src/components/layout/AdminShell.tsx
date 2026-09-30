import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "../ui/Icon";

export type AdminSection = "visao" | "estudantes" | "criadores" | "moderacao" | "insights" | "financeiro" | "gamificacao" | "catalogo" | "subscricoes" | "suporte";

const NAV: ReadonlyArray<{ id: AdminSection; label: string; href: string; icon: IconName }> = [
  { id: "visao", label: "Visão executiva", href: "/v2/admin", icon: "grid" },
  { id: "estudantes", label: "Estudantes e polos", href: "/v2/admin/estudantes", icon: "users" },
  { id: "criadores", label: "Homologação de criadores", href: "/v2/admin/criadores", icon: "seal" },
  { id: "moderacao", label: "Moderação de conteúdo", href: "/v2/admin/moderacao", icon: "shield" },
  { id: "insights", label: "Insights", href: "/v2/admin/insights", icon: "chart" },
  { id: "financeiro", label: "Financeiro e Express", href: "/v2/admin/financeiro", icon: "wallet" },
  { id: "subscricoes", label: "Subscrições Pro", href: "/v2/admin/subscricoes", icon: "seal" },
  { id: "gamificacao", label: "Gamificação e ligas", href: "/v2/admin/gamificacao", icon: "trophy" },
  { id: "catalogo", label: "Catálogo curricular", href: "/v2/admin/catalogo", icon: "school" },
  { id: "suporte", label: "Suporte e disputas", href: "/v2/admin/suporte", icon: "comment" },
];

type AdminShellProps = {
  active: AdminSection;
  title: string;
  description: string;
  /** Ações do cabeçalho da página (exportar, atualizar…). */
  actions?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
};

function NavList({ active, onNavigate }: { active: AdminSection; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1 px-2">
      {NAV.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            onClick={onNavigate}
            aria-current={item.id === active ? "page" : undefined}
            className={cn(
              "relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-body-md transition-[background-color,color] duration-150",
              item.id === active
                ? "bg-primary-fixed font-bold text-primary before:absolute before:top-2 before:bottom-2 before:left-0 before:w-1 before:rounded-r before:bg-brand-ocean before:content-['']"
                : "text-text-secondary hover:bg-surface-soft hover:text-on-surface",
            )}
          >
            <Icon name={item.icon} size={20} className="shrink-0" />
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Moldura do backoffice: navegação lateral no desktop, gaveta no telemóvel, e barra de estado. */
export function AdminShell({ active, title, description, actions, eyebrow, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-brand-ocean px-4 py-2 text-button text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar para o conteúdo
      </a>

      {/* Navegação lateral (desktop) */}
      <nav aria-label="Backoffice" className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col justify-between border-r-2 border-border-cloud bg-surface-canvas lg:flex">
        <div>
          <div className="flex h-16 items-center justify-between border-b-2 border-border-cloud px-5">
            <a href="/v2/admin" className="font-montserrat text-headline-h3 font-extrabold text-primary">
              Kombinu
            </a>
            <span className="rounded-full bg-brand-ocean px-2 py-0.5 text-overline text-white uppercase">Admin</span>
          </div>
          <p className="px-5 pt-5 pb-2 text-overline text-text-tertiary uppercase">Centro de operações</p>
          <NavList active={active} />
        </div>
        <div className="border-t-2 border-border-cloud p-4">
          <p className="flex items-center justify-between rounded-lg border-2 border-border-cloud bg-surface-soft p-3">
            <span>
              <span className="block text-caption text-text-secondary">Plataforma Luanda</span>
              <span className="block text-overline text-primary">v1.0 · AO</span>
            </span>
            <span aria-hidden="true" className="size-2 rounded-full bg-feedback-success" />
            <span className="sr-only">Sistema operacional</span>
          </p>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-surface-ink/40"
          />
          <nav
            aria-label="Backoffice"
            className="absolute inset-y-0 left-0 w-[280px] border-r-2 border-border-cloud bg-surface-canvas py-4"
          >
            <div className="mb-4 flex items-center justify-between px-5">
              <span className="font-montserrat text-headline-h3 font-extrabold text-primary">Kombinu Admin</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <NavList active={active} onNavigate={() => setMenuOpen(false)} />
          </nav>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b-2 border-border-cloud bg-surface-canvas px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu do backoffice"
              aria-expanded={menuOpen}
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-border-cloud text-text-secondary hover:bg-surface-soft lg:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
            <p className="hidden items-center gap-2 rounded-full border-2 border-border-cloud px-3 py-1 text-caption text-text-secondary xl:flex">
              <span aria-hidden="true" className="size-2 rounded-full bg-feedback-success" />
              Servidor <strong className="text-on-surface">operacional</strong>
            </p>
            <p className="hidden items-center gap-2 rounded-full border-2 border-border-cloud px-3 py-1 text-caption text-text-secondary lg:flex">
              <Icon name="signal" size={16} className="text-brand-sky-ink" />
              Multicaixa Express <strong className="text-on-surface tabular-nums">99,4%</strong>
            </p>
            <p className="flex items-center gap-2 rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase tabular-nums">
              <Icon name="bolt" size={14} />
              1,4 MB/h · meta &lt; 4,8
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Notificações (3 por ler)"
              className="relative flex size-11 items-center justify-center rounded-lg border-2 border-border-cloud text-text-secondary transition-[background-color] duration-150 hover:bg-surface-soft"
            >
              <Icon name="bell" size={20} />
              <span aria-hidden="true" className="absolute top-2 right-2 size-2 rounded-full bg-feedback-error" />
            </button>
            <p className="hidden border-l-2 border-border-cloud pl-3 text-right sm:block">
              <span className="block text-button text-on-surface">Super Admin</span>
              <span className="block text-caption text-text-secondary">operacoes@kombinu.ao</span>
            </p>
          </div>
        </header>

        <main id="conteudo" className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              {eyebrow && <p className="mb-1 text-overline text-text-tertiary uppercase">{eyebrow}</p>}
              <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">{title}</h1>
              <p className="mt-1 max-w-3xl text-body-md text-text-secondary">{description}</p>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
