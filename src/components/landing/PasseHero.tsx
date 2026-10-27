import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import { Button3D } from "../ui/Button3D";
import { Icon } from "../ui/Icon";
import { useFeedbackSound } from "../../hooks/useFeedbackSound";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const INSTITUTIONS = ["UAN", "UCAN", "ISPTEC", "Metodista", "Lusíada", "Outra"] as const;

const OPTIONS = [
  { key: "a", text: "Entra mais dinheiro em circulação" },
  { key: "b", text: "O crédito fica mais caro e a inflação abranda" },
  { key: "c", text: "O Kwanza desvaloriza de imediato" },
  { key: "d", text: "As empresas passam a investir mais" },
] as const;

const CORRECT_KEY = "b";
const SESSION_SECONDS = 5 * 60;

function useSessionTimer() {
  const reduced = usePrefersReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  if (reduced) return { label: "Sessão de hoje", clock: "5 min", ended: false };
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return {
    label: secondsLeft > 0 ? "Sessão de hoje" : "Sessão concluída",
    clock: `${m}:${String(s).padStart(2, "0")}`,
    ended: secondsLeft === 0,
  };
}

type PasseHeroProps = { onQuizAnswered: (correct: boolean) => void };

/** Hero: cabeçalho de impacto + um simulado real a correr em miniatura. */
export function PasseHero({ onQuizAnswered }: PasseHeroProps) {
  const [institution, setInstitution] = useState<(typeof INSTITUTIONS)[number]>("UAN");
  const [answer, setAnswer] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();
  const playFeedback = useFeedbackSound();
  const timer = useSessionTimer();

  const correct = answer === CORRECT_KEY;
  const progress = answer ? 32 : 20;

  function selectOption(key: string) {
    if (answer) return;
    setAnswer(key);
    const isCorrect = key === CORRECT_KEY;
    playFeedback(isCorrect ? "correct" : "wrong");
    onQuizAnswered(isCorrect);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -10, ry: px * 10 });
  }

  function handlePointerLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  function scrollToQuiz() {
    const rect = quizRef.current?.getBoundingClientRect();
    const offScreen = rect && (rect.top < 0 || rect.bottom > window.innerHeight);
    if (offScreen) quizRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    setNudge(true);
    window.setTimeout(() => setNudge(false), 1200);
    window.setTimeout(() => firstOptionRef.current?.focus(), offScreen ? 450 : 0);
  }

  return (
    <section
      id="topo"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden bg-[var(--color-wave-deep)] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 size-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, transparent 55%, rgb(12 38 120 / 0.55))" }}
        />
        <div
          className="absolute right-0 bottom-0 size-[45vw] translate-x-1/3 translate-y-1/3 rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, transparent 45%, rgb(12 38 120 / 0.45))" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-montserrat text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Domina a tua cadeira mais difícil em 5 minutos por dia sem gastar o teu saldo
          </h1>
          <p className="mt-7 max-w-[31em] text-lg text-white/90 sm:text-xl">
            Simulados com correção na hora e resumos escritos por estudantes, num Passe de Provas de 21 dias{" "}
            <strong className="font-bold">desde 600 Kz por cadeira</strong>: o preço de duas corridas de candongueiro.
          </p>

          <div className="mt-7">
            <p className="mb-3 font-bold text-white">Onde estudas?</p>
            <div className="flex flex-wrap gap-2">
              {INSTITUTIONS.map((inst) => (
                <button
                  key={inst}
                  type="button"
                  onClick={() => setInstitution(inst)}
                  aria-pressed={institution === inst}
                  className={cn(
                    "min-h-11 rounded-full border-2 px-4 font-bold transition-[background-color,border-color,color] duration-150",
                    institution === inst
                      ? "border-secondary-container bg-secondary-container text-on-secondary-fixed"
                      : "border-white/55 bg-white/10 text-white hover:border-white hover:bg-white/15",
                  )}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <Button3D variant="success" size="lg" className="btn-sun bg-secondary-container text-on-secondary-fixed shadow-3d-neutral hover:brightness-105" onClick={scrollToQuiz}>
              Resolver 1 simulado grátis
            </Button3D>
            <a href="#precos" className="font-bold text-white underline underline-offset-4 hover:text-white/80">
              Ver preços
            </a>
          </div>
          <p className="mt-4 max-w-[32em] text-sm text-white/80">
            O primeiro simulado não pede conta. Depois entras com o teu número de WhatsApp.
          </p>
        </motion.div>

        <motion.div
          ref={quizRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[480px] justify-self-end"
          style={{ perspective: 1400 }}
        >
          <motion.div
            animate={nudge ? { boxShadow: ["0 0 0 0 rgb(254 212 0 / 0)", "0 0 0 18px rgb(254 212 0 / 0)"] } : undefined}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: "transform 500ms cubic-bezier(0.2,0,0,1)" }}
            className="relative rounded-2xl bg-surface-canvas p-6 text-on-surface shadow-[var(--shadow-float)]"
          >
            <h2 className="sr-only">Experimenta um simulado</h2>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sky px-3 py-1 text-caption font-bold text-primary uppercase">
                simulado · economia i{institution !== "Outra" && ` · ${institution}`}
              </span>
              <span className="inline-flex items-center gap-2.5">
                <svg width={38} height={38} viewBox="0 0 38 38" className="-rotate-90" aria-hidden="true">
                  <circle cx={19} cy={19} r={15} fill="none" stroke="var(--color-surface-container-high)" strokeWidth={4} />
                  <circle
                    cx={19}
                    cy={19}
                    r={15}
                    fill="none"
                    stroke="var(--color-brand-ocean)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={94.25}
                    strokeDashoffset={timer.ended ? 94.25 : 0}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span className="grid text-left leading-tight">
                  <span className="text-caption text-text-secondary">{timer.label}</span>
                  <span className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">{timer.clock}</span>
                </span>
              </span>
            </div>

            <div className="mt-4.5">
              <div className="flex justify-between font-bold text-on-surface">
                <span>Progresso em Economia I</span>
                <span className="text-primary tabular-nums">{progress}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-feedback-success transition-[width] duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-caption text-text-secondary">Começas nos 20%: o teu diagnóstico já conta.</p>
            </div>

            <p className="mt-4.5 text-caption text-text-tertiary">Pergunta 3 de 10</p>
            <p className="mt-1.5 text-pretty font-bold text-on-surface">
              Quando o BNA sobe a taxa básica de juro, o que se espera a seguir?
            </p>

            <div className="mt-3.5 grid gap-2.5">
              {OPTIONS.map((opt, i) => {
                const isAnswered = answer !== null;
                const isCorrectOpt = opt.key === CORRECT_KEY;
                const isPicked = answer === opt.key;
                const state = !isAnswered ? "idle" : isCorrectOpt ? "correct" : isPicked ? "wrong" : "dim";
                return (
                  <motion.button
                    key={opt.key}
                    ref={i === 0 ? firstOptionRef : undefined}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => selectOption(opt.key)}
                    animate={state === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
                    transition={{ duration: 0.36 }}
                    className={cn(
                      "relative flex min-h-[54px] items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left font-medium transition-[border-color,background-color,box-shadow,color] duration-150",
                      state === "idle" && "border-border-cloud bg-surface-canvas shadow-[0_3px_0_var(--color-border-cloud)] hover:border-brand-ocean",
                      state === "correct" && "border-feedback-success bg-[#f1fbe8] shadow-[0_3px_0_var(--color-feedback-success-ink)]",
                      state === "wrong" && "border-feedback-error bg-[#fff1f1] shadow-[0_3px_0_var(--color-feedback-error-ink)]",
                      state === "dim" && "border-border-cloud bg-surface-soft text-text-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-[30px] shrink-0 place-items-center rounded-lg border-2 font-bold",
                        state === "correct" && "border-feedback-success bg-feedback-success text-surface-ink",
                        state === "wrong" && "border-feedback-error bg-feedback-error text-surface-ink",
                        (state === "idle" || state === "dim") && "border-border-cloud text-text-secondary",
                      )}
                    >
                      {opt.key.toUpperCase()}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {state === "correct" && <Icon name="check" size={20} className="shrink-0 text-feedback-success-ink" strokeWidth={2.5} />}
                    {state === "wrong" && <Icon name="x" size={20} className="shrink-0 text-feedback-error-ink" strokeWidth={2.5} />}
                  </motion.button>
                );
              })}
            </div>

            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("relative mt-3.5 rounded-xl p-4", correct ? "bg-surface-forest text-white" : "bg-surface-container-low text-on-surface")}
              >
                {correct && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                    className="absolute -top-4.5 right-5 rounded-full bg-secondary-container px-3.5 py-2 font-montserrat font-extrabold text-on-secondary-fixed shadow-[0_4px_0_var(--color-brand-sunbeam-ink)]"
                  >
                    +40 XP
                  </motion.span>
                )}
                <p className={cn("font-montserrat font-extrabold", correct && "text-feedback-success")}>
                  {correct ? "Certo. +40 XP para a tua liga." : "Quase. A resposta certa é a B."}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">
                  Juros mais altos encarecem o crédito e travam a procura, por isso os preços sobem mais devagar.
                </p>
                {!correct && (
                  <button
                    type="button"
                    onClick={() => setAnswer(null)}
                    className="mt-2 font-bold underline underline-offset-3"
                  >
                    Tentar de novo
                  </button>
                )}
              </motion.div>
            )}

            <div className="mt-4.5 flex flex-wrap gap-5 border-t-2 border-surface-container-low pt-3.5 text-sm font-bold text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="flame" size={16} className="text-feedback-streak-ink" /> Ofensiva de 3 dias
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="snow" size={16} className="text-brand-sky-ink" /> 2 congelamentos guardados
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
