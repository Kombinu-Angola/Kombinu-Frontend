import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import { REVIEW_INTERVALS, type ReviewBucket, type ReviewQueue } from "./types";

const BUCKETS: ReadonlyArray<{ value: ReviewBucket; label: string }> = [
  { value: "hoje", label: "Prontas hoje" },
  { value: "3dias", label: "Daqui a 3 dias" },
  { value: "7dias", label: "Daqui a 7 dias" },
  { value: "dominadas", label: "Já dominadas" },
];

type ReviewNotebookScreenProps = { queue: ReviewQueue; userName: string; onStartSession?: () => void };

/** Caderno de erros: as perguntas falhadas voltam em intervalos crescentes. */
export default function ReviewNotebookScreen({ queue, userName, onStartSession }: ReviewNotebookScreenProps) {
  const [bucket, setBucket] = useState<ReviewBucket>("hoje");
  const toast = useToast();

  const counts = useMemo(() => {
    const base: Record<ReviewBucket, number> = { hoje: 0, "3dias": 0, "7dias": 0, dominadas: queue.masteredCount };
    for (const item of queue.items) base[item.bucket] += 1;
    return base;
  }, [queue]);

  const today = queue.items.filter((i) => i.bucket === "hoje");
  const shown = queue.items.filter((i) => i.bucket === bucket);
  const total = counts.hoje + counts["3dias"] + counts["7dias"] + counts.dominadas;

  // O XP da sessão sai das perguntas da fila, com o multiplicador aplicado uma só vez.
  const sessionXp = today.reduce((sum, item) => sum + item.xp, 0) * queue.multiplier;

  const bySubject = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of today) map.set(item.subject, (map.get(item.subject) ?? 0) + 1);
    return [...map.entries()].map(([subject, n]) => `${n} de ${subject}`).join(" · ");
  }, [today]);

  return (
    <AppShell active="trilhas" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[920px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Revisão espaçada</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Caderno de erros
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            As perguntas que falhaste voltam em intervalos crescentes, de {REVIEW_INTERVALS.join(", ")} dias, até
            ficarem fixadas.
          </p>
        </header>

        <section
          aria-labelledby="queue-title"
          className="mb-8 rounded-3xl border-2 border-feedback-gem bg-surface-canvas p-5 shadow-clay sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="queue-title" className="flex items-center gap-2.5 text-headline-h3 text-on-surface">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-feedback-gem/20 text-feedback-gem-ink">
                <Icon name="bolt" size={22} />
              </span>
              Fila de revisão de hoje
            </h2>
            {queue.multiplier > 1 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed px-3 py-1.5 text-caption font-bold text-on-secondary-fixed-variant tabular-nums">
                <Icon name="bolt" size={15} />
                XP a {queue.multiplier}× na revisão
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-montserrat text-display-l font-extrabold text-feedback-gem-ink tabular-nums">
                {counts.hoje} {counts.hoje === 1 ? "pergunta" : "perguntas"}
              </p>
              <p className="text-body-md text-text-secondary">{bySubject || "Nada para rever hoje."}</p>
            </div>
            <p className="rounded-xl bg-surface-soft p-3 text-caption text-text-secondary tabular-nums">
              Sessão de cerca de {queue.sessionMinutes} minutos.
              <br />
              Rever agora vale mais do que reler a matéria toda.
            </p>
          </div>

          <Button3D
            size="lg"
            fullWidth
            className="mt-5"
            disabled={counts.hoje === 0}
            onClick={onStartSession}
            trailingIcon={<Icon name="arrow-right" size={20} />}
          >
            Iniciar revisão ({queue.sessionMinutes} min · +{sessionXp} XP)
          </Button3D>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-overline text-text-tertiary uppercase">Calendário de repetições</h2>
          <p className="text-caption text-text-tertiary tabular-nums">{total} perguntas no caderno</p>
        </div>

        <div role="group" aria-label="Filtrar por intervalo" className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {BUCKETS.map((b) => {
            const active = bucket === b.value;
            return (
              <button
                key={b.value}
                type="button"
                aria-pressed={active}
                onClick={() => setBucket(b.value)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color] duration-150",
                  active
                    ? "border-brand-ocean bg-brand-ocean text-white"
                    : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
                )}
              >
                {b.label}
                <span className="ml-1.5 tabular-nums">({counts[b.value]})</span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center text-body-md text-text-secondary">
            {bucket === "dominadas"
              ? `${counts.dominadas} perguntas já dominadas. Voltam a aparecer daqui a ${REVIEW_INTERVALS[3]} dias, para confirmar.`
              : "Nada neste intervalo."}
          </p>
        ) : (
          <ul className="flex flex-col gap-5">
            {shown.map((item) => {
              const nextInterval = REVIEW_INTERVALS[Math.min(item.level, REVIEW_INTERVALS.length - 1)];
              return (
                <li key={item.id}>
                  <article className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-elevation-1 sm:p-6">
                    <header className="flex flex-wrap items-center justify-between gap-2">
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary-fixed px-2.5 py-1 text-overline text-on-primary-fixed uppercase">
                          {item.university} · {item.subject}
                        </span>
                        <span className="text-caption text-text-tertiary">{item.topic}</span>
                      </p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md border-2 bg-surface-canvas px-2.5 py-1 text-caption font-bold tabular-nums",
                          item.attempts > 1
                            ? "border-feedback-error text-feedback-error-ink"
                            : "border-feedback-streak text-feedback-streak-ink",
                        )}
                      >
                        <Icon name="alert" size={14} />
                        {item.attempts === 1 ? "Falhada" : `Falhada ${item.attempts} vezes`} · há{" "}
                        {item.lastMissedDaysAgo} dias
                      </span>
                    </header>

                    <h3 className="mt-3 font-montserrat text-headline-h3 leading-snug font-extrabold text-balance text-on-surface">
                      {item.question}
                    </h3>

                    <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-surface-soft p-4">
                      <p className="flex items-start gap-2.5 rounded-xl border-2 border-feedback-error bg-surface-canvas p-3">
                        <Icon name="x" size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-error-ink" />
                        <span>
                          <span className="block text-overline text-feedback-error-ink uppercase">O que marcaste</span>
                          <span className="block text-body-md text-on-surface">{item.chosenAnswer}</span>
                        </span>
                      </p>

                      <p className="flex items-start gap-2.5 rounded-xl border-2 border-feedback-success bg-surface-canvas p-3">
                        <Icon name="check" size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                        <span>
                          <span className="block text-overline text-feedback-success-ink uppercase">Resposta certa</span>
                          <span className="block text-body-md font-bold text-on-surface">{item.correctAnswer}</span>
                        </span>
                      </p>

                      <p className="flex items-start gap-2.5 px-1 text-caption text-text-secondary">
                        <Icon name="lightbulb" size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>
                          <strong className="text-on-surface">Porquê:</strong> {item.rationale}
                        </span>
                      </p>
                    </div>

                    <footer className="mt-5 flex flex-col items-start justify-between gap-4 border-t-2 border-border-cloud pt-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="flex flex-wrap items-center gap-2 text-caption tabular-nums">
                          <span className="font-bold text-on-surface">
                            Fixação {item.level} de {REVIEW_INTERVALS.length}
                          </span>
                          <span className="rounded-full bg-surface-soft px-2 py-0.5 text-text-secondary">
                            Se acertares, volta daqui a {nextInterval} dias
                          </span>
                        </p>
                        <span
                          role="img"
                          aria-label={`Nível de fixação ${item.level} de ${REVIEW_INTERVALS.length}`}
                          className="mt-2 flex w-44 items-center gap-1.5"
                        >
                          {REVIEW_INTERVALS.map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "h-2 flex-1 rounded-full",
                                i < item.level ? "bg-feedback-gem" : "bg-border-cloud",
                              )}
                            />
                          ))}
                        </span>
                      </div>

                      <Button3D
                        onClick={() => toast.show("Sessão de treino desta pergunta em preparação.")}
                        leadingIcon={<Icon name="refresh" size={18} />}
                        className="w-full sm:w-auto"
                      >
                        Treinar agora (+{item.xp * queue.multiplier} XP)
                      </Button3D>
                    </footer>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
