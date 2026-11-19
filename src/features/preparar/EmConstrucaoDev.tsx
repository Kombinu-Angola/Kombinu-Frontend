import { useLocation } from "react-router-dom";
import { FlowLayout } from "@/components/fluxo/flow";
import { Alert } from "@/components/fluxo/feedback";
import { ScreenTitle } from "@/components/fluxo/layout";

/** Marcador dos ecrãs que chegam no PR seguinte (B6 e "As minhas preparações"). Só existe em desenvolvimento, com os mocks ligados. */
export default function EmConstrucaoDev() {
  const { pathname } = useLocation();
  return (
    <FlowLayout back={{ href: "/v2/preparar", label: "Voltar" }}>
      <ScreenTitle>Em construção</ScreenTitle>
      <div className="mt-6">
        <Alert tone="info" title="Modo de desenvolvimento">
          Este ecrã chega no próximo PR ({pathname}).
        </Alert>
      </div>
    </FlowLayout>
  );
}
