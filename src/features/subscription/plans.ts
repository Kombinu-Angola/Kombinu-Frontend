import type { SubscriptionPlan } from "./types";

/** Em produção: GET /api/plans/. Valores alinhados com o fluxo de credenciamento. */
export const PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    eyebrow: "Plano básico",
    name: "Plano grátis",
    priceKz: 0,
    note: "Sem mensalidade, para sempre",
    cta: "Continuar no plano grátis",
    features: [
      { text: "Resumos e quizzes da comunidade", included: true },
      { text: "3 materiais gerados com IA por mês", included: true },
      { text: "Modo de leitura ultraleve (menos de 5 MB/h)", included: true },
      { text: "A Kombinu retém 30% de cada venda", included: false },
      { text: "Sem simulados de exame exclusivos", included: false },
    ],
  },
  {
    id: "pro",
    eyebrow: "Plano premium",
    name: "Kombinu Pro",
    priceKz: 5000,
    note: "Por mês, pago por Multicaixa Express",
    cta: "Assinar o Pro com Express",
    recommended: "Recomendado para quem vende materiais",
    features: [
      { text: "Materiais gerados com IA sem limite", included: true },
      { text: "Acesso a todos os simulados e resoluções", included: true },
      { text: "0% de comissão: a receita das vendas é toda tua", included: true, highlight: true },
      { text: "Selo de Criador Pro verificado no marketplace", included: true },
      { text: "Leitura offline e descarga prioritária", included: true },
    ],
  },
];
