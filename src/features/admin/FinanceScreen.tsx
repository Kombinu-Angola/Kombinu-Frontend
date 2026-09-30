import { useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { Segmented } from "../../components/ui/Segmented";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import { PAYOUTS, TRANSACTIONS } from "./mockAdmin";

const TABS = [
  { value: "transacoes", label: "Transações Express" },
  { value: "repasses", label: "Fila de repasses" },
  { value: "subscricoes", label: "Subscrições Pro" },
] as const;

const COMMISSION = 0.3;
const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "short" });

const STATUS: Record<string, { label: string; className: string }> = {
  sucesso: { label: "Sucesso", className: "bg-surface-forest text-feedback-success" },
  pendente: { label: "Pendente", className: "bg-secondary-fixed text-on-secondary-fixed-variant" },
  falhou: { label: "Falhou", className: "bg-feedback-error-soft text-feedback-error-ink" },
};

/** ADM-04 — monitor financeiro: transações Multicaixa Express e autorização de repasses. */
export default function FinanceScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("transacoes");
  const [selected, setSelected] = useState<string[]>([]);
  const toast = useToast();

  const selectedPayouts = PAYOUTS.filter((p) => selected.includes(p.id));
  const selectedTotal = selectedPayouts.reduce((sum, p) => sum + p.amountKz, 0);
  const allSelected = selected.length === PAYOUTS.length;

  const cards = [
    { id: "custodia", label: "Saldo em custódia (Multicaixa Express)", value: 12450000, note: "Conciliação bancária ativa" },
    { id: "comissoes", label: `Comissões retidas (${COMMISSION * 100}% no plano grátis)`, value: 3735000, note: "Disponível para reinvestimento" },
    { id: "pendentes", label: "Repasses a criadores pendentes", value: 1840000, note: `${PAYOUTS.length} solicitações à espera` },
  ];

  return (
    <AdminShell
      active="financeiro"
      eyebrow="Gateway Multicaixa Express"
      title="Financeiro e Express"
      description="Conciliação de transações em tempo real e autorização de repasses aos criadores."
      actions={<Segmented label="Vista financeira" options={TABS} value={tab} onChange={(value) => setTab(value)} />}
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.id} className="rounded-2xl bg-brand-ocean-shadow p-5 text-white">
            <p className="flex items-start justify-between gap-2 text-overline text-white/80 uppercase">
              {c.label}
              <Icon name="wallet" size={20} className="shrink-0" />
            </p>
            <p className="mt-3 font-montserrat text-headline-h2 font-extrabold tabular-nums">{formatKz(c.value)}</p>
            <p className="mt-1 text-caption text-white/80">{c.note}</p>
          </div>
        ))}
      </div>

      {tab === "transacoes" && (
        <section aria-labelledby="tx-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="tx-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Transações recentes
            </h2>
            <p className="flex items-center gap-2 rounded-full border-2 border-border-cloud px-3 py-1 text-caption text-text-secondary">
              <span aria-hidden="true" className="size-2 rounded-full bg-feedback-success" />
              Atualizado há 10 s
            </p>
          </div>
          <TableScroll label="Tabela das transações recentes">
            <table className={table}>
              <caption className="sr-only">Transações Multicaixa Express recentes</caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Transação</th>
                  <th scope="col" className={th}>Hora</th>
                  <th scope="col" className={th}>Telemóvel</th>
                  <th scope="col" className={th}>Artigo</th>
                  <th scope="col" className={cn(th, "text-right")}>Valor bruto</th>
                  <th scope="col" className={cn(th, "text-right")}>Comissão</th>
                  <th scope="col" className={cn(th, "text-right")}>Líquido do criador</th>
                  <th scope="col" className={th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t) => {
                  const subscription = t.creatorNetKz === null;
                  const commission = subscription ? t.grossKz : t.grossKz - (t.creatorNetKz ?? 0);
                  return (
                    <tr key={t.id} className={tr}>
                      <th scope="row" className={cn(td, "font-bold tabular-nums")}>{t.id}</th>
                      <td className={cn(td, "text-text-secondary tabular-nums")}>{t.at}</td>
                      <td className={cn(td, "text-text-secondary tabular-nums")}>{t.phone}</td>
                      <td className={td}>{t.item}</td>
                      <td className={cn(td, "text-right tabular-nums")}>{formatKz(t.grossKz)}</td>
                      <td className={cn(td, "text-right text-text-secondary tabular-nums")}>
                        {formatKz(commission)}
                        {subscription && <span className="block text-caption text-text-tertiary">receita da plataforma</span>}
                      </td>
                      <td className={cn(td, "text-right font-bold text-primary tabular-nums")}>
                        {subscription ? <span className="text-text-tertiary">—</span> : formatKz(t.creatorNetKz ?? 0)}
                      </td>
                      <td className={td}>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-overline uppercase", STATUS[t.status].className)}>
                          {STATUS[t.status].label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
          <p className="mt-3 text-caption text-text-secondary">
            As subscrições Pro são receita da plataforma e não geram repasse ao criador.
          </p>
        </section>
      )}

      {tab === "repasses" && (
        <section aria-labelledby="payouts-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <h2 id="payouts-title" className="mb-4 font-montserrat text-headline-h3 font-extrabold text-on-surface">
            Repasses à espera de autorização
          </h2>
          <TableScroll label="Tabela dos repasses pendentes">
            <table className={table}>
              <caption className="sr-only">Pedidos de repasse pendentes</caption>
              <thead>
                <tr>
                  <th scope="col" className={cn(th, "w-12")}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => setSelected(e.target.checked ? PAYOUTS.map((p) => p.id) : [])}
                        className="size-5 cursor-pointer accent-brand-ocean"
                      />
                      <span className="sr-only">Selecionar todos os repasses</span>
                    </label>
                  </th>
                  <th scope="col" className={th}>Criador</th>
                  <th scope="col" className={th}>Telemóvel</th>
                  <th scope="col" className={cn(th, "text-right")}>Materiais</th>
                  <th scope="col" className={cn(th, "text-right")}>Valor</th>
                  <th scope="col" className={th}>Pedido em</th>
                </tr>
              </thead>
              <tbody>
                {PAYOUTS.map((p) => {
                  const checked = selected.includes(p.id);
                  return (
                    <tr key={p.id} className={cn(tr, checked && "bg-surface-sky")}>
                      <td className={td}>
                        <input
                          type="checkbox"
                          checked={checked}
                          aria-label={`Selecionar o repasse de ${p.creator}, ${formatKz(p.amountKz)}`}
                          onChange={(e) =>
                            setSelected((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)))
                          }
                          className="size-5 cursor-pointer accent-brand-ocean"
                        />
                      </td>
                      <th scope="row" className={cn(td, "font-bold")}>{p.creator}</th>
                      <td className={cn(td, "text-text-secondary tabular-nums")}>{p.phone}</td>
                      <td className={cn(td, "text-right tabular-nums")}>{p.materials}</td>
                      <td className={cn(td, "text-right font-bold tabular-nums")}>{formatKz(p.amountKz)}</td>
                      <td className={cn(td, "text-caption text-text-secondary tabular-nums")}>
                        {dateFormat.format(new Date(p.requestedAt))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>

          <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t-2 border-border-cloud pt-4 sm:flex-row sm:items-center">
            <p role="status" className="flex items-center gap-2 text-body-md text-on-surface">
              <Icon name="shield" size={20} className="text-primary" />
              {selected.length === 0
                ? "Seleciona os repasses a autorizar."
                : `${selected.length} selecionados · total ${formatKz(selectedTotal)}`}
            </p>
            <Button3D
              disabled={selected.length === 0}
              leadingIcon={<Icon name="lock" size={18} />}
              onClick={() => {
                toast.show(`${selected.length} repasses autorizados (${formatKz(selectedTotal)}).`);
                setSelected([]);
              }}
            >
              Autorizar em lote
            </Button3D>
          </div>
        </section>
      )}

      {tab === "subscricoes" && (
        <section className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
          <h2 className="font-montserrat text-headline-h3 font-extrabold text-on-surface">Relatório de subscrições Pro</h2>
          <p className="mt-2 text-body-md text-text-secondary">Este relatório ainda não foi migrado.</p>
        </section>
      )}
    </AdminShell>
  );
}
