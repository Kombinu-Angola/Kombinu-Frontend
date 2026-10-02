import { useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import { QuestionEditor } from "./QuestionEditor";
import type { Question, Topic } from "./types";

const TYPE_LABEL = { escolha: "Escolha múltipla", vf: "Verdadeiro ou falso", numerico: "Numérica" } as const;
const DIFFICULTY_LABEL = { 1: "Fácil", 2: "Média", 3: "Difícil" } as const;

const emptyQuestion = (): Question => ({
  id: "nova",
  type: "escolha",
  stem: "",
  options: [
    { id: "a", label: "A", text: "", explanation: "" },
    { id: "b", label: "B", text: "", explanation: "" },
    { id: "c", label: "C", text: "", explanation: "" },
  ],
  correctOptionId: "a",
  topicIds: [],
  declaredDifficulty: 2,
  estimatedSeconds: 60,
  usedIn: 0,
  updatedAt: new Date().toISOString(),
});

type QuestionBankScreenProps = { questions: Question[]; topics: Topic[]; creatorName: string; subjectName: string };

/** Banco de questões: a entidade que o artigo, o simulado e o caderno de erros partilham. */
export default function QuestionBankScreen({ questions: initial, topics, creatorName, subjectName }: QuestionBankScreenProps) {
  const [questions, setQuestions] = useState(initial);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("todos");
  const [type, setType] = useState("todos");
  const [editing, setEditing] = useState<Question | null>(null);
  const toast = useToast();

  const withTopic = questions.filter((q) => q.topicIds.length > 0).length;
  const withExplanations = questions.filter((q) => q.options.every((o) => o.explanation.trim().length >= 10)).length;
  const reused = questions.filter((q) => q.usedIn > 1).length;
  const needsReview = questions.filter((q) => q.observed && q.observed.accuracy < 45).length;

  const shown = useMemo(() => {
    const q = normalize(query.trim());
    return questions.filter(
      (item) =>
        (topic === "todos" || item.topicIds.includes(topic)) &&
        (type === "todos" || item.type === type) &&
        (!q || normalize(`${item.stem} ${item.options.map((o) => o.text).join(" ")}`).includes(q)),
    );
  }, [questions, query, topic, type]);

  function save(next: Question) {
    setQuestions((prev) => {
      if (next.id === "nova") {
        const id = `q-${String(prev.length + 1).padStart(3, "0")}`;
        return [{ ...next, id, updatedAt: new Date().toISOString() }, ...prev];
      }
      return prev.map((q) => (q.id === next.id ? { ...next, updatedAt: new Date().toISOString() } : q));
    });
    setEditing(null);
    toast.show(next.id === "nova" ? "Questão criada no banco." : "Questão atualizada.");
  }

  return (
    <CreatorShell
      active="materiais"
      creatorName={creatorName}
      actions={
        <>
          <Button3D variant="ghost" onClick={() => (window.location.assign("/v2/estudio/calibracao"))} leadingIcon={<Icon name="chart" size={18} />}>
            Calibração
          </Button3D>
          <Button3D variant="ghost" onClick={() => (window.location.assign("/v2/estudio/importar"))} leadingIcon={<Icon name="download" size={18} />}>
            Importar
          </Button3D>
          <Button3D onClick={() => setEditing(emptyQuestion())} leadingIcon={<Icon name="plus" size={18} />}>
            Nova questão
          </Button3D>
        </>
      }
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-primary uppercase">{subjectName}</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Banco de questões
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            As mesmas questões alimentam os checkpoints dos artigos, os simulados e o caderno de erros dos estudantes.
          </p>
        </header>

        <section aria-label="Saúde do banco" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: "total", label: "Questões no banco", value: String(questions.length), note: `${reused} usadas em mais de um material`, tone: "text-on-surface" },
            {
              id: "topico",
              label: "Com tópico atribuído",
              value: `${Math.round((withTopic / questions.length) * 100)}%`,
              note: withTopic === questions.length ? "Todas prontas para a trilha mista" : `${questions.length - withTopic} por classificar`,
              tone: withTopic === questions.length ? "text-feedback-success-ink" : "text-feedback-streak-ink",
            },
            {
              id: "explica",
              label: "Com explicação por alternativa",
              value: `${Math.round((withExplanations / questions.length) * 100)}%`,
              note: "É o que o estudante vê quando erra",
              tone: "text-primary",
            },
            {
              id: "rever",
              label: "A precisar de revisão",
              value: String(needsReview),
              note: "Abaixo de 45% de acerto observado",
              tone: needsReview > 0 ? "text-feedback-error-ink" : "text-feedback-success-ink",
            },
          ].map((tile) => (
            <article key={tile.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
              <p className="text-overline text-text-tertiary uppercase">{tile.label}</p>
              <p className={cn("mt-1.5 font-montserrat text-headline-h1-mobile font-extrabold tabular-nums", tile.tone)}>
                {tile.value}
              </p>
              <p className="mt-1 text-caption text-text-secondary tabular-nums">{tile.note}</p>
            </article>
          ))}
        </section>

        <section className="mb-5 flex flex-col gap-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 lg:flex-row lg:items-end">
          <div className="relative flex-1">
            <label htmlFor="bank-search" className="mb-2 block text-body-md font-bold text-on-surface">
              Procurar no banco
            </label>
            <Icon name="search" size={20} className="pointer-events-none absolute bottom-3.5 left-3 text-text-tertiary" />
            <input
              id="bank-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enunciado ou alternativa"
              className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-4 pl-10 text-body-md text-on-surface"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              id="bank-topic"
              label="Tópico"
              options={[{ value: "todos", label: "Todos os tópicos" }, ...topics.map((t) => ({ value: t.id, label: t.name }))]}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <SelectField
              id="bank-type"
              label="Tipo de item"
              options={[
                { value: "todos", label: "Todos os tipos" },
                { value: "escolha", label: "Escolha múltipla" },
                { value: "vf", label: "Verdadeiro ou falso" },
                { value: "numerico", label: "Numérica" },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
        </section>

        <p role="status" className="mb-3 text-caption text-text-secondary tabular-nums">
          {shown.length} de {questions.length} questões
        </p>

        <TableScroll label="Tabela do banco de questões">
          <table className={cn(table, "min-w-[980px]")}>
            <caption className="sr-only">Questões disponíveis no banco</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Enunciado</th>
                <th scope="col" className={th}>Tópico</th>
                <th scope="col" className={th}>Tipo</th>
                <th scope="col" className={cn(th, "text-right")}>Acerto observado</th>
                <th scope="col" className={cn(th, "text-right")}>Usada em</th>
                <th scope="col" className={cn(th, "text-right")}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((question) => {
                const needsFix = question.observed && question.observed.accuracy < 45;
                const missingExplanation = question.options.some((o) => o.explanation.trim().length < 10);
                return (
                  <tr key={question.id} className={tr}>
                    <th scope="row" className={cn(td, "min-w-[320px] font-normal")}>
                      <span className="block font-bold text-on-surface">{question.stem}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-caption text-text-tertiary tabular-nums">
                        <span>{question.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{DIFFICULTY_LABEL[question.declaredDifficulty]}</span>
                        <span aria-hidden="true">·</span>
                        <span>{question.estimatedSeconds}s</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatActivityTime(question.updatedAt)}</span>
                        {missingExplanation && (
                          <span className="flex items-center gap-1 font-bold text-feedback-streak-ink">
                            <Icon name="alert" size={13} />
                            Explicação por preencher
                          </span>
                        )}
                      </span>
                    </th>
                    <td className={td}>
                      <span className="flex flex-wrap gap-1">
                        {question.topicIds.length === 0 ? (
                          <span className="rounded-md border-2 border-feedback-error bg-surface-canvas px-2 py-0.5 text-caption font-bold text-feedback-error-ink">
                            Sem tópico
                          </span>
                        ) : (
                          question.topicIds.map((id) => (
                            <span key={id} className="rounded-md bg-surface-soft px-2 py-0.5 text-caption text-text-secondary">
                              {topics.find((t) => t.id === id)?.name ?? id}
                            </span>
                          ))
                        )}
                      </span>
                    </td>
                    <td className={cn(td, "whitespace-nowrap text-text-secondary")}>{TYPE_LABEL[question.type]}</td>
                    <td className={cn(td, "text-right whitespace-nowrap tabular-nums")}>
                      {question.observed ? (
                        <>
                          <span className={cn("font-bold", needsFix ? "text-feedback-error-ink" : "text-on-surface")}>
                            {question.observed.accuracy}%
                          </span>
                          <span className="block text-caption text-text-tertiary">{question.observed.answers} respostas</span>
                        </>
                      ) : (
                        <span className="text-caption text-text-tertiary">Ainda sem dados</span>
                      )}
                    </td>
                    <td className={cn(td, "text-right tabular-nums")}>
                      {question.usedIn === 0 ? <span className="text-text-tertiary">—</span> : `${question.usedIn} materiais`}
                    </td>
                    <td className={cn(td, "text-right")}>
                      <Button3D variant={needsFix ? "primary" : "ghost"} onClick={() => setEditing(question)}>
                        {needsFix ? "Rever" : "Editar"}
                        <span className="sr-only">: {question.stem}</span>
                      </Button3D>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableScroll>

        {shown.length === 0 && (
          <div className="mt-6 rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">
              {questions.length === 0 ? "O banco está vazio" : "Nenhuma questão com estes filtros"}
            </p>
            <p className="mt-1 text-body-md text-text-secondary">
              {questions.length === 0
                ? "Cria a primeira questão ou importa uma prova antiga em Word ou Excel."
                : "Tenta outro tópico ou limpa a pesquisa."}
            </p>
            {questions.length === 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button3D onClick={() => setEditing(emptyQuestion())}>Criar questão</Button3D>
                <Button3D variant="ghost" onClick={() => (window.location.assign("/v2/estudio/importar"))}>
                  Importar ficheiro
                </Button3D>
              </div>
            )}
          </div>
        )}
      </div>

      {editing && <QuestionEditor question={editing} topics={topics} onClose={() => setEditing(null)} onSave={save} />}
    </CreatorShell>
  );
}
