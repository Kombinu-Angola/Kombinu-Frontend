import { useMemo, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { SlideOver } from "../../components/ui/SlideOver";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime, formatKz, normalize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { SupportTicket, TicketCategory, TicketStatus } from "./supportTypes";

/** Acima deste valor, o reembolso precisa de autorização de um administrador. */
const REFUND_LIMIT_KZ = 10_000;

const CATEGORY: Record<TicketCategory, { label: string; className: string }> = {
  pagamento: { label: "Pagamentos", className: "border-feedback-error text-feedback-error-ink" },
  tecnico: { label: "Técnico", className: "border-border-cloud text-text-secondary" },
  denuncia: { label: "Denúncia", className: "border-feedback-streak text-feedback-streak-ink" },
};

const STATUS: Record<TicketStatus, { label: string; className: string }> = {
  aberto: { label: "Aberto", className: "border-2 border-feedback-error bg-surface-canvas text-feedback-error-ink" },
  "a-aguardar": { label: "À espera do utilizador", className: "bg-secondary-fixed text-on-secondary-fixed-variant" },
  resolvido: { label: "Resolvido", className: "bg-surface-forest text-feedback-success" },
};

type Filter = "todos" | TicketCategory;

type SupportTicketsScreenProps = {
  tickets: SupportTicket[];
  agentName: string;
  /** O agente pode reembolsar até ao limite; acima disso, escala. */
  canRefundAny?: boolean;
};

/** Central de suporte: fila de tickets, SLA e resolução de disputas de pagamento. */
export default function SupportTicketsScreen({ tickets: initial, agentName, canRefundAny = false }: SupportTicketsScreenProps) {
  const [tickets, setTickets] = useState(initial);
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const toast = useToast();

  const counts = useMemo(() => {
    const base: Record<Filter, number> = { todos: tickets.length, pagamento: 0, tecnico: 0, denuncia: 0 };
    for (const t of tickets) base[t.category] += 1;
    return base;
  }, [tickets]);

  const hoursWaiting = (t: SupportTicket) => (Date.now() - new Date(t.openedAt).getTime()) / 3_600_000;
  const overdue = tickets.filter((t) => hoursWaiting(t) > t.slaHours).length;
  const disputed = tickets.filter((t) => t.category === "pagamento" && t.amountKz);
  const disputedKz = disputed.reduce((sum, t) => sum + (t.amountKz ?? 0), 0);

  const shown = useMemo(() => {
    const q = normalize(query.trim());
    return tickets
      .filter(
        (t) =>
          (filter === "todos" || t.category === filter) &&
          (!q || normalize(`${t.id} ${t.subject} ${t.user.name} ${t.reference ?? ""} ${t.user.phone}`).includes(q)),
      )
      .sort((a, b) => hoursWaiting(b) / b.slaHours - hoursWaiting(a) / a.slaHours);
  }, [tickets, filter, query]);

  function resolve(ticket: SupportTicket) {
    setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, status: "resolvido" as const } : t)));
    setOpen(null);
    setReply("");
    toast.show(`Ticket ${ticket.id} marcado como resolvido.`);
  }

  const needsEscalation = open?.amountKz !== undefined && open.amountKz > REFUND_LIMIT_KZ && !canRefundAny;

  return (
    <AdminShell
      active="suporte"
      eyebrow={`Atendimento · operador ${agentName}`}
      title="Central de suporte"
      description="Fila de tickets, prazos de resposta e disputas de pagamento por Multicaixa Express."
      actions={
        <p className="flex items-center gap-2 rounded-full border-2 border-border-cloud px-3 py-1.5 text-caption text-text-secondary">
          <Icon name="shield" size={16} className="text-primary" />
          Reembolsos acima de {formatKz(REFUND_LIMIT_KZ)} exigem administrador
        </p>
      }
    >
      <section aria-label="Indicadores de atendimento" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { id: "fila", label: "Na fila", value: String(tickets.length), note: `${counts.pagamento} sobre pagamentos`, tone: "text-on-surface" },
          {
            id: "atraso",
            label: "Fora do prazo",
            value: String(overdue),
            note: overdue === 0 ? "Tudo dentro do SLA" : "Precisam de resposta hoje",
            tone: overdue > 0 ? "text-feedback-error-ink" : "text-feedback-success-ink",
          },
          { id: "disputa", label: "Valor em disputa", value: formatKz(disputedKz), note: `${disputed.length} casos financeiros`, tone: "text-feedback-streak-ink" },
          { id: "resp", label: "Primeira resposta", value: "18 min", note: "Meta: menos de 30 min", tone: "text-primary" },
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

      <section className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <label htmlFor="ticket-search" className="mb-2 block text-body-md font-bold text-on-surface">
            Procurar ticket
          </label>
          <Icon name="search" size={20} className="pointer-events-none absolute bottom-3.5 left-3 text-text-tertiary" />
          <input
            id="ticket-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Número do ticket, nome, telemóvel ou referência de pagamento"
            className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-4 pl-10 text-body-md text-on-surface"
          />
        </div>

        <div role="group" aria-label="Filtrar por categoria" className="flex gap-2 overflow-x-auto pb-1">
          {([
            { value: "todos" as const, label: "Todos" },
            { value: "pagamento" as const, label: "Pagamentos" },
            { value: "tecnico" as const, label: "Técnicos" },
            { value: "denuncia" as const, label: "Denúncias" },
          ]).map((tab) => {
            const active = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color] duration-150",
                  active
                    ? "border-brand-ocean bg-brand-ocean text-white"
                    : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary",
                )}
              >
                {tab.label}
                <span className="ml-1.5 tabular-nums">({counts[tab.value]})</span>
              </button>
            );
          })}
        </div>
      </section>

      <TableScroll label="Tabela da fila de tickets">
        <table className={cn(table, "min-w-[980px]")}>
          <caption className="sr-only">Tickets de suporte por resolver</caption>
          <thead>
            <tr>
              <th scope="col" className={th}>Ticket</th>
              <th scope="col" className={th}>Utilizador</th>
              <th scope="col" className={th}>Assunto</th>
              <th scope="col" className={cn(th, "text-right")}>Em disputa</th>
              <th scope="col" className={th}>Prazo</th>
              <th scope="col" className={th}>Estado</th>
              <th scope="col" className={cn(th, "text-right")}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((ticket) => {
              const waiting = hoursWaiting(ticket);
              const late = waiting > ticket.slaHours;
              const category = CATEGORY[ticket.category];
              return (
                <tr key={ticket.id} className={tr}>
                  <th scope="row" className={cn(td, "font-normal")}>
                    <span className="block font-bold whitespace-nowrap text-on-surface tabular-nums">{ticket.id}</span>
                    <span className={cn("mt-1 inline-block rounded-md border-2 bg-surface-canvas px-2 py-0.5 text-overline uppercase", category.className)}>
                      {category.label}
                    </span>
                  </th>
                  <td className={td}>
                    <span className="flex items-center gap-2.5">
                      <Avatar name={ticket.user.name} size="sm" />
                      <span>
                        <span className="block font-bold whitespace-nowrap text-on-surface">{ticket.user.name}</span>
                        <span className="block text-caption text-text-tertiary">
                          {ticket.user.kind} · {ticket.user.university}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className={cn(td, "min-w-[260px]")}>
                    <span className="block font-bold text-on-surface">{ticket.subject}</span>
                    <span className="line-clamp-1 block text-caption text-text-tertiary">{ticket.summary}</span>
                  </td>
                  <td className={cn(td, "text-right whitespace-nowrap tabular-nums")}>
                    {ticket.amountKz ? (
                      <span className={cn("font-bold", ticket.amountKz > REFUND_LIMIT_KZ ? "text-feedback-error-ink" : "text-on-surface")}>
                        {formatKz(ticket.amountKz)}
                      </span>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className={td}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border-2 bg-surface-canvas px-2.5 py-0.5 text-caption font-bold whitespace-nowrap tabular-nums",
                        late ? "border-feedback-error text-feedback-error-ink" : "border-border-cloud text-text-secondary",
                      )}
                    >
                      <Icon name="clock" size={14} />
                      {late ? "Fora do prazo" : `${Math.max(0, Math.round(ticket.slaHours - waiting))} h restantes`}
                    </span>
                  </td>
                  <td className={td}>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-overline uppercase whitespace-nowrap", STATUS[ticket.status].className)}>
                      {STATUS[ticket.status].label}
                    </span>
                  </td>
                  <td className={cn(td, "text-right")}>
                    <Button3D
                      onClick={() => {
                        setOpen(ticket);
                        setReply("");
                      }}
                      trailingIcon={<Icon name="arrow-right" size={16} />}
                    >
                      Abrir
                      <span className="sr-only"> o ticket {ticket.id}</span>
                    </Button3D>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScroll>

      {shown.length === 0 && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
          Nenhum ticket corresponde a estes filtros.
        </p>
      )}

      {open && (
        <SlideOver
          open
          onClose={() => setOpen(null)}
          eyebrow={`${open.id} · ${CATEGORY[open.category].label}`}
          title={open.subject}
          footer={
            <div className="flex flex-col gap-2">
              {needsEscalation && (
                <p id="escalate-hint" className="text-caption font-bold text-feedback-error-ink tabular-nums">
                  {formatKz(open.amountKz!)} está acima do teu limite de {formatKz(REFUND_LIMIT_KZ)}: precisa de
                  autorização de um administrador.
                </p>
              )}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {open.amountKz !== undefined &&
                  (needsEscalation ? (
                    <Button3D
                      variant="ghost"
                      onClick={() => {
                        toast.show("Pedido de reembolso escalado para administrador.");
                        setOpen(null);
                      }}
                      leadingIcon={<Icon name="shield" size={18} />}
                    >
                      Escalar reembolso
                    </Button3D>
                  ) : (
                    <Button3D
                      variant="ghost"
                      className="border-feedback-error text-feedback-error-ink"
                      onClick={() => {
                        toast.show(`Reembolso de ${formatKz(open.amountKz!)} autorizado.`);
                        resolve(open);
                      }}
                      leadingIcon={<Icon name="wallet" size={18} />}
                    >
                      Reembolsar
                    </Button3D>
                  ))}
                <Button3D
                  disabled={reply.trim().length < 10}
                  onClick={() => resolve(open)}
                  leadingIcon={<Icon name="check" size={18} strokeWidth={3} />}
                >
                  Responder e resolver
                </Button3D>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl bg-surface-soft p-4">
              <p className="flex items-center gap-2.5">
                <Avatar name={open.user.name} />
                <span>
                  <span className="block text-body-md font-bold text-on-surface">{open.user.name}</span>
                  <span className="block text-caption text-text-tertiary tabular-nums">
                    {open.user.kind} · {open.user.university} · {open.user.phone}
                  </span>
                </span>
              </p>
              {open.reference && (
                <p className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-surface-canvas p-3 text-caption tabular-nums">
                  <span className="text-text-secondary">Referência da transação</span>
                  <strong className="text-on-surface">{open.reference}</strong>
                </p>
              )}
              {open.amountKz !== undefined && (
                <p className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-surface-canvas p-3 text-caption tabular-nums">
                  <span className="text-text-secondary">Valor em disputa</span>
                  <strong className="text-on-surface">{formatKz(open.amountKz)}</strong>
                </p>
              )}
            </section>

            <section aria-labelledby="thread-title">
              <h3 id="thread-title" className="mb-2 text-overline text-text-tertiary uppercase">
                Conversa
              </h3>
              <ol className="flex flex-col gap-3">
                {open.messages.map((message) => (
                  <li
                    key={message.id}
                    className={cn(
                      "rounded-2xl border-2 p-3",
                      message.role === "agente" ? "border-primary-fixed bg-surface-sky" : "border-border-cloud bg-surface-canvas",
                    )}
                  >
                    <p className="flex flex-wrap items-center justify-between gap-2 text-caption">
                      <strong className="text-on-surface">{message.author}</strong>
                      <span className="text-text-tertiary">{formatActivityTime(message.at)}</span>
                    </p>
                    <p className="mt-1.5 text-body-md text-text-secondary">{message.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            <div>
              <label htmlFor="ticket-reply" className="mb-2 block text-body-md font-bold text-on-surface">
                A tua resposta
              </label>
              <textarea
                id="ticket-reply"
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Explica o que foi verificado e o que acontece a seguir."
                className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
              />
              <p className="mt-1.5 text-caption text-text-tertiary">
                A resposta é enviada por SMS e fica no histórico do ticket.
              </p>
            </div>
          </div>
        </SlideOver>
      )}
    </AdminShell>
  );
}
