import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { SelectField } from "../../components/ui/Field";
import { SlideOver } from "../../components/ui/SlideOver";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { Purchase, PurchaseStatus } from "./types";

const dateTime = new Intl.DateTimeFormat("pt-AO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const PERIODS = [
  { value: "todas", label: "Todas as transações" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "ano", label: "Ano letivo de 2026" },
];

const STATUS: Record<PurchaseStatus, { label: string; className: string; note?: string }> = {
  confirmado: { label: "Confirmado", className: "bg-surface-forest text-feedback-success" },
  expirado: {
    label: "Não autorizado",
    className: "border-2 border-feedback-error bg-surface-canvas text-feedback-error-ink",
    note: "Nada foi debitado",
  },
  reembolsado: {
    label: "Reembolsado",
    className: "border-2 border-border-cloud bg-surface-canvas text-text-secondary",
  },
};

type PurchaseHistoryScreenProps = { purchases: Purchase[]; userName: string; profileHref: string };

/** FIN-HIST-01 — extrato de compras e recibos das transações Multicaixa Express. */
export default function PurchaseHistoryScreen({ purchases, userName, profileHref }: PurchaseHistoryScreenProps) {
  const [period, setPeriod] = useState("todas");
  const [receipt, setReceipt] = useState<Purchase | null>(null);
  const toast = useToast();

  const shown = useMemo(() => {
    const limit = period === "30d" ? 30 : period === "ano" ? 365 : Infinity;
    return purchases.filter((p) => (Date.now() - new Date(p.at).getTime()) / 86_400_000 <= limit);
  }, [purchases, period]);

  // O total conta só o que foi efetivamente cobrado: expirados e reembolsos ficam de fora.
  const settled = shown.filter((p) => p.status === "confirmado");
  const totalKz = settled.reduce((sum, p) => sum + p.amountKz, 0);
  const refunded = shown.filter((p) => p.status === "reembolsado").reduce((sum, p) => sum + p.amountKz, 0);
  const phone = maskAOPhone(purchases[0]?.phone ?? "900000000");

  return (
    <AppShell active="biblioteca" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-6 lg:py-8">
        <a
          href={profileHref}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
        >
          <Icon name="arrow-left" size={16} />
          Voltar ao meu perfil
        </a>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Histórico financeiro</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Compras e recibos
          </h1>
          <p className="mt-1 text-body-md text-text-secondary">
            Cada compra tem um recibo com a referência da rede EMIS, que podes guardar ou enviar.
          </p>
        </header>

        <section aria-label="Resumo financeiro" className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
            <p className="text-overline text-text-tertiary uppercase">Total pago na plataforma</p>
            <p className="mt-2 font-montserrat text-display-l font-extrabold text-primary tabular-nums">
              {formatKz(totalKz)}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-caption text-text-secondary tabular-nums">
              <Icon name="check" size={16} strokeWidth={3} className="text-feedback-success-ink" />
              {settled.length} transações confirmadas
              {refunded > 0 && ` · ${formatKz(refunded)} reembolsados`}
            </p>
          </article>

          <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
            <p className="text-overline text-text-tertiary uppercase">Meio de pagamento</p>
            <p className="mt-2 flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-primary">
                <Icon name="phone" size={22} />
              </span>
              <span>
                <span className="block text-headline-h3 text-on-surface tabular-nums" aria-hidden="true">
                  Multicaixa Express {phone.visual}
                </span>
                <span className="sr-only">Multicaixa Express, {phone.spoken}</span>
                <span className="block text-caption text-text-tertiary">
                  Cada compra é autorizada com o PIN, na aplicação do Express
                </span>
              </span>
            </p>
          </article>
        </section>

        <section aria-labelledby="extract-title">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="extract-title" className="font-montserrat text-headline-h2 text-on-surface">
                Extrato de compras
              </h2>
              <p className="text-caption text-text-secondary">Ordenado da transação mais recente para a mais antiga.</p>
            </div>
            <div className="sm:w-64">
              <SelectField
                id="period-filter"
                label="Período"
                options={PERIODS}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
          </div>

          <TableScroll label="Tabela do extrato de compras">
            <table className={table}>
              <caption className="sr-only">Compras feitas na Kombinu</caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Data</th>
                  <th scope="col" className={th}>Material</th>
                  <th scope="col" className={th}>Referência</th>
                  <th scope="col" className={cn(th, "text-right")}>Valor</th>
                  <th scope="col" className={th}>Estado</th>
                  <th scope="col" className={cn(th, "text-right")}>Recibo</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((purchase) => (
                  <tr key={purchase.id} className={tr}>
                    <td className={cn(td, "whitespace-nowrap text-caption text-text-secondary tabular-nums")}>
                      {dateTime.format(new Date(purchase.at))}
                    </td>
                    <th scope="row" className={cn(td, "font-normal")}>
                      <span className="block font-bold text-on-surface">{purchase.title}</span>
                      <span className="block text-caption text-text-tertiary">{purchase.detail}</span>
                    </th>
                    <td className={cn(td, "whitespace-nowrap text-caption text-text-secondary tabular-nums")}>
                      {purchase.reference}
                    </td>
                    <td
                      className={cn(
                        td,
                        "text-right font-bold whitespace-nowrap tabular-nums",
                        purchase.status === "confirmado" ? "text-primary" : "text-text-tertiary",
                      )}
                    >
                      {formatKz(purchase.amountKz)}
                    </td>
                    <td className={td}>
                      <span
                        className={cn("inline-block rounded-full px-2.5 py-0.5 text-overline uppercase", STATUS[purchase.status].className)}
                      >
                        {STATUS[purchase.status].label}
                      </span>
                      {STATUS[purchase.status].note && (
                        <span className="mt-1 block text-caption text-text-tertiary">{STATUS[purchase.status].note}</span>
                      )}
                    </td>
                    <td className={cn(td, "text-right")}>
                      {purchase.receipt ? (
                        <Button3D variant="ghost" onClick={() => setReceipt(purchase)}>
                          Ver recibo
                          <span className="sr-only"> de {purchase.title}</span>
                        </Button3D>
                      ) : (
                        <Button3D variant="ghost" onClick={() => (window.location.assign(purchase.href))}>
                          Repetir compra
                          <span className="sr-only"> de {purchase.title}</span>
                        </Button3D>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>

          {shown.length === 0 && (
            <p className="mt-6 rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
              Não há transações neste período.
            </p>
          )}
        </section>
      </div>

      {receipt?.receipt && (
        <SlideOver
          open
          onClose={() => setReceipt(null)}
          eyebrow="Comprovativo"
          title={`Recibo ${receipt.receipt.number}`}
          footer={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button3D variant="ghost" fullWidth onClick={() => toast.show("Recibo enviado para o teu e-mail.")}>
                Enviar por e-mail
              </Button3D>
              <Button3D
                fullWidth
                onClick={() => toast.show("Recibo em PDF a ser gerado.")}
                leadingIcon={<Icon name="download" size={18} />}
              >
                Descarregar PDF
              </Button3D>
            </div>
          }
        >
          <div className="flex flex-col gap-5">
            <p className="rounded-2xl bg-surface-forest p-4 text-caption text-feedback-success">
              <Icon name="check" size={16} strokeWidth={3} className="mr-1 inline align-text-bottom" />
              Pagamento confirmado pela rede EMIS.
            </p>

            <dl className="rounded-2xl border-2 border-border-cloud">
              {[
                { label: "Material", value: receipt.title },
                { label: "Descrição", value: receipt.detail },
                { label: "Valor pago", value: formatKz(receipt.amountKz) },
                { label: "Meio de pagamento", value: receipt.receipt.method },
                { label: "Número do recibo", value: receipt.receipt.number },
                { label: "Referência EMIS", value: receipt.reference },
                { label: "Autorizado em", value: dateTime.format(new Date(receipt.receipt.authorizedAt)) },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 border-b-2 border-border-cloud p-3 last:border-0">
                  <dt className="shrink-0 text-caption text-text-secondary">{row.label}</dt>
                  <dd className="text-right text-body-md font-bold text-on-surface tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="text-caption text-text-tertiary">
              Guarda este comprovativo. Em caso de disputa, a referência EMIS é o que identifica a transação.
            </p>
          </div>
        </SlideOver>
      )}
    </AppShell>
  );
}
