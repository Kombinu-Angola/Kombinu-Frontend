import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { FlowLayout } from "@/components/fluxo/flow";
import { RadioCardGroup } from "@/components/fluxo/choice";
import { Switch } from "@/components/fluxo/switch";
import { Alert, Spinner } from "@/components/fluxo/feedback";
import { BookIcon, CalendarIcon, CheckIcon, ClockIcon, GridIcon, SparkIcon, TargetIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { EASE_OUT, fade, step } from "@/components/fluxo/motion";
import { Field, PrimaryButton } from "../auth-novo/ui";
import { addDays, dataLonga, daysUntil, mensagemDe, toISODate } from "../../lib/formatoFluxo";
import { fluxoService, type Depth, type GenerationJob, type ModuleComponent, type TargetGrade } from "../../services/fluxoService";

const PASSOS = 3;
/** Barra "dotada a 20%": arranca com algum avanço, para o passo 1 não parecer o início de um formulário longo. */
const progressoDe = (i: number) => 20 + (i / PASSOS) * 80;

type Quando = "week" | "two" | "three" | "custom";

/**
 * B2 + B3: a IA prepara a prévia em segundo plano enquanto o estudante calibra (espera com sentido).
 * O `job` vai na URL, por isso recarregar a página não perde a tarefa.
 */
export default function B3Calibrar() {
  const [params] = useSearchParams();
  const jobId = params.get("job");
  if (!jobId) return <Navigate to="/v2/preparar" replace />;
  return <Calibrar jobId={jobId} />;
}

function Calibrar({ jobId }: { jobId: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [fase, setFase] = useState<"perguntas" | "espera">("perguntas");
  const [aGuardar, setAGuardar] = useState(false);
  const [erro, setErro] = useState<string>();
  const repetida = useRef(false);

  const [quando, setQuando] = useState<Quando>();
  const [dataEscolhida, setDataEscolhida] = useState("");
  const [nota, setNota] = useState<TargetGrade>();
  const [profundidade, setProfundidade] = useState<Depth>("intermediate");
  const [componentes, setComponentes] = useState<Record<ModuleComponent, boolean>>({ diagrams: true, structured_text: true, flashcards: false });
  const [erroPasso, setErroPasso] = useState<string>();

  // B2: consulta a tarefa a cada 1,5 s até estar pronta (continua durante as perguntas).
  const tarefa = useQuery({
    queryKey: ["fluxo", "job", jobId],
    queryFn: () => fluxoService.job(jobId),
    refetchInterval: (q) => (q.state.data?.status === "ready" ? false : 1500),
  });
  const job = tarefa.data;
  const previaId = job?.previewContentId;

  // Uma falha repete-se uma vez, sem descontar da quota.
  useEffect(() => {
    if (job?.status === "failed" && !repetida.current) {
      repetida.current = true;
      void fluxoService.retryJob(jobId).then(() => qc.invalidateQueries({ queryKey: ["fluxo", "job", jobId] }));
    }
  }, [job?.status, jobId, qc]);

  // Se o estudante já acabou as perguntas e a prévia fica pronta, segue para ela.
  useEffect(() => {
    if (fase === "espera" && previaId) navigate(`/v2/preparar/previa?id=${encodeURIComponent(previaId)}`, { replace: true });
  }, [fase, previaId, navigate]);

  const dataProva = quando === "week" ? addDays(5) : quando === "two" ? addDays(14) : quando === "three" ? addDays(21) : quando === "custom" ? dataEscolhida : "";
  const dias = dataProva ? daysUntil(dataProva) : undefined;
  const textoPlano =
    dias === undefined
      ? ""
      : dias < 0
        ? "Essa data já passou."
        : dias <= 3
          ? `Faltam ${dias} ${dias === 1 ? "dia" : "dias"}: modo intensivo de véspera.`
          : `Faltam ${dias} dias: plano diário de ${Math.min(21, Math.max(14, dias))} dias.`;

  function validar(): string | undefined {
    if (i === 0) {
      if (!dataProva) return "Escolhe quando é a prova.";
      if (dias! < 0) return "Escolhe uma data a partir de hoje.";
    }
    if (i === 1 && !nota) return "Escolhe a nota que queres alcançar.";
    if (i === 2 && !componentes.diagrams && !componentes.structured_text) return "Escolhe pelo menos esquemas visuais ou texto estruturado.";
    return undefined;
  }

  function seguinte() {
    const e = validar();
    setErroPasso(e);
    if (e) return;
    if (i < PASSOS - 1) {
      setDir(1);
      setI(i + 1);
      return;
    }
    void guardar();
  }

  function anterior() {
    setErroPasso(undefined);
    setDir(-1);
    setI(i - 1);
  }

  async function guardar() {
    setAGuardar(true);
    setErro(undefined);
    try {
      const j: GenerationJob = await fluxoService.setJobParams(jobId, {
        examDate: dataProva,
        targetGrade: nota!,
        depth: profundidade,
        components: (Object.keys(componentes) as ModuleComponent[]).filter((k) => componentes[k]),
      });
      if (j.status === "ready" && j.previewContentId) navigate(`/v2/preparar/previa?id=${encodeURIComponent(j.previewContentId)}`);
      else setFase("espera");
    } catch (err) {
      setErro(mensagemDe(err));
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <FlowLayout
      back={fase === "perguntas" && i > 0 ? { onClick: anterior, label: "Pergunta anterior" } : undefined}
      progress={{ value: fase === "espera" ? 96 : progressoDe(i), label: "Calibração da prova" }}
      footer={
        fase === "perguntas" ? (
          <PrimaryButton type="button" onClick={seguinte} loading={aGuardar} loadingText="A guardar…">
            {i < PASSOS - 1 ? "Continuar" : "Criar a minha prévia"}
          </PrimaryButton>
        ) : undefined
      }
    >
      <EstadoTarefa job={job} />

      {erro && <div className="mt-4"><Alert tone="danger">{erro}</Alert></div>}

      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        {fase === "espera" ? (
          <motion.div key="espera" variants={fade} initial="initial" animate="enter" exit="exit" className="mt-8 flex flex-col gap-6">
            <ScreenTitle subtitle="A tua matéria é grande ou o fornecedor de IA está lento. Não precisas de ficar à espera neste ecrã.">Quase pronta</ScreenTitle>
            <Alert tone="info" icon={<ClockIcon className="size-4" />} title="Podes voltar mais tarde">
              Assim que a prévia estiver pronta, fica guardada em «As minhas preparações».
            </Alert>
          </motion.div>
        ) : (
          <motion.section key={i} custom={dir} variants={step} initial="initial" animate="enter" exit="exit" className="mt-8 flex flex-col gap-6">
            <p className="text-sm font-bold text-kombinu-blue">Pergunta {i + 1} de {PASSOS}</p>

            {i === 0 && (
              <>
                <ScreenTitle>Quando é a prova?</ScreenTitle>
                <RadioCardGroup
                  legend="Data da prova"
                  hideLegend
                  value={quando}
                  onChange={(v) => setQuando(v as Quando)}
                  columns={2}
                  options={[
                    { value: "week", title: "Esta semana", description: "Modo intensivo", icon: <CalendarIcon className="size-5" /> },
                    { value: "two", title: "Daqui a 2 semanas", description: "Plano de 14 dias", icon: <CalendarIcon className="size-5" /> },
                    { value: "three", title: "3 semanas ou mais", description: "Plano de 21 dias", icon: <CalendarIcon className="size-5" /> },
                    { value: "custom", title: "Sei a data", description: "Escolher no calendário", icon: <CalendarIcon className="size-5" /> },
                  ]}
                />
                {quando === "custom" && (
                  <Field label="Data da prova" type="date" min={toISODate(new Date())} value={dataEscolhida} hint={dataEscolhida ? dataLonga(dataEscolhida) : undefined} onChange={(e) => setDataEscolhida(e.target.value)} />
                )}
                {textoPlano && <p role="status" className="rounded-2xl bg-kombinu-blue-soft px-4 py-3 font-medium text-kombinu-blue-dark">{textoPlano}</p>}
              </>
            )}

            {i === 1 && (
              <>
                <ScreenTitle subtitle="Calibra a dificuldade das perguntas.">Que nota queres tirar?</ScreenTitle>
                <RadioCardGroup
                  legend="Nota alvo"
                  hideLegend
                  value={nota}
                  onChange={(v) => setNota(v as TargetGrade)}
                  options={[
                    { value: "pass", title: "Passar (10–12)", description: "Conceitos-base e as perguntas que saem sempre.", icon: <TargetIcon className="size-5" /> },
                    { value: "good", title: "Boa nota (13–15)", description: "Base sólida mais aplicação em exercícios.", icon: <TargetIcon className="size-5" /> },
                    { value: "excellence", title: "Dispensar (16+)", description: "Casos práticos complexos e armadilhas de exame.", icon: <TargetIcon className="size-5" /> },
                  ]}
                />
              </>
            )}

            {i === 2 && (
              <>
                <ScreenTitle subtitle="Define o tamanho de cada bloco da sebenta e das explicações.">Como queres estudar?</ScreenTitle>
                <RadioCardGroup
                  legend="Profundidade"
                  value={profundidade}
                  onChange={(v) => setProfundidade(v as Depth)}
                  options={[
                    { value: "direct", title: "Resumo direto", description: "Só o essencial" },
                    { value: "intermediate", title: "Intermédio", description: "Equilibrado" },
                    { value: "exhaustive", title: "Exaustivo", description: "Tudo explicado" },
                  ]}
                />
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 text-[0.8rem] font-bold tracking-[0.06em] uppercase">Formato</legend>
                  <Switch label="Esquemas visuais" description="Mapas e infográficos para memorizar" icon={<GridIcon className="size-5" />} checked={componentes.diagrams} onChange={(v) => setComponentes((c) => ({ ...c, diagrams: v }))} />
                  <Switch label="Texto estruturado" description="Explicações por tópicos" icon={<BookIcon className="size-5" />} checked={componentes.structured_text} onChange={(v) => setComponentes((c) => ({ ...c, structured_text: v }))} />
                  <Switch label="Flashcards" description="Para rever no táxi ou na fila" icon={<SparkIcon className="size-5" />} checked={componentes.flashcards} onChange={(v) => setComponentes((c) => ({ ...c, flashcards: v }))} />
                </fieldset>
                <p className="flex items-center gap-2 text-sm text-neutral-600">
                  <CheckIcon className="size-4 shrink-0 text-kombinu-blue" strokeWidth={3} /> Checkpoints e quizzes de fixação vão sempre incluídos.
                </p>
              </>
            )}

            {erroPasso && <p role="alert" className="text-sm font-medium text-kombinu-danger">{erroPasso}</p>}
          </motion.section>
        )}
      </AnimatePresence>
    </FlowLayout>
  );
}

/** Estado da tarefa de IA (B2). Fica no topo e anuncia mudanças sem roubar o foco. */
function EstadoTarefa({ job }: { job?: GenerationJob }) {
  const estado = !job ? "loading" : job.status === "ready" ? "ready" : job.status === "failed" ? "failed" : job.cacheHit ? "cache" : "processing";
  const c = {
    loading: { icone: <Spinner className="size-4" />, texto: "A ligar à tua tarefa…", cls: "bg-kombinu-surface text-neutral-700" },
    processing: { icone: <Spinner className="size-4" />, texto: "A IA está a ler a tua matéria…", cls: "bg-kombinu-blue-soft text-kombinu-blue-dark" },
    cache: { icone: <Spinner className="size-4" />, texto: "Já conhecemos este ficheiro: vai ser mais rápido.", cls: "bg-kombinu-blue-soft text-kombinu-blue-dark" },
    failed: { icone: <Spinner className="size-4" />, texto: "A preparar: estamos a repetir, sem gastar a tua quota.", cls: "bg-kombinu-yellow-soft text-neutral-800" },
    ready: { icone: <CheckIcon className="size-4" strokeWidth={3} />, texto: "Prévia pronta. Termina as perguntas para a abrir.", cls: "bg-kombinu-success-soft text-neutral-800" },
  }[estado];
  return (
    <div role="status" aria-live="polite" className="min-h-11">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={estado}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
          className={`inline-flex min-h-11 items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold ${c.cls}`}
        >
          {c.icone}
          {c.texto}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
