import { useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { FileDropzone } from "../../components/ui/FileDropzone";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import type { ImportedRow, Topic } from "./types";

type BulkImportScreenProps = { rows: ImportedRow[]; topics: Topic[]; creatorName: string };

/** Importação em massa: o ficheiro entra, os problemas resolvem-se aqui, e só o válido vai para o banco. */
export default function BulkImportScreen({ rows: initial, topics, creatorName }: BulkImportScreenProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState(initial);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [bulkTopic, setBulkTopic] = useState(topics[0].id);
  const toast = useToast();

  const valid = rows.filter((r) => r.issues.length === 0);
  const broken = rows.filter((r) => r.issues.length > 0);
  const shown = onlyIssues ? broken : rows;

  const fixable = useMemo(() => broken.filter((r) => r.issues.every((i) => i.field === "topico")), [broken]);

  function setTopic(id: string, topicId: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, topicId, issues: r.issues.filter((i) => i.field !== "topico") } : r,
      ),
    );
  }

  function setCorrect(id: string, index: number) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, correctIndex: index, issues: r.issues.filter((i) => i.field !== "gabarito") } : r,
      ),
    );
  }

  function applyTopicToAll() {
    setRows((prev) =>
      prev.map((r) =>
        r.topicId === null && r.issues.some((i) => i.field === "topico")
          ? { ...r, topicId: bulkTopic, issues: r.issues.filter((i) => i.field !== "topico") }
          : r,
      ),
    );
    toast.show(`Tópico aplicado a ${fixable.length} questões.`);
  }

  return (
    <CreatorShell active="materiais" creatorName={creatorName}>
      <div className="mx-auto max-w-[1080px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href="/v2/estudio/questoes" className="hover:text-primary">
            Banco de questões
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            Importar
          </span>
        </nav>

        <header className="mb-6">
          <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Importar questões em massa
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            Aceita Word e Excel. Cada linha vira uma questão do banco; o que vier incompleto resolve-se aqui, sem
            voltar ao ficheiro.
          </p>
        </header>

        <section className="mb-6">
          <FileDropzone
            id="import-file"
            headingLevel="h2"
            title="Ficheiro de questões"
            description="Word (.docx) ou Excel (.xlsx) até 10 MB. Uma questão por linha ou por parágrafo numerado."
            extensions={["docx", "xlsx", "csv"]}
            maxBytes={10 * 1024 * 1024}
            buttonLabel="Escolher ficheiro"
            file={file}
            onChange={setFile}
          />
        </section>

        <section aria-labelledby="result-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 border-b-2 border-border-cloud pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 id="result-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                {rows.length} questões lidas do ficheiro
              </h2>
              <p className="text-caption text-text-secondary tabular-nums">
                {valid.length} prontas a importar, {broken.length} precisam de atenção.
              </p>
            </div>

            <div role="group" aria-label="Filtrar linhas" className="flex gap-2">
              {[
                { value: false, label: `Todas (${rows.length})` },
                { value: true, label: `Com problemas (${broken.length})` },
              ].map((tab) => (
                <button
                  key={String(tab.value)}
                  type="button"
                  aria-pressed={onlyIssues === tab.value}
                  onClick={() => setOnlyIssues(tab.value)}
                  className={cn(
                    "min-h-11 rounded-full border-2 px-4 text-caption font-bold whitespace-nowrap transition-[background-color,border-color,color] duration-150",
                    onlyIssues === tab.value
                      ? "border-brand-ocean bg-brand-ocean text-white"
                      : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {fixable.length > 0 && (
            <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl bg-surface-sky p-4 sm:flex-row sm:items-end">
              <div className="sm:max-w-sm sm:flex-1">
                <SelectField
                  id="bulk-topic"
                  label={`Atribuir tópico a ${fixable.length} questões de uma vez`}
                  options={topics.map((t) => ({ value: t.id, label: t.name }))}
                  value={bulkTopic}
                  onChange={(e) => setBulkTopic(e.target.value)}
                />
              </div>
              <Button3D onClick={applyTopicToAll}>Aplicar a todas</Button3D>
            </div>
          )}

          <ol className="mt-5 flex flex-col gap-3">
            {shown.map((row) => {
              const ok = row.issues.length === 0;
              const unsupported = row.issues.some((i) => i.field === "alternativas");
              return (
                <li key={row.id}>
                  <article
                    className={cn(
                      "rounded-2xl border-2 p-4",
                      ok ? "border-feedback-success bg-surface-canvas" : unsupported ? "border-border-input bg-surface-canvas" : "border-feedback-streak bg-surface-canvas",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="flex items-center gap-2 text-caption text-text-tertiary tabular-nums">
                        <Icon
                          name={ok ? "check" : unsupported ? "x" : "alert"}
                          size={16}
                          strokeWidth={3}
                          className={ok ? "text-feedback-success-ink" : unsupported ? "text-text-tertiary" : "text-feedback-streak-ink"}
                        />
                        Linha {row.line}
                      </p>
                      {unsupported && (
                        <span className="rounded-full border-2 border-border-cloud px-2.5 py-0.5 text-overline text-text-secondary uppercase">
                          Não será importada
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-body-md font-bold text-on-surface">{row.stem}</p>

                    {row.options.length > 0 && (
                      <fieldset className="m-0 mt-3 min-w-0 border-0 p-0">
                        <legend className="mb-1.5 text-caption text-text-secondary">
                          {row.correctIndex === null ? "Marca a resposta certa:" : "Resposta certa:"}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {row.options.map((option, index) => (
                            <label
                              key={option}
                              className={cn(
                                "flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 text-caption transition-[border-color,background-color] duration-150",
                                row.correctIndex === index
                                  ? "border-feedback-success bg-feedback-success-soft font-bold text-on-surface"
                                  : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean",
                              )}
                            >
                              <input
                                type="radio"
                                name={`correct-${row.id}`}
                                checked={row.correctIndex === index}
                                onChange={() => setCorrect(row.id, index)}
                                className="size-4 cursor-pointer accent-feedback-success-ink"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      {row.topicId ? (
                        <p className="flex items-center gap-1.5 text-caption text-text-secondary">
                          <Icon name="check" size={14} strokeWidth={3} className="text-feedback-success-ink" />
                          Tópico: {topics.find((t) => t.id === row.topicId)?.name}
                        </p>
                      ) : (
                        <div className="w-full sm:max-w-xs">
                          <SelectField
                            id={`topic-${row.id}`}
                            label="Tópico"
                            options={[{ value: "", label: "Escolher tópico" }, ...topics.map((t) => ({ value: t.id, label: t.name }))]}
                            value=""
                            onChange={(e) => e.target.value && setTopic(row.id, e.target.value)}
                          />
                        </div>
                      )}

                      {row.issues.length > 0 && (
                        <ul className="flex flex-col gap-1">
                          {row.issues.map((issue) => (
                            <li key={issue.field} className="flex items-start gap-1.5 text-caption font-bold text-feedback-streak-ink">
                              <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
                              {issue.message}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t-2 border-border-cloud pt-5 sm:flex-row sm:items-center">
            <p className="text-caption text-text-secondary tabular-nums">
              {broken.length === 0
                ? "Está tudo pronto."
                : `${broken.length} questões ficam de fora se importares agora. Podes voltar a elas mais tarde.`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button3D variant="ghost" onClick={() => toast.show("Lote descartado.", "error")}>
                Descartar lote
              </Button3D>
              <Button3D
                disabled={valid.length === 0}
                onClick={() => {
                  toast.show(`${valid.length} questões importadas para o banco.`);
                  window.location.assign("/v2/estudio/questoes");
                }}
                trailingIcon={<Icon name="arrow-right" size={18} />}
              >
                Importar {valid.length} questões
              </Button3D>
            </div>
          </div>
        </section>
      </div>
    </CreatorShell>
  );
}
