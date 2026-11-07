import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { QaBoard, QaThread } from "./types";

type Filter = "todas" | "oficiais" | "minhas" | "sem-resposta";

const MIN_LENGTH = 15;

type MaterialQaScreenProps = { board: QaBoard; userName: string };

/** Dúvidas ancoradas a um módulo do material, com resposta oficial do criador. */
export default function MaterialQaScreen({ board, userName }: MaterialQaScreenProps) {
  const [threads, setThreads] = useState(board.threads);
  const [filter, setFilter] = useState<Filter>("todas");
  const [anchor, setAnchor] = useState(board.anchors[board.anchors.length - 2]?.value ?? board.anchors[0].value);
  const [question, setQuestion] = useState("");
  const [voted, setVoted] = useState<string[]>([]);
  const toast = useToast();

  const counts = useMemo(
    () => ({
      todas: threads.length,
      oficiais: threads.filter((t) => t.answers.some((a) => a.official)).length,
      minhas: threads.filter((t) => t.mine).length,
      "sem-resposta": threads.filter((t) => t.answers.length === 0).length,
    }),
    [threads],
  );

  const shown = threads.filter((t) =>
    filter === "todas"
      ? true
      : filter === "oficiais"
        ? t.answers.some((a) => a.official)
        : filter === "minhas"
          ? t.mine
          : t.answers.length === 0,
  );

  const TABS: ReadonlyArray<{ value: Filter; label: string }> = [
    { value: "todas", label: "Todas" },
    { value: "oficiais", label: "Com resposta do criador" },
    { value: "sem-resposta", label: "Sem resposta" },
    { value: "minhas", label: "As minhas" },
  ];

  function publish() {
    const trimmed = question.trim();
    if (trimmed.length < MIN_LENGTH) return;
    const anchorLabel = board.anchors.find((a) => a.value === anchor)?.label.split("—")[0].trim() ?? "";
    const thread: QaThread = {
      id: `local-${Date.now()}`,
      author: { name: userName, year: "2.º ano" },
      anchorId: anchor,
      anchorLabel,
      question: trimmed,
      at: new Date().toISOString(),
      helpful: 0,
      mine: true,
      answers: [],
    };
    setThreads((prev) => [thread, ...prev]);
    setQuestion("");
    toast.show("Dúvida publicada. O criador costuma responder em poucas horas.");
  }

  function toggleHelpful(id: string) {
    const already = voted.includes(id);
    setVoted((prev) => (already ? prev.filter((v) => v !== id) : [...prev, id]));
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, helpful: t.helpful + (already ? -1 : 1) } : t)));
  }

  return (
    <AppShell active="trilhas" userName={userName} campus={board.subject}>
      <div className="mx-auto max-w-[880px] px-4 py-6 md:px-6 lg:py-8">
        <a
          href={board.readingHref}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
        >
          <Icon name="arrow-left" size={16} />
          Voltar à leitura
        </a>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Discussão · {board.subject}</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            Dúvidas sobre {board.materialTitle}
          </h1>
          <p className="mt-1 text-body-md text-text-secondary tabular-nums">
            {counts.todas} dúvidas, {counts.oficiais} com resposta oficial do criador.
          </p>
        </header>

        <form
          className="mb-7 rounded-3xl border-2 border-border-cloud bg-surface-soft p-5"
          onSubmit={(e) => {
            e.preventDefault();
            publish();
          }}
        >
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-3 flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
              <Icon name="comment" size={20} className="text-primary" />
              Ficaste com alguma dúvida?
            </legend>

            <div className="mb-3.5">
              <SelectField
                id="qa-anchor"
                label="A que parte do material se refere"
                options={board.anchors}
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
              />
            </div>

            <label htmlFor="qa-question" className="sr-only">
              Descreve a tua dúvida
            </label>
            <textarea
              id="qa-question"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              aria-describedby="qa-hint"
              placeholder="Explica onde te perdeste. Quanto mais concreta for a dúvida, mais rápida é a resposta."
              className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3.5 text-body-md text-on-surface"
            />

            <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p id="qa-hint" className="flex items-center gap-1.5 text-caption text-text-secondary tabular-nums">
                <Icon name="clock" size={15} className="text-feedback-streak-ink" />
                Os criadores respondem, em média, em menos de {board.averageAnswerHours} horas.
              </p>
              <Button3D
                type="submit"
                disabled={question.trim().length < MIN_LENGTH}
                className="w-full sm:w-auto"
                trailingIcon={<Icon name="arrow-right" size={18} />}
              >
                Publicar dúvida
              </Button3D>
            </div>
          </fieldset>
        </form>

        <div role="group" aria-label="Filtrar dúvidas" className="mb-6 flex gap-2 overflow-x-auto pb-1">
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

        {shown.length === 0 ? (
          <p className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center text-body-md text-text-secondary">
            Nada aqui, por agora.
          </p>
        ) : (
          <ol className="flex flex-col gap-5">
            {shown.map((thread) => {
              const official = thread.answers.find((a) => a.official);
              const others = thread.answers.filter((a) => !a.official);
              const hasVoted = voted.includes(thread.id);
              return (
                <li key={thread.id}>
                  <article className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-elevation-1">
                    <header className="flex flex-wrap items-start justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <Avatar name={thread.author.name} />
                        <span>
                          <span className="block text-body-md font-bold text-on-surface">
                            {thread.author.name}
                            {thread.mine && <span className="ml-1 font-normal text-text-secondary">(tu)</span>}
                          </span>
                          <span className="block text-caption text-text-tertiary">
                            {thread.author.year} · {formatActivityTime(thread.at)}
                          </span>
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sky px-3 py-1 text-caption font-bold text-primary">
                        <Icon name="book" size={14} />
                        {thread.anchorLabel}
                      </span>
                    </header>

                    <h2 className="mt-3 font-montserrat text-headline-h3 font-extrabold text-balance text-on-surface">
                      {thread.question}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        aria-pressed={hasVoted}
                        onClick={() => toggleHelpful(thread.id)}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-3 text-caption font-bold transition-[border-color,background-color,color] duration-150",
                          hasVoted
                            ? "border-brand-ocean bg-surface-sky text-primary"
                            : "border-border-cloud text-text-secondary hover:border-brand-ocean hover:text-primary",
                        )}
                      >
                        <Icon name="trend-up" size={15} />
                        Tenho a mesma dúvida ({thread.helpful})
                      </button>
                      <span className="flex items-center gap-1.5 text-caption text-text-secondary tabular-nums">
                        <Icon name="comment" size={15} />
                        {thread.answers.length === 0
                          ? "Sem respostas"
                          : `${thread.answers.length} ${thread.answers.length === 1 ? "resposta" : "respostas"}`}
                      </span>
                    </div>

                    {official && (
                      <div className="mt-4 rounded-2xl border-2 border-feedback-success bg-surface-canvas p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border-cloud pb-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-feedback-success px-2.5 py-0.5 text-overline text-surface-ink uppercase">
                            <Icon name="check" size={14} strokeWidth={3} />
                            Resposta do criador
                          </span>
                          <span className="text-caption text-text-secondary">{formatActivityTime(official.at)}</span>
                        </div>

                        <p className="mt-3 flex items-center gap-2.5">
                          <Avatar name={official.author.name} size="sm" />
                          <span className="text-caption">
                            <span className="flex items-center gap-1 font-bold text-on-surface">
                              {official.author.name}
                              {official.author.verified && (
                                <>
                                  <Icon name="seal" size={14} className="text-brand-sky-ink" />
                                  <span className="sr-only">criador verificado</span>
                                </>
                              )}
                            </span>
                            <span className="block text-text-tertiary">{official.author.role}</span>
                          </span>
                        </p>

                        <p className="mt-2.5 text-body-md leading-relaxed text-on-surface">{official.body}</p>
                        <p className="mt-2 text-caption text-text-tertiary tabular-nums">
                          {official.helpful} estudantes acharam útil
                        </p>
                      </div>
                    )}

                    {others.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-3 border-l-4 border-border-cloud pl-4">
                        {others.map((answer) => (
                          <li key={answer.id}>
                            <p className="flex items-center gap-2 text-caption">
                              <Avatar name={answer.author.name} size="sm" />
                              <span>
                                <span className="block font-bold text-on-surface">{answer.author.name}</span>
                                <span className="block text-text-tertiary">
                                  {answer.author.role} · {formatActivityTime(answer.at)}
                                </span>
                              </span>
                            </p>
                            <p className="mt-1.5 text-body-md text-text-secondary">{answer.body}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {thread.answers.length === 0 && (
                      <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-soft p-3 text-caption text-text-secondary">
                        <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
                        Ainda sem resposta. Se souberes explicar, ajuda o colega.
                      </p>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </AppShell>
  );
}
