import { useDeferredValue, useId, useMemo, useState } from "react";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useListaMateriais } from "../../hooks/useV2Dados";
import { CATEGORIAS, NIVEIS } from "../../services/materialService";
import { FilterChips } from "./FilterChips";
import { MaterialCard } from "./MaterialCard";

type MaterialGridProps = { rotuloPesquisa: string; dica: string; className?: string };

/**
 * Pesquisa, filtros e grelha de materiais reais (`GET /contents/` do workspace activo).
 * A categoria e a pesquisa filtram no servidor; o nível filtra as páginas já carregadas
 * (o backend ainda não tem filtro por nível).
 */
export function MaterialGrid({ rotuloPesquisa, dica, className }: MaterialGridProps) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("all");
  const [nivel, setNivel] = useState<string>("all");
  const buscaDiferida = useDeferredValue(busca.trim());
  const searchId = useId();

  const lista = useListaMateriais({
    categoria: categoria === "all" ? undefined : categoria,
    busca: buscaDiferida || undefined,
  });

  const itens = useMemo(() => {
    const todos = lista.data?.pages.flatMap((p) => p.itens) ?? [];
    return nivel === "all" ? todos : todos.filter((m) => m.nivel === nivel);
  }, [lista.data, nivel]);
  const total = lista.data?.pages[0]?.total ?? 0;
  const contagem = nivel === "all" ? total : itens.length;

  return (
    <div className={className}>
      <div role="search" className="mx-auto mb-4 max-w-[1280px] px-4 md:px-6">
        <label htmlFor={searchId} className="sr-only">
          {rotuloPesquisa}
        </label>
        <div className="relative">
          <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-tertiary" />
          <input
            id={searchId}
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={dica}
            enterKeyHint="search"
            className="min-h-12 w-full rounded-full border-2 border-border-input bg-surface-canvas pr-4 pl-12 text-body-md text-on-surface"
          />
        </div>
      </div>

      <div className="border-b-2 border-border-cloud bg-surface-canvas">
        <div className="mx-auto flex max-w-[1280px] gap-6 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-6">
          <FilterChips
            label="Categoria"
            value={categoria}
            onChange={setCategoria}
            options={[{ value: "all", label: "Todas" }, ...CATEGORIAS.map((c) => ({ value: c.valor as string, label: c.rotulo }))]}
          />
          <span aria-hidden="true" className="w-0.5 shrink-0 self-stretch bg-border-cloud" />
          <FilterChips
            label="Nível"
            value={nivel}
            onChange={setNivel}
            options={[{ value: "all", label: "Todos" }, ...NIVEIS.map((n) => ({ value: n as string, label: n }))]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        {lista.isPending ? (
          <p role="status" className="rounded-3xl border-2 border-border-cloud p-10 text-center text-body-md text-text-secondary">
            A carregar materiais...
          </p>
        ) : lista.isError ? (
          <div role="alert" className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">Não foi possível carregar os materiais</p>
            <Button3D variant="secondary" className="mt-5" onClick={() => void lista.refetch()}>
              Tentar de novo
            </Button3D>
          </div>
        ) : itens.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">Não há materiais com estes filtros</p>
            <p className="mt-1 text-body-md text-text-secondary">Experimenta outra categoria ou limpa a pesquisa.</p>
            <Button3D
              variant="secondary"
              className="mt-5"
              onClick={() => {
                setBusca("");
                setCategoria("all");
                setNivel("all");
              }}
            >
              Limpar filtros
            </Button3D>
          </div>
        ) : (
          <>
            <p role="status" className="mb-5 text-body-md text-text-secondary tabular-nums">
              {contagem} {contagem === 1 ? "material" : "materiais"}
            </p>
            <h2 className="sr-only">Materiais disponíveis</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {itens.map((m) => (
                <li key={m.id}>
                  <MaterialCard material={m} />
                </li>
              ))}
            </ul>
            {lista.hasNextPage && (
              <div className="mt-10 flex justify-center">
                <Button3D variant="secondary" disabled={lista.isFetchingNextPage} onClick={() => void lista.fetchNextPage()}>
                  {lista.isFetchingNextPage ? "A carregar..." : "Ver mais materiais"}
                </Button3D>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
