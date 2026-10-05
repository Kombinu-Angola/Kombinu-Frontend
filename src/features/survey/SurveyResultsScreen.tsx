import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import type { SurveyResult } from "./types";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "long", year: "numeric" });

type SurveyResultsScreenProps = { result: SurveyResult; creatorName: string };

/** Resultados da enquete, com devolução a quem respondeu: é isso que faz as pessoas responderem outra vez. */
export default function SurveyResultsScreen({ result, creatorName }: SurveyResultsScreenProps) {
  const [message, setMessage] = useState(
    "Obrigado às 138 pessoas que responderam. Quatro em cada dez acharam o tempo apertado, por isso o próximo simulado passa a ter 120 segundos por questão.",
  );
  const toast = useToast();

  const responseRate = Math.round((result.answers / result.shown) * 100);
  const dismissRate = Math.round((result.dismissed / result.shown) * 100);
  const noisy = dismissRate > 60;
  const top = [...result.distribution].sort((a, b) => b.value - a.value)[0];

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
            {result.subject} · fechada a {dateFormat.format(new Date(result.closedAt))}
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

        <section aria-label="Saúde da recolha" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { id: "respostas", label: "Respostas", value: String(result.answers), note: `${result.shown} estudantes viram a pergunta`, tone: "text-primary" },
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="dist-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Distribuição das respostas
            </h2>
            <Button3D variant="ghost" onClick={() => toast.show("Exportação agregada em CSV iniciada.")} leadingIcon={<Icon name="download" size={18} />}>
              Exportar dados agregados
            </Button3D>
          </div>

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
            Somando "muito curto" e "apertado", {result.distribution[0].value + result.distribution[1].value}% sentiram
            falta de tempo. É o número que decide, segundo o que combinaste à partida.
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
                  <span className="block text-caption text-text-tertiary tabular-nums">{row.answers} respostas</span>
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

        <section aria-labelledby="return-title" className="rounded-3xl border-2 border-feedback-success bg-surface-canvas p-5 sm:p-6">
          <h2 id="return-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
            <Icon name="comment" size={22} className="text-feedback-success-ink" />
            Devolver a conclusão a quem respondeu
          </h2>
          <p id="return-hint" className="mt-1 mb-3 text-caption text-text-secondary">
            Fecha o ciclo. Quem vê que a resposta serviu para alguma coisa volta a responder da próxima vez.
          </p>

          <label htmlFor="return-message" className="sr-only">
            Mensagem de devolução
          </label>
          <textarea
            id="return-message"
            rows={3}
            value={message}
            aria-describedby="return-hint"
            onChange={(e) => setMessage(e.target.value)}
            className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3.5 text-body-md text-on-surface"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button3D variant="ghost" onClick={() => toast.show("Devolução guardada como rascunho.")}>
              Guardar rascunho
            </Button3D>
            <Button3D
              disabled={message.trim().length < 20}
              onClick={() => toast.show(`Devolução publicada para ${result.answers} estudantes.`)}
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              Publicar devolução
            </Button3D>
          </div>
        </section>
      </div>
    </CreatorShell>
  );
}
