import { useMemo, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { formatAOPhone } from "../../components/ui/PhoneInputAO";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatInt, normalize } from "../../lib/format";
import { levelInfo } from "../../lib/levels";
import { cn } from "@/lib/utils";
import { STUDENTS } from "./mockAdmin";
import { StudentDrawer } from "./StudentDrawer";
import type { StudentRow } from "./types";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "short", year: "numeric" });

const UNIVERSITIES = [
  { value: "todas", label: "Todas as instituições" },
  { value: "UAN", label: "UAN — Camama" },
  { value: "UCAN", label: "UCAN — Palanca" },
  { value: "ISAF", label: "ISAF — Ingombota" },
  { value: "UGS", label: "UGS — Talatona" },
];
const PLANS = [
  { value: "todos", label: "Todos os planos" },
  { value: "free", label: "Grátis" },
  { value: "pro", label: "Pro" },
];
const STATES = [
  { value: "todos", label: "Todos os estados" },
  { value: "ativo", label: "Ativo" },
  { value: "suspenso", label: "Suspenso" },
];

/** ADM-02 — gestão de estudantes, com ficha de inspeção em painel lateral. */
export default function StudentsScreen() {
  const [students, setStudents] = useState(STUDENTS);
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState("todas");
  const [plan, setPlan] = useState("todos");
  const [state, setState] = useState("todos");
  const [inspecting, setInspecting] = useState<StudentRow | null>(null);
  const toast = useToast();

  const rows = useMemo(() => {
    const q = normalize(query.trim());
    return students.filter(
      (s) =>
        (university === "todas" || s.university === university) &&
        (plan === "todos" || s.plan === plan) &&
        (state === "todos" || s.status === state) &&
        (!q || normalize(`${s.name} ${s.handle} ${s.phone} ${s.course}`).includes(q)),
    );
  }, [students, query, university, plan, state]);

  function toggleSuspension(id: string, suspended: boolean) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: suspended ? "suspenso" : "ativo" } : s)));
    setInspecting((prev) => (prev && prev.id === id ? { ...prev, status: suspended ? "suspenso" : "ativo" } : prev));
  }

  const resetFilters = () => {
    setQuery("");
    setUniversity("todas");
    setPlan("todos");
    setState("todos");
  };

  return (
    <AdminShell
      active="estudantes"
      eyebrow="Centro de operações · gestão de estudantes"
      title="Estudantes e polos"
      description="Controlo cadastral, progresso e inspeção de contas ativas."
      actions={
        <>
          <Button3D variant="ghost" leadingIcon={<Icon name="download" size={18} />} onClick={() => toast.show("Exportação CSV iniciada.")}>
            Exportar CSV
          </Button3D>
          <Button3D leadingIcon={<Icon name="plus" size={18} />} onClick={() => toast.show("Formulário de novo estudante em breve.")}>
            Adicionar estudante
          </Button3D>
        </>
      }
    >
      <section aria-labelledby="filters-title" className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
        <h2 id="filters-title" className="sr-only">
          Filtros
        </h2>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="relative flex-1">
            <label htmlFor="student-search" className="mb-2 block text-body-md font-bold text-on-surface">
              Procurar estudante
            </label>
            <Icon name="search" size={20} className="pointer-events-none absolute bottom-3.5 left-3 text-text-tertiary" />
            <input
              id="student-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome, utilizador, telemóvel ou curso"
              className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-4 pl-10 text-body-md text-on-surface"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SelectField id="filter-university" label="Instituição" options={UNIVERSITIES} value={university} onChange={(e) => setUniversity(e.target.value)} />
            <SelectField id="filter-plan" label="Plano" options={PLANS} value={plan} onChange={(e) => setPlan(e.target.value)} />
            <SelectField id="filter-state" label="Estado" options={STATES} value={state} onChange={(e) => setState(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-cloud pt-3">
          <p role="status" className="text-caption text-text-secondary">
            A mostrar <strong className="text-on-surface tabular-nums">{rows.length}</strong> de {students.length} registos carregados
            (3.420 no total).
          </p>
          <button type="button" onClick={resetFilters} className="min-h-11 rounded-full px-3 text-button text-primary uppercase hover:bg-surface-sky">
            Repor filtros
          </button>
        </div>
      </section>

      <TableScroll label="Tabela dos estudantes registados">
        <table className={table}>
          <caption className="sr-only">Estudantes registados</caption>
          <thead>
            <tr>
              <th scope="col" className={th}>Estudante</th>
              <th scope="col" className={th}>Instituição e curso</th>
              <th scope="col" className={th}>Telemóvel Express</th>
              <th scope="col" className={cn(th, "text-right")}>XP acumulado</th>
              <th scope="col" className={th}>Plano</th>
              <th scope="col" className={th}>Adesão</th>
              <th scope="col" className={cn(th, "text-right")}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const lvl = levelInfo(s.xp);
              return (
                <tr key={s.id} className={tr}>
                  <th scope="row" className={cn(td, "font-normal")}>
                    <span className="flex items-center gap-3">
                      <Avatar name={s.name} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 font-bold text-on-surface">
                          {s.name}
                          {s.verified && (
                            <>
                              <Icon name="seal" size={15} className="text-brand-sky-ink" />
                              <span className="sr-only">conta verificada</span>
                            </>
                          )}
                        </span>
                        <span className="block text-caption text-text-tertiary">{s.handle}</span>
                      </span>
                    </span>
                  </th>
                  <td className={td}>
                    <span className="block">{s.university}</span>
                    <span className="block text-caption text-text-secondary">{s.course}</span>
                  </td>
                  <td className={cn(td, "tabular-nums")}>+244 {formatAOPhone(s.phone)}</td>
                  <td className={cn(td, "text-right tabular-nums")}>
                    <span className="font-bold text-feedback-gem-ink">{formatInt(s.xp)} XP</span>
                    <span className="block text-caption text-text-tertiary">Nível {lvl.level}</span>
                  </td>
                  <td className={td}>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-overline uppercase",
                        s.plan === "pro" ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-soft text-text-secondary",
                      )}
                    >
                      {s.plan === "pro" ? "Pro" : "Grátis"}
                    </span>
                    {s.status === "suspenso" && (
                      <span className="mt-1 inline-block rounded-full border-2 border-feedback-error bg-surface-canvas px-2 py-0.5 text-overline text-feedback-error-ink uppercase">
                        Suspenso
                      </span>
                    )}
                  </td>
                  <td className={cn(td, "text-caption text-text-secondary tabular-nums")}>
                    {dateFormat.format(new Date(s.joinedAt))}
                  </td>
                  <td className={cn(td, "text-right")}>
                    <span className="flex justify-end gap-1">
                      <Button3D variant="ghost" onClick={() => setInspecting(s)} leadingIcon={<Icon name="eye" size={16} />}>
                        <span className="hidden sm:inline">Inspecionar</span>
                        <span className="sr-only sm:hidden">Inspecionar {s.name}</span>
                      </Button3D>
                      <button
                        type="button"
                        aria-label={`Mais opções para ${s.name}`}
                        onClick={() => toast.show("Menu de opções em breve.")}
                        className="flex size-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-soft hover:text-on-surface"
                      >
                        <Icon name="dots" size={20} />
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScroll>

      {rows.length === 0 && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
          Nenhum estudante corresponde a estes filtros.
        </p>
      )}

      <StudentDrawer student={inspecting} onClose={() => setInspecting(null)} onToggleSuspension={toggleSuspension} />
    </AdminShell>
  );
}
