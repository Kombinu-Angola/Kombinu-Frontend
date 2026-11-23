import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BoltIcon, CheckIcon, XIcon } from "@/components/fluxo/icons";
import { EASE_OUT, step } from "@/components/fluxo/motion";
import { PrimaryButton } from "../auth-novo/ui";
import type { Question } from "../../services/fluxoService";

export interface RespostaQuiz {
  questionId: string;
  optionId: string;
  firstTry: boolean;
}

export interface ResultadoQuiz {
  answers: RespostaQuiz[];
  correctFirstTry: number;
  total: number;
  xp: number;
}

type Props = {
  questions: Question[];
  onFinish: (r: ResultadoQuiz) => void;
  xpPorAcerto?: number;
  rotuloFinal?: string;
};

type Fase = "a-responder" | "errada" | "certa" | "revelada";

const CAIXA_OPCAO = {
  certa: "bg-kombinu-success-soft ring-2 ring-emerald-600",
  errada: "bg-kombinu-danger-soft ring-2 ring-kombinu-danger/60 opacity-80",
  escolhida: "bg-kombinu-blue-soft ring-2 ring-kombinu-blue",
  livre: "bg-white ring-1 ring-neutral-200 hover:bg-neutral-50",
} as const;

const LETRA_OPCAO = {
  certa: "bg-emerald-600 text-white",
  errada: "bg-kombinu-danger text-white",
  escolhida: "bg-kombinu-blue text-white",
  livre: "bg-kombinu-surface text-neutral-600",
} as const;

/**
 * Jogador de perguntas (prévia B4 e, mais tarde, o simulado completo). +10 XP só quando acerta à primeira;
 * errar deixa tentar de novo, sem penalizar a sessão. O XP mostrado é da prévia: o oficial vem da API.
 */
export function QuizPlayer({ questions, onFinish, xpPorAcerto = 10, rotuloFinal = "Ver resultado" }: Props) {
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<string>();
  const [fase, setFase] = useState<Fase>("a-responder");
  const [erradas, setErradas] = useState<string[]>([]);
  const [respostas, setRespostas] = useState<RespostaQuiz[]>([]);
  const [xp, setXp] = useState(0);
  const [rajada, setRajada] = useState(0);
  const nome = useId();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();

  const q = questions[indice];
  const ultima = indice === questions.length - 1;
  const aPrimeira = erradas.length === 0;
  const feito = fase === "certa" || fase === "revelada";

  useEffect(() => {
    if (fase !== "a-responder") feedbackRef.current?.focus({ preventScroll: true });
  }, [fase]);

  function verificar() {
    if (!escolhida) return;
    if (escolhida === q.correctOptionId) {
      setFase("certa");
      setRespostas((a) => [...a, { questionId: q.id, optionId: escolhida, firstTry: aPrimeira }]);
      if (aPrimeira) {
        setXp((x) => x + xpPorAcerto);
        setRajada((b) => b + 1);
      }
    } else {
      setErradas((w) => [...w, escolhida]);
      setFase("errada");
    }
  }

  function revelar() {
    setFase("revelada");
    setRespostas((a) => [...a, { questionId: q.id, optionId: q.correctOptionId, firstTry: false }]);
  }

  function seguinte() {
    if (ultima) {
      onFinish({ answers: respostas, correctFirstTry: respostas.filter((a) => a.firstTry).length, total: questions.length, xp });
      return;
    }
    setIndice((i) => i + 1);
    setEscolhida(undefined);
    setErradas([]);
    setFase("a-responder");
  }

  return (
    <section aria-labelledby={`${nome}-q`} className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <ol className="flex flex-1 gap-1.5" aria-label={`Pergunta ${indice + 1} de ${questions.length}`}>
          {questions.map((x, i) => {
            const r = respostas.find((a) => a.questionId === x.id);
            return <li key={x.id} aria-hidden="true" className={`h-2 flex-1 rounded-full ${r ? (r.firstTry ? "bg-emerald-600" : "bg-kombinu-yellow") : i === indice ? "bg-kombinu-blue" : "bg-kombinu-surface"}`} />;
          })}
        </ol>
        <span className="relative flex h-9 items-center gap-1 rounded-full bg-kombinu-yellow-soft px-3 font-display text-sm font-bold text-neutral-800 tabular-nums">
          <BoltIcon className="size-4" /> {xp} XP
          <AnimatePresence>
            {rajada > 0 && !reduzir && (
              <motion.span
                key={rajada}
                aria-hidden="true"
                className="pointer-events-none absolute -top-1 right-2 font-display text-sm font-extrabold text-neutral-800"
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: [0, 1, 1, 0], y: -26, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE_OUT, times: [0, 0.15, 0.7, 1] }}
              >
                +{xpPorAcerto}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>

      <AnimatePresence mode="popLayout" initial={false} custom={1}>
        <motion.fieldset key={q.id} custom={1} variants={step} initial="initial" animate="enter" exit="exit" className="flex flex-col gap-3">
          <legend id={`${nome}-q`} className="mb-2 font-display text-xl leading-snug font-bold text-balance">
            <span className="mb-1 block font-sans text-xs font-bold tracking-[0.1em] text-neutral-600 uppercase">Pergunta {indice + 1} de {questions.length}</span>
            {q.prompt}
          </legend>
          {q.options.map((o, i) => {
            const sel = escolhida === o.id;
            const errada = erradas.includes(o.id);
            const certa = feito && o.id === q.correctOptionId;
            const estado = certa ? "certa" : errada ? "errada" : sel ? "escolhida" : "livre";
            return (
              <label
                key={o.id}
                className={`flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kombinu-blue ${CAIXA_OPCAO[estado]} ${feito || errada ? "cursor-default" : "cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name={`${nome}-${q.id}`}
                  value={o.id}
                  checked={sel}
                  disabled={feito || errada}
                  onChange={() => {
                    setEscolhida(o.id);
                    if (fase === "errada") setFase("a-responder");
                  }}
                  className="sr-only"
                />
                <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-lg font-display text-sm font-bold ${LETRA_OPCAO[estado]}`}>
                  {estado === "certa" ? <CheckIcon className="size-4" strokeWidth={3} /> : estado === "errada" ? <XIcon className="size-4" strokeWidth={3} /> : String.fromCharCode(65 + i)}
                </span>
                <span className="text-[0.98rem] font-medium">{o.text}</span>
                {estado === "errada" && <span className="sr-only"> (resposta errada)</span>}
                {estado === "certa" && <span className="sr-only"> (resposta certa)</span>}
              </label>
            );
          })}
        </motion.fieldset>
      </AnimatePresence>

      <div aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {fase !== "a-responder" && (
            <motion.div
              key={`${q.id}-${fase}`}
              ref={feedbackRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className={`rounded-2xl p-4 outline-none ${fase === "errada" ? "bg-kombinu-danger-soft" : fase === "certa" ? "bg-kombinu-success-soft" : "bg-kombinu-yellow-soft"}`}
            >
              <p className="font-display font-bold">
                {fase === "errada" ? "Ainda não. Tenta outra opção." : fase === "certa" ? (aPrimeira ? `Certo à primeira! +${xpPorAcerto} XP` : "Certo!") : "Esta era a resposta certa"}
              </p>
              {feito && <p className="mt-1.5 text-[0.95rem] leading-relaxed text-neutral-700">{q.explanation}</p>}
              {fase === "errada" && (
                <button type="button" onClick={revelar} className="mt-2 flex min-h-11 items-center rounded-md text-sm font-bold underline underline-offset-2 focus-ring">
                  Mostrar a resposta
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {feito ? (
        <PrimaryButton type="button" onClick={seguinte}>{ultima ? rotuloFinal : "Próxima pergunta"}</PrimaryButton>
      ) : (
        <PrimaryButton type="button" onClick={verificar} disabled={!escolhida}>Verificar</PrimaryButton>
      )}
    </section>
  );
}
