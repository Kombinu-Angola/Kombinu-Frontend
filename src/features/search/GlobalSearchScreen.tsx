import { useDeferredValue, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useListaMateriais } from "../../hooks/useV2Dados";

/** Pesquisa de materiais (`GET /contents/?search=`) no workspace activo. */
export default function GlobalSearchScreen({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const termo = useDeferredValue(query.trim());
  const lista = useListaMateriais({ busca: termo || undefined });
  const itens = lista.data?.pages.flatMap((p) => p.itens) ?? [];

  return (
    <AppShell active="sebentas">
      <div className="mx-auto max-w-[1040px] px-4 py-6 md:px-6 lg:py-8">
        <h1 className="sr-only">Resultados da pesquisa</h1>
        <form role="search" className="mb-6" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="global-search" className="sr-only">
            Pesquisar materiais
          </label>
          <div className="flex min-h-[52px] items-center gap-3 rounded-full border-2 border-brand-ocean bg-surface-canvas px-5 has-[input:focus-visible]:border-brand-sky-ink">
            <Icon name="search" size={20} className="shrink-0 text-text-tertiary" />
            <input
              id="global-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Título ou descrição"
              enterKeyHint="search"
              className="min-h-11 w-full bg-transparent text-body-lg text-on-surface outline-none"
            />
          </div>
        </form>

        {lista.isPending ? (
          <p role="status" className="text-body-md text-text-secondary">
            A pesquisar...
          </p>
        ) : lista.isError ? (
          <p role="alert" className="text-body-md text-text-secondary">
            Não foi possível pesquisar agora. Tenta novamente.
          </p>
        ) : itens.length === 0 ? (
          <p role="status" className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center text-body-md text-text-secondary">
            {termo ? `Nenhum material encontrado para “${termo}”.` : "Ainda não há materiais neste espaço."}
          </p>
        ) : (
          <>
            <p role="status" className="mb-4 text-caption text-text-secondary tabular-nums">
              {lista.data?.pages[0]?.total ?? itens.length} resultados
            </p>
            <ul className="flex flex-col gap-3">
              {itens.map((m) => (
                <li key={m.id}>
                  <a
                    href={`/v2/marketplace/${encodeURIComponent(m.id)}`}
                    className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 hover:border-brand-ocean"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-body-lg font-bold text-on-surface">{m.titulo}</span>
                      <span className="block truncate text-caption text-text-secondary">
                        {m.categoriaRotulo} · {m.nivel} · {m.criadorNome}
                      </span>
                    </span>
                    <Icon name="arrow-right" size={20} className="shrink-0 text-primary" />
                  </a>
                </li>
              ))}
            </ul>
            {lista.hasNextPage && (
              <div className="mt-6 flex justify-center">
                <Button3D variant="secondary" disabled={lista.isFetchingNextPage} onClick={() => void lista.fetchNextPage()}>
                  Ver mais
                </Button3D>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
