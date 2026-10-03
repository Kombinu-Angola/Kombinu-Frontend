import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime, formatSize, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { LibraryItem } from "./types";

type Filter = "todas" | "offline" | "em-curso" | "concluidas";

type StudentLibraryScreenProps = {
  items: LibraryItem[];
  userName: string;
  downloadsHref: string;
  marketplaceHref: string;
};

/** LIB-01 — repositório do estudante: tudo o que comprou, com estado de leitura e de descarga. */
export default function StudentLibraryScreen({
  items,
  userName,
  downloadsHref,
  marketplaceHref,
}: StudentLibraryScreenProps) {
  const [filter, setFilter] = useState<Filter>("todas");
  const [query, setQuery] = useState("");
  const toast = useToast();

  // Todas as contagens saem dos dados: nunca ficam desalinhadas do que a grelha mostra.
  const counts = useMemo(
    () => ({
      todas: items.length,
      offline: items.filter((i) => i.offlineKb !== null).length,
      "em-curso": items.filter((i) => i.status === "em-curso").length,
      concluidas: items.filter((i) => i.status === "concluida").length,
    }),
    [items],
  );

  const offlineKb = items.reduce((sum, i) => sum + (i.offlineKb ?? 0), 0);

  const shown = useMemo(() => {
    const q = normalize(query.trim());
    return items.filter((i) => {
      const matchesFilter =
        filter === "todas" ||
        (filter === "offline" && i.offlineKb !== null) ||
        (filter === "em-curso" && i.status === "em-curso") ||
        (filter === "concluidas" && i.status === "concluida");
      const matchesQuery = !q || normalize(`${i.title} ${i.subject} ${i.author.name}`).includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [items, filter, query]);

  const TABS: ReadonlyArray<{ value: Filter; label: string }> = [
    { value: "todas", label: "Todas" },
    { value: "offline", label: "Disponíveis offline" },
    { value: "em-curso", label: "Em curso" },
    { value: "concluidas", label: "Concluídas" },
  ];

  return (
    <AppShell active="biblioteca" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[1240px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Repositório pessoal</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            As minhas sebentas
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            Tudo o que compraste fica aqui, ligado à tua conta. O que está descarregado abre sem gastar dados.
          </p>
        </header>

        <section
          aria-labelledby="offline-title"
          className="flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-primary-fixed bg-surface-sky p-4 sm:p-5 md:flex-row md:items-center"
        >
          <div className="flex items-start gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-canvas text-primary">
              <Icon name="cloud" size={24} />
            </span>
            <div>
              <h2 id="offline-title" className="text-headline-h3 text-on-surface tabular-nums">
                {formatSize(offlineKb)} guardados no telemóvel
              </h2>
              <p className="mt-0.5 text-caption text-text-secondary tabular-nums">
                {counts.offline} de {counts.todas} sebentas prontas para ler e resolver quizzes sem ligação.
              </p>
            </div>
          </div>
          <LinkButton3D href={downloadsHref} variant="secondary" leadingIcon={<Icon name="gear" size={18} />}>
            Gerir descargas
          </LinkButton3D>
        </section>

        <section className="mt-8 flex flex-col gap-4 border-b-2 border-border-cloud pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-lg flex-1">
            <label htmlFor="library-search" className="sr-only">
              Pesquisar nas minhas sebentas
            </label>
            <Icon
              name="search"
              size={20}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-tertiary"
            />
            <input
              id="library-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Título, cadeira ou autor"
              className="min-h-12 w-full rounded-full border-2 border-border-input bg-surface-canvas pr-4 pl-11 text-body-md text-on-surface"
            />
          </div>

          <div role="group" aria-label="Filtrar sebentas" className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const active = filter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(tab.value)}
                  className={cn(
                    "min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color,translate,box-shadow] duration-150",
                    active
                      ? "border-brand-ocean bg-brand-ocean text-white shadow-3d-primary active:translate-y-1 active:shadow-none"
                      : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
                  )}
                >
                  {tab.label}
                  <span className="ml-1.5 tabular-nums">({counts[tab.value]})</span>
                </button>
              );
            })}
          </div>
        </section>

        <p role="status" className="mt-5 text-caption text-text-secondary tabular-nums">
          {shown.length === 0 ? "Nenhuma sebenta corresponde a esta pesquisa." : `${shown.length} sebentas`}
        </p>

        {shown.length === 0 ? (
          <div className="mt-4 rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">Ainda não tens nada aqui</p>
            <p className="mt-1 text-body-md text-text-secondary">
              As sebentas que comprares aparecem nesta página, prontas a descarregar.
            </p>
            <LinkButton3D href={marketplaceHref} className="mt-5">
              Explorar sebentas
            </LinkButton3D>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((item) => {
              const done = item.status === "concluida";
              return (
                <li key={item.id}>
                  <article className="flex h-full flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-elevation-1 transition-[translate,box-shadow,border-color] duration-200 ease-out-quint hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-overline text-on-primary-fixed uppercase">
                          {item.university} · {item.year}
                        </span>
                        {item.offlineKb !== null ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-feedback-success-soft px-2.5 py-1 text-caption font-bold text-feedback-success-ink tabular-nums">
                            <Icon name="cloud" size={14} />
                            Offline · {formatSize(item.offlineKb)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border-2 border-border-cloud px-2.5 py-0.5 text-caption text-text-secondary">
                            <Icon name="signal" size={14} />
                            Só com ligação
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 font-montserrat text-headline-h3 leading-snug font-extrabold text-on-surface">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-caption text-text-secondary">
                        {item.author.name} · {item.author.credential}
                      </p>
                      <p className="text-caption text-text-tertiary tabular-nums">
                        {item.pages} páginas · {item.checkpoints} checkpoints · aberta {formatActivityTime(item.lastOpenedAt).toLowerCase()}
                      </p>

                      <div className="mt-4">
                        <ProgressBar
                          value={item.readPercent}
                          tone={done ? "ocean" : "streak"}
                          label={`Leitura de ${item.title}`}
                          valueText={`${item.readPercent}% lido`}
                        />
                        <p className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-caption tabular-nums">
                          <span className={cn("font-bold", done ? "text-primary" : "text-feedback-streak-ink")}>
                            {done ? "Concluída" : `${item.readPercent}% lido`}
                          </span>
                          <span className="text-text-tertiary">
                            {done && item.grade ? (
                              <span className="flex items-center gap-1 font-bold text-brand-sunbeam-ink">
                                <Icon name="star" size={14} className="fill-feedback-streak text-feedback-streak" />
                                {item.grade}
                              </span>
                            ) : (
                              `${item.checkpoints - item.checkpointsDone} checkpoints por fazer`
                            )}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 border-t-2 border-border-cloud pt-4">
                      <LinkButton3D
                        href={item.href}
                        variant={done ? "secondary" : "primary"}
                        className="flex-1"
                        trailingIcon={<Icon name="arrow-right" size={18} />}
                      >
                        {done ? "Rever" : "Continuar"}
                      </LinkButton3D>
                      <Button3D
                        variant="ghost"
                        aria-label={`Mais opções para ${item.title}`}
                        onClick={() => toast.show("Menu de opções em breve.")}
                        className="px-3"
                      >
                        <Icon name="dots" size={20} />
                      </Button3D>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
