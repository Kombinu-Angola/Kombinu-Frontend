import { useMemo, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatInt, formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";

const PERIODS = [
  { value: "2026-09", label: "Setembro de 2026" },
  { value: "2026-08", label: "Agosto de 2026" },
  { value: "2026-07", label: "Julho de 2026" },
];

type RevenueLine = {
  id: string;
  label: string;
  transactions: number;
  grossKz: number;
  /** Comissão retida pela Kombinu; 0 quando a receita é toda da plataforma. */
  commissionKz: number;
  /** Retenção na fonte aplicável ao repasse, quando existe. */
  withholdingKz: number;
  note: string;
};

const LINES: RevenueLine[] = [
  {
    id: "sebentas",
    label: "Venda de sebentas e simulados (plano grátis)",
    transactions: 1284,
    grossKz: 2_310_000,
    commissionKz: 693_000,
    withholdingKz: 103_950,
    note: "Comissão de 30%; retenção sobre o repasse ao criador",
  },
  {
    id: "sebentas-pro",
    label: "Venda de sebentas e simulados (criadores Pro)",
    transactions: 742,
    grossKz: 1_420_000,
    commissionKz: 0,
    withholdingKz: 99_400,
    note: "Sem comissão; retenção sobre o repasse ao criador",
  },
  {
    id: "subscricoes",
    label: "Subscrições Kombinu Pro",
    transactions: 346,
    grossKz: 1_730_000,
    commissionKz: 1_730_000,
    withholdingKz: 0,
    note: "Receita integral da plataforma, sem repasse",
  },
];

type FiscalExportScreenProps = { entityName: string; nif: string };

/** Exportação contabilística e preparação do ficheiro SAF-T (AO) para a contabilidade. */
export default function FiscalExportScreen({ entityName, nif }: FiscalExportScreenProps) {
  const [period, setPeriod] = useState(PERIODS[0].value);
  const [generated, setGenerated] = useState(false);
  const toast = useToast();

  const totals = useMemo(
    () => ({
      transactions: LINES.reduce((sum, l) => sum + l.transactions, 0),
      gross: LINES.reduce((sum, l) => sum + l.grossKz, 0),
      commission: LINES.reduce((sum, l) => sum + l.commissionKz, 0),
      withholding: LINES.reduce((sum, l) => sum + l.withholdingKz, 0),
      net: LINES.reduce((sum, l) => sum + (l.grossKz - l.commissionKz - l.withholdingKz), 0),
    }),
    [],
  );

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <AdminShell
      active="fiscal"
      eyebrow="Financeiro · contabilidade"
      title="Exportação contabilística"
      description="Prepara o ficheiro SAF-T (AO) e o livro de vendas do período, para entrega à contabilidade."
      actions={
        <>
          <SelectField id="fiscal-period" label="Período" options={PERIODS} value={period} onChange={(e) => setPeriod(e.target.value)} />
          <Button3D variant="ghost" onClick={() => toast.show("Conciliação com a EMIS atualizada.")} leadingIcon={<Icon name="refresh" size={18} />}>
            Conciliar com a EMIS
          </Button3D>
        </>
      }
    >
      <section
        aria-labelledby="entity-title"
        className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 md:flex-row md:items-center"
      >
        <h2 id="entity-title" className="flex items-center gap-3 text-body-md text-on-surface">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <Icon name="shield" size={22} />
          </span>
          <span>
            <span className="block font-bold">{entityName}</span>
            <span className="block text-caption text-text-secondary tabular-nums">
              NIF {nif} · período de {periodLabel.toLowerCase()}
            </span>
          </span>
        </h2>
        <p className="rounded-full bg-surface-soft px-3.5 py-1.5 text-caption text-text-secondary tabular-nums">
          {formatInt(totals.transactions)} transações conciliadas
        </p>
      </section>

      <section aria-label="Totais do período" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { id: "bruto", label: "Receita bruta", value: formatKz(totals.gross), note: "Antes de comissão e retenções", tone: "text-on-surface" },
          { id: "comissao", label: "Receita da Kombinu", value: formatKz(totals.commission), note: "Comissões e subscrições", tone: "text-primary" },
          { id: "retencao", label: "Retenção na fonte", value: formatKz(totals.withholding), note: "A entregar nos termos aplicáveis", tone: "text-feedback-streak-ink" },
          { id: "liquido", label: "Repasse líquido a criadores", value: formatKz(totals.net), note: "Já pago ou em fila", tone: "text-feedback-success-ink" },
        ].map((tile) => (
          <article key={tile.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
            <p className="text-overline text-text-tertiary uppercase">{tile.label}</p>
            <p className={cn("mt-1.5 font-montserrat text-headline-h2 font-extrabold tabular-nums", tile.tone)}>{tile.value}</p>
            <p className="mt-1 text-caption text-text-secondary">{tile.note}</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="lines-title" className="mb-6">
        <h2 id="lines-title" className="mb-3 font-montserrat text-headline-h2 text-on-surface">
          Receita por tipo
        </h2>
        <TableScroll label="Tabela da receita por tipo">
          <table className={cn(table, "min-w-[940px]")}>
            <caption className="sr-only">Decomposição da receita do período</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Tipo de receita</th>
                <th scope="col" className={cn(th, "text-right")}>Transações</th>
                <th scope="col" className={cn(th, "text-right")}>Valor bruto</th>
                <th scope="col" className={cn(th, "text-right")}>Comissão Kombinu</th>
                <th scope="col" className={cn(th, "text-right")}>Retenção na fonte</th>
                <th scope="col" className={cn(th, "text-right")}>Repasse líquido</th>
              </tr>
            </thead>
            <tbody>
              {LINES.map((line) => (
                <tr key={line.id} className={tr}>
                  <th scope="row" className={cn(td, "font-normal")}>
                    <span className="block font-bold text-on-surface">{line.label}</span>
                    <span className="block text-caption text-text-tertiary">{line.note}</span>
                  </th>
                  <td className={cn(td, "text-right tabular-nums")}>{formatInt(line.transactions)}</td>
                  <td className={cn(td, "text-right whitespace-nowrap tabular-nums")}>{formatKz(line.grossKz)}</td>
                  <td className={cn(td, "text-right whitespace-nowrap text-text-secondary tabular-nums")}>
                    {line.commissionKz === 0 ? "—" : formatKz(line.commissionKz)}
                  </td>
                  <td className={cn(td, "text-right whitespace-nowrap text-text-secondary tabular-nums")}>
                    {line.withholdingKz === 0 ? "—" : formatKz(line.withholdingKz)}
                  </td>
                  <td className={cn(td, "text-right font-bold whitespace-nowrap text-primary tabular-nums")}>
                    {formatKz(line.grossKz - line.commissionKz - line.withholdingKz)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border-cloud bg-surface-soft">
                <th scope="row" className={cn(td, "font-bold")}>
                  Total do período
                </th>
                <td className={cn(td, "text-right font-bold tabular-nums")}>{formatInt(totals.transactions)}</td>
                <td className={cn(td, "text-right font-bold whitespace-nowrap tabular-nums")}>{formatKz(totals.gross)}</td>
                <td className={cn(td, "text-right font-bold whitespace-nowrap tabular-nums")}>{formatKz(totals.commission)}</td>
                <td className={cn(td, "text-right font-bold whitespace-nowrap tabular-nums")}>{formatKz(totals.withholding)}</td>
                <td className={cn(td, "text-right font-bold whitespace-nowrap tabular-nums")}>{formatKz(totals.net)}</td>
              </tr>
            </tfoot>
          </table>
        </TableScroll>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section aria-labelledby="saft-title" className="rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-5 sm:p-6">
          <h2 id="saft-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
            <Icon name="file" size={22} className="text-primary" />
            Ficheiro SAF-T (AO), em XML
          </h2>
          <p className="mt-2 text-body-md text-text-secondary">
            Reúne a faturação do período na estrutura SAF-T (AO), para a contabilidade validar e submeter.
          </p>

          <dl className="mt-4 flex flex-col gap-2 rounded-2xl bg-surface-soft p-4 text-caption">
            {[
              { label: "Período", value: periodLabel },
              { label: "Documentos incluídos", value: `${formatInt(totals.transactions)} recibos` },
              { label: "Total faturado", value: formatKz(totals.gross) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <dt className="text-text-secondary">{row.label}</dt>
                <dd className="font-bold text-on-surface tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>

          <Button3D
            fullWidth
            className="mt-4"
            onClick={() => {
              setGenerated(true);
              toast.show("Ficheiro gerado. Entrega-o à contabilidade para validação.");
            }}
            leadingIcon={<Icon name="download" size={18} />}
          >
            Gerar ficheiro de {periodLabel.split(" ")[0].toLowerCase()}
          </Button3D>

          {generated && (
            <p role="status" className="mt-3 flex items-start gap-2 rounded-xl border-2 border-feedback-success bg-surface-canvas p-3 text-caption text-text-secondary tabular-nums">
              <Icon name="check" size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
              saft-ao-{period}.xml pronto a descarregar.
            </p>
          )}
        </section>

        <section aria-labelledby="book-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="book-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
            <Icon name="chart" size={22} className="text-primary" />
            Livro de vendas e retenções
          </h2>
          <p className="mt-2 text-body-md text-text-secondary">
            Folha de cálculo com uma linha por transação, para conferência e importação no software de contabilidade.
          </p>

          <ul className="mt-4 flex flex-col gap-2 rounded-2xl bg-surface-soft p-4 text-caption text-text-secondary">
            {[
              "Data, referência EMIS e telemóvel mascarado",
              "Valor bruto, comissão, retenção e líquido por linha",
              "Identificação do criador para efeitos de repasse",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Icon name="check" size={14} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                {item}
              </li>
            ))}
          </ul>

          <Button3D variant="secondary" fullWidth className="mt-4" onClick={() => toast.show("Folha de cálculo gerada.")} leadingIcon={<Icon name="download" size={18} />}>
            Descarregar folha de cálculo
          </Button3D>
        </section>
      </div>

      <p className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-4 text-body-md text-text-secondary">
        <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
        <span>
          <strong className="text-on-surface">Antes de submeter:</strong> estes ficheiros são gerados a partir dos
          dados da plataforma e servem de base ao trabalho da contabilidade. As taxas de retenção e o enquadramento
          fiscal são parâmetros configuráveis e têm de ser confirmados pelo contabilista certificado da entidade
          antes de qualquer entrega oficial.
        </span>
      </p>
    </AdminShell>
  );
}
