import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { DataSaverBadge } from "../../components/ui/DataSaverBadge";
import { Icon } from "../../components/ui/Icon";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { useGamification } from "../../contexts/GamificationContext";
import type { Article } from "../content/blocks";
import type { ReadingResult } from "./ReadingPlayerScreen";

type ModuleCompleteScreenProps = {
  article: Article;
  result: ReadingResult;
  gemsEarned: number;
  onNext: () => void;
};

/**
 * Conclusão de módulo. A partilha usa a API nativa do sistema quando existe
 * e cai para uma ligação do WhatsApp quando não existe.
 */
export default function ModuleCompleteScreen({ article, result, gemsEarned, onNext }: ModuleCompleteScreenProps) {
  const headingRef = useFocusOnMount();
  const { streakDays } = useGamification();

  const shareText = `Acabei de concluir "${article.title}" na Kombinu e ganhei ${result.xpEarned} XP.`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: shareText });
        return;
      } catch {
        /* o utilizador cancelou: não fazemos nada */
      }
    }
    window.open(whatsappHref, "_blank", "noopener");
  }

  const metrics = [
    {
      id: "score",
      asset: "trophy-complete" as const,
      value: `${result.checkpointsCorrect}/${result.checkpointsTotal}`,
      label:
        result.checkpointsTotal > 0
          ? `${Math.round((result.checkpointsCorrect / result.checkpointsTotal) * 100)}% de acerto`
          : "Checkpoints certos",
      tone: "text-feedback-success-ink",
    },
    {
      id: "xp",
      asset: "xp-bolt" as const,
      value: `+${result.xpEarned} XP`,
      label: `+${gemsEarned} gemas`,
      tone: "text-feedback-gem-ink",
    },
    {
      id: "streak",
      asset: "streak-flame" as const,
      value: `${streakDays} dias`,
      label: "Sequência de estudo",
      tone: "text-feedback-streak-ink",
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col items-center gap-8 bg-background px-4 py-10 sm:px-6">
      <main id="conteudo" className="flex w-full max-w-[740px] flex-col items-center gap-8">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-1.5 text-overline text-on-secondary-fixed-variant uppercase">
            <Icon name="seal" size={16} />
            Módulo concluído
          </span>
          <Asset3D name="kombi-celebrate" alt="" size={112} priority className="motion-safe:animate-pop-in" />
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="max-w-[520px] font-montserrat text-headline-h1-mobile text-balance text-primary outline-none sm:text-headline-h1"
          >
            Excelente trabalho!
          </h1>
          <p className="max-w-[480px] text-body-lg text-pretty text-text-secondary">
            Dominaste os fundamentos deste módulo. Continua neste ritmo.
          </p>
        </header>

        <section aria-labelledby="metrics-title" className="w-full">
          <h2 id="metrics-title" className="sr-only">
            O que ganhaste
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.id}
                className="flex flex-col items-center gap-1 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 text-center shadow-elevation-1"
              >
                <Asset3D name={m.asset} alt="" size={48} className="mb-1" />
                <dt className="order-last text-caption text-text-tertiary">{m.label}</dt>
                <dd className={`font-montserrat text-headline-h3 font-extrabold tabular-nums ${m.tone}`}>{m.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <details className="group w-full rounded-3xl border-2 border-border-cloud bg-surface-soft">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-5 text-headline-h3 text-primary">
            Revisão rápida dos pontos-chave
            <Icon name="plus" size={20} className="shrink-0 transition-[rotate] duration-150 group-open:rotate-45" />
          </summary>
          <ul className="list-disc space-y-2 border-t-2 border-border-cloud px-5 py-4 pl-9 text-body-md text-on-surface">
            {article.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </details>

        {article.next && (
          <section
            aria-labelledby="next-title"
            className="flex w-full flex-col items-center gap-4 rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-6 text-center shadow-clay"
          >
            <p className="text-overline text-text-tertiary uppercase">Próxima leitura recomendada</p>
            <h2 id="next-title" className="font-montserrat text-headline-h2 text-primary">
              {article.next.title}
            </h2>
            <p className="flex items-center gap-2">
              <Avatar name={article.next.author} size="sm" />
              <span className="text-body-md font-bold text-on-surface">{article.next.author}</span>
              <span className="text-caption text-text-tertiary">· {article.next.minutes} min</span>
            </p>
            <Button3D size="lg" fullWidth onClick={onNext} trailingIcon={<Icon name="arrow-right" size={20} />}>
              Começar o próximo artigo
            </Button3D>
          </section>
        )}

        <div className="flex flex-col items-center gap-3">
          <Button3D variant="ghost" onClick={share} leadingIcon={<Icon name="share" size={18} />}>
            Partilhar o resumo
          </Button3D>
          <noscript>
            <a href={whatsappHref} className="text-caption font-bold text-brand-sky-ink underline">
              Partilhar pelo WhatsApp
            </a>
          </noscript>
        </div>

        <DataSaverBadge megabytesToday={1.2} />
      </main>
    </div>
  );
}
