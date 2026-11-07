import type { CreatorFinance } from "./types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const MOCK_FINANCE: CreatorFinance = {
  balanceKz: 142500,
  grossKz: 203500,
  soldCount: 148,
  averageTicketKz: 1375,
  growthPct: 18.4,
  plan: "pro",
  commissionRate: 0,
  savedByProKz: 61050,
  weekly: [40, 55, 45, 75, 60, 85, 100],
  payoutPhone: "923456789",
  sales: [
    { id: "TX-4411", at: hoursAgo(2), material: "Sebenta de política cambial", buyerPhone: "923 ••• 112", grossKz: 1500, commissionKz: 0, netKz: 1500, status: "liquidado" },
    { id: "TX-4408", at: hoursAgo(9), material: "Pack de quizzes: Estatística I", buyerPhone: "941 ••• 884", grossKz: 1000, commissionKz: 0, netKz: 1000, status: "liquidado" },
    { id: "TX-4402", at: hoursAgo(26), material: "Simulado: exame da Ordem", buyerPhone: "912 ••• 556", grossKz: 4500, commissionKz: 0, netKz: 4500, status: "a caminho" },
    { id: "TX-4399", at: hoursAgo(51), material: "Sebenta de política cambial", buyerPhone: "939 ••• 331", grossKz: 1500, commissionKz: 0, netKz: 1500, status: "devolvido" },
  ],
};
