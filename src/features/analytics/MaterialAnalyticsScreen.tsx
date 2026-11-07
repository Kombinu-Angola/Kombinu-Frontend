import { useMemo } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { MaterialAnalytics } from "./types";

const rating1 = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type MaterialAnalyticsScreenProps = { analytics: MaterialAnalytics; creatorName: string; materialsHref: string };

/** Analítica pedagógica de um material: onde os estudantes param e que perguntas falham. */
export default function MaterialAnalyticsScreen({ analytics, creatorName, materialsHref }: MaterialAnalyticsScreenProps) {
  const toast = useToast();
  const first = analytics.funnel[0];
  const last = analytics.funnel[analytics.funnel.length - 1];
  const completion = Math.round((last.readers / first.readers) * 1000) / 10;

  const totalAnswers = analytics.questions.reduce((sum, q) => sum + q.answers, 0);
  const weightedAccuracy = Math.round(
    analytics.questions.reduce((sum, q) => sum + q.accuracy * q.answers, 0) / (totalAnswers || 1),
  );

  // A maior perda é calculada, não escrita à mão: era isso que estava errado no desenho original.
  const biggestDrop = useMemo(() => {
    let worst = { from: analytics.funnel[0], to: analytics.funnel[0], lost: 0, pct: 0 };
    for (let i = 1; i < analytics.funnel.length; i += 1) {
      const from = analytics.funnel[i - 1];
      const to = analytics.funnel[i];
      const lost = from.readers - to.readers;
      if (lost > worst.lost) worst = { from, to, lost, pct: Math.round((lost / from.readers) * 100) };
    }
    return worst;
  }, [analytics.funnel]);

  const hardest = [...analytics.questions].sort((a, b) => a.accuracy - b.accuracy)[0];

  const kpis = [
    {
      id: "buyers",
      label: "Estudantes com acesso",
      value: formatInt(analytics.buyers.total),
      note: `${analytics.buyers.marketplace} pelo marketplace, ${analytics.buyers.directLink} por ligação direta`,
      tone: "text-primary",
    },
    {
      id: "completion",
      label: "Leitura até ao fim",
      value: `${completion.toLocaleString("pt-AO")}%`,
      note: `Média da faculdade: ${analytics.facultyAverageCompletion}%`,
      tone: "text-feedback-success-ink",
    },
    {
      id: "accuracy",
      label: "Acerto médio nos quizzes",
      value: `${weightedAccuracy}%`,
      note: `${analytics.questions.length} questões · ${formatInt(totalAnswers)} respostas`,
      tone: "text-feedback-streak-ink",
    },
    {
      id: "rating",
      label: "Avaliação dos estudantes",
      value: `${rating1.format(analytics.rating)} / 5`,
      note: `${analytics.reviews} avaliações depois do gabarito`,
      tone: "text-brand-sunbeam-ink",
    },
  ];

  return (
    <CreatorShell
      active="materiais"
      creatorName={creatorName}
      actions={
        <Button3D
          variant="ghost"
          leadingIcon={<Icon name="download" size={18} />}
          onClick={() => toast.show("Relatório a ser gerado em CSV.")}
        >
          Descarregar relatório
        </Button3D>
      }
    >
      <div className="mx-auto max-w-[1140px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href={materialsHref} className="hover:text-primary">
            Os meus materiais
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            Analítica
          </span>
        </nav>

        <header className="mb-7">
          <p className="text-overline text-primary uppercase">
            Relatório pedagógico · {analytics.university} {analytics.subject}
          </p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            {analytics.title}
          </h1>
          <p className="mt-1 max-w-3xl text-body-md text-text-secondary">
            Leitura, acertos e feedback dos estudantes que compraram este material.
          </p>
        </header>

        <section aria-label="Indicadores" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
              <p className="text-overline text-text-tertiary uppercase">{kpi.label}</p>
              <p className={cn("mt-2 font-montserrat text-headline-h1-mobile font-extrabold tabular-nums", kpi.tone)}>
                {kpi.value}
              </p>
              <p className="mt-1 text-caption text-text-secondary tabular-nums">{kpi.note}</p>
            </article>
          ))}
        </section>

        <section
          aria-labelledby="funnel-title"
          className="mb-8 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6"
        >
          <div className="border-b-2 border-border-cloud pb-4">
            <h2 id="funnel-title" className="font-montserrat text-headline-h2 text-on-surface">
              Onde os estudantes param
            </h2>
            <p className="mt-1 text-body-md text-text-secondary">
              Quantos chegaram ao fim de cada módulo, e quanto tempo demoraram.
            </p>
          </div>

          <ol className="mt-6 flex flex-col gap-6">
            {analytics.funnel.map((step) => {
              const share = Math.round((step.readers / first.readers) * 1000) / 10;
              return (
                <li key={step.id}>
                  <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 text-body-md font-bold text-on-surface">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-caption text-on-primary-fixed tabular-nums">
                        {step.order}
                      </span>
                      {step.title}
                    </p>
                    <p className="text-caption text-text-secondary tabular-nums">
                      {step.readers} estudantes ({share.toLocaleString("pt-AO")}%) ·{" "}
                      <span className="font-bold text-primary">{step.avgMinutes} min em média</span>
                    </p>
                  </div>
                  <ProgressBar
                    value={step.readers}
                    max={first.readers}
                    label={`Leitores do módulo ${step.order}`}
                    valueText={`${step.readers} de ${first.readers} estudantes`}
                  />
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex items-start gap-3.5 rounded-2xl bg-surface-sky p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-canvas text-primary">
              <Icon name="lightbulb" size={20} />
            </span>
            <p className="text-body-md text-on-surface tabular-nums">
              <strong className="text-primary">Onde perdes mais leitores:</strong> entre o módulo {biggestDrop.from.order}{" "}
              e o módulo {biggestDrop.to.order}, saem {biggestDrop.lost} estudantes ({biggestDrop.pct}%). O módulo{" "}
              {biggestDrop.to.order} é também o mais demorado, com {biggestDrop.to.avgMinutes} minutos de leitura. Vale a
              pena partir a matéria em duas partes ou juntar um exemplo resolvido antes da teoria.
            </p>
          </div>
        </section>

        <section aria-labelledby="questions-title">
          <div className="mb-4">
            <h2 id="questions-title" className="font-montserrat text-headline-h2 text-on-surface">
              Auditoria das perguntas
            </h2>
            <p className="text-body-md text-text-secondary">
              Questões abaixo de 50% de acerto costumam estar mal formuladas, não difíceis.
            </p>
          </div>

          <TableScroll label="Tabela da auditoria das perguntas">
            <table className={table}>
              <caption className="sr-only">Desempenho de cada pergunta do material</caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Questão</th>
                  <th scope="col" className={cn(th, "text-right")}>Respostas</th>
                  <th scope="col" className={th}>Acerto</th>
                  <th scope="col" className={th}>Alternativa errada mais escolhida</th>
                  <th scope="col" className={cn(th, "text-right")}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {analytics.questions.map((question) => {
                  const critical = question.accuracy < 50;
                  return (
                    <tr key={question.id} className={tr}>
                      <th scope="row" className={cn(td, "max-w-sm font-normal")}>
                        <span className="block font-bold text-on-surface">
                          Questão {question.order}: {question.prompt}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-caption text-text-tertiary">
                          <Icon name="book" size={14} />
                          {question.anchor}
                        </span>
                      </th>
                      <td className={cn(td, "text-right tabular-nums")}>{question.answers}</td>
                      <td className={cn(td, "min-w-[140px]")}>
                        <span
                          className={cn(
                            "mb-1 flex items-center gap-1.5 font-bold tabular-nums",
                            critical ? "text-feedback-error-ink" : question.accuracy < 70 ? "text-feedback-streak-ink" : "text-feedback-success-ink",
                          )}
                        >
                          {critical && <Icon name="alert" size={15} />}
                          {question.accuracy}%
                        </span>
                        <ProgressBar
                          value={question.accuracy}
                          size="sm"
                          tone={critical ? "streak" : "ocean"}
                          label={`Acerto da questão ${question.order}`}
                          valueText={`${question.accuracy}% de acerto`}
                        />
                      </td>
                      <td className={cn(td, "max-w-xs")}>
                        <span className="block text-caption text-text-secondary">{question.topDistractor.text}</span>
                        <span className="text-caption font-bold text-text-tertiary tabular-nums">
                          escolhida por {question.topDistractor.share}%
                        </span>
                      </td>
                      <td className={cn(td, "text-right")}>
                        <Button3D
                          variant={critical ? "primary" : "ghost"}
                          onClick={() => (window.location.assign("/v2/estudio"))}
                        >
                          Rever
                          <span className="sr-only"> a questão {question.order}</span>
                        </Button3D>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>

          <p className="mt-4 flex items-start gap-2 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-4 text-body-md text-text-secondary tabular-nums">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
            A questão {hardest.order} tem {hardest.accuracy}% de acerto e {hardest.topDistractor.share}% dos estudantes
            escolhem a mesma alternativa errada. Quando um distrator atrai mais gente do que a resposta certa, costuma
            ser sinal de enunciado ambíguo.
          </p>
        </section>
      </div>
    </CreatorShell>
  );
}
