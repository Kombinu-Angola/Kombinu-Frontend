import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { SectionCard } from "../../components/ui/SectionCard";
import { Icon } from "../../components/ui/Icon";
import { LeaderboardRow } from "../../components/ui/LeaderboardRow";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useGamification } from "../../contexts/GamificationContext";
import { formatActivityTime, formatInt } from "../../lib/format";
import { levelInfo } from "../../lib/levels";
import { cn } from "@/lib/utils";
import type { DashboardData } from "./types";

const SKILL_TONES = ["ocean", "streak", "gem"] as const;

function formatStudyTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m} min` : m === 0 ? `${h} h` : `${h} h ${m}`;
}

/** Painel do estudante: resumo, competências, atividade, retomar lição, missões e liga. */
export default function DashboardScreen({ data }: { data: DashboardData }) {
  const { xp, gems } = useGamification();
  const lvl = levelInfo(xp);
  const { stats } = data;

  return (
    <AppShell active="painel" userName={data.user.name} campus="UAN · Economia">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-4 py-8 md:px-6 lg:grid-cols-12 lg:gap-8 lg:py-12">
        <header className="border-b-2 border-border-cloud pb-4 lg:col-span-12">
          <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Olá, {data.user.firstName}
          </h1>
          <p className="mt-1 text-body-lg text-text-secondary">O teu progresso desta semana.</p>
        </header>

        {/* Perfil: no telemóvel aparece compacto no topo; no desktop fica fixo à esquerda */}
        <aside aria-label="O teu perfil" className="order-1 lg:order-none lg:col-span-3">
          <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay lg:sticky lg:top-28 lg:p-6">
            <div className="flex items-center gap-4 lg:flex-col lg:text-center">
              <span className="relative">
                <Avatar name={data.user.name} size="lg" />
                <span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full border-[3px] border-white bg-brand-ocean text-caption font-bold text-white tabular-nums">
                  <span className="sr-only">Nível </span>
                  {lvl.level}
                </span>
              </span>
              <div className="min-w-0 flex-1 lg:w-full">
                <p className="font-montserrat text-headline-h3 font-extrabold text-on-surface">{data.user.name}</p>
                <p className="mb-3 text-caption text-text-secondary">
                  {lvl.title} · {data.user.course}
                </p>
                <ProgressBar
                  value={lvl.inLevel}
                  max={lvl.perLevel}
                  label={`Progresso no nível ${lvl.level}`}
                  valueText={`${lvl.inLevel} de ${lvl.perLevel} XP`}
                />
                <p className="mt-2 text-caption text-text-tertiary tabular-nums">
                  <strong className="text-on-surface">{formatInt(xp)} XP</strong> · faltam {lvl.toNext} para o nível{" "}
                  {lvl.level + 1}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Telemóvel: retomar e missões antes das estatísticas; desktop: ordem das colunas */}
        <div className="order-3 flex flex-col gap-8 lg:order-none lg:col-span-6">

          <section aria-labelledby="stats-title">
            <h2 id="stats-title" className="sr-only">
              Resumo da semana
            </h2>
            <dl className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col justify-between gap-2 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                <dt className="text-overline text-text-tertiary uppercase">Taxa de acerto</dt>
                <dd className="flex flex-wrap items-end gap-x-2">
                  <span className="font-montserrat text-headline-h3 font-extrabold whitespace-nowrap text-primary tabular-nums sm:text-headline-h2 xl:text-headline-h1-mobile">
                    {stats.accuracy}%
                  </span>
                  <span className="mb-1 flex items-center gap-0.5 text-caption font-bold text-feedback-success-ink">
                    <Icon name="trend-up" size={16} />
                    <span className="sr-only">subiu</span>+{stats.accuracyDelta}
                  </span>
                </dd>
              </div>
              <div className="flex flex-col justify-between gap-2 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                <dt className="text-overline text-text-tertiary uppercase">Tempo de estudo</dt>
                <dd className="font-montserrat text-headline-h3 font-extrabold whitespace-nowrap text-feedback-streak-ink tabular-nums sm:text-headline-h2 xl:text-headline-h1-mobile">
                  {formatStudyTime(stats.studyMinutesWeek)}
                </dd>
              </div>
              <div className="flex flex-col justify-between gap-2 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                <dt className="text-overline text-text-tertiary uppercase">Lições feitas</dt>
                <dd className="font-montserrat text-headline-h3 font-extrabold whitespace-nowrap text-feedback-gem-ink tabular-nums sm:text-headline-h2 xl:text-headline-h1-mobile">
                  {stats.lessonsCompleted}
                </dd>
              </div>
            </dl>
          </section>

          <SectionCard title="Competências por cadeira">
            <ul className="flex flex-col gap-6">
              {data.skills.map((skill, i) => {
                const s = levelInfo(skill.xp);
                return (
                  <li key={skill.id}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <span className="text-body-lg font-bold text-on-surface">{skill.subject}</span>
                      <span className="shrink-0 text-caption text-text-secondary tabular-nums">
                        Nível {s.level} · {s.inLevel}/{s.perLevel} XP
                      </span>
                    </div>
                    <ProgressBar
                      value={s.inLevel}
                      max={s.perLevel}
                      tone={SKILL_TONES[i % SKILL_TONES.length]}
                      label={`${skill.subject}, nível ${s.level}`}
                      valueText={`${s.inLevel} de ${s.perLevel} XP`}
                    />
                  </li>
                );
              })}
            </ul>
          </SectionCard>

          <SectionCard title="Atividade recente">
            <ul className="-mx-2 flex flex-col">
              {data.activity.map((a) => (
                <li key={a.id}>
                  <a
                    href={a.href}
                    className="flex min-h-16 items-center gap-4 rounded-2xl p-2 transition-[background-color] duration-150 hover:bg-surface-soft"
                  >
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-full",
                        a.kind === "quiz" ? "bg-primary-fixed text-primary" : "bg-secondary-fixed text-on-secondary-fixed-variant",
                      )}
                    >
                      <Icon name={a.kind === "quiz" ? "target" : "book"} size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-md font-bold text-on-surface">{a.title}</span>
                      <span className="block text-caption text-text-secondary">{formatActivityTime(a.at)}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-body-md font-bold text-on-surface tabular-nums">
                        {a.score !== undefined ? `${a.score}%` : "Concluída"}
                      </span>
                      <span className="block text-caption font-bold text-feedback-success-ink tabular-nums">+{a.xp} XP</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="order-2 flex flex-col gap-6 lg:order-none lg:col-span-3">
          {/* Efeito Zeigarnik: a tarefa por acabar primeiro, com um só botão */}
          <SectionCard eyebrow="Continua de onde paraste" title={data.resume.title} className="border-brand-ocean">
            <p className="-mt-3 mb-4 text-caption text-text-secondary">{data.resume.module}</p>
            <ProgressBar
              value={data.resume.done}
              max={data.resume.total}
              size="sm"
              label="Progresso do módulo"
              valueText={`${data.resume.done} de ${data.resume.total} blocos`}
            />
            <p className="mt-2 mb-5 text-caption text-text-tertiary tabular-nums">
              {data.resume.done} de {data.resume.total} blocos
            </p>
            <LinkButton3D href={data.resume.href} fullWidth trailingIcon={<Icon name="arrow-right" size={18} />}>
              Retomar
            </LinkButton3D>
          </SectionCard>

          <SectionCard
            title="Missões diárias"
            action={
              <span className="flex items-center gap-1 text-caption font-bold text-feedback-gem-ink tabular-nums">
                <Icon name="gem" size={16} />
                <span className="sr-only">Tens </span>
                {formatInt(gems)}
                <span className="sr-only"> gemas</span>
              </span>
            }
          >
            <ul className="flex flex-col gap-5">
              {data.missions.map((m) => {
                const done = m.progress >= m.goal;
                return (
                  <li key={m.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full border-2",
                        done ? "border-feedback-success bg-feedback-success-soft text-feedback-success-ink" : "border-border-cloud bg-surface-soft text-text-tertiary",
                      )}
                    >
                      <Icon name={done ? "check" : m.icon} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1.5 block text-body-md font-bold text-on-surface">{m.title}</span>
                      <span className="flex items-center gap-2">
                      <ProgressBar
                        value={m.progress}
                        max={m.goal}
                        size="sm"
                        tone="streak"
                        label={m.title}
                        valueText={`${m.progress} de ${m.goal}`}
                      />
                      <span aria-hidden="true" className="text-caption text-text-tertiary tabular-nums">
                        {m.progress}/{m.goal}
                      </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-0.5 text-caption font-bold text-feedback-gem-ink">
                      <Icon name="gem" size={14} />+{m.gems}
                      <span className="sr-only"> gemas</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </SectionCard>

          <SectionCard
            title={data.league.name}
            action={
              <a href={data.league.href} className="flex min-h-11 items-center text-caption font-bold text-brand-sky-ink hover:underline">
                Ver tabela
              </a>
            }
          >
            <ol className="flex flex-col gap-1">
              {data.league.rows.map((row) => (
                <LeaderboardRow key={row.rank} {...row} xp={row.isYou ? xp : row.xp} compact />
              ))}
            </ol>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
