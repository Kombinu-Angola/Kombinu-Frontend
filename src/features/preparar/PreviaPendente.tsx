import { useSearchParams } from "react-router-dom";
import { FlowLayout } from "@/components/fluxo/flow";
import { Alert } from "@/components/fluxo/feedback";
import { ScreenTitle } from "@/components/fluxo/layout";

/** Marcador do B4 (prévia jogável), que chega no PR seguinte. Só existe em desenvolvimento, com os mocks ligados. */
export default function PreviaPendente() {
  const [params] = useSearchParams();
  return (
    <FlowLayout back={{ href: "/v2/preparar", label: "Voltar" }} progress={{ value: 96, label: "Prévia" }}>
      <ScreenTitle subtitle="A tua prévia ficou pronta.">Prévia em construção</ScreenTitle>
      <div className="mt-6">
        <Alert tone="info" title="Modo de desenvolvimento">
          O ecrã da prévia jogável (B4) chega no próximo PR. Identificador: {params.get("id")}
        </Alert>
      </div>
    </FlowLayout>
  );
}
