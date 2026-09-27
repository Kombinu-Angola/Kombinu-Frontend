import { AppShell } from "../../components/layout/AppShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useCountdown } from "../../hooks/useCountdown";
import { formatInt } from "../../lib/format";
import type { Challenge } from "./types";

type ChallengeScreenProps = {
  challenge: Challenge;
  userName: string;
  onStart: (challengeId: string) => void;
};

/** Desafio Relâmpago 24h: contagem decrescente, prémio, regras e entrada. */
export default function ChallengeScreen({ challenge: c, userName, onStart }: ChallengeScreenProps) {
  const countdown = useCountdown(c.endsAt);
  const canStart = !countdown.ended && !c.completed;

  return (
    <AppShell active="simulados" userName={userName} campus="UAN · Economia">
      <section aria-labelledby="challenge-title" className="bg-feedback-streak px-4 py-10 md:py-14">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center text-center">
          <Asset3D name="challenge-bolt" alt="" size={72} priority surface="warm" className="mb-3" />
          <p className="text-overline text-surface-ink uppercase">Desafio relâmpago · {c.subject}</p>
          <h1
            id="challenge-title"
            className="mt-2 max-w-3xl font-montserrat text-headline-h1-mobile text-balance text-surface-ink md:text-headline-h1"
          >
            {c.title}
          </h1>

          <div className="mt-6 rounded-full bg-surface-ink px-6 py-2 shadow-elevation-1">
            {countdown.ended ? (
              <p className="font-montserrat text-headline-h2 font-extrabold text-feedback-streak">Desafio terminado</p>
            ) : (
              <p className="flex items-baseline gap-3 text-feedback-streak">
                <span className="text-overline uppercase">Termina em</span>
                {/* O relógio muda a cada segundo: fica fora do leitor de ecrã; a versão falada fica ao lado */}
                <time
                  aria-hidden="true"
                  dateTime={c.endsAt}
                  className="font-montserrat text-headline-h1-mobile font-extrabold tabular-nums md:text-display-l"
                >
                  {countdown.clock}
                </time>
                <span className="sr-only">{countdown.spoken}</span>
              </p>
            )}
          </div>
          <p className="mt-4 text-body-md font-bold text-surface-ink">
            {formatInt(c.participants)} estudantes já entraram
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 grid max-w-[1280px] grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-6">
        <section
          aria-labelledby="prize-title"
          className="flex flex-col items-center rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 text-center shadow-clay sm:p-8"
        >
          <Asset3D name="trophy-complete" alt="" size={96} className="mb-4" />
          <h2 id="prize-title" className="font-montserrat text-headline-h2 text-on-surface">
            {c.prize.title}
          </h2>
          <p className="mt-2 mb-6 max-w-sm text-body-lg text-text-secondary">{c.prize.description}</p>
          <Button3D
            size="lg"
            fullWidth
            className="mt-auto"
            disabled={!canStart}
            onClick={() => onStart(c.id)}
            trailingIcon={canStart ? <Icon name="arrow-right" size={20} /> : undefined}
          >
            {c.completed ? "Já participaste nesta ronda" : countdown.ended ? "Desafio terminado" : "Entrar no desafio"}
          </Button3D>
          {canStart && (
            <p className="mt-3 text-caption text-text-tertiary">O cronómetro de 5 minutos só começa na primeira pergunta.</p>
          )}
        </section>

        <section aria-labelledby="rules-title" className="rounded-3xl border-2 border-border-cloud bg-surface-soft p-6 sm:p-8">
          <h2 id="rules-title" className="mb-6 flex items-center gap-2 border-b-2 border-border-cloud pb-3 text-headline-h3 text-on-surface">
            <Icon name="help" size={22} className="text-primary" />
            Regras do desafio
          </h2>
          <ul className="space-y-5">
            {c.rules.map((rule) => (
              <li key={rule.id} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-canvas text-primary shadow-elevation-1">
                  <Icon name={rule.icon} size={22} />
                </span>
                <div>
                  <p className="text-headline-h3 text-on-surface">{rule.title}</p>
                  <p className="text-body-md text-text-secondary">{rule.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mx-auto mt-6 max-w-[1280px] px-4 md:px-6" aria-label="Incentivo">
        <div className="flex items-center gap-4 rounded-3xl bg-surface-ink p-6 text-white sm:p-8">
          <Asset3D name="diagnostic-target" alt="" size={56} surface="dark" />
          <p className="font-montserrat text-headline-h3 font-extrabold text-balance">
            Prepara-te: revê pilhas, filas e árvores antes de começar.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
