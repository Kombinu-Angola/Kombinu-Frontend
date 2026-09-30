import type { Purchase } from "./types";

const daysAgo = (d: number, h = 12) => {
  const date = new Date(Date.now() - d * 86_400_000);
  date.setHours(h, 32, 0, 0);
  return date.toISOString();
};

export const PURCHASES: Purchase[] = [
  {
    id: "p1",
    reference: "TX-984210",
    at: daysAgo(9, 14),
    title: "Sebenta: Macroeconomia I",
    detail: "Criador: Mateus Silva · UAN",
    kind: "sebenta",
    amountKz: 1500,
    status: "confirmado",
    phone: "923456789",
    receipt: { number: "REC-2026-0412", method: "Multicaixa Express", authorizedAt: daysAgo(9, 14) },
    href: "/v2/biblioteca",
  },
  {
    id: "p2",
    reference: "TX-921405",
    at: daysAgo(24, 9),
    title: "Subscrição mensal Kombinu Pro",
    detail: "Renovação automática por Express",
    kind: "subscricao",
    amountKz: 5000,
    status: "confirmado",
    phone: "923456789",
    receipt: { number: "REC-2026-0388", method: "Multicaixa Express", authorizedAt: daysAgo(24, 9) },
    href: "/v2/estudio/definicoes",
  },
  {
    id: "p3",
    reference: "TX-874102",
    at: daysAgo(30, 19),
    title: "Sebenta: Direito das Obrigações",
    detail: "Criador: Teresa Bento · UCAN",
    kind: "sebenta",
    amountKz: 2000,
    status: "expirado",
    phone: "923456789",
    href: "/v2/sebenta",
  },
  {
    id: "p4",
    reference: "TX-861950",
    at: daysAgo(43, 11),
    title: "Resumo: Contabilidade Financeira II",
    detail: "Criador: Domingos Pascoal · ISAF",
    kind: "sebenta",
    amountKz: 1000,
    status: "confirmado",
    phone: "923456789",
    receipt: { number: "REC-2026-0301", method: "Multicaixa Express", authorizedAt: daysAgo(43, 11) },
    href: "/v2/biblioteca",
  },
  {
    id: "p5",
    reference: "TX-843771",
    at: daysAgo(58, 16),
    title: "Simulado: exame da Ordem",
    detail: "Criador: Hamilton Kiala · UCAN",
    kind: "sebenta",
    amountKz: 4500,
    status: "reembolsado",
    phone: "923456789",
    receipt: { number: "REC-2026-0244", method: "Multicaixa Express", authorizedAt: daysAgo(58, 16) },
    href: "/v2/sebenta",
  },
];
