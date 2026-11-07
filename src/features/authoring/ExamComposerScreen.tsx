import { useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { ExamSettings, Question, Topic } from "./types";

const FEEDBACK_MODES = [
  { value: "final", label: "Só no fim: simula o exame real" },
  { value: "imediato", label: "Imediato: serve para treinar" },
];

const ATTEMPTS = [
  { value: "1", label: "Uma tentativa" },
  { value: "2", label: "Duas tentativas" },
  { value: "0", label: "Sem limite" },
];

type ExamComposerScreenProps = { questions: Question[]; topics: Topic[]; creatorName: string; subjectName: string };

/** Compositor de simulado: banco à esquerda, prova à direita, cobertura sempre à vista. */
export default function ExamComposerScreen({ questions, topics, creatorName, subjectName }: ExamComposerScreenProps) {
  const [title, setTitle] = useState(`Simulado de ${subjectName}: 1.ª frequência`);
  const [selected, setSelected] = useState<string[]>([questions[0].id, questions[2].id, questions[4].id]);
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("todos");
  const [settings, setSettings] = useState<ExamSettings>({
    shuffleOptions: true,
    shuffleQuestions: false,
    timeLimitMinutes: 15,
    feedback: "final",
    attempts: 1,
  });
  const toast = useToast();

  const chosen = selected.map((id) => questions.find((q) => q.id === id)!).filter(Boolean);
  const available = useMemo(() => {
    const q = normalize(query.trim());
    return questions.filter(
      (item) =>
        (topicFilter === "todos" || item.topicIds.includes(topicFilter)) &&
        (!q || normalize(item.stem).includes(q)),
    );
  }, [questions, query, topicFilter]);

  // Duração e XP são somados, nunca escritos à mão.
  const seconds = chosen.reduce((sum, q) => sum + q.estimatedSeconds, 0);
  const minutes = Math.ceil(seconds / 60);
  const xp = chosen.length * 10;
  const overTime = settings.timeLimitMinutes > 0 && minutes > settings.timeLimitMinutes;

  const coverage = topics.map((topic) => {
    const count = chosen.filter((q) => q.topicIds.includes(topic.id)).length;
    const share = chosen.length === 0 ? 0 : Math.round((count / chosen.length) * 100);
    return { topic, count, share, gap: share < topic.examWeight - 15 };
  });
  const uncovered = coverage.filter((c) => c.count === 0);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...selected];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSelected(next);
    toast.show(`Questão movida para a posição ${target + 1} de ${next.length}.`);
  }

  /** Preenche por regra: respeita o peso de cada tópico no exame. */
  function fillByRule(target: number) {
    const picks: string[] = [...selected];
    for (const { topic } of coverage) {
      const quota = Math.round((topic.examWeight / 100) * target);
      const pool = questions.filter((q) => q.topicIds.includes(topic.id) && !picks.includes(q.id));
      for (const q of pool.slice(0, Math.max(0, quota - chosen.filter((c) => c.topicIds.includes(topic.id)).length))) {
        if (picks.length < target) picks.push(q.id);
      }
    }
    setSelected(picks);
    toast.show(`Simulado preenchido com ${picks.length} questões, segundo o peso dos tópicos.`);
  }

  return (
    <CreatorShell
      active="materiais"
      creatorName={creatorName}
      actions={
        <>
          <Button3D variant="ghost" onClick={() => toast.show("Pré-visualização em preparação.")} leadingIcon={<Icon name="eye" size={18} />}>
            Ver como aluno
          </Button3D>
          <Button3D
            disabled={chosen.length < 5}
            onClick={() => toast.show("Simulado pronto. Define o preço para publicar.")}
            aria-describedby={chosen.length < 5 ? "publish-hint" : undefined}
          >
            Definir preço e publicar
          </Button3D>
        </>
      }
    >
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-5">
          <p className="text-overline text-primary uppercase">Compositor de simulado · {subjectName}</p>
          <h1 className="sr-only">{title}</h1>
          <label htmlFor="exam-title" className="sr-only">
            Título do simulado
          </label>
          <input
            id="exam-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-transparent bg-transparent font-montserrat text-headline-h1-mobile text-on-surface hover:border-border-cloud focus-visible:border-brand-ocean sm:text-headline-h1"
          />
        </header>

        <section
          aria-labelledby="totals-title"
          className="mb-6 grid grid-cols-2 gap-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 lg:grid-cols-4"
        >
          <h2 id="totals-title" className="sr-only">
            Totais do simulado
          </h2>
          {[
            { label: "Questões", value: `${chosen.length}`, note: chosen.length < 5 ? "Mínimo de 5 para publicar" : "Dentro do intervalo" },
            { label: "Duração estimada", value: `${minutes} min`, note: `Soma dos tempos por questão` },
            { label: "XP do simulado", value: `${xp} XP`, note: "10 XP por questão" },
            {
              label: "Tópicos cobertos",
              value: `${coverage.filter((c) => c.count > 0).length} de ${topics.length}`,
              note: uncovered.length === 0 ? "Cobertura completa" : `Falta ${uncovered.map((u) => u.topic.name).join(", ")}`,
            },
          ].map((tile) => (
            <p key={tile.label}>
              <span className="block text-overline text-text-tertiary uppercase">{tile.label}</span>
              <span className="block font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums">
                {tile.value}
              </span>
              <span className="block text-caption text-text-secondary">{tile.note}</span>
            </p>
          ))}
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section aria-labelledby="bank-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 lg:col-span-5">
            <h2 id="bank-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Banco de questões
            </h2>
            <p className="mt-0.5 mb-4 text-caption text-text-secondary">
              Escolhe uma a uma, ou deixa a regra distribuir pelo peso dos tópicos.
            </p>

            <div className="mb-3 flex flex-col gap-3">
              <div className="relative">
                <label htmlFor="composer-search" className="sr-only">
                  Procurar questão
                </label>
                <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-tertiary" />
                <input
                  id="composer-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enunciado"
                  className="min-h-11 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-3 pl-9 text-body-md text-on-surface"
                />
              </div>
              <SelectField
                id="composer-topic"
                label="Tópico"
                options={[{ value: "todos", label: "Todos os tópicos" }, ...topics.map((t) => ({ value: t.id, label: `${t.name} (${t.examWeight}%)` }))]}
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
              />
              <Button3D variant="secondary" fullWidth onClick={() => fillByRule(10)} leadingIcon={<Icon name="target" size={18} />}>
                Preencher 10 questões por regra
              </Button3D>
            </div>

            <ul className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
              {available.map((question) => {
                const included = selected.includes(question.id);
                return (
                  <li key={question.id}>
                    <article
                      className={cn(
                        "rounded-2xl border-2 p-3",
                        included ? "border-feedback-success bg-surface-canvas" : "border-border-cloud bg-surface-soft",
                      )}
                    >
                      <p className="text-body-md font-bold text-on-surface">{question.stem}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-caption text-text-tertiary tabular-nums">
                        {question.topicIds.map((id) => (
                          <span key={id} className="rounded bg-surface-canvas px-1.5 py-0.5">
                            {topics.find((t) => t.id === id)?.name}
                          </span>
                        ))}
                        <span>{question.estimatedSeconds}s</span>
                        {question.observed && <span>{question.observed.accuracy}% de acerto</span>}
                      </p>
                      <Button3D
                        variant={included ? "ghost" : "secondary"}
                        className="mt-2.5"
                        onClick={() => toggle(question.id)}
                        leadingIcon={<Icon name={included ? "check" : "plus"} size={16} strokeWidth={included ? 3 : 2} />}
                      >
                        {included ? "No simulado" : "Adicionar"}
                        <span className="sr-only">: {question.stem}</span>
                      </Button3D>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <section aria-labelledby="coverage-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <h2 id="coverage-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Cobertura por tópico
              </h2>
              <p className="mt-0.5 mb-4 text-caption text-text-secondary">
                Comparada com o peso de cada tópico no exame da cadeira.
              </p>

              <ul className="flex flex-col gap-4">
                {coverage.map(({ topic, count, share, gap }) => (
                  <li key={topic.id}>
                    <p className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-caption">
                      <span className="font-bold text-on-surface">{topic.name}</span>
                      <span className={cn("tabular-nums", gap ? "font-bold text-feedback-streak-ink" : "text-text-secondary")}>
                        {count} {count === 1 ? "questão" : "questões"} ({share}%) · peso no exame {topic.examWeight}%
                      </span>
                    </p>
                    <ProgressBar
                      value={share}
                      tone={gap ? "streak" : "ocean"}
                      size="sm"
                      label={`Cobertura de ${topic.name}`}
                      valueText={`${share}% do simulado, contra ${topic.examWeight}% de peso no exame`}
                    />
                  </li>
                ))}
              </ul>

              {uncovered.length > 0 && (
                <p className="mt-4 flex items-start gap-2 rounded-xl border-2 border-feedback-streak bg-surface-canvas p-3 text-caption text-text-secondary">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
                  {uncovered.length === 1
                    ? `O tópico ${uncovered[0].topic.name} não tem nenhuma questão, e vale ${uncovered[0].topic.examWeight}% do exame.`
                    : `${uncovered.length} tópicos ficam de fora: ${uncovered.map((u) => u.topic.name).join(", ")}.`}
                </p>
              )}
            </section>

            <section aria-labelledby="structure-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 id="structure-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                  Estrutura da prova ({chosen.length})
                </h2>
                {chosen.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="min-h-11 text-caption font-bold text-text-secondary hover:text-feedback-error-ink"
                  >
                    Limpar tudo
                  </button>
                )}
              </div>

              {chosen.length === 0 ? (
                <p className="rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
                  Ainda não escolheste nenhuma questão.
                </p>
              ) : (
                <ol className="flex flex-col gap-2">
                  {chosen.map((question, index) => (
                    <li key={question.id}>
                      <article className="flex items-start gap-3 rounded-2xl border-2 border-border-cloud bg-surface-soft p-3">
                        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-ocean text-caption font-bold text-white tabular-nums">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-body-md font-bold text-on-surface">{question.stem}</span>
                          <span className="mt-0.5 block text-caption text-text-tertiary tabular-nums">
                            {question.topicIds.map((id) => topics.find((t) => t.id === id)?.name).join(", ")} ·{" "}
                            {question.estimatedSeconds}s
                          </span>
                        </span>
                        <span className="flex shrink-0 gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => move(index, -1)}
                            aria-label={`Mover a questão ${index + 1} para cima`}
                            className="flex size-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-canvas disabled:text-text-disabled"
                          >
                            <Icon name="arrow-right" size={18} className="-rotate-90" />
                          </button>
                          <button
                            type="button"
                            disabled={index === chosen.length - 1}
                            onClick={() => move(index, 1)}
                            aria-label={`Mover a questão ${index + 1} para baixo`}
                            className="flex size-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-canvas disabled:text-text-disabled"
                          >
                            <Icon name="arrow-right" size={18} className="rotate-90" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggle(question.id)}
                            aria-label={`Remover a questão ${index + 1} do simulado`}
                            className="flex size-11 items-center justify-center rounded-lg text-text-secondary hover:bg-feedback-error-soft hover:text-feedback-error-ink"
                          >
                            <Icon name="trash" size={18} />
                          </button>
                        </span>
                      </article>
                    </li>
                  ))}
                </ol>
              )}

              {chosen.length < 5 && (
                <p id="publish-hint" className="mt-3 text-caption text-text-secondary tabular-nums">
                  Faltam {5 - chosen.length} questões para o simulado poder ser publicado.
                </p>
              )}
            </section>

            <section aria-labelledby="settings-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <h2 id="settings-title" className="mb-4 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Como se aplica
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="time-limit" className="mb-2 block text-body-md font-bold text-on-surface">
                    Tempo limite (minutos)
                  </label>
                  <input
                    id="time-limit"
                    type="number"
                    min={0}
                    max={120}
                    step={5}
                    value={settings.timeLimitMinutes}
                    aria-describedby="time-hint"
                    onChange={(e) => setSettings((s) => ({ ...s, timeLimitMinutes: Number(e.target.value) }))}
                    className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface tabular-nums"
                  />
                  <p
                    id="time-hint"
                    className={cn("mt-1.5 text-caption tabular-nums", overTime ? "font-bold text-feedback-error-ink" : "text-text-secondary")}
                  >
                    {settings.timeLimitMinutes === 0
                      ? "Sem limite de tempo."
                      : overTime
                        ? `As questões somam ${minutes} min: o limite é curto demais.`
                        : `Folga de ${settings.timeLimitMinutes - minutes} min face ao tempo estimado.`}
                  </p>
                </div>

                <SelectField
                  id="attempts"
                  label="Tentativas permitidas"
                  options={ATTEMPTS}
                  value={String(settings.attempts)}
                  onChange={(e) => setSettings((s) => ({ ...s, attempts: Number(e.target.value) as 0 | 1 | 2 }))}
                />

                <div className="md:col-span-2">
                  <SelectField
                    id="feedback-mode"
                    label="Quando mostrar as explicações"
                    hint="No modo imediato, o estudante vê a explicação da alternativa que escolheu."
                    options={FEEDBACK_MODES}
                    value={settings.feedback}
                    onChange={(e) => setSettings((s) => ({ ...s, feedback: e.target.value as ExamSettings["feedback"] }))}
                  />
                </div>
              </div>

              <ul className="mt-5 flex flex-col gap-3 border-t-2 border-border-cloud pt-4">
                <li className="flex items-center justify-between gap-4">
                  <span>
                    <span className="block text-body-md text-on-surface">Baralhar a ordem das alternativas</span>
                    <span id="shuffle-opt-hint" className="block text-caption text-text-tertiary">
                      Dificulta a partilha de respostas entre colegas.
                    </span>
                  </span>
                  <Switch
                    id="shuffle-options"
                    checked={settings.shuffleOptions}
                    label="Baralhar a ordem das alternativas"
                    hideLabel
                    describedBy="shuffle-opt-hint"
                    onChange={(v) => setSettings((s) => ({ ...s, shuffleOptions: v }))}
                  />
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>
                    <span className="block text-body-md text-on-surface">Baralhar a ordem das questões</span>
                    <span id="shuffle-q-hint" className="block text-caption text-text-tertiary">
                      Desliga se a prova tiver uma sequência pedagógica.
                    </span>
                  </span>
                  <Switch
                    id="shuffle-questions"
                    checked={settings.shuffleQuestions}
                    label="Baralhar a ordem das questões"
                    hideLabel
                    describedBy="shuffle-q-hint"
                    onChange={(v) => setSettings((s) => ({ ...s, shuffleQuestions: v }))}
                  />
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </CreatorShell>
  );
}
