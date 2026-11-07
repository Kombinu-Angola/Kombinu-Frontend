import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { Badge, BadgeCategory } from "./types";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "short", year: "numeric" });

const CATEGORIES: ReadonlyArray<{ value: BadgeCategory | "todas"; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "streaks", label: "Consistência" },
  { value: "quizzes", label: "Quizzes" },
  { value: "cadeiras", label: "Cadeiras críticas" },
  { value: "comunidade", label: "Comunidade" },
];

type BadgeVaultScreenProps = { badges: Badge[]; userName: string; seasonTotal: number };

/** PRF-03 — cofre de medalhas: conquistadas e por conquistar, com o que falta em cada uma. */
export default function BadgeVaultScreen({ badges, userName, seasonTotal }: BadgeVaultScreenProps) {
  const [category, setCategory] = useState<BadgeCategory | "todas">("todas");

  const unlocked = badges.filter((b) => b.unlockedAt).length;
  const shown = useMemo(
    () => (category === "todas" ? badges : badges.filter((b) => b.category === category)),
    [badges, category],
  );
  const counts = useMemo(() => {
    const map = new Map<string, number>([["todas", badges.length]]);
    for (const b of badges) map.set(b.category, (map.get(b.category) ?? 0) + 1);
    return map;
  }, [badges]);

  return (
    <AppShell active="painel" userName={userName} campus="UAN · Engenharia">
      <div className="mx-auto max-w-[1240px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-overline text-text-tertiary uppercase">Portfólio de conquistas</p>
            <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
              Cofre de medalhas
            </h1>
            <p className="mt-2 text-body-md text-text-secondary">
              Cada medalha é atribuída pelo teu histórico na plataforma e fica associada ao teu perfil académico.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 sm:min-w-[300px]">
            <p className="mb-2 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <Icon name="trophy" size={22} />
              </span>
              <span>
                <span className="block text-body-md font-bold text-on-surface tabular-nums">
                  {unlocked} de {seasonTotal} conquistas
                </span>
                <span className="block text-caption text-text-secondary tabular-nums">
                  {Math.round((unlocked / seasonTotal) * 100)}% da temporada
                </span>
              </span>
            </p>
            <ProgressBar
              value={unlocked}
              max={seasonTotal}
              label="Progresso da temporada"
              valueText={`${unlocked} de ${seasonTotal} conquistas`}
            />
          </div>
        </header>

        <div role="group" aria-label="Categorias de medalhas" className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => {
            const active = category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c.value)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color,translate,box-shadow] duration-150",
                  active
                    ? "border-brand-ocean bg-brand-ocean text-white shadow-3d-primary active:translate-y-1 active:shadow-none"
                    : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
                )}
              >
                {c.label}
                <span className="ml-1.5 tabular-nums">({counts.get(c.value) ?? 0})</span>
              </button>
            );
          })}
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <li key={badge.id}>
                <article
                  className={cn(
                    "flex h-full flex-col justify-between rounded-3xl border-2 p-5 transition-[translate,box-shadow] duration-200",
                    isUnlocked
                      ? "border-border-cloud bg-surface-canvas shadow-elevation-1 hover:-translate-y-1 hover:shadow-clay"
                      : "border-dashed border-border-input bg-surface-soft",
                  )}
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "flex size-14 items-center justify-center rounded-2xl",
                          isUnlocked ? "bg-secondary-fixed text-brand-sunbeam-ink" : "bg-surface-canvas text-text-tertiary",
                        )}
                      >
                        <Icon name={isUnlocked ? badge.icon : "lock"} size={30} />
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-overline uppercase",
                          isUnlocked
                            ? "bg-feedback-success-soft text-feedback-success-ink"
                            : "border-2 border-border-cloud bg-surface-canvas text-text-tertiary",
                        )}
                      >
                        {isUnlocked ? `Desbloqueada em ${dateFormat.format(new Date(badge.unlockedAt!))}` : "Por conquistar"}
                      </span>
                    </div>

                    <h2 className={cn("text-headline-h3", isUnlocked ? "text-on-surface" : "text-text-secondary")}>
                      {badge.name}
                    </h2>
                    <p className="mt-1 text-caption text-text-secondary">{badge.description}</p>
                  </div>

                  <div className="mt-4">
                    {isUnlocked ? (
                      <p className="flex items-center justify-between gap-2 rounded-xl bg-surface-soft p-3 text-caption">
                        <span className="flex items-center gap-1 font-bold text-primary">
                          <Icon name="shield" size={15} />
                          Credencial verificada
                        </span>
                        <span className="text-text-tertiary tabular-nums">{badge.proof}</span>
                      </p>
                    ) : (
                      badge.progress && (
                        <>
                          <p className="mb-1.5 flex justify-between text-caption text-text-secondary tabular-nums">
                            <span>Progresso</span>
                            <span className="font-bold text-on-surface">
                              {badge.progress.value}/{badge.progress.goal} {badge.progress.unit}
                            </span>
                          </p>
                          <ProgressBar
                            value={badge.progress.value}
                            max={badge.progress.goal}
                            size="sm"
                            tone="streak"
                            label={`Progresso para ${badge.name}`}
                            valueText={`${badge.progress.value} de ${badge.progress.goal} ${badge.progress.unit}`}
                          />
                        </>
                      )
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
