import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { Segmented } from "../../components/ui/Segmented";
import { SlideOver } from "../../components/ui/SlideOver";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { formatActivityTime, formatInt, formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { CreatorFinance } from "./types";

const RANGES = [
  { value: "7d", label: "7 dias" },
  { value: "mes", label: "Este mês" },
  { value: "total", label: "Acumulado" },
] as const;

const STATUS = {
  liquidado: { label: "Liquidado", className: "bg-surface-forest text-feedback-success" },
  "a caminho": { label: "A caminho", className: "bg-secondary-fixed text-on-secondary-fixed-variant" },
  devolvido: { label: "Devolvido", className: "border-2 border-feedback-error bg-surface-canvas text-feedback-error-ink" },
} as const;

const MIN_WITHDRAWAL = 5000;

type CreatorFinanceScreenProps = { finance: CreatorFinance; creatorName: string };

/** MKT-06 — painel financeiro do criador: saldo, levantamentos e histórico de vendas. */
export default function CreatorFinanceScreen({ finance, creatorName }: CreatorFinanceScreenProps) {
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("7d");
  const [withdrawing, setWithdrawing] = useState(false);
  const [amount, setAmount] = useState(String(finance.balanceKz));
  const toast = useToast();

  const phone = maskAOPhone(finance.payoutPhone);
  const value = Number(amount) || 0;
  const invalid = value < MIN_WITHDRAWAL || value > finance.balanceKz;
  const maxBar = Math.max(...finance.weekly);

  return (
    <CreatorShell
      active="financeiro"
      creatorName={creatorName}
      actions={<Segmented label="Período" options={RANGES} value={range} onChange={(value) => setRange(value)} className="hidden md:inline-flex" />}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
        <header>
          <p className="flex flex-wrap items-center gap-2 text-overline text-text-tertiary uppercase">
            Carteira digital
            <span className="flex items-center gap-1.5 text-feedback-success-ink">
              <span aria-hidden="true" className="size-2 rounded-full bg-feedback-success" />
              Rede Multicaixa Express ativa
            </span>
          </p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Financeiro e vendas
          </h1>
          <p className="mt-1 max-w-3xl text-body-md text-text-secondary">
            Acompanha as vendas das tuas sebentas e pede levantamentos para o teu Multicaixa Express.
          </p>
          <div className="mt-4 md:hidden">
            <Segmented label="Período" options={RANGES} value={range} onChange={(value) => setRange(value)} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <section aria-labelledby="balance-title" className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <div>
              <h2 id="balance-title" className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
                Saldo disponível
                <Icon name="wallet" size={20} className="text-primary" />
              </h2>
              <p className="mt-3 font-montserrat text-display-l font-extrabold text-primary tabular-nums">
                {formatKz(finance.balanceKz)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-caption text-text-secondary">
                <Icon name="bolt" size={16} className="text-feedback-success-ink" />
                Transferência instantânea por Express
              </p>
            </div>
            <Button3D
              size="lg"
              fullWidth
              className="mt-5"
              onClick={() => setWithdrawing(true)}
              leadingIcon={<Icon name="phone" size={20} />}
            >
              Pedir levantamento
            </Button3D>
          </section>

          <section aria-labelledby="gross-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="gross-title" className="flex flex-wrap items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
              Receita bruta
              <span className="flex items-center gap-1 rounded-full bg-feedback-success-soft px-2 py-0.5 text-caption font-bold text-feedback-success-ink tabular-nums">
                <Icon name="trend-up" size={14} />+{finance.growthPct}%
              </span>
            </h2>
            <p className="mt-3 font-montserrat text-display-l font-extrabold text-on-surface tabular-nums">
              {formatKz(finance.grossKz)}
            </p>
            <p className="mt-1 text-caption text-text-secondary tabular-nums">
              {formatInt(finance.soldCount)} vendas · ticket médio {formatKz(finance.averageTicketKz)}
            </p>
            <div className="mt-4 flex h-12 items-end gap-1.5" aria-hidden="true">
              {finance.weekly.map((v, i) => (
                <span
                  key={i}
                  className={cn("flex-1 rounded-t bg-brand-ocean", i === finance.weekly.length - 1 ? "opacity-100" : "opacity-40")}
                  style={{ height: `${(v / maxBar) * 100}%` }}
                />
              ))}
            </div>
            <p className="mt-1 flex justify-between text-caption text-text-tertiary">
              <span>7 dias atrás</span>
              <span>Hoje</span>
            </p>
          </section>

          <section aria-labelledby="commission-title" className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <div>
              <h2 id="commission-title" className="flex items-center justify-between gap-2 text-overline text-text-tertiary uppercase">
                Comissão da Kombinu
                <Icon name="seal" size={20} className="text-brand-sunbeam-ink" />
              </h2>
              <p className="mt-3 rounded-2xl bg-secondary-fixed/50 p-4">
                <span className="inline-flex rounded-full bg-secondary-container px-2.5 py-0.5 text-overline text-surface-ink uppercase">
                  Plano Pro ativo · {finance.commissionRate * 100}% de comissão
                </span>
                <span className="mt-2 block text-body-md font-bold text-on-surface">
                  A receita das vendas vai inteira para o teu saldo.
                </span>
              </p>
            </div>
            <p className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-surface-soft p-3 text-caption">
              <span className="text-text-secondary">Poupança acumulada face ao plano grátis</span>
              <strong className="text-feedback-success-ink tabular-nums">{formatKz(finance.savedByProKz)}</strong>
            </p>
          </section>
        </div>

        <section aria-labelledby="sales-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="sales-title" className="mb-4 font-montserrat text-headline-h2 text-on-surface">
            Vendas recentes
          </h2>
          <TableScroll label="Tabela das vendas recentes">
            <table className={table}>
              <caption className="sr-only">Vendas recentes das tuas sebentas</caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Referência</th>
                  <th scope="col" className={th}>Quando</th>
                  <th scope="col" className={th}>Material</th>
                  <th scope="col" className={th}>Comprador</th>
                  <th scope="col" className={cn(th, "text-right")}>Bruto</th>
                  <th scope="col" className={cn(th, "text-right")}>Comissão</th>
                  <th scope="col" className={cn(th, "text-right")}>Líquido</th>
                  <th scope="col" className={th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {finance.sales.map((sale) => (
                  <tr key={sale.id} className={tr}>
                    <th scope="row" className={cn(td, "font-bold tabular-nums")}>{sale.id}</th>
                    <td className={cn(td, "text-text-secondary")}>{formatActivityTime(sale.at)}</td>
                    <td className={td}>{sale.material}</td>
                    <td className={cn(td, "text-text-secondary tabular-nums")}>{sale.buyerPhone}</td>
                    <td className={cn(td, "text-right tabular-nums")}>{formatKz(sale.grossKz)}</td>
                    <td className={cn(td, "text-right text-text-secondary tabular-nums")}>{formatKz(sale.commissionKz)}</td>
                    <td className={cn(td, "text-right font-bold text-primary tabular-nums")}>{formatKz(sale.netKz)}</td>
                    <td className={td}>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-overline uppercase", STATUS[sale.status].className)}>
                        {STATUS[sale.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        </section>
      </div>

      {withdrawing && (
        <SlideOver
          open
          onClose={() => setWithdrawing(false)}
          eyebrow="Multicaixa Express"
          title="Pedir levantamento"
          footer={
            <Button3D
              fullWidth
              disabled={invalid}
              onClick={() => {
                toast.show(`Levantamento de ${formatKz(value)} pedido. Confirma no telemóvel.`);
                setWithdrawing(false);
              }}
            >
              Confirmar pedido
            </Button3D>
          }
        >
          <div className="flex flex-col gap-5">
            <p className="rounded-2xl bg-surface-soft p-4">
              <span className="block text-caption text-text-secondary">Saldo disponível</span>
              <span className="block font-montserrat text-headline-h2 font-extrabold text-primary tabular-nums">
                {formatKz(finance.balanceKz)}
              </span>
            </p>

            <div>
              <label htmlFor="withdraw-amount" className="mb-2 block text-body-md font-bold text-on-surface">
                Quanto queres levantar?
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border-2 border-border-input bg-surface-canvas">
                <input
                  id="withdraw-amount"
                  type="number"
                  inputMode="numeric"
                  min={MIN_WITHDRAWAL}
                  max={finance.balanceKz}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-describedby="withdraw-hint"
                  aria-invalid={invalid || undefined}
                  className="min-h-12 w-full bg-transparent px-4 text-body-lg font-bold text-on-surface tabular-nums focus-visible:outline-none"
                />
                <span className="px-4 text-body-md font-bold text-text-secondary">Kz</span>
              </div>
              <p id="withdraw-hint" className={cn("mt-2 text-caption tabular-nums", invalid ? "font-bold text-feedback-error-ink" : "text-text-secondary")}>
                {invalid
                  ? `O valor tem de estar entre ${formatKz(MIN_WITHDRAWAL)} e ${formatKz(finance.balanceKz)}.`
                  : `Mínimo ${formatKz(MIN_WITHDRAWAL)} por pedido.`}
              </p>
            </div>

            <p className="rounded-2xl border-2 border-border-cloud p-4 text-body-md text-text-secondary">
              O valor vai para o número{" "}
              <strong className="text-on-surface tabular-nums" aria-hidden="true">
                {phone.visual}
              </strong>
              <span className="sr-only">{phone.spoken}</span>. A transferência costuma chegar em minutos.
            </p>
          </div>
        </SlideOver>
      )}
    </CreatorShell>
  );
}
