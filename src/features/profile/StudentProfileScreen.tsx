import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import { useGamification } from "../../contexts/GamificationContext";
import { formatActivityTime, formatInt } from "../../lib/format";
import { levelInfo } from "../../lib/levels";
import { cn } from "@/lib/utils";
import type { ProfileTab, StudentProfile } from "./types";

const pct = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type StudentProfileScreenProps = { profile: StudentProfile; badgesHref: string };

/** PRF-01 — perfil académico e desempenho do estudante. */
export default function StudentProfileScreen({ profile, badgesHref }: StudentProfileScreenProps) {
  const [tab, setTab] = useState<ProfileTab>("cadeiras");
  const { xp, streakDays } = useGamification();
  const lvl = levelInfo(xp);
  const toast = useToast();

  const tabs: ReadonlyArray<{ value: ProfileTab; label: string; count?: number }> = [
    { value: "cadeiras", label: "Cadeiras em curso", count: profile.counts.cadeiras },
    { value: "sebentas", label: "Sebentas guardadas", count: profile.counts.sebentas },
    { value: "simulados", label: "Histórico de simulados" },
    { value: "badges", label: "Medalhas", count: profile.counts.badges },
  ];

  async function share() {
    const text = `O meu perfil na Kombinu: nível ${lvl.level}, ${pct.format(profile.accuracy)}% de acerto.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: profile.name, text });
        return;
      } catch {
        /* cancelado */
      }
    }
    await navigator.clipboard?.writeText(window.location.href);
    toast.show("Ligação do perfil copiada.");
  }

  return (
    <AppShell active="painel" userName={profile.name} campus={`${profile.course} · ${profile.year}`}>
      <div className="mx-auto max-w-[1240px] px-4 py-6 md:px-6 lg:py-8">
        <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-8">
          <header className="flex flex-col justify-between gap-6 border-b-2 border-border-cloud pb-8 md:flex-row md:items-start">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar name={profile.name} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
                    {profile.name}
                  </h1>
                  {profile.verified && (
                    <>
                      <Icon name="seal" size={22} className="text-brand-sky-ink" />
                      <span className="sr-only">perfil verificado</span>
                    </>
                  )}
                  {profile.plan === "pro" && (
                    <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-overline text-on-primary-fixed uppercase">
                      Plano Pro
                    </span>
                  )}
                </div>
                <p className="mt-1 text-body-md font-bold text-brand-sky-ink">
                  {profile.university} · {profile.course} ({profile.year})
                </p>
                <p className="mt-2 max-w-[620px] text-body-md text-text-secondary">{profile.bio}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Button3D variant="ghost" onClick={share} leadingIcon={<Icon name="share" size={18} />}>
                Partilhar perfil
              </Button3D>
              <Button3D onClick={() => toast.show("Edição de perfil em breve.")} leadingIcon={<Icon name="edit" size={18} />}>
                Editar perfil
              </Button3D>
            </div>
          </header>

          <section aria-labelledby="metrics-title" className="my-8">
            <h2 id="metrics-title" className="sr-only">
              Desempenho
            </h2>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-border-cloud bg-surface-soft p-5">
                <dt className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
                  Precisão global
                  <Icon name="target" size={20} className="text-feedback-success-ink" />
                </dt>
                <dd className="mt-3">
                  <span className="block font-montserrat text-headline-h1-mobile font-extrabold text-feedback-success-ink tabular-nums">
                    {pct.format(profile.accuracy)}%
                  </span>
                  <span className="block text-caption text-text-secondary tabular-nums">
                    Média em {formatInt(profile.answered)} questões resolvidas
                  </span>
                </dd>
              </div>

              <div className="rounded-2xl border-2 border-border-cloud bg-surface-soft p-5">
                <dt className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
                  Experiência
                  <Icon name="trophy" size={20} className="text-primary" />
                </dt>
                <dd className="mt-3">
                  <span className="block font-montserrat text-headline-h1-mobile font-extrabold text-primary">
                    Nível {lvl.level}
                  </span>
                  <span className="mb-2 block text-caption text-text-secondary tabular-nums">
                    {lvl.title} · {formatInt(xp)} XP
                  </span>
                  <ProgressBar
                    value={lvl.inLevel}
                    max={lvl.perLevel}
                    size="sm"
                    label={`Progresso para o nível ${lvl.level + 1}`}
                    valueText={`${lvl.inLevel} de ${lvl.perLevel} XP`}
                  />
                </dd>
              </div>

              <div className="rounded-2xl border-2 border-border-cloud bg-surface-soft p-5">
                <dt className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
                  Sequência ativa
                  <Icon name="flame" size={20} className="text-feedback-streak-ink" />
                </dt>
                <dd className="mt-3">
                  <span className="block font-montserrat text-headline-h1-mobile font-extrabold text-feedback-streak-ink tabular-nums">
                    {streakDays} dias
                  </span>
                  <span className="block text-caption text-text-secondary">{profile.league}</span>
                </dd>
              </div>
            </dl>
          </section>

          <div role="tablist" aria-label="Secções do perfil" className="mb-6 flex gap-2 overflow-x-auto border-b-2 border-border-cloud">
            {tabs.map((t) => (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "-mb-0.5 flex min-h-12 items-center gap-2 border-b-[3px] px-3 whitespace-nowrap transition-[color,border-color] duration-150",
                  tab === t.value
                    ? "border-brand-ocean font-bold text-primary"
                    : "border-transparent text-text-secondary hover:text-on-surface",
                )}
              >
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-caption font-bold tabular-nums",
                      tab === t.value ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-soft text-text-secondary",
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {tab === "cadeiras" && (
            <section aria-labelledby="activity-title">
              <h2 id="activity-title" className="mb-4 font-montserrat text-headline-h2 text-on-surface">
                Módulos e atividade recente
              </h2>
              <ul className="flex flex-col gap-3">
                {profile.activity.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col items-start justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-soft p-4 md:flex-row md:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                        <Icon name={item.icon} size={24} />
                      </span>
                      <div>
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="text-body-lg font-bold text-on-surface">{item.title}</span>
                          <span className="rounded-full bg-feedback-success-soft px-2 py-0.5 text-caption font-bold text-feedback-success-ink tabular-nums">
                            {item.score} acertos
                          </span>
                          <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-caption font-bold text-on-primary-fixed tabular-nums">
                            +{item.xp} XP
                          </span>
                        </p>
                        <p className="mt-0.5 text-caption text-text-secondary">
                          {item.detail} · {formatActivityTime(item.at)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={item.href}
                      className="flex min-h-11 shrink-0 items-center gap-1 text-button text-primary uppercase hover:underline"
                    >
                      Rever resumo
                      <Icon name="arrow-right" size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "sebentas" && (
            <section aria-labelledby="saved-title">
              <h2 id="saved-title" className="mb-4 font-montserrat text-headline-h2 text-on-surface">
                Sebentas guardadas
              </h2>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {profile.saved.map((doc) => (
                  <li key={doc.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                    <p className="text-body-lg font-bold text-on-surface">
                      <a href={doc.href} className="hover:text-primary">
                        {doc.title}
                      </a>
                    </p>
                    <p className="mt-0.5 text-caption text-text-secondary">{doc.subject}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-2 text-caption">
                      <span className="rounded-md bg-surface-soft px-2 py-0.5 font-bold text-text-secondary tabular-nums">
                        {doc.sizeKb} KB
                      </span>
                      {doc.offline ? (
                        <span className="flex items-center gap-1 rounded-md bg-surface-forest px-2 py-0.5 font-bold text-feedback-success">
                          <Icon name="cloud" size={14} />
                          Disponível offline
                        </span>
                      ) : (
                        <span className="text-text-tertiary">Só com ligação</span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "simulados" && (
            <section aria-labelledby="exams-title">
              <h2 id="exams-title" className="mb-4 font-montserrat text-headline-h2 text-on-surface">
                Histórico de simulados
              </h2>
              <ul className="flex flex-col gap-3">
                {profile.exams.map((exam) => (
                  <li
                    key={exam.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-soft p-4"
                  >
                    <div>
                      <p className="text-body-lg font-bold text-on-surface">{exam.title}</p>
                      <p className="text-caption text-text-secondary tabular-nums">
                        {formatActivityTime(exam.at)} · {exam.minutes} min
                      </p>
                    </div>
                    <p className="flex items-center gap-3">
                      <span className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                        {exam.accuracy}%
                      </span>
                      <a href={exam.href} className="flex min-h-11 items-center text-button text-primary uppercase hover:underline">
                        Rever
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "badges" && (
            <section aria-labelledby="badges-title" className="text-center">
              <h2 id="badges-title" className="font-montserrat text-headline-h2 text-on-surface">
                {profile.counts.badges} medalhas conquistadas
              </h2>
              <p className="mt-2 text-body-md text-text-secondary">
                O cofre mostra as medalhas desbloqueadas e o que falta para as próximas.
              </p>
              <LinkButton3D href={badgesHref} size="lg" className="mt-5" trailingIcon={<Icon name="arrow-right" size={20} />}>
                Abrir o cofre de medalhas
              </LinkButton3D>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  );
}
