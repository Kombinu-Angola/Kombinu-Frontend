import { AppShell } from "../../components/layout/AppShell";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { LearningTrail, TrailNodeStatus } from "./types";

const NODE_STYLE: Record<TrailNodeStatus, { badge: string; card: string; label: string }> = {
  concluido: {
    badge: "bg-feedback-success text-surface-ink shadow-3d-success",
    card: "border-border-cloud bg-surface-canvas",
    label: "concluído",
  },
  ativo: {
    badge: "bg-brand-ocean text-white shadow-3d-primary ring-4 ring-primary-fixed",
    card: "border-brand-ocean bg-surface-canvas shadow-clay",
    label: "em curso",
  },
  bloqueado: {
    badge: "border-2 border-border-input bg-surface-canvas text-text-tertiary",
    card: "border-dashed border-border-input bg-surface-soft",
    label: "bloqueado",
  },
};

function Stars({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5 rounded-full border-2 border-border-cloud bg-surface-canvas px-2 py-0.5">
      {[1, 2, 3].map((n) => (
        <Icon
          key={n}
          name="star"
          size={15}
          aria-hidden="true"
          className={n <= stars ? "fill-feedback-streak text-feedback-streak" : "text-border-cloud-strong"}
        />
      ))}
      <span className="sr-only">{stars} de 3 estrelas</span>
    </span>
  );
}

type LearningTrailScreenProps = { trail: LearningTrail; userName: string; backHref: string };

/** Trilha linear de uma cadeira: nós concluídos, nó em curso e exame no fim. */
export default function LearningTrailScreen({ trail, userName, backHref }: LearningTrailScreenProps) {
  const done = trail.nodes.filter((n) => n.status === "concluido").length;
  const total = trail.nodes.length;
  const percent = Math.round((done / total) * 100);
  const active = trail.nodes.find((n) => n.status === "ativo");
  const remaining = total - done;
  const examUnlocked = done === total;

  return (
    <AppShell active="trilhas" userName={userName} campus={`${trail.subject} · ${trail.year}`}>
      <div className="mx-auto max-w-[800px] px-4 py-6 md:px-6 lg:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <a
            href={backHref}
            className="inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
          >
            <Icon name="arrow-left" size={16} />
            Voltar às cadeiras
          </a>
          <span className="text-caption text-text-tertiary">
            {trail.year} · {trail.semester}
          </span>
        </div>

        <header className="mb-5">
          <h1 className="font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            {trail.subject} — {trail.headline}
          </h1>
        </header>

        <section
          aria-labelledby="progress-title"
          className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 sm:p-5"
        >
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="progress-title" className="flex items-center gap-1.5 text-headline-h3 text-on-surface">
              <Icon name="target" size={18} className="text-primary" />
              Progresso da trilha
            </h2>
            <span className="font-bold text-primary tabular-nums">
              {percent}% · {done} de {total} módulos
            </span>
          </div>
          <ProgressBar
            value={done}
            max={total}
            label="Progresso da trilha"
            valueText={`${done} de ${total} módulos concluídos`}
          />
          <p className="mt-2 flex items-start gap-1.5 text-caption text-text-secondary tabular-nums">
            <Icon name="lightbulb" size={15} className="mt-0.5 shrink-0 text-primary" />
            {active
              ? `Estás no módulo ${active.order}. Faltam ${remaining} módulos para desbloquear o exame simulado.`
              : "Trilha concluída. O exame simulado já está disponível."}
          </p>
        </section>

        <ol className="mt-8 flex flex-col">
          {trail.nodes.map((node, index) => {
            const style = NODE_STYLE[node.status];
            const last = index === trail.nodes.length - 1;
            const lineDone = node.status === "concluido";
            return (
              <li key={node.id} className="relative flex items-start gap-4 pb-8">
                {!last && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[52px] bottom-0 left-[23px] w-1 rounded-full",
                      lineDone ? "bg-feedback-success" : node.status === "ativo" ? "bg-brand-ocean" : "bg-border-cloud",
                    )}
                  />
                )}

                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full font-montserrat text-headline-h3 font-extrabold tabular-nums",
                    style.badge,
                  )}
                >
                  {node.status === "concluido" ? (
                    <Icon name="check" size={24} strokeWidth={3} />
                  ) : node.status === "bloqueado" ? (
                    <Icon name="lock" size={20} />
                  ) : (
                    node.order
                  )}
                </span>

                <article
                  className={cn(
                    "flex-1 rounded-2xl border-2 p-4 transition-[border-color,box-shadow] duration-200",
                    style.card,
                    node.status !== "bloqueado" && "hover:border-brand-ocean",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-overline uppercase tabular-nums",
                        node.status === "ativo"
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : node.status === "concluido"
                            ? "bg-feedback-success-soft text-feedback-success-ink"
                            : "bg-surface-canvas text-text-tertiary",
                      )}
                    >
                      Módulo {String(node.order).padStart(2, "0")}
                      {node.status === "ativo" && " · estás aqui"}
                    </span>
                    <span className="text-caption text-text-tertiary tabular-nums">{node.minutes} min</span>
                    <span className="sr-only">Estado: {style.label}</span>
                  </div>

                  <h3
                    className={cn(
                      "mt-2 font-montserrat text-headline-h3 font-extrabold",
                      node.status === "bloqueado" ? "text-text-secondary" : "text-on-surface",
                    )}
                  >
                    {node.title}
                  </h3>
                  <p className="mt-1 text-body-md text-text-secondary">{node.summary}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-cloud pt-3">
                    <span className="flex flex-wrap items-center gap-2">
                      {node.status === "concluido" && node.stars !== undefined && <Stars stars={node.stars} />}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption font-bold tabular-nums",
                          node.status === "bloqueado"
                            ? "text-text-tertiary"
                            : "bg-secondary-fixed text-on-secondary-fixed-variant",
                        )}
                      >
                        <Icon name="bolt" size={14} />+{node.xp} XP
                      </span>
                    </span>

                    {node.status === "bloqueado" ? (
                      <span className="flex items-center gap-1.5 text-caption text-text-tertiary">
                        <Icon name="lock" size={15} />
                        Conclui o módulo anterior
                      </span>
                    ) : (
                      <LinkButton3D
                        href={node.href}
                        variant={node.status === "ativo" ? "primary" : "ghost"}
                        trailingIcon={<Icon name="arrow-right" size={18} />}
                      >
                        {node.status === "ativo" ? "Continuar" : "Rever"}
                        <span className="sr-only"> o módulo {node.title}</span>
                      </LinkButton3D>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <section
          aria-labelledby="exam-title"
          className={cn(
            "flex flex-col items-center gap-3 rounded-3xl border-2 p-6 text-center",
            examUnlocked ? "border-brand-ocean bg-surface-canvas shadow-clay" : "border-dashed border-border-input bg-surface-soft",
          )}
        >
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full",
              examUnlocked ? "bg-secondary-container text-surface-ink" : "bg-surface-canvas text-text-tertiary",
            )}
          >
            <Icon name={examUnlocked ? "trophy" : "lock"} size={28} />
          </span>
          <h2 id="exam-title" className="font-montserrat text-headline-h2 text-on-surface">
            {trail.finalExam.title}
          </h2>
          <p className="max-w-md text-body-md text-text-secondary tabular-nums">
            {examUnlocked
              ? `${trail.finalExam.minutes} minutos, com direito a ${trail.finalExam.xp} XP.`
              : `Desbloqueia com os ${remaining} módulos que faltam. Depois são ${trail.finalExam.minutes} minutos por ${trail.finalExam.xp} XP.`}
          </p>
          {examUnlocked && (
            <LinkButton3D href={trail.finalExam.href} size="lg" trailingIcon={<Icon name="arrow-right" size={20} />}>
              Fazer o exame simulado
            </LinkButton3D>
          )}
        </section>
      </div>
    </AppShell>
  );
}
