export type PurchaseStatus = "confirmado" | "expirado" | "reembolsado";

export type Purchase = {
  id: string;
  /** Referência da rede EMIS. */
  reference: string;
  at: string;
  title: string;
  detail: string;
  kind: "sebenta" | "subscricao";
  amountKz: number;
  status: PurchaseStatus;
  phone: string;
  /** Presente apenas em compras confirmadas. */
  receipt?: { number: string; method: string; authorizedAt: string };
  href: string;
};
