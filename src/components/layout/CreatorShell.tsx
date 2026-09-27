import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "../ui/Avatar";
import { Button3D } from "../ui/Button3D";
import { Icon, type IconName } from "../ui/Icon";

export type CreatorSection = "estudio" | "financeiro" | "publico" | "definicoes";

const NAV: ReadonlyArray<{ id: CreatorSection; label: string; href: string; icon: IconName; hint: string }> = [
  { id: "estudio", label: "Estúdio de criação", href: "#/estudio", icon: "edit", hint: "Rascunhos e publicações" },
  { id: "financeiro", label: "Financeiro e vendas", href: "#/estudio/financeiro", icon: "wallet", hint: "Saldo, levantamentos e histórico" },
  { id: "publico", label: "Perfil público", href: "#/criador", icon: "users", hint: "Como os estudantes te veem" },
  { id: "definicoes", label: "Conta e subscrição", href: "#/estudio/definicoes", icon: "gear", hint: "Perfil, notificações e plano" },
];

type CreatorShellProps = {
  active: CreatorSection;
  creatorName: string;
  /** Ações do topo específicas do ecrã. */
  actions?: ReactNode;
  children: ReactNode;
};

/** Moldura do modo criador: barra fixa com gaveta de navegação e atalho para o modo estudante. */
export function CreatorShell({ active, creatorName, actions, children }: CreatorShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-brand-ocean px-4 py-2 text-button text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar para o conteúdo
      </a>

      <header className="sticky top-0 z-40 border-b-2 border-border-cloud bg-surface-canvas">
        <div className="mx-auto flex min-h-16 max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-2 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label="Abrir o menu do criador"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-border-cloud text-text-secondary transition-[background-color] duration-150 hover:bg-surface-soft"
            >
              <Icon name="menu" size={20} />
            </button>
            <a href="#/estudio" className="font-montserrat text-headline-h3 font-extrabold text-primary">
              Kombinu <span className="text-text-secondary">Estúdio</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <a
              href="#/trilhas"
              className="hidden min-h-11 items-center gap-2 rounded-full border-2 border-border-cloud px-4 text-button text-text-secondary uppercase transition-[color,background-color] duration-150 hover:bg-surface-soft hover:text-primary sm:inline-flex"
            >
              <Icon name="refresh" size={18} />
              Modo estudante
            </a>
            <a href="#/criador" aria-label={`Perfil público de ${creatorName}`} className="rounded-full">
              <Avatar name={creatorName} />
            </a>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar o menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-surface-ink/40"
          />
          <nav
            aria-label="Modo criador"
            className="absolute inset-y-0 left-0 flex w-[300px] flex-col border-r-2 border-border-cloud bg-surface-canvas p-4"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="font-montserrat text-headline-h3 font-extrabold text-primary">Modo criador</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar o menu"
                className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={item.id === active ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center gap-3 rounded-xl px-3 transition-[background-color,color] duration-150",
                      item.id === active ? "bg-primary-fixed text-primary" : "text-text-secondary hover:bg-surface-soft",
                    )}
                  >
                    <Icon name={item.icon} size={22} className="shrink-0" />
                    <span>
                      <span className={cn("block text-body-md", item.id === active && "font-bold")}>{item.label}</span>
                      <span className="block text-caption text-text-tertiary">{item.hint}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t-2 border-border-cloud pt-4">
              <Button3D variant="ghost" fullWidth onClick={() => (window.location.hash = "#/trilhas")}>
                Voltar ao modo estudante
              </Button3D>
            </div>
          </nav>
        </div>
      )}

      <main id="conteudo" className="flex-1">
        {children}
      </main>
    </div>
  );
}
