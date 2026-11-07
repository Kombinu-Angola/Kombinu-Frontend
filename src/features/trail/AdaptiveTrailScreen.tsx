import { AppShell } from "../../components/layout/AppShell";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { cn } from "@/lib/utils";

const decimal = new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 1 });
import type { AdaptiveStepKind, AdaptiveTrail } from "./types";

const KIND: Record<AdaptiveStepKind, { label: string; icon: IconName }> = {
  reforco: { label: "Passo 1: reforço conceptual", icon: "lightbulb" },
  simulado: { label: "Passo 2: simulado de fixação", icon: "bolt" },
  checkpoint: { label: "Passo 3: checkpoint de superação", icon: "trophy" },
};

type AdaptiveTrailScreenProps = { trail: AdaptiveTrail; userName: string; diagnosticHref: string };

/** Trilha mista: o plano de recuperação montado a partir das lacunas do diagnóstico. */
export default function AdaptiveTrailScreen({ trail, userName, diagnosticHref }: AdaptiveTrailScreenProps) {
  const done = trail.steps.filter((s) => s.status === "concluido").length;
  const totalXp = trail.steps.reduce((sum, s) => sum + Math.round(s.baseXp * trail.multiplier), 0);
  const gapCount = trail.gaps.length;

  return (
    <AppShell active="trilhas" userName={userName} campus={`${trail.subject} · ${trail.university}`}>
      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href="/v2/trilhas" className="hover:text-primary">
            {trail.course}
          </a>
          <span aria-hidden="true">/</span>
          <a href="/v2/cadeira" className="hover:text-primary">
            {trail.subject}
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            Trilha mista
          </span>
        </nav>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Nivelamento adaptativo</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            A tua trilha de recuperação
          </h1>
          <p className="mt-2 max-w-3xl text-body-lg text-pretty text-text-secondary">
            Montámos estes passos a partir do teu diagnóstico, nas áreas em que mais estudantes da tua faculdade
            reprovam.
          </p>
        </header>

        <section
          aria-labelledby="diagnostic-title"
          className="rounded-3xl border-2 border-feedback-gem bg-surface-canvas p-5 shadow-clay sm:p-6"
        >
          <div className="flex flex-col justify-between gap-3 border-b-2 border-border-cloud pb-4 sm:flex-row sm:items-center">
            <h2 id="diagnostic-title" className="flex items-center gap-2 text-headline-h3 text-on-surface">
              <Icon name="target" size={20} className="text-feedback-gem-ink" />
              Diagnóstico calibrado ({trail.university})
            </h2>
            <p className="text-body-md text-text-secondary tabular-nums">
              Precisão inicial:{" "}
              <strong className="font-montserrat text-headline-h3 font-extrabold text-feedback-gem-ink">
                {trail.initialAccuracy}%
              </strong>{" "}
              · {gapCount} {gapCount === 1 ? "lacuna" : "lacunas"}
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2.5">
            {trail.gaps.map((gap, i) => (
              <li
                key={gap}
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-feedback-error bg-surface-canvas px-3 py-1.5 text-caption font-bold text-feedback-error-ink"
              >
                <Icon name="alert" size={15} />
                Lacuna {i + 1}: {gap}
              </li>
            ))}
            {trail.strengths.map((strength) => (
              <li
                key={strength}
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-feedback-success bg-surface-canvas px-3 py-1.5 text-caption font-bold text-feedback-success-ink"
              >
                <Icon name="check" size={15} strokeWidth={3} />
                Ponto forte: {strength}
              </li>
            ))}
          </ul>

          <p className="mt-4 flex items-start gap-3 rounded-2xl bg-surface-sky p-3.5">
            <Icon name="bolt" size={20} className="mt-0.5 shrink-0 text-primary" />
            <span className="text-body-md text-on-surface tabular-nums">
              <strong>Bónus ativo:</strong> cada atividade desta trilha vale {decimal.format(trail.multiplier)}× o XP normal. Se
              concluíres as três, somas {totalXp} XP.
            </span>
          </p>

          <a
            href={diagnosticHref}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-primary hover:underline"
          >
            Rever o diagnóstico completo
            <Icon name="arrow-right" size={15} />
          </a>
        </section>

        <section aria-labelledby="steps-title" className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="steps-title" className="font-montserrat text-headline-h2 text-on-surface">
              Etapas de superação
            </h2>
            <span className="text-caption font-bold text-text-secondary tabular-nums">
              {done} de {trail.steps.length} concluídas
            </span>
          </div>
          <ProgressBar
            value={done}
            max={trail.steps.length}
            tone="gem"
            label="Progresso da trilha mista"
            valueText={`${done} de ${trail.steps.length} etapas concluídas`}
          />

          <ol className="mt-5 flex flex-col gap-5">
            {trail.steps.map((step, index) => {
              const kind = KIND[step.kind];
              const locked = step.status === "bloqueado";
              const xp = Math.round(step.baseXp * trail.multiplier);
              const previous = trail.steps[index - 1];
              return (
                <li key={step.id}>
                  <article
                    className={cn(
                      "relative overflow-hidden rounded-3xl border-2 p-5 sm:p-6",
                      locked ? "border-dashed border-border-input bg-surface-soft" : "border-border-cloud bg-surface-canvas shadow-elevation-1",
                    )}
                  >
                    {!locked && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-brand-ocean" />}

                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-overline uppercase",
                          locked ? "bg-surface-canvas text-text-tertiary" : "bg-surface-sky text-primary",
                        )}
                      >
                        <Icon name={kind.icon} size={15} />
                        {kind.label}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-caption font-bold tabular-nums",
                          locked ? "border-2 border-border-cloud text-text-tertiary" : "bg-secondary-fixed text-on-secondary-fixed-variant",
                        )}
                      >
                        <Icon name="bolt" size={14} />
                        {xp} XP
                        <span className="font-medium">
                          ({step.baseXp} × {decimal.format(trail.multiplier)})
                        </span>
                      </span>
                    </div>

                    <h3
                      className={cn(
                        "flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold",
                        locked ? "text-text-secondary" : "text-on-surface",
                      )}
                    >
                      {locked && <Icon name="lock" size={18} className="shrink-0 text-text-tertiary" />}
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-body-md text-text-secondary">{step.summary}</p>

                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-caption text-text-secondary">
                      <li className="flex items-center gap-1.5 tabular-nums">
                        <Icon name="clock" size={15} />
                        {step.minutes} min
                      </li>
                      <li className="flex items-center gap-1.5 font-bold text-feedback-success-ink tabular-nums">
                        <Icon name="signal" size={15} />
                        {step.dataMb.toLocaleString("pt-AO", { maximumFractionDigits: 1 })} MB
                      </li>
                      {step.failureRate !== undefined && (
                        <li className="flex items-center gap-1.5 font-bold text-feedback-error-ink tabular-nums">
                          <Icon name="alert" size={15} />
                          {step.failureRate}% reprova nesta matéria
                        </li>
                      )}
                    </ul>

                    {step.badge && (
                      <p className="mt-4 flex items-center gap-3 rounded-xl border-2 border-border-cloud bg-surface-canvas p-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed text-brand-sunbeam-ink">
                          <Icon name="seal" size={22} />
                        </span>
                        <span>
                          <span className="block text-body-md font-bold text-on-surface">{step.badge}</span>
                          <span className="block text-caption text-text-tertiary">
                            Medalha atribuída ao concluir esta etapa
                          </span>
                        </span>
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-cloud pt-4">
                      {locked ? (
                        <p className="flex items-center gap-2 text-caption text-text-secondary">
                          <Icon name="lock" size={15} className="shrink-0" />
                          {previous ? `Conclui "${previous.title}" para desbloquear.` : "Ainda bloqueado."}
                        </p>
                      ) : (
                        <p className="flex items-center gap-2 text-caption font-bold text-feedback-success-ink">
                          <span aria-hidden="true" className="size-2.5 rounded-full bg-feedback-success" />
                          Disponível agora
                        </p>
                      )}

                      {locked ? (
                        <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-border-cloud px-4 text-button text-text-tertiary uppercase">
                          <Icon name="lock" size={16} />
                          Bloqueado
                        </span>
                      ) : (
                        <LinkButton3D href={step.href} trailingIcon={<Icon name="arrow-right" size={18} />}>
                          {step.kind === "reforco" ? "Resolver a lacuna" : step.kind === "simulado" ? "Fazer o simulado" : "Fazer a reavaliação"}
                        </LinkButton3D>
                      )}
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
