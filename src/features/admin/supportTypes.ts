export type TicketCategory = "pagamento" | "tecnico" | "denuncia";
export type TicketStatus = "aberto" | "a-aguardar" | "resolvido";

export type TicketMessage = { id: string; author: string; role: "estudante" | "criador" | "agente"; body: string; at: string };

export type SupportTicket = {
  id: string;
  category: TicketCategory;
  status: TicketStatus;
  subject: string;
  summary: string;
  user: { name: string; kind: "Estudante" | "Criador"; phone: string; university: string };
  reference?: string;
  /** Valor em disputa, quando existe. */
  amountKz?: number;
  openedAt: string;
  slaHours: number;
  assignee?: string;
  messages: TicketMessage[];
};
