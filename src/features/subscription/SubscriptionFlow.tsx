import { useState } from "react";
import PlanSelectionScreen from "./PlanSelectionScreen";
import ExpressCheckoutScreen from "./ExpressCheckoutScreen";
import TransactionStatusScreen, { type TransactionState } from "./TransactionStatusScreen";
import { PLANS } from "./plans";
import type { AuthorizePayment, PlanId } from "./types";

type SubscriptionFlowProps = {
  creatorName: string;
  currentPlan: PlanId;
  defaultPhone?: string;
  authorize: AuthorizePayment;
  onPlanActivated?: (plan: PlanId) => void;
  studioHref?: string;
};

/**
 * FIN-01 → FIN-02 → FIN-03. O pedido de autorização vive aqui: o ecrã de estado
 * só mostra o resultado, por isso voltar atrás nunca duplica uma cobrança.
 */
export default function SubscriptionFlow({
  creatorName,
  currentPlan,
  defaultPhone,
  authorize,
  onPlanActivated,
  studioHref = "/v2/estudio",
}: SubscriptionFlowProps) {
  const [stage, setStage] = useState<"plans" | "checkout" | "status">("plans");
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [state, setState] = useState<TransactionState>({ status: "waiting" });
  const pro = PLANS.find((p) => p.id === "pro")!;

  async function requestAuthorization(target: string) {
    setPhone(target);
    setState({ status: "waiting" });
    setStage("status");
    try {
      const result = await authorize(target, pro.priceKz);
      setState({ status: "approved", result });
      onPlanActivated?.("pro");
    } catch {
      setState({
        status: "failed",
        message: "O pedido não foi autorizado a tempo. Confirma se tens saldo e se a aplicação do Express está ativa.",
      });
    }
  }

  if (stage === "status") {
    return (
      <TransactionStatusScreen
        plan={pro}
        phone={phone}
        state={state}
        studioHref={studioHref}
        onExpire={() =>
          setState((prev) =>
            prev.status === "waiting"
              ? { status: "failed", message: "O tempo para autorizar terminou antes da confirmação chegar." }
              : prev,
          )
        }
        onRetry={() => void requestAuthorization(phone)}
        onCancel={() => setStage("checkout")}
      />
    );
  }

  if (stage === "checkout") {
    return (
      <ExpressCheckoutScreen
        plan={pro}
        creatorName={creatorName}
        defaultPhone={phone}
        onCancel={() => setStage("plans")}
        onSubmit={(target) => void requestAuthorization(target)}
      />
    );
  }

  return (
    <PlanSelectionScreen
      plans={PLANS}
      currentPlan={currentPlan}
      creatorName={creatorName}
      onChoose={(plan) => {
        if (plan === "pro") setStage("checkout");
        else window.location.assign(studioHref);
      }}
    />
  );
}
