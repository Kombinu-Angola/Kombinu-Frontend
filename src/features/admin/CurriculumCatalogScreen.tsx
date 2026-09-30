import { useMemo, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { SlideOver } from "../../components/ui/SlideOver";
import { Switch } from "../../components/ui/Switch";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatInt, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { CatalogInstitution } from "./catalogTypes";

const KINDS = [
  { value: "Pública", label: "Pública" },
  { value: "Privada", label: "Privada" },
  { value: "Privada de interesse público", label: "Privada de interesse público" },
];

type CurriculumCatalogScreenProps = { institutions: CatalogInstitution[] };

/** ADM-CAT-01 — catálogo de instituições, faculdades e cadeiras que alimenta toda a plataforma. */
export default function CurriculumCatalogScreen({ institutions }: CurriculumCatalogScreenProps) {
  const [filter, setFilter] = useState("");
  const [institutionId, setInstitutionId] = useState(institutions[0].id);
  const [facultyId, setFacultyId] = useState(institutions[0].faculties[0].id);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAcronym, setNewAcronym] = useState("");
  const [newKind, setNewKind] = useState(KINDS[0].value);
  const [newCity, setNewCity] = useState("Luanda");
  const toast = useToast();

  const institution = institutions.find((i) => i.id === institutionId) ?? institutions[0];
  const faculty = institution.faculties.find((f) => f.id === facultyId) ?? institution.faculties[0];

  const shownInstitutions = useMemo(() => {
    const q = normalize(filter.trim());
    if (!q) return institutions;
    return institutions.filter(
      (i) =>
        normalize(`${i.name} ${i.acronym} ${i.city}`).includes(q) ||
        i.faculties.some((f) => normalize(f.name).includes(q)),
    );
  }, [institutions, filter]);

  // Todos os totais saem da árvore, por isso nunca divergem do que está listado.
  const totals = useMemo(() => {
    const subjects = institutions.flatMap((i) => i.faculties.flatMap((f) => f.subjects));
    return {
      institutions: institutions.length,
      faculties: institutions.reduce((sum, i) => sum + i.faculties.length, 0),
      subjects: subjects.length,
      critical: subjects.filter((s) => s.critical).length,
      students: subjects.reduce((sum, s) => sum + s.students, 0),
    };
  }, [institutions]);

  function selectFaculty(nextInstitution: string, nextFaculty: string) {
    setInstitutionId(nextInstitution);
    setFacultyId(nextFaculty);
  }

  return (
    <AdminShell
      active="catalogo"
      eyebrow="Configuração do sistema"
      title="Catálogo curricular"
      description="Instituições, faculdades e cadeiras que alimentam o diagnóstico, as recomendações e as ligas."
      actions={
        <>
          <Button3D
            variant="ghost"
            leadingIcon={<Icon name="download" size={18} />}
            onClick={() => toast.show("Importação por folha de cálculo em preparação.")}
          >
            Importar estrutura
          </Button3D>
          <Button3D onClick={() => setAdding(true)} leadingIcon={<Icon name="plus" size={18} />}>
            Nova instituição
          </Button3D>
        </>
      }
    >
      <section aria-label="Totais do catálogo" className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { id: "inst", label: "Instituições", value: formatInt(totals.institutions), note: `${totals.faculties} faculdades` },
          { id: "subj", label: "Cadeiras catalogadas", value: formatInt(totals.subjects), note: `${totals.critical} marcadas como críticas` },
          { id: "stud", label: "Estudantes abrangidos", value: formatInt(totals.students), note: "Somatório das cadeiras" },
          { id: "cycle", label: "Ciclo letivo", value: "2026", note: "Revisão anual do catálogo" },
        ].map((tile) => (
          <article key={tile.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
            <p className="text-overline text-text-tertiary uppercase">{tile.label}</p>
            <p className="mt-1.5 font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums">{tile.value}</p>
            <p className="text-caption text-text-secondary tabular-nums">{tile.note}</p>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <aside aria-labelledby="tree-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-4 lg:col-span-3">
          <h2 id="tree-title" className="sr-only">
            Instituições e faculdades
          </h2>

          <div className="relative mb-3">
            <label htmlFor="catalog-filter" className="sr-only">
              Filtrar instituição ou faculdade
            </label>
            <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-tertiary" />
            <input
              id="catalog-filter"
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Instituição ou faculdade"
              className="min-h-11 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-3 pl-9 text-body-md text-on-surface"
            />
          </div>

          <p className="mb-2 text-overline text-text-tertiary uppercase tabular-nums">
            {shownInstitutions.length} de {institutions.length} instituições
          </p>

          <ul className="flex flex-col gap-2.5">
            {shownInstitutions.map((inst) => {
              const open = inst.id === institutionId;
              return (
                <li
                  key={inst.id}
                  className={cn(
                    "rounded-2xl border-2 p-3 transition-[border-color] duration-150",
                    open ? "border-brand-ocean bg-surface-canvas" : "border-border-cloud bg-surface-canvas hover:border-brand-ocean",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => selectFaculty(inst.id, inst.faculties[0].id)}
                    className="flex w-full items-start justify-between gap-2 text-left"
                  >
                    <span>
                      <span className="block text-body-md font-bold text-on-surface">
                        {inst.name} ({inst.acronym})
                      </span>
                      <span className="mt-0.5 block text-caption text-text-secondary">
                        {inst.kind} · {inst.city}
                      </span>
                    </span>
                    <Icon
                      name="arrow-right"
                      size={18}
                      className={cn("mt-0.5 shrink-0 transition-transform duration-150", open ? "rotate-90 text-primary" : "text-text-tertiary")}
                    />
                  </button>

                  {open && (
                    <ul className="mt-3 flex flex-col gap-1 border-t-2 border-border-cloud pt-2">
                      {inst.faculties.map((f) => {
                        const active = f.id === facultyId;
                        return (
                          <li key={f.id}>
                            <button
                              type="button"
                              aria-current={active ? "true" : undefined}
                              onClick={() => selectFaculty(inst.id, f.id)}
                              className={cn(
                                "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-2.5 text-caption transition-[background-color,color] duration-150",
                                active ? "bg-primary-fixed font-bold text-primary" : "text-text-secondary hover:bg-surface-soft hover:text-on-surface",
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <Icon name="school" size={16} />
                                {f.name}
                              </span>
                              <span className="shrink-0 tabular-nums">{f.subjects.length} cadeiras</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {shownInstitutions.length === 0 && (
            <p className="rounded-xl border-2 border-dashed border-border-input p-6 text-center text-caption text-text-secondary">
              Nenhuma instituição corresponde ao filtro.
            </p>
          )}
        </aside>

        <section aria-labelledby="subjects-title" className="flex flex-col gap-4 lg:col-span-9">
          <div className="flex flex-col justify-between gap-3 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-overline text-text-tertiary uppercase">
                {institution.acronym} · {institution.city}
              </p>
              <h2 id="subjects-title" className="mt-0.5 font-montserrat text-headline-h2 text-on-surface">
                {faculty.name}
              </h2>
              <p className="text-caption text-text-secondary tabular-nums">
                {faculty.subjects.length} cadeiras ·{" "}
                {formatInt(faculty.subjects.reduce((sum, s) => sum + s.students, 0))} estudantes
              </p>
            </div>
            <Button3D variant="ghost" onClick={() => toast.show("Formulário de nova cadeira em preparação.")} leadingIcon={<Icon name="plus" size={18} />}>
              Adicionar cadeira
            </Button3D>
          </div>

          <TableScroll label="Tabela das cadeiras da faculdade">
            <table className={table}>
              <caption className="sr-only">Cadeiras catalogadas em {faculty.name}</caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Cadeira</th>
                  <th scope="col" className={th}>Ano e semestre</th>
                  <th scope="col" className={cn(th, "text-right")}>Reprovação</th>
                  <th scope="col" className={cn(th, "text-right")}>Materiais</th>
                  <th scope="col" className={cn(th, "text-right")}>Estudantes</th>
                  <th scope="col" className={th}>Crítica</th>
                </tr>
              </thead>
              <tbody>
                {faculty.subjects.map((subject) => (
                  <tr key={subject.id} className={tr}>
                    <th scope="row" className={cn(td, "font-normal")}>
                      <span className="block font-bold text-on-surface">{subject.name}</span>
                      <span className="block text-caption text-text-tertiary tabular-nums">{subject.code}</span>
                    </th>
                    <td className={cn(td, "whitespace-nowrap text-text-secondary tabular-nums")}>
                      {subject.year} ano · {subject.semester} semestre
                    </td>
                    <td className={cn(td, "text-right tabular-nums")}>
                      <span
                        className={cn(
                          "font-bold",
                          subject.failureRate >= 40
                            ? "text-feedback-error-ink"
                            : subject.failureRate >= 30
                              ? "text-feedback-streak-ink"
                              : "text-text-secondary",
                        )}
                      >
                        {subject.failureRate}%
                      </span>
                    </td>
                    <td className={cn(td, "text-right tabular-nums")}>
                      {subject.materials === 0 ? (
                        <span className="font-bold text-feedback-error-ink">Sem materiais</span>
                      ) : (
                        subject.materials
                      )}
                    </td>
                    <td className={cn(td, "text-right tabular-nums")}>{formatInt(subject.students)}</td>
                    <td className={td}>
                      <Switch
                        id={`critical-${subject.id}`}
                        checked={subject.critical}
                        label={`Marcar ${subject.name} como cadeira crítica`}
                        hideLabel
                        onChange={(checked) =>
                          toast.show(
                            checked
                              ? `${subject.name} passa a cadeira crítica: entra nas recomendações.`
                              : `${subject.name} deixou de ser cadeira crítica.`,
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>

          <p className="flex items-start gap-2 rounded-2xl bg-surface-soft p-4 text-caption text-text-secondary">
            <Icon name="lightbulb" size={16} className="mt-0.5 shrink-0 text-primary" />
            Marcar uma cadeira como crítica coloca-a no diagnóstico de entrada e nas recomendações do feed. Usa o
            indicador de reprovação como referência, não como regra automática.
          </p>
        </section>
      </div>

      {adding && (
        <SlideOver
          open
          onClose={() => setAdding(false)}
          eyebrow="Catálogo"
          title="Nova instituição"
          footer={
            <Button3D
              fullWidth
              disabled={newName.trim().length < 3 || newAcronym.trim().length < 2}
              onClick={() => {
                toast.show(`${newAcronym.toUpperCase()} adicionada ao catálogo.`);
                setAdding(false);
                setNewName("");
                setNewAcronym("");
              }}
            >
              Adicionar ao catálogo
            </Button3D>
          }
        >
          <div className="flex flex-col gap-5">
            <TextField id="new-name" label="Nome completo" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <TextField
              id="new-acronym"
              label="Sigla"
              hint="Aparece nos cartões e nas ligas."
              value={newAcronym}
              onChange={(e) => setNewAcronym(e.target.value)}
            />
            <SelectField id="new-kind" label="Natureza" options={KINDS} value={newKind} onChange={(e) => setNewKind(e.target.value)} />
            <TextField id="new-city" label="Cidade ou polo" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
            <p className="rounded-xl bg-surface-soft p-3 text-caption text-text-secondary">
              Depois de criada, acrescenta as faculdades e as cadeiras. Só instituições com cadeiras catalogadas
              aparecem no registo dos estudantes.
            </p>
          </div>
        </SlideOver>
      )}
    </AdminShell>
  );
}
