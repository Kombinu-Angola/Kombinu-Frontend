import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { FlowLayout } from "@/components/fluxo/flow";
import { Alert, Badge } from "@/components/fluxo/feedback";
import { BoltIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { EASE_OUT } from "@/components/fluxo/motion";
import { PrimaryButton } from "../auth-novo/ui";
import { fluxoService } from "../../services/fluxoService";
import { BlocoDaSebenta } from "./BlocoDaSebenta";
import { ConteudoBloqueado, FolhaDecisao } from "./FolhaDecisao";
import { QuizPlayer, type ResultadoQuiz } from "./QuizPlayer";

/** B4: prévia jogável, 1 bloco da sebenta e 3 perguntas sobre o ficheiro do estudante. */
export default function B4Previa() {
  const [params] = useSearchParams();
  const id = params.get("id");
  if (!id) return <Navigate to="/v2/preparar" replace />;
  return <Previa previaId={id} />;
}

function Previa({ previaId }: { previaId: string }) {
  const previa = useQuery({ queryKey: ["fluxo", "previa", previaId], queryFn: () => fluxoService.preview(previaId), retry: false });
  const [resultado, setResultado] = useState<ResultadoQuiz>();
  const [folha, setFolha] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function terminar(r: ResultadoQuiz) {
    setResultado(r);
    // Um instante para o resultado ser visto antes de a folha subir.
    temporizador.current = setTimeout(() => setFolha(true), 650);
  }

  const d = previa.data;

  return (
    <FlowLayout width="wide" back={{ href: "/v2/preparar/materiais", label: "Ir para As minhas preparações" }} progress={{ value: resultado ? 100 : 96, label: "Prévia" }}>
      {previa.isError && (
        <Alert tone="danger" title="Não conseguimos carregar a prévia">
          Esta prévia já não existe neste dispositivo. Volta a preparar a tua prova.
        </Alert>
      )}
      {previa.isPending && (
        <div className="grid gap-4" aria-busy="true">
          <span className="h-6 w-40 animate-pulse rounded-2xl bg-kombinu-surface" />
          <span className="h-10 w-3/4 animate-pulse rounded-2xl bg-kombinu-surface" />
          <span className="h-64 animate-pulse rounded-2xl bg-kombinu-surface" />
        </div>
      )}

      {d && (
        <div className="flex flex-col gap-10">
          <ScreenTitle eyebrow={<Badge tone="blue">{d.subjectName} · Prévia grátis</Badge>} subtitle="Lê o primeiro bloco e responde a 3 perguntas feitas a partir do teu ficheiro.">
            {d.title}
          </ScreenTitle>

          <BlocoDaSebenta bloco={d.block} />
          <ConteudoBloqueado blocos={d.totalBlocks - 1} perguntas={d.totalQuestions - d.questions.length} />

          <section aria-labelledby="quiz-h" className="rounded-[28px] bg-kombinu-surface p-5 sm:p-7">
            <h2 id="quiz-h" className="mb-5 flex items-center gap-2 font-display text-xl font-bold">
              <BoltIcon className="size-5 text-kombinu-blue" /> Testa o que leste
            </h2>
            <AnimatePresence mode="wait" initial={false}>
              {resultado ? (
                <motion.div key="feito" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: EASE_OUT }} className="flex flex-col gap-4 text-center" role="status">
                  <p className="font-display text-3xl font-extrabold">+{resultado.xp} XP</p>
                  <p className="text-neutral-700">Acertaste {resultado.correctFirstTry} de {resultado.total} à primeira. A IA usou exatamente a matéria do teu ficheiro.</p>
                  <PrimaryButton type="button" onClick={() => setFolha(true)}>Desbloquear o módulo completo</PrimaryButton>
                </motion.div>
              ) : (
                <motion.div key="quiz" exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <QuizPlayer questions={d.questions} onFinish={terminar} rotuloFinal="Terminar prévia" />
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <FolhaDecisao
            open={folha}
            onClose={() => setFolha(false)}
            contentId={d.contentId}
            resumo={{ title: d.title, subjectName: d.subjectName, totalBlocks: d.totalBlocks, totalQuestions: d.totalQuestions, planDays: d.planDays }}
          />
        </div>
      )}
    </FlowLayout>
  );
}
