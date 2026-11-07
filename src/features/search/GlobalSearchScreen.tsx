import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { formatInt, formatKz, formatSize, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { SearchKind, SearchResults } from "./types";

const rating1 = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const KIND_LABEL: Record<SearchKind, { plural: string; icon: IconName }> = {
  sebenta: { plural: "Sebentas e resumos", icon: "book" },
  simulado: { plural: "Simulados e quizzes", icon: "bolt" },
  explicador: { plural: "Explicadores", icon: "users" },
  cadeira: { plural: "Cadeiras", icon: "school" },
};

const ORDER: SearchKind[] = ["sebenta", "simulado", "explicador", "cadeira"];

type GlobalSearchScreenProps = { results: SearchResults; userName: string };

/** Pesquisa global: cadeira em destaque e resultados agrupados por tipo. */
export default function GlobalSearchScreen({ results, userName }: GlobalSearchScreenProps) {
  const [query, setQuery] = useState(results.query);
  const [kind, setKind] = useState<SearchKind | "todos">("todos");

  // A pesquisa filtra de facto, sem acentos: é o mesmo comportamento do marketplace.
  const matched = useMemo(() => {
    const q = normalize(query.trim());
    return results.hits.filter((hit) => !q || normalize(`${hit.title} ${hit.subtitle} ${hit.university}`).includes(q));
  }, [results.hits, query]);

  const counts = useMemo(() => {
    const base: Record<SearchKind | "todos", number> = {
      todos: matched.length,
      sebenta: 0,
      simulado: 0,
      explicador: 0,
      cadeira: 0,
    };
    for (const hit of matched) base[hit.kind] += 1;
    return base;
  }, [matched]);

  const shown = kind === "todos" ? matched : matched.filter((h) => h.kind === kind);
  const groups = ORDER.map((k) => ({ kind: k, hits: shown.filter((h) => h.kind === k) })).filter(
    (g) => g.hits.length > 0,
  );
  const showBest = Boolean(results.best) && normalize(query).includes(normalize(results.best!.subject).slice(0, 5));

  return (
    <AppShell active="sebentas" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[1040px] px-4 py-6 md:px-6 lg:py-8">
        <h1 className="sr-only">Resultados da pesquisa</h1>
        <form role="search" className="mb-2" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="global-search" className="sr-only">
            Pesquisar em toda a Kombinu
          </label>
          <div className="flex min-h-[52px] items-center gap-3 rounded-full border-2 border-brand-ocean bg-surface-canvas px-5 has-[input:focus-visible]:border-brand-sky-ink">
            <Icon name="search" size={22} className="shrink-0 text-primary" />
            <input
              id="global-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sebentas, simulados, temas ou cadeiras"
              className="w-full bg-transparent text-body-lg text-on-surface focus-visible:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpar a pesquisa"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-text-tertiary hover:bg-surface-soft hover:text-on-surface"
              >
                <Icon name="x" size={18} />
              </button>
            )}
          </div>
        </form>

        <p role="status" className="mb-5 flex items-center gap-2 px-3 text-caption text-text-secondary tabular-nums">
          <Icon name="bolt" size={15} className="text-feedback-success-ink" />
          {matched.length === 0
            ? "Sem resultados para esta pesquisa."
            : `${matched.length} resultados · a pesquisa ignora acentos e erros de escrita.`}
        </p>

        <div role="group" aria-label="Filtrar por tipo" className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {([{ value: "todos" as const, label: "Todos" }, ...ORDER.map((k) => ({ value: k, label: KIND_LABEL[k].plural }))]).map(
            (tab) => {
              const active = kind === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setKind(tab.value)}
                  className={cn(
                    "min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color] duration-150",
                    active
                      ? "border-brand-ocean bg-brand-ocean text-white"
                      : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
                  )}
                >
                  {tab.label}
                  <span className="ml-1.5 tabular-nums">({counts[tab.value]})</span>
                </button>
              );
            },
          )}
        </div>

        {showBest && results.best && kind === "todos" && (
          <section
            aria-labelledby="best-title"
            className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border-2 border-brand-ocean bg-surface-sky p-5 shadow-clay md:flex-row md:items-center"
          >
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 text-overline text-surface-ink uppercase">
                <Icon name="target" size={14} />
                Cadeira do teu plano curricular
              </p>
              <h2 id="best-title" className="mt-2 font-montserrat text-headline-h2 text-primary">
                {results.best.subject} · {results.best.university}
              </h2>
              <p className="mt-1 text-body-md text-text-secondary tabular-nums">
                {results.best.faculty} · {results.best.year}, {results.best.semester} · {results.best.materials}{" "}
                materiais validados · {results.best.students} estudantes na liga
              </p>
            </div>
            <LinkButton3D href={results.best.href} className="shrink-0" trailingIcon={<Icon name="arrow-right" size={18} />}>
              Abrir a trilha
            </LinkButton3D>
          </section>
        )}

        {shown.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">Nada encontrado para “{query}”</p>
            <p className="mt-1 text-body-md text-text-secondary">
              Tenta o nome da cadeira, da universidade ou do tema. Se mesmo assim não houver, avisamos os criadores da
              tua faculdade.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groups.map((group) => (
              <section key={group.kind} aria-labelledby={`group-${group.kind}`}>
                <h2
                  id={`group-${group.kind}`}
                  className="mb-3 flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface"
                >
                  <Icon name={KIND_LABEL[group.kind].icon} size={20} className="text-primary" />
                  {KIND_LABEL[group.kind].plural}
                  <span className="text-caption font-medium text-text-tertiary tabular-nums">({group.hits.length})</span>
                </h2>

                <ul
                  className={cn(
                    "grid gap-4",
                    group.kind === "sebenta" || group.kind === "explicador" ? "md:grid-cols-2" : "grid-cols-1",
                  )}
                >
                  {group.hits.map((hit) => (
                    <li key={hit.id}>
                      <article className="flex h-full flex-col justify-between rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 transition-[border-color,translate] duration-150 hover:-translate-y-0.5 hover:border-brand-ocean">
                        <div>
                          <p className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-primary-fixed px-2 py-0.5 text-overline text-on-primary-fixed uppercase">
                              {hit.university}
                              {hit.year && ` · ${hit.year}`}
                            </span>
                            {hit.sizeKb !== undefined && (
                              <span className="rounded-md bg-surface-forest px-2 py-0.5 text-overline text-feedback-success uppercase tabular-nums">
                                {formatSize(hit.sizeKb)}
                              </span>
                            )}
                            {hit.kind === "simulado" && hit.xp !== undefined && (
                              <span className="rounded-md bg-secondary-fixed px-2 py-0.5 text-overline text-on-secondary-fixed-variant uppercase tabular-nums">
                                +{hit.xp} XP
                              </span>
                            )}
                          </p>

                          <h3 className="mt-2.5 flex items-start gap-2 font-montserrat text-headline-h3 leading-snug font-extrabold text-on-surface">
                            {hit.kind === "explicador" && <Avatar name={hit.title} size="sm" />}
                            <a href={hit.href} className="hover:text-primary">
                              {hit.title}
                            </a>
                            {hit.verified && (
                              <>
                                <Icon name="seal" size={16} className="mt-1 shrink-0 text-brand-sky-ink" />
                                <span className="sr-only">verificado</span>
                              </>
                            )}
                          </h3>
                          <p className="mt-1 text-caption text-text-secondary">{hit.subtitle}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-cloud pt-3">
                          <p className="flex flex-wrap items-center gap-3 text-caption text-text-secondary tabular-nums">
                            {hit.rating !== undefined && (
                              <span className="flex items-center gap-1">
                                <Icon name="star" size={15} className="fill-feedback-streak text-feedback-streak" />
                                <strong className="text-on-surface">{rating1.format(hit.rating)}</strong>
                                {hit.reviews !== undefined && <span className="text-text-tertiary">({hit.reviews})</span>}
                              </span>
                            )}
                            {hit.minutes !== undefined && <span>{hit.minutes} min</span>}
                            {hit.attempts !== undefined && <span>{formatInt(hit.attempts)} tentativas</span>}
                            {hit.priceKz !== undefined &&
                              (hit.priceKz === 0 ? (
                                <span className="rounded-full bg-feedback-success px-2 py-0.5 text-overline text-surface-ink uppercase">
                                  Grátis
                                </span>
                              ) : (
                                <strong className="text-body-md text-primary">{formatKz(hit.priceKz)}</strong>
                              ))}
                          </p>

                          <LinkButton3D href={hit.href} variant="ghost" trailingIcon={<Icon name="arrow-right" size={16} />}>
                            {hit.kind === "simulado" ? "Iniciar" : hit.kind === "explicador" ? "Ver perfil" : "Abrir"}
                            <span className="sr-only">: {hit.title}</span>
                          </LinkButton3D>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
