import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import { mensagemErroEnquete } from "../../services/surveyService";
import type { SurveyResult } from "./types";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "long", year: "numeric" });

type SurveyResultsScreenProps = {
  result: SurveyResult;
  creatorName: string;
  /** Fecha a enquete (activa -> encerrada). Só aparece enquanto está aberta. */
  onClose: () => Promise<void>;
};

/** Resultados da enquete, com devolução a quem respondeu: é isso que faz as pessoas responderem outra vez. */
export default function SurveyResultsScreen({ result, creatorName, onClose }: SurveyResultsScreenProps) {
  const [closing, setClosing] = useState(false);
  const toast = useToast();
  const open = result.closedAt === null;

  // `shown` pode ser 0 numa enquete recém-ativada: sem divisão por zero.
  const pct = (n: number) => (result.shown === 0 ? 0 : Math.round((n / result.shown) * 100));
  const responseRate = pct(result.answers);
  const dismissRate = pct(result.dismissed);
  const noisy = dismissRate > 60;
  const top = [...result.distribution].sort((a, b) => b.value - a.value)[0];

  const fechar = async () => {
    setClosing(true);
    try {
      await onClose();
      toast.show("Enquete fechada. Deixou de receber respostas.");
    } catch (err) {
      toast.show(mensagemErroEnquete(err, "Não foi possível fechar a enquete."), "error");
    } finally {
      setClosing(false);
    }
  };

  return (
    <CreatorShell active="materiais" creatorName={creatorName}>
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href="/v2/estudio/enquete" className="hover:text-primary">
            Micro-enquetes
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            Resultados
          </span>
        </nav>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">
            {result.subject ? `${result.subject} · ` : ""}
            {open ? "a decorrer" : `fechada a ${dateFormat.format(new Date(result.closedAt as string))}`}
          </p>
          <h1 className="mt-1 font-montserrat text-headline-h2 text-balance text-on-surface sm:text-headline-h1">
            {result.question}
          </h1>
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-surface-sky p-3.5 text-body-md text-on-surface">
            <Icon name="target" size={18} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <strong>Decisão que ficou combinada:</strong> {result.decision}
            </span>
          </p>
        </header>

        {open && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-3.5">
            <p className="text-body-md text-on-surface">A enquete continua a receber respostas.</p>
            <Button3D variant="danger-outline" disabled={closing} onClick={() => void fechar()}>
              {closing ? "A fechar…" : "Fechar enquete"}
            </Button3D>
          </div>
        )}

        <section aria-label="Saúde da recolha" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { id: "respostas", label: "Respostas", value: String(result.answers), note: result.shown === 1 ? "1 estudante viu a pergunta" : `${result.shown} estudantes viram a pergunta`, tone: "text-primary" },
            { id: "taxa", label: "Taxa de resposta", value: `${responseRate}%`, note: "Acima de 50% é saudável numa micro-enquete", tone: "text-feedback-success-ink" },
            {
              id: "dispensa",
              label: "Taxa de dispensa",
              value: `${dismissRate}%`,
              note: noisy ? "Acima de 60%: a pergunta está a incomodar" : "Dentro do normal",
              tone: noisy ? "text-feedback-error-ink" : "text-text-secondary",
            },
          ].map((tile) => (
            <article key={tile.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
              <p className="text-overline text-text-tertiary uppercase">{tile.label}</p>
              <p className={cn("mt-1.5 font-montserrat text-headline-h1-mobile font-extrabold tabular-nums", tile.tone)}>
                {tile.value}
              </p>
              <p className="mt-1 text-caption text-text-secondary tabular-nums">{tile.note}</p>
            </article>
          ))}
        </section>

        <section aria-labelledby="dist-title" className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="dist-title" className="mb-4 font-montserrat text-headline-h3 font-extrabold text-on-surface">
            Distribuição das respostas
          </h2>

          <ul className="flex flex-col gap-4">
            {result.distribution.map((item) => {
              const isTop = item.label === top.label;
              return (
                <li key={item.label}>
                  <p className="mb-1.5 flex items-baseline justify-between gap-3 text-body-md">
                    <span className={cn(isTop ? "font-bold text-on-surface" : "text-text-secondary")}>{item.label}</span>
                    <span className="font-bold tabular-nums text-on-surface">
                      {item.value}% <span className="font-normal text-text-tertiary">({Math.round((item.value / 100) * result.answers)})</span>
                    </span>
                  </p>
                  <ProgressBar
                    value={item.value}
                    tone={isTop ? "ocean" : "gem"}
                    size={isTop ? "md" : "sm"}
                    label={`Respostas em ${item.label}`}
                    valueText={`${item.value} por cento`}
                  />
                </li>
              );
            })}
          </ul>

          <p className="mt-5 flex items-start gap-2 border-t-2 border-border-cloud pt-4 text-caption text-text-secondary tabular-nums">
            <Icon name="lightbulb" size={16} className="mt-0.5 shrink-0 text-primary" />
            {top && result.answers > 0
              ? `A opção mais escolhida foi "${top.label}", com ${top.value}% das respostas. É o número que decide, segundo o que combinaste à partida.`
              : "Ainda sem respostas. Os números aparecem assim que as primeiras chegarem."}
          </p>
        </section>

        <section aria-labelledby="year-title" className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="year-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
            Corte por ano curricular
          </h2>
          <p className="mt-0.5 mb-4 text-caption text-text-secondary">
            Os cortes param aqui: as respostas são anónimas e não há vista por estudante.
          </p>

          <ul className="flex flex-col gap-3">
            {result.byYear.map((row) => (
              <li key={row.year} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-soft p-4">
                <span>
                  <span className="block text-body-md font-bold text-on-surface">{row.year}</span>
                  <span className="block text-caption text-text-tertiary tabular-nums">{row.answers} {row.answers === 1 ? "resposta" : "respostas"}</span>
                </span>
                <span className="text-right">
                  <span className="block text-caption text-text-secondary">Resposta mais comum</span>
                  <span className="block text-body-md font-bold text-primary tabular-nums">
                    {row.topChoice} ({row.share}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </CreatorShell>
  );
}
