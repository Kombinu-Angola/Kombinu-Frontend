import { useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { AreaChart } from "../../components/charts/AreaChart";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Segmented } from "../../components/ui/Segmented";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatInt, formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";

const PRICE_KZ = 5000;
const GRACE_DAYS = 7;

const MONTHS = [
  { value: "set", label: "Setembro de 2026" },
  { value: "ago", label: "Agosto de 2026" },
  { value: "jul", label: "Julho de 2026" },
] as const;

/** Ciclo de cobrança: cada conta está exatamente num estado. */
const PIPELINE = [
  { id: "ativos", label: "Cobrados com sucesso", accounts: 346, tone: "bg-feedback-success", text: "text-feedback-success-ink" },
  { id: "tolerancia", label: `Em tolerância (${GRACE_DAYS} dias)`, accounts: 24, tone: "bg-feedback-streak", text: "text-feedback-streak-ink" },
  { id: "perdidos", label: "Perdidos para o plano grátis", accounts: 19, tone: "bg-border-cloud-strong", text: "text-text-secondary" },
] as const;

const RENEWALS = [
  { id: "r1", creator: "Teresa Bento", phone: "912 ••• 678", attempt: 2, nextAttempt: "amanhã, 09:00", daysLeft: 5, university: "UAN" },
  { id: "r2", creator: "Hamilton Kiala", phone: "941 ••• 884", attempt: 3, nextAttempt: "hoje, 18:00", daysLeft: 1, university: "UCAN" },
  { id: "r3", creator: "Domingos Pascoal", phone: "923 ••• 112", attempt: 1, nextAttempt: "amanhã, 09:00", daysLeft: 6, university: "ISAF" },
  { id: "r4", creator: "Célia Ngola", phone: "939 ••• 331", attempt: 2, nextAttempt: "dentro de 2 dias", daysLeft: 3, university: "UAN" },
];

const MRR_SERIES = [
  { label: "Abr", value: 1_120_000 },
  { label: "Mai", value: 1_285_000 },
  { label: "Jun", value: 1_390_000 },
  { label: "Jul", value: 1_495_000 },
  { label: "Ago", value: 1_563_000 },
  { label: "Set", value: 1_730_000 },
];

/** ADM-SUB-01 — receita recorrente das subscrições Pro e estado das cobranças. */
export default function SubscriptionsReportScreen() {
  const [month, setMonth] = useState<(typeof MONTHS)[number]["value"]>("set");
  const toast = useToast();

  // Tudo o que se segue deriva do pipeline: contas, MRR e valores em risco.
  const active = PIPELINE[0].accounts;
  const grace = PIPELINE[1].accounts;
  const lost = PIPELINE[2].accounts;
  const totalCycle = active + grace + lost;
  const mrr = active * PRICE_KZ;
  const atRisk = grace * PRICE_KZ;
  const retention = Math.round((active / totalCycle) * 1000) / 10;
  const creatorsTotal = 2_640;
  const conversion = Math.round((active / creatorsTotal) * 1000) / 10;

  return (
    <AdminShell
      active="subscricoes"
      eyebrow="Financeiro · receita recorrente"
      title="Subscrições Pro"
      description={`Mensalidade de ${formatKz(PRICE_KZ)} por criador, cobrada por Multicaixa Express em ciclos de 30 dias.`}
      actions={
        <>
          <Segmented label="Mês de faturação" options={MONTHS} value={month} onChange={(value) => setMonth(value)} />
          <Button3D
            variant="ghost"
            leadingIcon={<Icon name="download" size={18} />}
            onClick={() => toast.show("Exportação contabilística em preparação.")}
          >
            Exportar
          </Button3D>
        </>
      }
    >
      <section aria-label="Indicadores de receita" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <p className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
            Receita recorrente mensal
            <Icon name="wallet" size={20} className="text-primary" />
          </p>
          <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-primary tabular-nums">
            {formatKz(mrr)}
          </p>
          <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary tabular-nums">
            {formatInt(active)} contas cobradas × {formatKz(PRICE_KZ)}
          </p>
        </article>

        <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <p className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
            Criadores com Pro ativo
            <Icon name="seal" size={20} className="text-brand-sunbeam-ink" />
          </p>
          <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-on-surface tabular-nums">
            {formatInt(active + grace)}
          </p>
          <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary tabular-nums">
            Inclui os {grace} em tolerância, que mantêm 0% de comissão
          </p>
        </article>

        <article className="rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-5">
          <p className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
            Em período de tolerância
            <Icon name="clock" size={20} className="text-feedback-streak-ink" />
          </p>
          <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-feedback-streak-ink tabular-nums">
            {grace} contas
          </p>
          <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary tabular-nums">
            {formatKz(atRisk)} por confirmar neste ciclo
          </p>
        </article>

        <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <p className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
            Retenção do ciclo
            <Icon name="trend-up" size={20} className="text-feedback-success-ink" />
          </p>
          <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-feedback-success-ink tabular-nums">
            {retention.toLocaleString("pt-AO")}%
          </p>
          <p className="mt-2 border-t-2 border-border-cloud pt-2 text-caption text-text-secondary tabular-nums">
            {lost} contas passaram ao plano grátis · conversão de criadores: {conversion.toLocaleString("pt-AO")}%
          </p>
        </article>
      </section>

      <section
        aria-labelledby="mrr-title"
        className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b-2 border-border-cloud pb-4">
          <div>
            <h2 id="mrr-title" className="font-montserrat text-headline-h2 text-on-surface">
              Evolução da receita recorrente
            </h2>
            <p className="mt-1 text-body-md text-text-secondary">Últimos seis ciclos de cobrança, em Kwanzas.</p>
          </div>
          <p className="rounded-full bg-feedback-success-soft px-3 py-1 text-caption font-bold text-feedback-success-ink tabular-nums">
            +{Math.round(((MRR_SERIES[5].value - MRR_SERIES[4].value) / MRR_SERIES[4].value) * 1000) / 10}% face ao mês
            anterior
          </p>
        </div>

        <AreaChart points={MRR_SERIES} unit="Kz" label="Receita recorrente mensal dos últimos seis ciclos, em Kwanzas" />
      </section>

      <section
        aria-labelledby="pipeline-title"
        className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6"
      >
        <h2 id="pipeline-title" className="font-montserrat text-headline-h2 text-on-surface">
          Estado das cobranças do ciclo
        </h2>
        <p className="mt-1 mb-4 text-body-md text-text-secondary tabular-nums">
          {formatInt(totalCycle)} contas entraram neste ciclo de cobrança.
        </p>

        <ul className="flex flex-col gap-4">
          {PIPELINE.map((stage) => {
            const share = Math.round((stage.accounts / totalCycle) * 1000) / 10;
            return (
              <li key={stage.id}>
                <p className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="flex items-center gap-2 text-body-md text-on-surface">
                    <span aria-hidden="true" className={cn("size-3 rounded-full", stage.tone)} />
                    {stage.label}
                  </span>
                  <span className={cn("text-caption font-bold tabular-nums", stage.text)}>
                    {stage.accounts} contas ({share.toLocaleString("pt-AO")}%) · {formatKz(stage.accounts * PRICE_KZ)}
                  </span>
                </p>
                <ProgressBar
                  value={stage.accounts}
                  max={totalCycle}
                  size="sm"
                  tone={stage.id === "tolerancia" ? "streak" : "ocean"}
                  label={stage.label}
                  valueText={`${stage.accounts} de ${totalCycle} contas`}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="renewals-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="renewals-title" className="font-montserrat text-headline-h2 text-on-surface">
              Renovações por confirmar
            </h2>
            <p className="text-body-md text-text-secondary">
              Contas em tolerância. Uma nova tentativa é enviada ao telemóvel a cada 48 horas.
            </p>
          </div>
          <Button3D onClick={() => toast.show(`${RENEWALS.length} lembretes enviados por SMS.`)} leadingIcon={<Icon name="bell" size={18} />}>
            Enviar lembretes
          </Button3D>
        </div>

        <TableScroll label="Tabela das renovações por confirmar">
          <table className={table}>
            <caption className="sr-only">Criadores em período de tolerância</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Criador</th>
                <th scope="col" className={th}>Telemóvel</th>
                <th scope="col" className={cn(th, "text-right")}>Tentativa</th>
                <th scope="col" className={th}>Próxima tentativa</th>
                <th scope="col" className={th}>Tolerância</th>
                <th scope="col" className={cn(th, "text-right")}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {RENEWALS.map((row) => {
                const urgent = row.daysLeft <= 2;
                return (
                  <tr key={row.id} className={tr}>
                    <th scope="row" className={cn(td, "font-normal")}>
                      <span className="block font-bold text-on-surface">{row.creator}</span>
                      <span className="block text-caption text-text-tertiary">{row.university}</span>
                    </th>
                    <td className={cn(td, "text-text-secondary tabular-nums")}>{row.phone}</td>
                    <td className={cn(td, "text-right tabular-nums")}>{row.attempt} de 3</td>
                    <td className={cn(td, "whitespace-nowrap text-text-secondary")}>{row.nextAttempt}</td>
                    <td className={td}>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border-2 bg-surface-canvas px-2.5 py-0.5 text-caption font-bold whitespace-nowrap tabular-nums",
                          urgent ? "border-feedback-error text-feedback-error-ink" : "border-border-cloud text-text-secondary",
                        )}
                      >
                        <Icon name="clock" size={14} />
                        {row.daysLeft} {row.daysLeft === 1 ? "dia" : "dias"}
                      </span>
                    </td>
                    <td className={cn(td, "text-right font-bold whitespace-nowrap tabular-nums")}>{formatKz(PRICE_KZ)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableScroll>

        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-surface-soft p-4 text-caption text-text-secondary">
          <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-primary" />
          Enquanto a tolerância durar, estas contas mantêm 0% de comissão. A passagem ao plano grátis só acontece
          depois de {GRACE_DAYS} dias sem autorização.
        </p>
      </section>
    </AdminShell>
  );
}
