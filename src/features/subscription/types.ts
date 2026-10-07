export type PlanId = "free" | "pro";

export type PlanFeature = { text: string; included: boolean; highlight?: boolean };

export type SubscriptionPlan = {
  id: PlanId;
  eyebrow: string;
  name: string;
  priceKz: number;
  note: string;
  features: PlanFeature[];
  cta: string;
  recommended?: string;
};

export type AuthorizationResult = { reference: string; approvedAt: string };

/** Pede a autorização no telemóvel e resolve quando o EMIS confirmar (ou rejeitar). */
export type AuthorizePayment = (phone: string, amountKz: number) => Promise<AuthorizationResult>;
