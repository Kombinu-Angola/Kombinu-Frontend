import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { formatInt, formatSize, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import { FREE_FACULTIES, FREE_FORMATS, type FreeMaterial, type FreeMaterialFormat } from "./mockFreeLibrary";

type FreeLibraryScreenProps = { materials: FreeMaterial[]; userName: string; totalStudents: number };

/** Biblioteca livre: catálogo aberto, sem compra, para explorar fora da trilha. */
export default function FreeLibraryScreen({ materials, userName, totalStudents }: FreeLibraryScreenProps) {
  const [query, setQuery] = useState("");
  const [faculty, setFaculty] = useState("todas");
  const [format, setFormat] = useState<FreeMaterialFormat | "todos">("todos");

  const shown = useMemo(() => {
    const q = normalize(query.trim());
    return materials.filter(
      (m) =>
        (faculty === "todas" || m.faculty === faculty) &&
        (format === "todos" || m.format === format) &&
        (!q || normalize(`${m.title} ${m.author.name} ${m.university}`).includes(q)),
    );
  }, [materials, query, faculty, format]);

  return (
    <AppShell active="biblioteca" userName={userName} campus="UAN · Economia">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
        <section className="flex flex-col justify-between gap-6 rounded-3xl border-2 border-border-cloud bg-surface-soft p-6 sm:p-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-overline text-primary uppercase">Acesso livre · todas as cadeiras</p>
            <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
              Estuda sem gastar nada
            </h1>
            <p className="mt-2 text-body-lg text-pretty text-text-secondary">
              Resumos, quizzes e infográficos partilhados por colegas e monitores de universidades angolanas. Sem
              compra, sem subscrição e sempre em modo leve.
            </p>
          </div>
          <p className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 border-border-cloud bg-surface-canvas px-4 py-2.5 text-body-md font-bold text-on-surface tabular-nums md:self-center">
            <Icon name="book" size={20} className="text-primary" />
            {formatInt(materials.length)} materiais · {formatInt(totalStudents)} estudantes
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="relative">
            <label htmlFor="free-search" className="sr-only">
              Pesquisar na biblioteca livre
            </label>
            <Icon
              name="search"
              size={20}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-tertiary"
            />
            <input
              id="free-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cadeira, universidade ou tema (por exemplo: derivadas)"
              className="min-h-12 w-full rounded-full border-2 border-border-input bg-surface-canvas pr-4 pl-11 text-body-md text-on-surface"
            />
          </div>

          <div role="group" aria-label="Filtrar por faculdade" className="flex gap-2.5 overflow-x-auto pb-1">
            {FREE_FACULTIES.map((f) => {
              const active = faculty === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFaculty(f.value)}
                  className={cn(
                    "min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color] duration-150",
                    active
                      ? "border-brand-ocean bg-brand-ocean text-white"
                      : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div role="group" aria-label="Filtrar por formato" className="flex gap-2 overflow-x-auto pb-1">
            {FREE_FORMATS.map((f) => {
              const active = format === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFormat(f.value)}
                  className={cn(
                    "min-h-11 shrink-0 rounded-lg border-2 px-3.5 text-caption font-bold whitespace-nowrap transition-[background-color,border-color,color] duration-150",
                    active
                      ? "border-brand-ocean bg-surface-sky text-primary"
                      : "border-border-cloud bg-surface-canvas text-text-secondary hover:text-on-surface",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </section>

        <p role="status" className="text-caption text-text-secondary tabular-nums">
          {shown.length === 0
            ? "Nenhum material corresponde a esta pesquisa."
            : `${shown.length} de ${materials.length} materiais`}
        </p>

        {shown.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">Ainda não há nada com estes filtros</p>
            <p className="mt-1 text-body-md text-text-secondary">
              Experimenta outra faculdade, ou procura pelo nome da cadeira.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((material) => (
              <li key={material.id}>
                <article className="flex h-full flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-elevation-1 transition-[translate,box-shadow,border-color] duration-200 ease-out-quint hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-md bg-primary-fixed px-2.5 py-1 text-overline text-on-primary-fixed uppercase">
                        {material.university}
                      </span>
                      <span className="rounded-full bg-feedback-success px-2.5 py-0.5 text-overline text-surface-ink uppercase">
                        Acesso livre
                      </span>
                    </div>

                    <span className="mt-4 flex h-24 items-center justify-center rounded-2xl bg-surface-soft">
                      <Asset3D name={material.cover} alt="" size={56} />
                    </span>

                    <h2 className="mt-4 font-montserrat text-headline-h3 leading-snug font-extrabold text-on-surface">
                      {material.title}
                    </h2>
                    <p className="mt-1.5 text-caption text-text-secondary">
                      {material.author.name} · {material.author.role}
                    </p>

                    <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 border-t-2 border-border-cloud pt-3 text-caption text-text-tertiary tabular-nums">
                      <span>{material.minutes} min</span>
                      <span aria-hidden="true">·</span>
                      <span>{material.quizzes} quizzes</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-feedback-success-ink">{formatSize(material.sizeKb)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatInt(material.readers)} leituras</span>
                    </p>
                  </div>

                  <LinkButton3D
                    href={material.href}
                    fullWidth
                    className="mt-5"
                    trailingIcon={<Icon name="arrow-right" size={18} />}
                  >
                    Abrir
                    <span className="sr-only">: {material.title}</span>
                  </LinkButton3D>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
