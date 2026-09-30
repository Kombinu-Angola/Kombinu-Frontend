import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { formatActivityTime } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationCategory, NotificationTone } from "./types";

type Filter = "todas" | NotificationCategory | "por-ler";

const TABS: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "por-ler", label: "Por ler" },
  { value: "gamificacao", label: "Ofensiva e ligas" },
  { value: "conteudo", label: "Sebentas e cadeira" },
  { value: "conta", label: "Conta" },
];

const TONE: Record<NotificationTone, { card: string; icon: string }> = {
  urgente: { card: "border-feedback-streak bg-surface-canvas", icon: "bg-feedback-streak text-surface-ink" },
  informativo: { card: "border-brand-ocean bg-surface-canvas", icon: "bg-brand-ocean text-white" },
  neutro: { card: "border-border-cloud bg-surface-canvas", icon: "bg-surface-soft text-text-secondary" },
};

type NotificationCenterScreenProps = { notifications: AppNotification[]; userName: string; settingsHref: string };

/** Centro de notificações: um sítio para tudo o que a plataforma avisa por SMS ou no ecrã. */
export default function NotificationCenterScreen({ notifications: initial, userName, settingsHref }: NotificationCenterScreenProps) {
  const [notifications, setNotifications] = useState(initial);
  const [filter, setFilter] = useState<Filter>("todas");

  const counts = useMemo(() => {
    const unread = notifications.filter((n) => !n.read).length;
    return {
      todas: notifications.length,
      "por-ler": unread,
      gamificacao: notifications.filter((n) => n.category === "gamificacao").length,
      conteudo: notifications.filter((n) => n.category === "conteudo").length,
      conta: notifications.filter((n) => n.category === "conta").length,
    } satisfies Record<Filter, number>;
  }, [notifications]);

  const shown = notifications.filter((n) =>
    filter === "todas" ? true : filter === "por-ler" ? !n.read : n.category === filter,
  );

  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <AppShell active="painel" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[820px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-overline text-primary uppercase">Avisos</p>
            <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
              Notificações
            </h1>
            <p className="mt-1 text-body-md text-text-secondary tabular-nums">
              {counts["por-ler"] === 0
                ? "Está tudo lido."
                : `${counts["por-ler"]} ${counts["por-ler"] === 1 ? "aviso por ler" : "avisos por ler"}.`}
            </p>
          </div>
          <Button3D
            variant="ghost"
            disabled={counts["por-ler"] === 0}
            onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
            leadingIcon={<Icon name="check" size={18} strokeWidth={3} />}
          >
            Marcar todas como lidas
          </Button3D>
        </header>

        <div role="group" aria-label="Filtrar notificações" className="mb-6 flex gap-2 overflow-x-auto pb-1">
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
            {filter === "por-ler" ? "Não tens avisos por ler." : "Nada nesta categoria, por agora."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {shown.map((n) => {
              const tone = TONE[n.tone];
              return (
                <li key={n.id}>
                  <article
                    className={cn(
                      "flex flex-col justify-between gap-4 rounded-2xl border-2 p-4 transition-[box-shadow,border-color] duration-150 sm:flex-row sm:items-center",
                      n.read ? "border-border-cloud bg-surface-canvas" : cn(tone.card, "border-l-[6px] shadow-elevation-1"),
                    )}
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-full",
                          n.read ? "bg-surface-soft text-text-secondary" : tone.icon,
                        )}
                      >
                        <Icon name={n.icon} size={22} />
                      </span>
                      <div>
                        <h2 className="flex items-center gap-2 text-headline-h3 text-on-surface">
                          {n.title}
                          {!n.read && (
                            <>
                              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand-ocean" />
                              <span className="sr-only">(por ler)</span>
                            </>
                          )}
                        </h2>
                        <p className="mt-1 text-body-md text-text-secondary">{n.body}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-3">
                          <time dateTime={n.at} className="text-caption text-text-tertiary">
                            {formatActivityTime(n.at)}
                          </time>
                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => markRead(n.id)}
                              className="min-h-11 text-caption font-bold text-primary hover:underline"
                            >
                              Marcar como lida
                              <span className="sr-only">: {n.title}</span>
                            </button>
                          )}
                        </p>
                      </div>
                    </div>

                    {n.action && (
                      <div className="shrink-0 self-end sm:self-center">
                        <LinkButton3D
                          href={n.action.href}
                          variant={n.action.primary && !n.read ? "primary" : "ghost"}
                          onClick={() => markRead(n.id)}
                          trailingIcon={<Icon name="arrow-right" size={18} />}
                        >
                          {n.action.label}
                          <span className="sr-only">: {n.title}</span>
                        </LinkButton3D>
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="mt-10 border-t-2 border-border-cloud pt-6 text-center">
          <a
            href={settingsHref}
            className="inline-flex min-h-11 items-center gap-2 text-caption font-bold text-text-secondary hover:text-primary"
          >
            <Icon name="gear" size={18} />
            Escolher que avisos queres receber, e por que canal
          </a>
        </footer>
      </div>
    </AppShell>
  );
}
