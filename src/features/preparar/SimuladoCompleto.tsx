import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FlowLayout } from "@/components/fluxo/flow";
import { Alert } from "@/components/fluxo/feedback";
import { ScreenTitle } from "@/components/fluxo/layout";
import { fluxoService } from "../../services/fluxoService";
import { QuizPlayer, type ResultadoQuiz } from "./QuizPlayer";

/** Simulado completo do módulo: as perguntas do material, com explicação. O XP é de exemplo (o oficial vem da API). */
export default function SimuladoCompleto() {
  const { id } = useParams();
  if (!id) return <Navigate to="/v2/preparar/materiais" replace />;
  return <Simulado id={id} />;
}

function Simulado({ id }: { id: string }) {
  const modulo = useQuery({ queryKey: ["fluxo", "modulo", id], queryFn: () => fluxoService.module(id), retry: false });
  const [resultado, setResultado] = useState<ResultadoQuiz>();
  const m = modulo.data;
  const voltar = `/v2/preparar/modulo/${encodeURIComponent(id)}`;

  return (
    <FlowLayout width="wide" back={{ href: voltar, label: "Voltar ao módulo" }} progress={{ value: resultado ? 100 : 50, label: "Simulado completo" }}>
      {modulo.isError && <Alert tone="danger" title="Não encontramos este simulado">Pode ter sido preparado noutro dispositivo.</Alert>}
      {modulo.isPending && <span className="block h-48 animate-pulse rounded-2xl bg-kombinu-surface" aria-busy="true" />}

      {m && m.status !== "unlocked" && m.status !== "pending_review" && (
        <Alert tone="warning" title="O simulado completo ainda está bloqueado">
          Desbloqueia o módulo para o fazeres. <Link to={voltar} className="font-bold underline underline-offset-2">Voltar ao módulo</Link>
        </Alert>
      )}

      {m && (m.status === "unlocked" || m.status === "pending_review") && (
        <div className="flex flex-col gap-8">
          <ScreenTitle subtitle="Perguntas sobre toda a tua matéria, com explicação de cada resposta.">{m.title}</ScreenTitle>
          {resultado ? (
            <div className="flex flex-col gap-4 rounded-[28px] bg-kombinu-surface p-6 text-center" role="status">
              <p className="font-display text-3xl font-extrabold">{resultado.correctFirstTry} de {resultado.total} à primeira</p>
              <p className="text-neutral-700">+{resultado.xp} XP neste simulado (valor de exemplo do modo de desenvolvimento).</p>
              <Link to={voltar} className="mx-auto inline-flex min-h-12 items-center rounded-2xl bg-kombinu-blue px-6 font-display font-bold text-white focus-ring">Voltar ao módulo</Link>
            </div>
          ) : (
            <section className="rounded-[28px] bg-kombinu-surface p-5 sm:p-7">
              <QuizPlayer questions={m.questions} onFinish={setResultado} rotuloFinal="Ver resultado" />
            </section>
          )}
        </div>
      )}
    </FlowLayout>
  );
}
