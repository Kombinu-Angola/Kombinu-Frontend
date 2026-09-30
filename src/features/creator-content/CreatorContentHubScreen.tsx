import { useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime, formatInt, formatKz, formatSize, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import { PricingModal } from "./PricingModal";
import type { CreatorMaterial, MaterialStatus, Visibility } from "./types";

const rating1 = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const STATUS: Record<MaterialStatus, { label: string; className: string }> = {
  publicado: { label: "Publicado", className: "bg-surface-forest text-feedback-success" },
  rascunho: { label: "Rascunho", className: "border-2 border-border-cloud bg-surface-canvas text-text-secondary" },
  pausado: { label: "Pausado", className: "bg-secondary-fixed text-on-secondary-fixed-variant" },
  "em-moderacao": { label: "Em moderação", className: "bg-primary-fixed text-on-primary-fixed" },
};

const VISIBILITY_LABEL: Record<Visibility, string> = {
  publico: "Público",
  link: "Só por ligação",
  faculdade: "Só a faculdade",
};

type Filter = "todos" | MaterialStatus;

type CreatorContentHubScreenProps = {
  materials: CreatorMaterial[];
  creatorName: string;
  plan: "pro" | "free";
};

/** Gestão dos materiais do criador: estado, preço, visibilidade e desempenho. */
export default function CreatorContentHubScreen({ materials: initial, creatorName, plan }: CreatorContentHubScreenProps) {
  const [materials, setMaterials] = useState(initial);
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState("todas");
  const [pricing, setPricing] = useState<CreatorMaterial | null>(null);
  const [pausing, setPausing] = useState<CreatorMaterial | null>(null);
  const toast = useToast();

  const universities = useMemo(
    () => [
      { value: "todas", label: "Todas as instituições" },
      ...[...new Set(materials.map((m) => m.university))].sort().map((u) => ({ value: u, label: u })),
    ],
    [materials],
  );

  const counts = useMemo(() => {
    const base: Record<Filter, number> = { todos: materials.length, publicado: 0, rascunho: 0, pausado: 0, "em-moderacao": 0 };
    for (const m of materials) base[m.status] += 1;
    return base;
  }, [materials]);

  // Receita e vendas derivam das linhas: o resumo nunca discorda da tabela.
  const published = materials.filter((m) => m.status === "publicado");
  const sales = materials.reduce((sum, m) => sum + m.sales, 0);
  const revenue = materials.reduce((sum, m) => sum + m.sales * m.priceKz, 0);
  const commissionRate = plan === "pro" ? 0 : 0.3;
  const net = Math.round(revenue * (1 - commissionRate));

  const shown = useMemo(() => {
    const q = normalize(query.trim());
    return materials.filter(
      (m) =>
        (filter === "todos" || m.status === filter) &&
        (university === "todas" || m.university === university) &&
        (!q || normalize(`${m.title} ${m.subject}`).includes(q)),
    );
  }, [materials, filter, university, query]);

  const TABS: ReadonlyArray<{ value: Filter; label: string }> = [
    { value: "todos", label: "Todos" },
    { value: "publicado", label: "Publicados" },
    { value: "em-moderacao", label: "Em moderação" },
    { value: "rascunho", label: "Rascunhos" },
    { value: "pausado", label: "Pausados" },
  ];

  function applyPricing(material: CreatorMaterial, priceKz: number, visibility: Visibility) {
    setMaterials((prev) =>
      prev.map((m) => (m.id === material.id ? { ...m, priceKz, visibility, updatedAt: new Date().toISOString() } : m)),
    );
    setPricing(null);
    toast.show(priceKz === 0 ? "Material passou a gratuito." : `Preço atualizado para ${formatKz(priceKz)}.`);
  }

  function togglePause(material: CreatorMaterial) {
    const next: MaterialStatus = material.status === "pausado" ? "publicado" : "pausado";
    setMaterials((prev) => prev.map((m) => (m.id === material.id ? { ...m, status: next } : m)));
    setPausing(null);
    toast.show(
      next === "pausado"
        ? "Material pausado. Deixa de aparecer no marketplace, mas quem já comprou continua a ler."
        : "Material outra vez no marketplace.",
    );
  }

  return (
    <CreatorShell
      active="materiais"
      creatorName={creatorName}
      actions={
        <Button3D onClick={() => (window.location.assign("/v2/estudio"))} leadingIcon={<Icon name="plus" size={18} />}>
          Novo material
        </Button3D>
      }
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-text-tertiary uppercase">Modo criador</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Os meus materiais
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            Gere as publicações ativas, altera preços e acompanha o desempenho junto dos estudantes.
          </p>
        </header>

        <section aria-label="Resumo" className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
            <p className="text-overline text-text-tertiary uppercase">Materiais no ar</p>
            <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-on-surface tabular-nums">
              {published.length}
            </p>
            <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary tabular-nums">
              {counts.rascunho} em rascunho · {counts["em-moderacao"]} em moderação · {counts.pausado} pausados
            </p>
          </article>

          <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
            <p className="text-overline text-text-tertiary uppercase">Cópias vendidas</p>
            <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-on-surface tabular-nums">
              {formatInt(sales)}
            </p>
            <p className="mt-2 flex items-center gap-1 border-t-2 border-border-cloud pt-2 text-caption font-bold text-feedback-success-ink">
              <Icon name="trend-up" size={16} />
              <span className="sr-only">subiu </span>+18% face ao mês anterior
            </p>
          </article>

          <article className="rounded-2xl border-2 border-feedback-success bg-surface-canvas p-5">
            <p className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
              Receita líquida gerada
              <span className="rounded-full bg-surface-forest px-2 py-0.5 text-feedback-success">
                {plan === "pro" ? "0% de comissão" : "30% de comissão"}
              </span>
            </p>
            <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-feedback-success-ink tabular-nums">
              {formatKz(net)}
            </p>
            <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary tabular-nums">
              Bruto {formatKz(revenue)} · repasse por Multicaixa Express
            </p>
          </article>
        </section>

        <section className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div role="group" aria-label="Filtrar por estado" className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const active = filter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(tab.value)}
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
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="relative sm:w-72">
              <label htmlFor="material-search" className="sr-only">
                Filtrar por título ou cadeira
              </label>
              <Icon
                name="search"
                size={20}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-tertiary"
              />
              <input
                id="material-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Título ou cadeira"
                className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-3 pl-10 text-body-md text-on-surface"
              />
            </div>
            <div className="sm:w-56">
              <SelectField
                id="material-university"
                label="Instituição"
                options={universities}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
          </div>
        </section>

        <TableScroll label="Tabela dos meus materiais">
          <table className={table}>
            <caption className="sr-only">Materiais publicados e em preparação</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Material</th>
                <th scope="col" className={th}>Cadeira e polo</th>
                <th scope="col" className={cn(th, "text-right")}>Preço</th>
                <th scope="col" className={cn(th, "text-right")}>Vendas</th>
                <th scope="col" className={th}>Avaliação</th>
                <th scope="col" className={th}>Estado</th>
                <th scope="col" className={cn(th, "text-right")}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((material) => (
                <tr key={material.id} className={tr}>
                  <th scope="row" className={cn(td, "font-normal")}>
                    <span className="flex items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-sky text-primary">
                        <Icon name="file" size={22} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-on-surface">{material.title}</span>
                        <span className="block text-caption text-text-tertiary tabular-nums">
                          {material.pages} págs · {material.quizzes} quizzes · {formatSize(material.sizeKb)} ·{" "}
                          {formatActivityTime(material.updatedAt).toLowerCase()}
                        </span>
                      </span>
                    </span>
                  </th>
                  <td className={td}>
                    <span className="block whitespace-nowrap">{material.subject}</span>
                    <span className="block text-caption text-text-tertiary">
                      {material.university} · {material.year}
                    </span>
                  </td>
                  <td className={cn(td, "text-right whitespace-nowrap")}>
                    <span className="font-bold text-primary tabular-nums">
                      {material.priceKz === 0 ? "Gratuito" : formatKz(material.priceKz)}
                    </span>
                    <span className="block text-caption text-text-tertiary">{VISIBILITY_LABEL[material.visibility]}</span>
                  </td>
                  <td className={cn(td, "text-right tabular-nums")}>{formatInt(material.sales)}</td>
                  <td className={td}>
                    {material.rating === null ? (
                      <span className="text-caption text-text-tertiary">Sem avaliações</span>
                    ) : (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Icon name="star" size={16} className="fill-feedback-streak text-feedback-streak" />
                        <span className="font-bold text-on-surface tabular-nums">{rating1.format(material.rating)}</span>
                        <span className="text-caption text-text-tertiary tabular-nums">({material.reviews})</span>
                      </span>
                    )}
                  </td>
                  <td className={td}>
                    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-overline uppercase", STATUS[material.status].className)}>
                      {STATUS[material.status].label}
                    </span>
                  </td>
                  <td className={cn(td, "text-right")}>
                    <span className="inline-flex justify-end gap-1">
                      <a
                        href={material.studioHref}
                        aria-label={`Editar ${material.title} no estúdio`}
                        className="flex size-11 items-center justify-center rounded-lg text-primary transition-[background-color] duration-150 hover:bg-surface-sky"
                      >
                        <Icon name="edit" size={20} />
                      </a>
                      <a
                        href="/v2/estudio/analitica"
                        aria-label={`Analítica de ${material.title}`}
                        className="flex size-11 items-center justify-center rounded-lg text-primary transition-[background-color] duration-150 hover:bg-surface-sky"
                      >
                        <Icon name="chart" size={20} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setPricing(material)}
                        aria-label={`Preço e visibilidade de ${material.title}`}
                        className="flex size-11 items-center justify-center rounded-lg text-primary transition-[background-color] duration-150 hover:bg-surface-sky"
                      >
                        <Icon name="wallet" size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPausing(material)}
                        disabled={material.status === "rascunho" || material.status === "em-moderacao"}
                        aria-label={
                          material.status === "pausado"
                            ? `Republicar ${material.title}`
                            : `Pausar ${material.title}`
                        }
                        className="flex size-11 items-center justify-center rounded-lg text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-soft hover:text-on-surface disabled:text-text-disabled disabled:hover:bg-transparent"
                      >
                        <Icon name={material.status === "pausado" ? "play" : "pause"} size={20} />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>

        {shown.length === 0 && (
          <p className="mt-6 rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
            Nenhum material corresponde a estes filtros.
          </p>
        )}
      </div>

      {pricing && (
        <PricingModal
          material={pricing}
          plan={plan}
          mode="editar"
          onClose={() => setPricing(null)}
          onConfirm={({ priceKz, visibility }) => applyPricing(pricing, priceKz, visibility)}
        />
      )}

      {pausing && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-surface-ink/60 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="pause-title" className="w-full max-w-md rounded-3xl bg-surface-canvas p-6 shadow-clay">
            <h2 id="pause-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              {pausing.status === "pausado" ? "Republicar material?" : "Pausar material?"}
            </h2>
            <p className="mt-2 text-body-md text-text-secondary">
              {pausing.status === "pausado"
                ? "Volta a aparecer no marketplace e pode ser comprado outra vez."
                : "Deixa de aparecer no marketplace e de ser vendido. Quem já comprou continua com acesso, incluindo offline."}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button3D variant="ghost" onClick={() => setPausing(null)}>
                Cancelar
              </Button3D>
              <Button3D onClick={() => togglePause(pausing)}>
                {pausing.status === "pausado" ? "Republicar" : "Pausar"}
              </Button3D>
            </div>
          </div>
        </div>
      )}
    </CreatorShell>
  );
}
