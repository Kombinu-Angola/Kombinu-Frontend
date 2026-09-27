import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { LeaderboardRow } from "../../components/ui/LeaderboardRow";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useGamification } from "../../contexts/GamificationContext";
import { formatActivityTime, formatInt } from "../../lib/format";
import { levelInfo } from "../../lib/levels";
import { cn } from "@/lib/utils";
import type { StudyFeed, TrailTab } from "./types";

const TABS: ReadonlyArray<{ value: TrailTab; label: string }> = [
  { value: "aprendizado", label: "Trilhas de aprendizado" },
  { value: "mista", label: "Trilha mista" },
  { value: "biblioteca", label: "Biblioteca livre" },
];

type StudyFeedScreenProps = { feed: StudyFeed };

/** Feed de estudos: módulo em curso (efeito Zeigarnik), publicações recentes e painel do estudante. */
export default function StudyFeedScreen({ feed }: StudyFeedScreenProps) {
  const [tab, setTab] = useState<TrailTab>("aprendizado");
  const [saved, setSaved] = useState<string[]>([]);
  const { xp, streakDays, gems } = useGamification();
  const lvl = levelInfo(xp);

  const posts = useMemo(() => feed.posts.filter((p) => p.trail === tab), [feed.posts, tab]);
  const { active } = feed;
  const percent = Math.round((active.sectionsDone / active.sectionsTotal) * 100);

  return (
    <AppShell active="trilhas" userName={feed.student.name} campus={`${active.university} · ${feed.student.course}`}>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-8">
        <div className="min-w-0">
          <div role="tablist" aria-label="Tipo de trilha" className="mb-6 flex gap-2 overflow-x-auto border-b-2 border-border-cloud">
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "-mb-0.5 min-h-12 border-b-[3px] px-3 text-body-md whitespace-nowrap transition-[color,border-color] duration-150",
                  tab === t.value
                    ? "border-brand-ocean font-bold text-primary"
                    : "border-transparent text-text-secondary hover:text-on-surface",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Efeito Zeigarnik: o que ficou por acabar vem primeiro */}
          <section
            aria-labelledby="active-title"
            className="mb-8 rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-5 shadow-clay sm:p-7"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-md bg-surface-sky px-3 py-1 text-overline text-primary uppercase">
                Cadeira ativa: {active.subject} — {active.university}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed px-3 py-1 text-overline text-on-secondary-fixed-variant tabular-nums">
                <Icon name="bolt" size={14} />+{active.xp} XP
              </span>
            </div>

            <h1 id="active-title" className="font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
              {active.title}
            </h1>
            <p className="mt-2 text-body-md text-text-secondary">{active.summary}</p>

            <div className="mt-5">
              <p className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-body-md">
                <span className="text-text-secondary">
                  <strong className="text-on-surface tabular-nums">{percent}% concluído</strong> — falta 1 checkpoint para
                  fechar o artigo.
                </span>
                <span className="font-bold text-primary tabular-nums">
                  {active.sectionsDone}/{active.sectionsTotal} secções
                </span>
              </p>
              <ProgressBar
                value={active.sectionsDone}
                max={active.sectionsTotal}
                tone="ocean"
                label="Progresso do módulo em curso"
                valueText={`${active.sectionsDone} de ${active.sectionsTotal} secções`}
              />
            </div>

            <div className="mt-5 flex flex-col items-stretch justify-between gap-3 border-t-2 border-border-cloud pt-4 sm:flex-row sm:items-center">
              <p className="flex items-center gap-2 text-caption text-text-tertiary">
                <Icon name="seal" size={16} className="text-primary" />
                Revisto por {active.reviewedBy}
              </p>
              <LinkButton3D href={active.href} size="lg" trailingIcon={<Icon name="arrow-right" size={20} />}>
                Continuar leitura
              </LinkButton3D>
            </div>
          </section>

          <section aria-labelledby="posts-title">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="posts-title" className="font-montserrat text-headline-h2 text-on-surface">
                Módulos recentes
              </h2>
              <a href="#/marketplace" className="flex min-h-11 items-center gap-1 text-button text-primary uppercase hover:underline">
                Ver os {feed.totalModules}
                <Icon name="arrow-right" size={16} />
              </a>
            </div>

            {posts.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
                Ainda não há módulos nesta trilha.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {posts.map((post) => {
                  const isSaved = saved.includes(post.id);
                  return (
                    <li
                      key={post.id}
                      className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 transition-[border-color,box-shadow] duration-200 hover:border-brand-ocean hover:shadow-elevation-1"
                    >
                      <article>
                        <header className="mb-4 flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-3">
                            <Avatar name={post.author.name} />
                            <span className="min-w-0">
                              <span className="flex items-center gap-1.5 text-body-md font-bold text-on-surface">
                                {post.author.name}
                                <Icon
                                  name={post.author.badge === "verified" ? "seal" : "trophy"}
                                  size={15}
                                  className="text-primary"
                                />
                                <span className="sr-only">
                                  {post.author.badge === "verified" ? "autor verificado" : "monitor académico"}
                                </span>
                              </span>
                              <span className="block truncate text-caption text-text-tertiary">{post.author.role}</span>
                            </span>
                          </span>
                          <time dateTime={post.publishedAt} className="shrink-0 text-caption text-text-tertiary">
                            {formatActivityTime(post.publishedAt)}
                          </time>
                        </header>

                        <div className="flex flex-col gap-4 md:flex-row">
                          <div className="min-w-0 flex-1">
                            <h3 className="mb-1.5 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                              <a href={post.href} className="hover:text-primary">
                                {post.title}
                              </a>
                            </h3>
                            <p className="line-clamp-2 text-body-md text-text-secondary">{post.excerpt}</p>
                          </div>
                          <span className="flex h-28 w-full shrink-0 items-center justify-center rounded-2xl bg-surface-soft md:w-44">
                            <Asset3D name={post.cover} alt="" size={64} />
                          </span>
                        </div>

                        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-cloud pt-3">
                          <p className="flex flex-wrap items-center gap-2 text-caption text-text-secondary">
                            <span className="rounded-md bg-surface-soft px-2.5 py-1 font-bold tabular-nums">
                              {post.minutes} min de leitura
                            </span>
                            {post.hasQuiz && (
                              <span className="rounded-md bg-surface-sky px-2.5 py-1 font-bold text-primary">
                                Quiz incluído
                              </span>
                            )}
                            <span className="text-text-tertiary tabular-nums">
                              {formatInt(post.completions)} estudantes concluíram
                            </span>
                          </p>
                          <button
                            type="button"
                            aria-pressed={isSaved}
                            onClick={() =>
                              setSaved((prev) => (isSaved ? prev.filter((id) => id !== post.id) : [...prev, post.id]))
                            }
                            className={cn(
                              "flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button uppercase transition-[color,background-color] duration-150",
                              isSaved ? "bg-surface-sky text-primary" : "text-text-secondary hover:bg-surface-soft",
                            )}
                          >
                            <Icon name="book" size={18} />
                            {isSaved ? "Guardado" : "Guardar"}
                            <span className="sr-only"> para leitura offline: {post.title}</span>
                          </button>
                        </footer>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside aria-label="Painel do estudante" className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <section aria-labelledby="student-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
            <h2 id="student-title" className="sr-only">
              O teu progresso
            </h2>
            <div className="flex items-center gap-3.5">
              <span className="relative">
                <Avatar name={feed.student.name} size="lg" />
                <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-brand-ocean text-caption font-bold text-white tabular-nums">
                  <span className="sr-only">Nível </span>
                  {lvl.level}
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-montserrat text-headline-h3 font-extrabold text-on-surface">{feed.student.name}</p>
                <p className="text-caption font-bold text-primary">
                  Nível {lvl.level} — {lvl.title}
                </p>
                <p className="text-caption text-text-tertiary">
                  {feed.student.course} · {feed.student.year}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-1.5 flex justify-between text-caption font-bold">
                <span className="text-text-secondary">Próximo nível ({lvl.level + 1})</span>
                <span className="text-on-surface tabular-nums">
                  {lvl.inLevel} / {lvl.perLevel} XP
                </span>
              </p>
              <ProgressBar
                value={lvl.inLevel}
                max={lvl.perLevel}
                label={`Progresso para o nível ${lvl.level + 1}`}
                valueText={`${lvl.inLevel} de ${lvl.perLevel} XP`}
              />
              <p className="mt-1.5 text-right text-caption text-text-tertiary tabular-nums">
                Faltam {lvl.toNext} XP
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2.5 border-t-2 border-border-cloud pt-4">
              <div className="rounded-xl border-2 border-feedback-streak/40 bg-surface-canvas p-3">
                <dt className="text-caption text-text-secondary">Sequência</dt>
                <dd className="flex items-center gap-1 font-montserrat text-headline-h3 font-extrabold text-feedback-streak-ink tabular-nums">
                  <Icon name="flame" size={18} />
                  {streakDays} dias
                </dd>
              </div>
              <div className="rounded-xl border-2 border-feedback-gem/40 bg-surface-canvas p-3">
                <dt className="text-caption text-text-secondary">Gemas</dt>
                <dd className="flex items-center gap-1 font-montserrat text-headline-h3 font-extrabold text-feedback-gem-ink tabular-nums">
                  <Icon name="gem" size={18} />
                  {formatInt(gems)}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="data-title" className="rounded-3xl border-2 border-border-cloud bg-surface-soft p-5">
            <h2 id="data-title" className="mb-1 flex items-center gap-2 text-body-md font-bold text-on-surface">
              <Icon name="bolt" size={20} className="text-feedback-success-ink" />
              Economia de dados
            </h2>
            <p className="font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums">
              1,2 MB <span className="font-lato text-caption font-medium text-text-secondary">consumidos hoje</span>
            </p>
            <p className="mt-3 flex items-start gap-2 rounded-xl border-2 border-border-cloud bg-surface-canvas p-3 text-caption text-text-secondary">
              <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-primary" />
              Garantia Kombinu: menos de 5 MB por hora de estudo.
            </p>
          </section>

          <section aria-labelledby="league-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 id="league-title" className="flex items-center gap-1.5 text-body-md font-bold text-on-surface">
                <Icon name="trophy" size={20} className="text-brand-sunbeam-ink" />
                {feed.league.name}
              </h2>
              <span className="text-caption text-text-tertiary">{feed.league.campus}</span>
            </div>
            <ol className="flex flex-col gap-1">
              {feed.league.rows.map((row) => (
                <LeaderboardRow key={row.rank} {...row} xp={row.isYou ? xp : row.xp} compact />
              ))}
            </ol>
            <a href={feed.league.href} className="mt-2 flex min-h-11 items-center justify-center text-caption font-bold text-primary hover:underline">
              Ver a liga completa
            </a>
          </section>

          <section className="flex items-center justify-between gap-3 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-4">
            <p className="flex min-w-0 items-center gap-2.5">
              <Icon name="clock" size={22} className="shrink-0 text-primary" />
              <span>
                <span className="block text-body-md font-bold text-on-surface">{feed.exams.label}</span>
                <span className="block text-caption font-bold text-feedback-streak-ink tabular-nums">
                  Faltam {feed.exams.daysLeft} dias
                </span>
              </span>
            </p>
            <Button3D variant="ghost" onClick={() => undefined}>
              Calendário
            </Button3D>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
