export type CreatorSale = {
  id: string;
  at: string;
  material: string;
  buyerPhone: string;
  grossKz: number;
  commissionKz: number;
  netKz: number;
  status: "liquidado" | "a caminho" | "devolvido";
};

/** Contrato esperado de GET /api/creators/me/finance/ */
export type CreatorFinance = {
  balanceKz: number;
  grossKz: number;
  soldCount: number;
  averageTicketKz: number;
  growthPct: number;
  plan: "pro" | "free";
  commissionRate: number;
  savedByProKz: number;
  weekly: number[];
  payoutPhone: string;
  sales: CreatorSale[];
};
