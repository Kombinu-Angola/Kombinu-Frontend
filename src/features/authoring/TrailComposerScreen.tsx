import { useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Topic, TrailNodeDraft } from "./types";

const SEMESTERS = [
  { value: "2026-1", label: "Ano letivo 2026, 1.º semestre" },
  { value: "2026-2", label: "Ano letivo 2026, 2.º semestre" },
];

const INITIAL_NODES: TrailNodeDraft[] = [
  { id: "n1", kind: "artigo", title: "Introdução ao mercado cambial e reservas do BNA", minutes: 12, xp: 40, checkpoints: 3, topicIds: ["t-cambial"] },
  { id: "n2", kind: "artigo", title: "O modelo IS-LM em economia fechada", minutes: 18, xp: 50, checkpoints: 4, topicIds: ["t-islm"] },
  { id: "n3", kind: "simulado", title: "Simulado prático: 8 questões de IS-LM", minutes: 15, xp: 80, checkpoints: 8, topicIds: ["t-islm"] },
  { id: "n4", kind: "vazio", title: "", minutes: 0, xp: 0, checkpoints: 0, topicIds: [] },
];

type TrailComposerScreenProps = { topics: Topic[]; creatorName: string; subjectName: string; readersOnCurrent: number };

/** Compositor de trilha: sequência de nós, coerência pedagógica e política de versões. */
export default function TrailComposerScreen({ topics, creatorName, subjectName, readersOnCurrent }: TrailComposerScreenProps) {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [goal, setGoal] = useState("Compreender como o câmbio e a política monetária se cruzam numa economia aberta.");
  const [semester, setSemester] = useState(SEMESTERS[0].value);
  const [versionPolicy, setVersionPolicy] = useState<"manter" | "forcar">("manter");
  const toast = useToast();

  const filled = nodes.filter((n) => n.kind !== "vazio");
  const minutes = filled.reduce((sum, n) => sum + n.minutes, 0);
  const xp = filled.reduce((sum, n) => sum + n.xp, 0);
  const checkpoints = filled.reduce((sum, n) => sum + n.checkpoints, 0);
  const medianXp = filled.length === 0 ? 0 : [...filled].sort((a, b) => a.xp - b.xp)[Math.floor(filled.length / 2)].xp;
  const unbalanced = filled.filter((n) => medianXp > 0 && n.xp > medianXp * 2);
  const practice = filled.filter((n) => n.kind === "simulado").length;
  const emptyNodes = nodes.filter((n) => n.kind === "vazio").length;

  const coverage = useMemo(
    () => topics.map((topic) => ({ topic, count: filled.filter((n) => n.topicIds.includes(topic.id)).length })),
    [topics, filled],
  );
  const uncovered = coverage.filter((c) => c.count === 0);
  const canPublish = emptyNodes === 0 && practice > 0 && filled.length >= 3;

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= nodes.length) return;
    const next = [...nodes];
    [next[index], next[target]] = [next[target], next[index]];
    setNodes(next);
    toast.show(`Módulo movido para a posição ${target + 1} de ${next.length}.`);
  }

  function remove(id: string) {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  }

  function addNode(kind: TrailNodeDraft["kind"]) {
    setNodes((prev) => [
      ...prev,
      kind === "vazio"
        ? { id: `n${prev.length + 1}`, kind, title: "", minutes: 0, xp: 0, checkpoints: 0, topicIds: [] }
        : {
            id: `n${prev.length + 1}`,
            kind,
            title: kind === "artigo" ? "Novo artigo do meu estúdio" : "Novo simulado do meu banco",
            minutes: kind === "artigo" ? 14 : 12,
            xp: kind === "artigo" ? 40 : 70,
            checkpoints: kind === "artigo" ? 3 : 8,
            topicIds: [topics[0].id],
          },
    ]);
  }

  return (
    <CreatorShell
      active="materiais"
      creatorName={creatorName}
      actions={
        <Button3D
          disabled={!canPublish}
          aria-describedby={canPublish ? undefined : "trail-blockers"}
          onClick={() =>
            toast.show(
              versionPolicy === "manter"
                ? "Trilha publicada. Quem já começou termina na versão anterior."
                : "Trilha publicada para todos, incluindo quem está a meio.",
            )
          }
        >
          Publicar trilha
        </Button3D>
      }
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Compositor de trilha · {subjectName}</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Trilha completa de {subjectName}
          </h1>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <section aria-labelledby="meta-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <h2 id="meta-title" className="mb-4 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Identificação da trilha
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField id="trail-subject" label="Cadeira" value={subjectName} readOnly hint="Vem do catálogo curricular." />
                <SelectField id="trail-semester" label="Ano e semestre" options={SEMESTERS} value={semester} onChange={(e) => setSemester(e.target.value)} />
                <div className="md:col-span-2">
                  <label htmlFor="trail-goal" className="mb-2 block text-body-md font-bold text-on-surface">
                    Objetivo da trilha, em uma frase
                  </label>
                  <textarea
                    id="trail-goal"
                    rows={2}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    aria-describedby="goal-hint"
                    className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
                  />
                  <p id="goal-hint" className="mt-1 text-caption text-text-secondary">
                    Aparece ao estudante antes de começar, e ajuda-o a decidir se é isto que precisa.
                  </p>
                </div>
              </div>
            </section>

            <section aria-labelledby="nodes-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 id="nodes-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                  Sequência de módulos ({nodes.length})
                </h2>
                <p className="text-caption text-text-tertiary">Usa os botões de mover: funciona com teclado.</p>
              </div>

              <ol className="flex flex-col gap-3">
                {nodes.map((node, index) => {
                  const empty = node.kind === "vazio";
                  return (
                    <li key={node.id}>
                      <article
                        className={cn(
                          "flex flex-col gap-3 rounded-2xl border-2 p-4 sm:flex-row sm:items-center",
                          empty ? "border-dashed border-border-input bg-surface-soft" : "border-border-cloud bg-surface-canvas",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-full font-bold tabular-nums",
                            empty ? "border-2 border-dashed border-border-input text-text-tertiary" : "bg-brand-ocean text-white",
                          )}
                        >
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          {empty ? (
                            <>
                              <p className="text-body-md font-bold text-text-secondary">Nó por preencher</p>
                              <p className="mt-2 flex flex-wrap gap-2">
                                <Button3D variant="ghost" onClick={() => addNode("artigo")} leadingIcon={<Icon name="book" size={16} />}>
                                  Associar artigo
                                </Button3D>
                                <Button3D variant="ghost" onClick={() => addNode("simulado")} leadingIcon={<Icon name="bolt" size={16} />}>
                                  Associar simulado
                                </Button3D>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="flex flex-wrap items-center gap-2">
                                <span
                                  className={cn(
                                    "rounded-md px-2 py-0.5 text-overline uppercase",
                                    node.kind === "artigo" ? "bg-primary-fixed text-on-primary-fixed" : "bg-secondary-fixed text-on-secondary-fixed-variant",
                                  )}
                                >
                                  {node.kind === "artigo" ? "Artigo" : "Simulado"}
                                </span>
                                <span className="text-body-md font-bold text-on-surface">{node.title}</span>
                              </p>
                              <p className="mt-1 flex flex-wrap items-center gap-2 text-caption text-text-tertiary tabular-nums">
                                <span>{node.minutes} min</span>
                                <span aria-hidden="true">·</span>
                                <span>{node.xp} XP</span>
                                <span aria-hidden="true">·</span>
                                <span>{node.checkpoints} questões</span>
                                {node.topicIds.map((id) => (
                                  <span key={id} className="rounded bg-surface-soft px-1.5 py-0.5">
                                    {topics.find((t) => t.id === id)?.name}
                                  </span>
                                ))}
                              </p>
                            </>
                          )}
                        </div>

                        <span className="flex shrink-0 gap-0.5 self-end sm:self-center">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => move(index, -1)}
                            aria-label={`Mover o módulo ${index + 1} para cima`}
                            className="flex size-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-soft disabled:text-text-disabled"
                          >
                            <Icon name="arrow-right" size={18} className="-rotate-90" />
                          </button>
                          <button
                            type="button"
                            disabled={index === nodes.length - 1}
                            onClick={() => move(index, 1)}
                            aria-label={`Mover o módulo ${index + 1} para baixo`}
                            className="flex size-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-soft disabled:text-text-disabled"
                          >
                            <Icon name="arrow-right" size={18} className="rotate-90" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(node.id)}
                            aria-label={`Remover o módulo ${index + 1}`}
                            className="flex size-11 items-center justify-center rounded-lg text-text-secondary hover:bg-feedback-error-soft hover:text-feedback-error-ink"
                          >
                            <Icon name="trash" size={18} />
                          </button>
                        </span>
                      </article>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-4 flex flex-wrap gap-2 border-t-2 border-border-cloud pt-4">
                <Button3D variant="ghost" onClick={() => addNode("artigo")} leadingIcon={<Icon name="plus" size={16} />}>
                  Artigo do meu estúdio
                </Button3D>
                <Button3D variant="ghost" onClick={() => addNode("simulado")} leadingIcon={<Icon name="plus" size={16} />}>
                  Simulado do meu banco
                </Button3D>
                <Button3D variant="ghost" onClick={() => addNode("vazio")} leadingIcon={<Icon name="plus" size={16} />}>
                  Marcador por preencher
                </Button3D>
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5 lg:col-span-4 lg:sticky lg:top-24">
            <section aria-labelledby="coherence-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <h2 id="coherence-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Coerência da trilha
              </h2>

              <dl className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "Tempo total", value: `${Math.floor(minutes / 60)}h ${minutes % 60}min` },
                  { label: "XP total", value: `${xp} XP` },
                  { label: "Questões", value: String(checkpoints) },
                  { label: "Módulos", value: `${filled.length} de ${nodes.length}` },
                ].map((row) => (
                  <div key={row.label} className="rounded-xl bg-surface-soft p-3">
                    <dt className="text-caption text-text-secondary">{row.label}</dt>
                    <dd className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-5 mb-2 text-overline text-text-tertiary uppercase">Cobertura de tópicos</h3>
              <ul className="flex flex-col gap-3">
                {coverage.map(({ topic, count }) => (
                  <li key={topic.id}>
                    <p className="mb-1 flex items-baseline justify-between gap-2 text-caption">
                      <span className={cn(count === 0 ? "font-bold text-feedback-streak-ink" : "text-text-secondary")}>
                        {topic.name}
                      </span>
                      <span className="tabular-nums text-text-tertiary">{count}</span>
                    </p>
                    <ProgressBar
                      value={count}
                      max={Math.max(2, ...coverage.map((c) => c.count))}
                      size="sm"
                      tone={count === 0 ? "streak" : "ocean"}
                      label={`Módulos sobre ${topic.name}`}
                      valueText={`${count} módulos`}
                    />
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-col gap-2 border-t-2 border-border-cloud pt-4 text-caption">
                {[
                  {
                    ok: practice > 0,
                    text: practice > 0 ? `${practice} módulos de prática` : "Sem nenhum módulo de prática",
                  },
                  {
                    ok: unbalanced.length === 0,
                    text:
                      unbalanced.length === 0
                        ? "XP equilibrado entre módulos"
                        : `${unbalanced.length} módulo vale mais do dobro da mediana`,
                  },
                  {
                    ok: uncovered.length === 0,
                    text: uncovered.length === 0 ? "Todos os tópicos cobertos" : `${uncovered.length} tópicos sem módulo`,
                  },
                  { ok: emptyNodes === 0, text: emptyNodes === 0 ? "Sem nós por preencher" : `${emptyNodes} nós por preencher` },
                ].map((check) => (
                  <li key={check.text} className="flex items-start gap-2">
                    <Icon
                      name={check.ok ? "check" : "alert"}
                      size={15}
                      strokeWidth={3}
                      className={cn("mt-0.5 shrink-0", check.ok ? "text-feedback-success-ink" : "text-feedback-streak-ink")}
                    />
                    <span className={check.ok ? "text-text-secondary" : "font-bold text-on-surface"}>{check.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="version-title" className="rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-5">
              <h2 id="version-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Quem já está a meio
              </h2>
              <p className="mt-1 mb-3 text-caption text-text-secondary tabular-nums">
                {readersOnCurrent} estudantes estão a fazer a versão atual.
              </p>

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="sr-only">Política de versão ao publicar</legend>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      value: "manter" as const,
                      title: "Deixar terminar na versão atual",
                      hint: "Recomendado: ninguém perde progresso. A nova versão vale para quem começar depois.",
                    },
                    {
                      value: "forcar" as const,
                      title: "Passar todos para a nova versão",
                      hint: "Só para correções urgentes. O progresso em módulos removidos perde-se.",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-[border-color,background-color] duration-150",
                        versionPolicy === option.value ? "border-brand-ocean bg-surface-sky" : "border-border-cloud bg-surface-canvas",
                      )}
                    >
                      <input
                        type="radio"
                        name="version-policy"
                        checked={versionPolicy === option.value}
                        onChange={() => setVersionPolicy(option.value)}
                        className="mt-0.5 size-5 cursor-pointer accent-brand-ocean"
                      />
                      <span>
                        <span className="block text-caption font-bold text-on-surface">{option.title}</span>
                        <span className="block text-caption text-text-tertiary">{option.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {!canPublish && (
                <p id="trail-blockers" className="mt-3 text-caption font-bold text-feedback-error-ink">
                  Para publicar: {emptyNodes > 0 && "preenche os nós vazios"}
                  {emptyNodes > 0 && practice === 0 && " e "}
                  {practice === 0 && "junta pelo menos um simulado"}.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </CreatorShell>
  );
}
