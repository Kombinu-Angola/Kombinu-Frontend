import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { useCountdown } from "../../hooks/useCountdown";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { useToast } from "../../components/ui/Toast";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";

export type SeasonOutcome = "promovido" | "mantido" | "despromovido";

export type SeasonResult = {
  season: string;
  outcome: SeasonOutcome;
  rank: number;
  totalPlayers: number;
  fromDivision: string;
  toDivision: string;
  campus: string;
  xp: number;
  quizzes: number;
  streakDays: number;
  streakTarget: number;
  rewards: Array<{ id: string; icon: IconName; label: string; detail: string; tone: string }>;
  nextSeasonEndsAt: string;
};

const OUTCOME: Record<SeasonOutcome, { eyebrow: string; title: string; border: string; zone: string }> = {
  promovido: {
    eyebrow: "Temporada fechada",
    title: "Subiste de divisão",
    border: "border-feedback-success",
    zone: "Zona de promoção",
  },
  mantido: {
    eyebrow: "Temporada fechada",
    title: "Mantiveste a divisão",
    border: "border-brand-ocean",
    zone: "Zona neutra",
  },
  despromovido: {
    eyebrow: "Temporada fechada",
    title: "Desceste de divisão",
    border: "border-feedback-streak",
    zone: "Zona de despromoção",
  },
};

type SeasonFinaleScreenProps = { result: SeasonResult; userName: string; leagueHref: string };

/** Fecho de temporada: o momento em que a competição semanal tem conclusão. */
export default function SeasonFinaleScreen({ result, leagueHref }: SeasonFinaleScreenProps) {
  const headingRef = useFocusOnMount();
  const countdown = useCountdown(result.nextSeasonEndsAt);
  const toast = useToast();
  const outcome = OUTCOME[result.outcome];

  async function share() {
    const text = `Fechei a temporada da Kombinu em ${result.rank}.º lugar na ${result.fromDivision}, com ${formatInt(result.xp)} XP.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Kombinu", text });
        return;
      } catch {
        /* cancelado */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <div className="min-h-dvh bg-background">
      <main id="conteudo" className="mx-auto max-w-[740px] px-4 py-8 lg:py-10">
        <header className="flex flex-col items-center text-center">
          <Asset3D name="trophy-complete" alt="" size={104} priority className="mb-4 motion-safe:animate-pop-in" />
          <p className="text-overline text-text-tertiary uppercase">
            {outcome.eyebrow} · {result.season}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
          >
            {outcome.title}
          </h1>
          <p className="mt-2 max-w-md text-body-lg text-pretty text-text-secondary tabular-nums">
            {result.outcome === "promovido"
              ? `Terminaste em ${result.rank}.º entre ${formatInt(result.totalPlayers)} estudantes da ${result.fromDivision} e passas à ${result.toDivision}.`
              : result.outcome === "mantido"
                ? `Terminaste em ${result.rank}.º entre ${formatInt(result.totalPlayers)} estudantes e continuas na ${result.toDivision}.`
                : `Terminaste em ${result.rank}.º entre ${formatInt(result.totalPlayers)} estudantes e desces para a ${result.toDivision}.`}
          </p>
        </header>

        <section
          aria-labelledby="result-title"
          className={cn("mt-6 rounded-3xl border-2 bg-surface-canvas p-5 shadow-clay sm:p-6", outcome.border)}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-cloud pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-brand-sunbeam-ink">
                <Icon name="trophy" size={26} />
              </span>
              <div>
                <h2 id="result-title" className="text-headline-h3 text-on-surface">
                  {result.fromDivision} · {result.campus}
                </h2>
                <p className="text-caption text-text-tertiary">{outcome.zone}</p>
              </div>
            </div>
            <p className="text-right">
              <span className="block font-montserrat text-display-l font-extrabold text-primary tabular-nums">
                {result.rank}.º
              </span>
              <span className="block text-caption text-text-secondary tabular-nums">
                de {formatInt(result.totalPlayers)}
              </span>
            </p>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-surface-soft p-4 text-center sm:grid-cols-3">
            {[
              { id: "xp", label: "XP conquistado", value: formatInt(result.xp), icon: "bolt" as const, tone: "text-primary" },
              { id: "quiz", label: "Quizzes resolvidos", value: String(result.quizzes), icon: "target" as const, tone: "text-on-surface" },
              {
                id: "streak",
                label: "Dias com meta cumprida",
                value: `${result.streakDays}/${result.streakTarget}`,
                icon: "flame" as const,
                tone: "text-feedback-streak-ink",
              },
            ].map((stat) => (
              <div key={stat.id}>
                <dt className="flex items-center justify-center gap-1 text-caption text-text-secondary">
                  <Icon name={stat.icon} size={15} />
                  {stat.label}
                </dt>
                <dd className={cn("font-montserrat text-headline-h3 font-extrabold tabular-nums", stat.tone)}>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="rewards-title" className="mt-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
          <h2 id="rewards-title" className="flex items-center gap-2 text-headline-h3 text-on-surface">
            <Icon name="gem" size={20} className="text-feedback-gem-ink" />
            Recompensas creditadas
          </h2>
          <ul className="mt-3.5 flex flex-col gap-3">
            {result.rewards.map((reward) => (
              <li key={reward.id} className="flex items-center gap-3 rounded-xl bg-surface-soft p-3">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-canvas", reward.tone)}>
                  <Icon name={reward.icon} size={20} />
                </span>
                <span>
                  <span className="block text-body-md font-bold text-on-surface">{reward.label}</span>
                  <span className="block text-caption text-text-secondary">{reward.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-soft p-4 sm:flex-row sm:items-center">
          <p className="flex items-start gap-2.5">
            <Icon name="bolt" size={20} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
            <span>
              <span className="block text-body-md font-bold text-on-surface">
                A temporada da {result.toDivision} já começou
              </span>
              <span className="block text-caption text-text-secondary">
                As zonas foram repostas e todos começam com zero XP.
              </span>
            </span>
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface-canvas px-3 py-1.5 text-caption font-bold text-primary tabular-nums">
            <Icon name="clock" size={15} />
            <span aria-hidden="true">Termina em {countdown.compact}</span>
            <span className="sr-only">Termina em {countdown.spoken}</span>
          </span>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LinkButton3D href={leagueHref} size="lg" fullWidth trailingIcon={<Icon name="arrow-right" size={20} />}>
            Ver a nova classificação
          </LinkButton3D>
          <Button3D
            variant="ghost"
            fullWidth
            onClick={() => {
              void share();
              toast.show("Mensagem pronta para partilhares.");
            }}
            leadingIcon={<Icon name="share" size={18} />}
          >
            Partilhar com colegas
          </Button3D>
        </div>
      </main>
    </div>
  );
}
