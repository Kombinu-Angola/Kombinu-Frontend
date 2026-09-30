import { useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { DonutChart } from "../../components/charts/DonutChart";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Segmented } from "../../components/ui/Segmented";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import { DIFFICULTY, FORMAT_PREFERENCE, NPS, ZERO_MATCH } from "./mockAdmin";
import { KpiCard } from "./KpiCard";
import type { Kpi } from "./types";

const RANGES = [
  { value: "30d", label: "Últimos 30 dias" },
  { value: "s1", label: "1.º semestre" },
  { value: "ano", label: "Ano letivo" },
] as const;

const KPIS: Kpi[] = [
  { id: "polls", label: "Micro-enquetes analisadas", value: "84.000", trend: { value: 12.4, label: "este mês" } },
  { id: "retention", label: "Índice médio de retenção", value: "78,6%", trend: { value: 4.1, label: "face à meta" } },
  { id: "success", label: "Taxa global de sucesso", value: "91,2%", note: "Estável nos 4 campi" },
  { id: "gaps", label: "Lacunas de conteúdo ativas", value: "34", note: "Requerem recrutamento de criadores" },
];

const DONUT_COLORS = ["var(--color-brand-ocean)", "var(--color-border-cloud-strong)"];

/** ADM-05 — insights pedagógicos: dificuldade, formatos, NPS e procuras sem resultados. */
export default function InsightsScreen() {
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("30d");
  const toast = useToast();
  const topFormat = FORMAT_PREFERENCE[0];

  return (
    <AdminShell
      active="insights"
      eyebrow="Inteligência pedagógica"
      title="Insights e enquetes"
      description="Dados consolidados a partir de 84.000 micro-enquetes pós-quiz e diagnósticos de entrada."
      actions={<Segmented label="Período dos insights" options={RANGES} value={range} onChange={(value) => setRange(value)} />}
    >
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="difficulty-title" className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <h2 id="difficulty-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Cadeiras com maior dificuldade percebida
              </h2>
              <span className="rounded-full border-2 border-feedback-error bg-surface-canvas px-2.5 py-0.5 text-overline text-feedback-error-ink uppercase">
                Crítico
              </span>
            </div>
            <p className="mb-5 text-caption text-text-secondary">Índice declarado pelos estudantes nas avaliações parciais.</p>
            <ul className="flex flex-col gap-5">
              {DIFFICULTY.map((d, i) => (
                <li key={d.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-body-md font-bold text-on-surface">
                      {i + 1}. {d.subject}{" "}
                      <span className="font-medium text-text-tertiary">({d.university})</span>
                    </span>
                    <span className="shrink-0 text-body-md font-bold text-on-surface tabular-nums">{d.difficulty}%</span>
                  </div>
                  <ProgressBar
                    value={d.difficulty}
                    tone={d.difficulty >= 85 ? "streak" : "ocean"}
                    label={`Dificuldade em ${d.subject}`}
                    valueText={`${d.difficulty}% de dificuldade, ${formatInt(d.responses)} respostas`}
                  />
                  <p className="mt-1 text-caption text-text-tertiary tabular-nums">
                    {formatInt(d.responses)} respostas
                    {d.gap && <span className="ml-2 font-bold text-feedback-streak-ink">· procura por novos explicadores</span>}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-cloud pt-4">
            <p className="text-caption text-text-secondary tabular-nums">Base: 14.200 respostas</p>
            <Button3D leadingIcon={<Icon name="users" size={18} />} onClick={() => toast.show("Campanha de recrutamento criada para Macroeconomia I.")}>
              Recrutar criadores
            </Button3D>
          </div>
        </section>

        <section aria-labelledby="format-title" className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div>
            <h2 id="format-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Preferência de formato pedagógico
            </h2>
            <p className="mb-5 text-caption text-text-secondary">Formato declarado como preferido para estudar.</p>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
              <DonutChart
                slices={FORMAT_PREFERENCE.map((f, i) => ({ label: f.label, value: f.value, color: DONUT_COLORS[i] }))}
                centerValue={`${topFormat.value}%`}
                centerLabel="Micro-learning"
              />
              <dl className="flex w-full flex-col gap-3 sm:max-w-xs">
                {FORMAT_PREFERENCE.map((f, i) => (
                  <div key={f.label} className="flex items-center justify-between gap-3 rounded-xl bg-surface-soft p-3">
                    <dt className="flex items-center gap-2 text-body-md text-on-surface">
                      <span aria-hidden="true" className="size-3 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                      {f.label}
                    </dt>
                    <dd className="font-bold text-on-surface tabular-nums">{f.value}%</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <p className="mt-5 flex items-center gap-2 border-t-2 border-border-cloud pt-4 text-caption font-bold text-feedback-success-ink">
            <Icon name="check" size={16} strokeWidth={3} />
            Adoção 18 pontos acima da meta
          </p>
        </section>

        <section aria-labelledby="nps-title" className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div>
            <h2 id="nps-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              NPS por instituição
            </h2>
            <p className="mb-5 text-caption text-text-secondary">Net Promoter Score consolidado por parceira.</p>
            <ul className="flex flex-col gap-4">
              {NPS.map((n) => (
                <li key={n.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-body-md text-on-surface">{n.label}</span>
                    <span className="shrink-0 font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                      +{n.score}
                    </span>
                  </div>
                  <ProgressBar value={n.score} label={`NPS de ${n.label}`} valueText={`mais ${n.score}`} />
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 border-t-2 border-border-cloud pt-4 text-caption text-text-secondary">
            Média do ecossistema: <strong className="text-on-surface tabular-nums">+68</strong>
          </p>
        </section>

        <section aria-labelledby="zero-title" className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <h2 id="zero-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Procuras sem resultados
              </h2>
              <span className="rounded-full bg-secondary-fixed px-2.5 py-0.5 text-overline text-on-secondary-fixed-variant uppercase">
                Zero resultados
              </span>
            </div>
            <p className="mb-4 text-caption text-text-secondary">Termos procurados no marketplace que não devolvem nada.</p>
            <TableScroll label="Tabela das procuras sem resultados">
              <table className={cn(table, "min-w-0")}>
                <caption className="sr-only">Termos procurados sem resultados</caption>
                <thead>
                  <tr>
                    <th scope="col" className={th}>Termo</th>
                    <th scope="col" className={cn(th, "text-right")}>Procuras/semana</th>
                    <th scope="col" className={cn(th, "text-right")}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {ZERO_MATCH.map((z) => (
                    <tr key={z.id} className={tr}>
                      <th scope="row" className={cn(td, "font-medium")}>{z.term}</th>
                      <td className={cn(td, "text-right tabular-nums")}>{formatInt(z.searches)}</td>
                      <td className={cn(td, "text-right")}>
                        <button
                          type="button"
                          onClick={() => toast.show(`Alerta criado para "${z.term}".`)}
                          className="min-h-11 rounded-full px-3 text-button text-primary uppercase hover:bg-surface-sky"
                        >
                          Criar alerta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-cloud pt-4">
            <p className="text-caption text-text-secondary">Alertas automáticos ativos para criadores</p>
            <Button3D variant="ghost" leadingIcon={<Icon name="download" size={18} />} onClick={() => toast.show("Lista exportada em CSV.")}>
              Exportar lista
            </Button3D>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
