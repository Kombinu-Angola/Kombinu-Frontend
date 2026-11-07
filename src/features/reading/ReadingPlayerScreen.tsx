import { useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { DataSaverBadge } from "../../components/ui/DataSaverBadge";
import { Icon } from "../../components/ui/Icon";
import { Pill } from "../../components/ui/Pill";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "../content/BlockRenderer";
import { countCheckpoints, type Article } from "../content/blocks";
import { ArticleToc } from "./ArticleToc";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "short", year: "numeric" });

export type ReadingResult = { articleId: string; checkpointsCorrect: number; checkpointsTotal: number; xpEarned: number };

type ReadingPlayerScreenProps = {
  article: Article;
  onBack: () => void;
  onComplete: (result: ReadingResult) => void;
  onListen?: () => void;
  subscribed?: boolean;
  onToggleSubscribe?: (next: boolean) => void;
};

/** Leitor de artigos com índice, checkpoints e conclusão (ganho de XP). */
export default function ReadingPlayerScreen({
  article,
  onBack,
  onComplete,
  onListen,
  subscribed = false,
  onToggleSubscribe,
}: ReadingPlayerScreenProps) {
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; xp: number }>>({});
  const [isSubscribed, setIsSubscribed] = useState(subscribed);
  const [textSize, setTextSize] = useState(1);
  const total = countCheckpoints(article.blocks);
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter((a) => a.correct).length;
  const checkpointXp = Object.values(answers).reduce((sum, a) => (a.correct ? sum + a.xp : sum), 0);
  const ready = answered === total;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-brand-ocean px-4 py-2 text-button text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar para o artigo
      </a>

      <header className="sticky top-0 z-50 border-b-2 border-border-cloud bg-surface-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button text-primary transition-[background-color] duration-150 hover:bg-surface-soft"
            >
              <Icon name="arrow-left" size={20} />
              <span className="hidden sm:inline">Voltar à cadeira</span>
              <span className="sr-only sm:hidden">Voltar à cadeira</span>
            </button>
            <span aria-hidden="true" className="hidden h-8 w-0.5 bg-border-cloud md:block" />
            <p className="hidden min-w-0 items-center gap-2 md:flex">
              <Avatar name={article.author.name} size="sm" />
              <span className="truncate text-body-md font-bold text-on-surface">{article.author.role}</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span role="group" aria-label="Tamanho do texto" className="hidden items-center rounded-full border-2 border-border-cloud sm:flex">
              <button
                type="button"
                onClick={() => setTextSize((v) => Math.max(0, v - 1))}
                disabled={textSize === 0}
                aria-label="Diminuir o tamanho do texto"
                className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft disabled:text-text-disabled"
              >
                <span aria-hidden="true" className="text-caption font-bold">A−</span>
              </button>
              <button
                type="button"
                onClick={() => setTextSize((v) => Math.min(2, v + 1))}
                disabled={textSize === 2}
                aria-label="Aumentar o tamanho do texto"
                className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft disabled:text-text-disabled"
              >
                <span aria-hidden="true" className="text-body-lg font-bold">A+</span>
              </button>
            </span>

            {article.audioMinutes && (
              <button
                type="button"
                onClick={onListen}
                className="flex min-h-11 items-center gap-2 rounded-full border-2 border-border-cloud px-3 text-button text-primary transition-[background-color] duration-150 hover:bg-surface-soft"
              >
                <Icon name="play" size={18} />
                <span className="hidden sm:inline">Ouvir ({article.audioMinutes} min)</span>
                <span className="sr-only sm:hidden">Ouvir em áudio, {article.audioMinutes} minutos</span>
              </button>
            )}
            <Button3D
              variant={isSubscribed ? "secondary" : "primary"}
              aria-pressed={isSubscribed}
              onClick={() => {
                setIsSubscribed((v) => !v);
                onToggleSubscribe?.(!isSubscribed);
              }}
            >
              {isSubscribed ? "A seguir" : "Seguir"}
            </Button3D>
          </div>
        </div>
      </header>

      <main id="conteudo" className="mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-1 gap-8 px-4 py-8 md:px-6 lg:grid-cols-[220px_minmax(0,740px)] lg:py-12">
        <ArticleToc blocks={article.blocks} />

        <article className={cn("min-w-0", textSize === 1 && "text-[110%]", textSize === 2 && "text-[125%]")}>
          <header className="mb-8 border-b-2 border-border-cloud pb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Pill tone="sunbeam">{article.eyebrow}</Pill>
              <span className="text-caption text-text-tertiary">{article.minutes} min de leitura</span>
            </div>
            <h1 className="mb-5 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
              {article.title}
            </h1>
            <div className="flex items-center gap-3">
              <Avatar name={article.author.name} />
              <div>
                <p className="text-body-md font-bold text-on-surface">{article.author.name}</p>
                <p className="text-caption text-text-tertiary">
                  <time dateTime={article.publishedAt}>{dateFormat.format(new Date(article.publishedAt))}</time> ·{" "}
                  {article.author.role}
                </p>
              </div>
            </div>
          </header>

          <BlockRenderer
            blocks={article.blocks}
            onCheckpointAnswer={(id, isCorrect, xp) =>
              setAnswers((prev) => (prev[id] ? prev : { ...prev, [id]: { correct: isCorrect, xp } }))
            }
          />

          <footer className="mt-12 border-t-2 border-border-cloud pt-8 text-center">
            {total > 0 && (
              <p className={cn("mb-4 text-body-md", ready ? "text-feedback-success-ink" : "text-text-secondary")}>
                {ready ? (
                  <>
                    <Icon name="check" size={18} strokeWidth={3} className="mr-1 inline align-text-bottom" />
                    Checkpoints respondidos: {correct} de {total} certos.
                  </>
                ) : (
                  `Responde aos ${total} checkpoints do artigo para o marcares como lido (${answered} de ${total}).`
                )}
              </p>
            )}
            <Button3D
              size="lg"
              disabled={!ready}
              className="w-full sm:w-auto"
              leadingIcon={<Icon name="check" size={20} strokeWidth={3} />}
              onClick={() =>
                onComplete({
                  articleId: article.id,
                  checkpointsCorrect: correct,
                  checkpointsTotal: total,
                  xpEarned: article.completionXp + checkpointXp,
                })
              }
            >
              Marcar como lido (+{article.completionXp} XP)
            </Button3D>
          </footer>
        </article>
      </main>

      <div className="flex justify-center pb-8">
        <DataSaverBadge megabytesToday={1.2} />
      </div>
    </div>
  );
}
