import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { useGamification } from "../../contexts/GamificationContext";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { StreakDayState, StreakMonth } from "./types";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const DAY_STYLE: Record<StreakDayState, string> = {
  done: "bg-secondary-fixed text-on-secondary-fixed-variant",
  frozen: "bg-tertiary-fixed text-on-tertiary-fixed",
  today: "border-2 border-brand-ocean bg-surface-sky text-primary",
  missed: "border-2 border-border-input bg-surface-canvas text-text-tertiary",
  future: "bg-surface-soft text-text-tertiary",
};

const DAY_ICON: Partial<Record<StreakDayState, IconName>> = {
  done: "flame",
  frozen: "snow",
  today: "target",
  missed: "x",
};

const DAY_LABEL: Record<StreakDayState, string> = {
  done: "dia cumprido",
  frozen: "protegido com gelo",
  today: "hoje, por cumprir",
  missed: "dia falhado",
  future: "ainda por vir",
};

const LINKS: ReadonlyArray<{ href: string; icon: IconName; title: string; hint: string }> = [
  { href: "#/desafio", icon: "bolt", title: "Desafio 24h", hint: "Bónus rápido de XP" },
  { href: "#/ligas", icon: "trophy", title: "Liga universitária", hint: "A tua posição esta semana" },
  { href: "#/medalhas", icon: "seal", title: "Medalhas", hint: "O que falta desbloquear" },
];

type StreakHubScreenProps = { streak: StreakMonth; userName: string; studyHref: string };

/** PRF-04 — hub da ofensiva: calendário do mês, proteções de gelo e a ação do dia. */
export default function StreakHubScreen({ streak, userName, studyHref }: StreakHubScreenProps) {
  const [freezes, setFreezes] = useState(streak.freezesAvailable);
  const [confirming, setConfirming] = useState(false);
  const { gems, addGems, streakDays } = useGamification();
  const toast = useToast();

  const monthLabel = new Intl.DateTimeFormat("pt-AO", { month: "long", year: "numeric" }).format(
    new Date(streak.year, streak.month - 1, 1),
  );
  const canAfford = gems >= streak.freezePriceGems;
  const offset = streak.firstWeekday - 1;

  function buyFreeze() {
    if (!canAfford) return;
    addGems(-streak.freezePriceGems);
    setFreezes((f) => f + 1);
    setConfirming(false);
    toast.show("Proteção de gelo adicionada à tua conta.");
  }

  return (
    <AppShell active="trilhas" userName={userName} campus="UAN · Economia">
      <div className="mx-auto flex max-w-[860px] flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
        <header className="flex flex-col items-center gap-4 rounded-3xl border-2 border-feedback-streak bg-surface-canvas p-6 text-center shadow-clay sm:p-8">
          <Asset3D name="streak-flame" alt="" size={88} priority />
          <p className="text-overline text-feedback-streak-ink uppercase">A tua ofensiva</p>
          <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            <span className="tabular-nums">{streakDays || streak.currentStreak} dias</span> seguidos
          </h1>
          {!streak.todayDone && (
            <p className="max-w-md text-body-lg text-pretty text-text-secondary">
              Ainda não estudaste hoje. Faltam poucos minutos para manteres a sequência.
            </p>
          )}
          <dl className="mt-1 flex flex-wrap justify-center gap-3">
            <div className="rounded-xl bg-surface-soft px-4 py-2">
              <dt className="text-caption text-text-secondary">Melhor marca</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                {streak.bestStreak} dias
              </dd>
            </div>
            <div className="rounded-xl bg-surface-soft px-4 py-2">
              <dt className="text-caption text-text-secondary">Proteções de gelo</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">{freezes}</dd>
            </div>
            <div className="rounded-xl bg-surface-soft px-4 py-2">
              <dt className="text-caption text-text-secondary">Gemas</dt>
              <dd className="flex items-center gap-1 font-montserrat text-headline-h3 font-extrabold text-feedback-gem-ink tabular-nums">
                <Icon name="gem" size={18} />
                {formatInt(gems)}
              </dd>
            </div>
          </dl>
        </header>

        <section aria-labelledby="calendar-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="calendar-title" className="mb-4 flex items-center gap-2 font-montserrat text-headline-h2 text-on-surface">
            <Icon name="clock" size={22} className="text-primary" />
            <span className="first-letter:uppercase">{monthLabel}</span>
          </h2>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((w) => (
              <p key={w} className="py-1 text-center text-overline text-text-tertiary uppercase">
                {w}
              </p>
            ))}

            {Array.from({ length: offset }, (_, i) => (
              <span key={`empty-${i}`} aria-hidden="true" className="h-14 rounded-lg bg-surface-soft/40 sm:h-16" />
            ))}

            {streak.days.map((day) => {
              const icon = DAY_ICON[day.state];
              return (
                <p
                  key={day.day}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 rounded-lg sm:h-16",
                    DAY_STYLE[day.state],
                  )}
                >
                  <span className="text-caption font-bold tabular-nums">{day.day}</span>
                  {icon && <Icon name={icon} size={16} />}
                  <span className="sr-only">
                    {day.day} de {monthLabel}: {DAY_LABEL[day.state]}
                  </span>
                </p>
              );
            })}
          </div>

          <ul className="mt-5 flex flex-wrap justify-center gap-4 border-t-2 border-border-cloud pt-4">
            {(["done", "frozen", "today", "missed"] as const).map((state) => (
              <li key={state} className="flex items-center gap-2 text-caption text-text-secondary">
                <span className={cn("flex size-6 items-center justify-center rounded-md", DAY_STYLE[state])}>
                  {DAY_ICON[state] && <Icon name={DAY_ICON[state]!} size={13} />}
                </span>
                <span className="first-letter:uppercase">{DAY_LABEL[state]}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="freeze-title"
          className="flex flex-col items-start justify-between gap-5 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6 md:flex-row md:items-center"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-tertiary-fixed text-on-tertiary-fixed">
              <Icon name="snow" size={26} />
            </span>
            <div>
              <h2 id="freeze-title" className="flex flex-wrap items-center gap-2 text-headline-h3 text-on-surface">
                Proteção de gelo
                <span className="rounded-full bg-tertiary-fixed px-2.5 py-0.5 text-overline text-on-tertiary-fixed uppercase tabular-nums">
                  {freezes} disponíveis
                </span>
              </h2>
              <p className="mt-1 max-w-md text-caption text-text-secondary">
                Guarda a tua sequência num dia em que não consigas estudar. É usada automaticamente.
              </p>
            </div>
          </div>

          {confirming ? (
            <div className="flex w-full shrink-0 flex-col gap-2 md:w-auto">
              <p className="text-caption text-text-secondary tabular-nums">
                Trocar {streak.freezePriceGems} gemas por 1 proteção?
              </p>
              <div className="flex gap-2">
                <Button3D variant="ghost" onClick={() => setConfirming(false)}>
                  Cancelar
                </Button3D>
                <Button3D onClick={buyFreeze}>Confirmar</Button3D>
              </div>
            </div>
          ) : (
            <div className="w-full shrink-0 md:w-auto">
              <Button3D
                fullWidth
                disabled={!canAfford}
                onClick={() => setConfirming(true)}
                leadingIcon={<Icon name="gem" size={18} />}
                aria-describedby={canAfford ? undefined : "freeze-hint"}
              >
                Comprar por {streak.freezePriceGems} gemas
              </Button3D>
              {!canAfford && (
                <p id="freeze-hint" className="mt-2 text-caption text-text-secondary tabular-nums">
                  Faltam-te {streak.freezePriceGems - gems} gemas. Ganha-as nas missões diárias.
                </p>
              )}
            </div>
          )}
        </section>

        <div className="flex flex-col items-center gap-3">
          <LinkButton3D href={studyHref} size="lg" className="w-full max-w-xl" trailingIcon={<Icon name="arrow-right" size={20} />}>
            Estudar agora (+{streak.goalXp} XP)
          </LinkButton3D>
          <p className="text-center text-caption text-text-tertiary">{streak.goalDescription}</p>
        </div>

        <nav aria-label="Atalhos da ofensiva" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 transition-[border-color,translate] duration-150 hover:-translate-y-0.5 hover:border-brand-ocean"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-sky text-primary">
                <Icon name={link.icon} size={20} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-body-md font-bold text-on-surface">{link.title}</span>
                <span className="block truncate text-caption text-text-tertiary">{link.hint}</span>
              </span>
            </a>
          ))}
        </nav>
      </div>
    </AppShell>
  );
}
