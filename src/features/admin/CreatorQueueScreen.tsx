import { useMemo, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { SlideOver } from "../../components/ui/SlideOver";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatSize, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { CreatorApplicationRow } from "./creatorQueueTypes";

const hoursBetween = (iso: string) => (Date.now() - new Date(iso).getTime()) / 3_600_000;
const formatHours = (h: number) => `${Math.floor(Math.abs(h))} h ${Math.round((Math.abs(h) % 1) * 60)} min`;

const SORTS = [
  { value: "sla", label: "Prazo mais apertado primeiro" },
  { value: "recente", label: "Submissão mais recente" },
  { value: "nome", label: "Ordem alfabética" },
];

type CreatorQueueScreenProps = { applications: CreatorApplicationRow[] };

/** Fila de homologação: a operação por trás do prazo prometido na candidatura do criador. */
export default function CreatorQueueScreen({ applications: initial }: CreatorQueueScreenProps) {
  const [queue, setQueue] = useState(initial);
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState("todas");
  const [sort, setSort] = useState("sla");
  const [auditing, setAuditing] = useState<CreatorApplicationRow | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const toast = useToast();

  const universities = useMemo(
    () => [
      { value: "todas", label: "Todas as instituições" },
      ...[...new Set(initial.map((a) => a.university))].sort().map((u) => ({ value: u, label: u })),
    ],
    [initial],
  );

  const remaining = (app: CreatorApplicationRow) => app.slaHours - hoursBetween(app.submittedAt);
  const atRisk = queue.filter((a) => remaining(a) < 2).length;

  const shown = useMemo(() => {
    const q = normalize(query.trim());
    const list = queue.filter(
      (a) =>
        (university === "todas" || a.university === university) &&
        (!q || normalize(`${a.candidate.name} ${a.university} ${a.protocol} ${a.candidate.specialty}`).includes(q)),
    );
    return [...list].sort((a, b) => {
      if (sort === "nome") return a.candidate.name.localeCompare(b.candidate.name, "pt");
      if (sort === "recente") return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      return remaining(a) - remaining(b);
    });
  }, [queue, query, university, sort]);

  function openAudit(app: CreatorApplicationRow) {
    setAuditing(app);
    setChecked(app.criteria.filter((c) => c.prechecked).map((c) => c.id));
    setFeedback("");
  }

  function resolve(app: CreatorApplicationRow, approved: boolean) {
    setQueue((prev) => prev.filter((a) => a.protocol !== app.protocol));
    setAuditing(null);
    toast.show(
      approved
        ? `${app.candidate.name} homologado. O estúdio passa a modo publicado.`
        : `Candidatura devolvida a ${app.candidate.name} com instruções.`,
      approved ? "success" : "error",
    );
  }

  const allChecked = auditing ? checked.length === auditing.criteria.length : false;
  const missing = auditing ? auditing.criteria.filter((c) => !checked.includes(c.id)) : [];

  return (
    <AdminShell
      active="criadores"
      eyebrow="Moderação e governança"
      title="Fila de homologação de criadores"
      description="Auditoria das credenciais docentes e do registo Multicaixa Express, nos termos da Lei n.º 15/14."
      actions={
        <p className="flex items-center gap-2 rounded-full border-2 border-border-cloud px-3 py-1.5 text-caption text-text-secondary">
          <span aria-hidden="true" className="size-2 rounded-full bg-feedback-success" />
          Fila sincronizada em tempo real
        </p>
      }
    >
      <section aria-label="Indicadores da fila" className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <p className="text-overline text-text-tertiary uppercase">Candidaturas em espera</p>
          <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-on-surface tabular-nums">
            {queue.length}
          </p>
          <p
            className={cn(
              "mt-2 flex items-center gap-1.5 border-t-2 border-border-cloud pt-2 text-caption tabular-nums",
              atRisk > 0 ? "font-bold text-feedback-streak-ink" : "text-text-secondary",
            )}
          >
            <Icon name="alert" size={16} />
            {atRisk > 0 ? `${atRisk} a menos de 2 h do prazo` : "Nenhuma perto do prazo"}
          </p>
        </article>

        <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <p className="text-overline text-text-tertiary uppercase">Tempo médio de resposta</p>
          <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-primary tabular-nums">6 h 14</p>
          <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary">
            Prazo prometido: 4 h com amostra, 24 h sem amostra
          </p>
        </article>

        <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <p className="text-overline text-text-tertiary uppercase">Aprovações este mês</p>
          <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-feedback-success-ink tabular-nums">
            78,4%
          </p>
          <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary tabular-nums">
            21,6% devolvidas, quase sempre por documento ilegível
          </p>
        </article>
      </section>

      <section className="mb-5 flex flex-col gap-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <label htmlFor="queue-search" className="mb-2 block text-body-md font-bold text-on-surface">
            Procurar candidatura
          </label>
          <Icon name="search" size={20} className="pointer-events-none absolute bottom-3.5 left-3 text-text-tertiary" />
          <input
            id="queue-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome, instituição ou protocolo"
            className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-4 pl-10 text-body-md text-on-surface"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField id="queue-university" label="Instituição" options={universities} value={university} onChange={(e) => setUniversity(e.target.value)} />
          <SelectField id="queue-sort" label="Ordenar por" options={SORTS} value={sort} onChange={(e) => setSort(e.target.value)} />
        </div>
      </section>

      <TableScroll label="Tabela da fila de homologação">
        <table className={table}>
          <caption className="sr-only">Candidaturas de criador à espera de auditoria</caption>
          <thead>
            <tr>
              <th scope="col" className={th}>Protocolo</th>
              <th scope="col" className={th}>Candidato</th>
              <th scope="col" className={th}>Instituição e vínculo</th>
              <th scope="col" className={th}>Documentos</th>
              <th scope="col" className={th}>Prazo</th>
              <th scope="col" className={cn(th, "text-right")}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((app) => {
              const left = remaining(app);
              const late = left <= 0;
              const urgent = left > 0 && left < 2;
              return (
                <tr key={app.protocol} className={tr}>
                  <th scope="row" className={cn(td, "font-normal")}>
                    <span className="block font-bold whitespace-nowrap text-on-surface tabular-nums">{app.protocol}</span>
                    <span className="block text-caption text-text-tertiary tabular-nums">
                      Há {formatHours(hoursBetween(app.submittedAt))}
                    </span>
                  </th>
                  <td className={td}>
                    <span className="flex items-center gap-2.5">
                      <Avatar name={app.candidate.name} size="sm" />
                      <span>
                        <span className="block font-bold whitespace-nowrap text-on-surface">{app.candidate.name}</span>
                        <span className="block text-caption text-text-tertiary">{app.candidate.specialty}</span>
                      </span>
                    </span>
                  </td>
                  <td className={td}>
                    <span className="block whitespace-nowrap">
                      {app.university} · {app.faculty}
                    </span>
                    <span className="mt-1 inline-block rounded-md bg-surface-soft px-2 py-0.5 text-caption text-text-secondary">
                      {app.affiliation}
                    </span>
                  </td>
                  <td className={td}>
                    {(() => {
                      const broken = app.documents.filter((d) => !d.ok).length;
                      return (
                        <>
                          <span className="block whitespace-nowrap tabular-nums">
                            {app.documents.length} ficheiros · {formatSize(app.documents.reduce((sum, d) => sum + d.sizeKb, 0))}
                          </span>
                          <span
                            className={cn(
                              "block text-caption",
                              broken > 0 ? "font-bold text-feedback-error-ink" : "text-text-tertiary",
                            )}
                          >
                            {broken > 0
                              ? `${broken} por rever`
                              : app.sampleIncluded
                                ? "Com amostra"
                                : "Sem amostra"}
                          </span>
                        </>
                      );
                    })()}
                  </td>
                  <td className={td}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border-2 bg-surface-canvas px-2.5 py-1 text-caption font-bold whitespace-nowrap tabular-nums",
                        late
                          ? "border-feedback-error text-feedback-error-ink"
                          : urgent
                            ? "border-feedback-streak text-feedback-streak-ink"
                            : "border-border-cloud text-text-secondary",
                      )}
                    >
                      <Icon name="clock" size={14} />
                      {late ? `Atrasada ${formatHours(left)}` : `Faltam ${formatHours(left)}`}
                    </span>
                  </td>
                  <td className={cn(td, "text-right")}>
                    <Button3D onClick={() => openAudit(app)} trailingIcon={<Icon name="arrow-right" size={16} />}>
                      Auditar
                      <span className="sr-only"> a candidatura de {app.candidate.name}</span>
                    </Button3D>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScroll>

      {shown.length === 0 && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
          {queue.length === 0 ? "A fila está vazia. Nada por homologar." : "Nenhuma candidatura corresponde a estes filtros."}
        </p>
      )}

      {auditing && (
        <SlideOver
          open
          onClose={() => setAuditing(null)}
          eyebrow={auditing.protocol}
          title={auditing.candidate.name}
          footer={
            <div className="flex flex-col gap-2">
              {!allChecked && (
                <p id="approve-hint" className="text-caption text-text-secondary">
                  Falta confirmar: {missing.map((m) => m.title.toLowerCase()).join("; ")}.
                </p>
              )}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button3D
                  variant="ghost"
                  className="border-feedback-error text-feedback-error-ink"
                  onClick={() => {
                    if (!feedback.trim()) {
                      document.getElementById("queue-feedback")?.focus();
                      return;
                    }
                    resolve(auditing, false);
                  }}
                >
                  Devolver com instruções
                </Button3D>
                <Button3D
                  variant="success"
                  disabled={!allChecked}
                  aria-describedby={allChecked ? undefined : "approve-hint"}
                  onClick={() => resolve(auditing, true)}
                >
                  Homologar criador
                </Button3D>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl bg-surface-soft p-4">
              <p className="text-caption text-text-secondary">
                {auditing.university} · {auditing.faculty} · {auditing.affiliation}
              </p>
              <p className="mt-1 text-body-md font-bold text-on-surface">{auditing.candidate.specialty}</p>
              <p className="mt-2 text-caption text-text-secondary tabular-nums" aria-hidden="true">
                Express: {maskAOPhone(auditing.phone).visual}
              </p>
              <p className="sr-only">Multicaixa Express, {maskAOPhone(auditing.phone).spoken}</p>
            </section>

            <section aria-labelledby="docs-title">
              <h3 id="docs-title" className="mb-2 text-overline text-text-tertiary uppercase">
                Documentos submetidos
              </h3>
              <ul className="flex flex-col gap-2">
                {auditing.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-xl border-2 p-3",
                      doc.ok ? "border-border-cloud bg-surface-canvas" : "border-feedback-error bg-surface-canvas",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-body-md font-bold text-on-surface">{doc.name}</span>
                      <span className="block text-caption text-text-tertiary tabular-nums">{formatSize(doc.sizeKb)}</span>
                      {doc.note && <span className="mt-1 block text-caption font-bold text-feedback-error-ink">{doc.note}</span>}
                    </span>
                    <Button3D variant="ghost" onClick={() => toast.show("Visualizador de documentos em breve.")}>
                      Abrir
                      <span className="sr-only"> {doc.name}</span>
                    </Button3D>
                  </li>
                ))}
              </ul>
            </section>

            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-2 text-overline text-text-tertiary uppercase">Critérios de homologação</legend>
              <div className="flex flex-col gap-2.5">
                {auditing.criteria.map((criterion) => {
                  const isChecked = checked.includes(criterion.id);
                  return (
                    <label
                      key={criterion.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-[border-color,background-color] duration-150",
                        isChecked ? "border-feedback-success bg-feedback-success-soft" : "border-border-cloud bg-surface-soft",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setChecked((prev) =>
                            prev.includes(criterion.id) ? prev.filter((c) => c !== criterion.id) : [...prev, criterion.id],
                          )
                        }
                        className="mt-0.5 size-6 shrink-0 cursor-pointer accent-feedback-success-ink"
                      />
                      <span>
                        <span className="block text-body-md font-bold text-on-surface">{criterion.title}</span>
                        <span className="block text-caption text-text-secondary">{criterion.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="queue-feedback" className="mb-2 flex flex-wrap items-center justify-between gap-2 text-body-md font-bold text-on-surface">
                Instruções para o candidato
                <span className="text-caption font-medium text-text-tertiary">Obrigatório para devolver</span>
              </label>
              <textarea
                id="queue-feedback"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ex.: reenvia a declaração com o carimbo legível."
                className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
              />
            </div>
          </div>
        </SlideOver>
      )}
    </AdminShell>
  );
}
