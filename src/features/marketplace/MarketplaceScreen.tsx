import { useDeferredValue, useId, useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { normalize } from "../../lib/format";
import { FilterChips } from "./FilterChips";
import { AREA_LABEL, MaterialCard } from "./MaterialCard";
import type { Area, Material } from "./types";

const PAGE_SIZE = 8;
const AREAS: Area[] = ["direito", "economia", "engenharia", "saude"];

type MarketplaceScreenProps = {
  materials: Material[];
  userName: string;
};

/** Vitrine do marketplace: pesquisa, filtros por universidade e área, grelha paginada. */
export default function MarketplaceScreen({ materials, userName }: MarketplaceScreenProps) {
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState<string | "all">("all");
  const [area, setArea] = useState<Area | "all">("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();

  const universities = useMemo(
    () => [...new Set(materials.map((m) => m.university))].sort(),
    [materials],
  );

  const results = useMemo(() => {
    const q = normalize(deferredQuery.trim());
    return materials.filter(
      (m) =>
        (university === "all" || m.university === university) &&
        (area === "all" || m.area === area) &&
        (!q || normalize(`${m.title} ${m.author} ${m.university}`).includes(q)),
    );
  }, [materials, deferredQuery, university, area]);

  const shown = results.slice(0, visible);
  const resetPaging = () => setVisible(PAGE_SIZE);

  return (
    <AppShell active="sebentas" userName={userName} campus="UAN · Economia">
      <section className="bg-surface-ink px-4 py-12 text-white md:px-6 md:py-16">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="max-w-3xl font-montserrat text-headline-h1-mobile text-balance md:text-display-l">
            Os melhores materiais da tua universidade
          </h1>
          <p className="mt-3 max-w-2xl text-body-lg text-white/75">
            Resumos, sebentas e exames resolvidos por estudantes como tu.
          </p>
          <div role="search" className="mt-6 max-w-xl">
            <label htmlFor={searchId} className="sr-only">
              Pesquisar materiais
            </label>
            <div className="relative">
              <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/60" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPaging();
                }}
                placeholder="Cadeira, autor ou universidade"
                enterKeyHint="search"
                className="min-h-12 w-full rounded-full border-2 border-white/25 bg-white/10 pr-4 pl-12 text-body-md text-white placeholder:text-white/60 transition-[border-color,background-color] duration-150 focus-visible:border-white focus-visible:bg-white/15"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-40 border-b-2 border-border-cloud bg-surface-canvas md:top-20">
        <div className="mx-auto flex max-w-[1280px] gap-6 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-6">
          <FilterChips
            label="Universidade"
            value={university}
            onChange={(v) => {
              setUniversity(v);
              resetPaging();
            }}
            options={[{ value: "all", label: "Todas" }, ...universities.map((u) => ({ value: u, label: u }))]}
          />
          <span aria-hidden="true" className="w-0.5 shrink-0 self-stretch bg-border-cloud" />
          <FilterChips<Area>
            label="Área"
            value={area}
            onChange={(v) => {
              setArea(v);
              resetPaging();
            }}
            options={[{ value: "all", label: "Todas" }, ...AREAS.map((a) => ({ value: a, label: AREA_LABEL(a) }))]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <p role="status" className="mb-5 text-body-md text-text-secondary">
          {results.length === 0
            ? "Nenhum material encontrado."
            : `${results.length} ${results.length === 1 ? "material" : "materiais"}`}
        </p>

        {results.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">Não há materiais com estes filtros</p>
            <p className="mt-1 text-body-md text-text-secondary">Experimenta outra universidade ou limpa a pesquisa.</p>
            <Button3D
              variant="secondary"
              className="mt-5"
              onClick={() => {
                setQuery("");
                setUniversity("all");
                setArea("all");
              }}
            >
              Limpar filtros
            </Button3D>
          </div>
        ) : (
          <><h2 className="sr-only">Materiais disponíveis</h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((m) => (
              <li key={m.id}>
                <MaterialCard material={m} />
              </li>
            ))}
          </ul></>
        )}

        {visible < results.length && (
          <div className="mt-10 flex flex-col items-center gap-2">
            <Button3D variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Ver mais materiais
            </Button3D>
            <p className="text-caption text-text-tertiary tabular-nums">
              A mostrar {shown.length} de {results.length}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
