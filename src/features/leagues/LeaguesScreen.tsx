import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { Icon } from "../../components/ui/Icon";
import { Segmented } from "../../components/ui/Segmented";
import { useCountdown } from "../../hooks/useCountdown";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { LeagueScope, LeagueSeason } from "./types";

const SCOPES = [
  { value: "faculdade", label: "A minha faculdade" },
  { value: "luanda", label: "Luanda" },
  { value: "angola", label: "Todo o país" },
] as const;

const MEDALS = ["bg-secondary-container text-surface-ink", "bg-surface-container-highest text-on-surface", "bg-secondary-fixed text-on-secondary-fixed-variant"];

type LeaguesScreenProps = { league: LeagueSeason; userName: string };

/** Ligas universitárias: tabela semanal com zonas de promoção e despromoção. */
export default function LeaguesScreen({ league, userName }: LeaguesScreenProps) {
  const [scope, setScope] = useState<LeagueScope>("faculdade");
  const countdown = useCountdown(league.endsAt);

  const lastRank = league.entries.length;
  const relegationFrom = lastRank - league.relegationSlots + 1;

  return (
    <AppShell active="ligas" userName={userName} campus={league.campus}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6 md:flex-row md:items-end">
          <div>
            <p className="flex flex-wrap items-center gap-2 text-overline text-text-tertiary uppercase">
              {league.season} · semana {league.week}
              <span className="flex items-center gap-1 text-feedback-streak-ink">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-feedback-streak" />
                Ao vivo
              </span>
            </p>
            <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
              Ligas universitárias
            </h1>
            <p className="mt-1 text-body-md text-text-secondary">
              Competição semanal entre faculdades, por consistência de estudo e prática.
            </p>
          </div>

          <p className="flex shrink-0 items-center gap-2 self-start rounded-full bg-secondary-fixed px-4 py-2 md:self-auto">
            <Icon name="clock" size={18} className="text-on-secondary-fixed-variant" />
            <span className="text-caption text-on-secondary-fixed-variant uppercase">Termina em</span>
            <strong className="text-body-md text-on-secondary-fixed-variant tabular-nums" aria-hidden="true">
              {countdown.compact}
            </strong>
            <span className="sr-only">{countdown.spoken}</span>
          </p>
        </header>

        <section aria-labelledby="division-title" className="rounded-3xl bg-brand-ocean p-5 text-white sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary-container text-surface-ink">
                <Icon name="trophy" size={34} />
              </span>
              <div>
                <p className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary-fixed px-2.5 py-0.5 text-overline text-on-secondary-fixed-variant uppercase">
                    {league.division}
                  </span>
                  <span className="text-caption text-white">{league.campus}</span>
                </p>
                <h2 id="division-title" className="mt-2 font-montserrat text-headline-h3 font-extrabold">
                  Os {league.promotionSlots} primeiros sobem para a Divisão Diamante
                </h2>
                <p className="mt-1 text-caption text-white">
                  Os {league.relegationSlots} últimos descem. Mantém a ofensiva diária para acumular XP.
                </p>
              </div>
            </div>

            <dl className="flex gap-3">
              <div className="flex-1 rounded-xl bg-white/10 px-4 py-2 text-center">
                <dt className="text-caption text-white">Na liga</dt>
                <dd className="font-montserrat text-headline-h3 font-extrabold tabular-nums">
                  {formatInt(league.totalStudents)}
                </dd>
              </div>
              <div className="flex-1 rounded-xl bg-white/10 px-4 py-2 text-center">
                <dt className="text-caption text-white">Sobem</dt>
                <dd className="font-montserrat text-headline-h3 font-extrabold text-secondary-fixed tabular-nums">
                  Top {league.promotionSlots}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented label="Âmbito do ranking" options={SCOPES} value={scope} onChange={(value) => setScope(value)} />
          <p className="flex items-center gap-1.5 text-caption text-text-tertiary">
            <Icon name="refresh" size={16} />
            Atualizado a cada hora
          </p>
        </div>

        <section aria-labelledby="table-title">
          <h2 id="table-title" className="sr-only">
            Classificação
          </h2>
          <p className="mb-2 flex items-center gap-2 rounded-lg border-2 border-feedback-success bg-surface-canvas px-4 py-2 text-overline text-feedback-success-ink uppercase">
            <Icon name="trend-up" size={16} />
            Zona de promoção — top {league.promotionSlots}
          </p>

          <ol className="flex flex-col gap-2">
            {league.entries.map((entry) => {
              const promoted = entry.rank <= league.promotionSlots;
              const relegated = entry.rank >= relegationFrom;
              return (
                <li key={entry.rank}>
                  {entry.rank === relegationFrom && (
                    <p className="mb-2 flex items-center gap-2 rounded-lg border-2 border-feedback-error bg-surface-canvas px-4 py-2 text-overline text-feedback-error-ink uppercase">
                      <Icon name="alert" size={16} />
                      Zona de despromoção — últimos {league.relegationSlots}
                    </p>
                  )}
                  <article
                    aria-current={entry.isYou ? "true" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-2xl border-2 p-3 sm:p-4",
                      entry.isYou
                        ? "border-brand-ocean bg-surface-sky shadow-[inset_0_0_0_1px_var(--color-brand-ocean)]"
                        : "border-border-cloud bg-surface-canvas",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full text-body-md font-bold tabular-nums",
                          entry.rank <= 3 ? MEDALS[entry.rank - 1] : "bg-surface-soft text-text-secondary",
                        )}
                      >
                        {entry.rank}
                        <span className="sr-only">.º lugar</span>
                      </span>
                      <Avatar name={entry.name} />
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className={cn("text-body-lg font-bold", entry.isYou ? "text-primary" : "text-on-surface")}>
                            {entry.isYou ? `${entry.name} (tu)` : entry.name}
                          </span>
                          <span className="rounded-full bg-surface-soft px-2 py-0.5 text-overline text-text-secondary uppercase">
                            {entry.university}
                          </span>
                        </p>
                        <p className="truncate text-caption text-text-tertiary">{entry.course}</p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                      <p className="hidden items-center gap-1 rounded-full border-2 border-border-cloud bg-surface-canvas px-3 py-1 text-caption font-bold text-feedback-streak-ink tabular-nums sm:flex">
                        <Icon name="flame" size={16} />
                        {entry.streakDays} dias
                      </p>
                      <p className="text-right">
                        <span className="block font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                          {formatInt(entry.xp)}
                        </span>
                        <span className="block text-overline text-text-tertiary uppercase">XP</span>
                      </p>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full",
                          promoted && "bg-feedback-success-soft text-feedback-success-ink",
                          relegated && "bg-feedback-error-soft text-feedback-error-ink",
                          !promoted && !relegated && "text-text-disabled",
                        )}
                      >
                        <Icon name={promoted ? "trend-up" : relegated ? "alert" : "minus"} size={16} />
                      </span>
                      <span className="sr-only">
                        {promoted ? "em zona de promoção" : relegated ? "em zona de despromoção" : "em zona neutra"}
                      </span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}
