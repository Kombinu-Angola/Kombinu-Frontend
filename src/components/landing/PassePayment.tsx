import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button3D } from "../ui/Button3D";
import { Icon } from "../ui/Icon";
import { Avatar } from "../ui/Avatar";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const GUARDIAN_MESSAGE =
  "Olá, pai. Tenho a 1.ª frequência de Anatomia I daqui a 15 dias. Preciso do Passe de Provas da Kombinu (600 Kz, 21 dias): simulados e resumos da cadeira. Podes pagar aqui pelo Multicaixa Express? kombinu.ao/p/A7K2";

const CLASS_AVATARS = ["D L", "A M", "J K", "T S", "N P", "Y C", "B M", "E F", "G Q"];

type MethodId = "mcx" | "enc" | "turma" | "vou";

const METHODS: ReadonlyArray<{ id: MethodId; title: string; desc: string; icon: React.ReactNode }> = [
  {
    id: "mcx",
    title: "Multicaixa Express",
    desc: "Pagas na hora com o teu número.",
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-13 shrink-0">
        <g transform="rotate(-12 32 32)">
          <rect x={16} y={6} width={30} height={50} rx={8} fill="#1b2430" />
          <rect x={19.5} y={11} width={23} height={38} rx={4} fill="#3d7bf0" />
          <circle cx={31} cy={30.5} r={8} fill="#fed400" />
        </g>
      </svg>
    ),
  },
  {
    id: "enc",
    title: "Pede ao teu encarregado",
    desc: "Envias um link pelo WhatsApp e ele paga.",
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-13 shrink-0">
        <path d="M10 14 Q10 8 16 8 H48 Q54 8 54 14 V36 Q54 42 48 42 H28 L18 52 V42 H16 Q10 42 10 36 Z" fill="#fed400" />
        <circle cx={22} cy={25} r={3.2} fill="#1b2430" />
        <circle cx={32} cy={25} r={3.2} fill="#1b2430" />
        <circle cx={42} cy={25} r={3.2} fill="#1b2430" />
      </svg>
    ),
  },
  {
    id: "turma",
    title: "Passe de Turma",
    desc: "O delegado compra para a turma com desconto.",
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-13 shrink-0">
        <circle cx={18} cy={21} r={7} fill="#3d7bf0" />
        <path d="M6 50 Q6 32 18 32 Q30 32 30 50 Z" fill="#3d7bf0" />
        <circle cx={46} cy={21} r={7} fill="#3d7bf0" />
        <path d="M34 50 Q34 32 46 32 Q58 32 58 50 Z" fill="#3d7bf0" />
        <circle cx={32} cy={27} r={9} fill="#fed400" />
        <path d="M17 57 Q17 39 32 39 Q47 39 47 57 Z" fill="#fed400" />
      </svg>
    ),
  },
  {
    id: "vou",
    title: "Voucher na reprografia",
    desc: "Compras um código e pagas em dinheiro.",
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-13 shrink-0">
        <path d="M6 16 H58 V27 Q52 27 52 33 Q52 39 58 39 V50 H6 V39 Q12 39 12 33 Q12 27 6 27 Z" fill="#fed400" />
        <path d="M42 19 V47" stroke="#6b5600" strokeWidth={2} strokeDasharray="3 3" />
        <rect x={16} y={24} width={18} height={5} rx={2.5} fill="#3d7bf0" />
        <rect x={16} y={33} width={12} height={5} rx={2.5} fill="#3d7bf0" />
      </svg>
    ),
  },
];

function useTypewriter(text: string, active: boolean) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced || !active ? text : "");

  useEffect(() => {
    if (reduced || !active) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, text, reduced]);

  return { shown, done: shown.length === text.length };
}

/** 4 formas de ativar o passe sem conta bancária -- só ~1 em cada 3 adultos em Angola tem uma. */
export function PassePayment() {
  const [method, setMethod] = useState<MethodId>("enc");
  const [retypeKey, setRetypeKey] = useState(0);
  const { shown, done } = useTypewriter(GUARDIAN_MESSAGE, method === "enc");
  const retypeRef = useRef(0);

  function retype() {
    retypeRef.current += 1;
    setRetypeKey(retypeRef.current);
  }

  return (
    <section id="pagamento" aria-labelledby="pag-h" className="relative overflow-hidden bg-primary py-20 text-white sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute right-0 bottom-0 size-[38vw] translate-x-1/4 translate-y-1/4 rounded-full opacity-50" style={{ background: "radial-gradient(closest-side, transparent 50%, rgb(12 38 120 / 0.5))" }} />

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.2fr_0.8fr] sm:items-end sm:gap-16">
          <h2 id="pag-h" className="font-montserrat text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
            Paga mesmo sem conta no banco.
          </h2>
          <div>
            <p className="max-w-[34em] text-lg text-white">
              Só cerca de um em cada três adultos em Angola tem conta bancária. Por isso há quatro formas de ativar o
              teu passe.
            </p>
            <p className="mt-2 text-sm text-white/80">Fonte: inquérito do INE (2022).</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div role="group" aria-label="Formas de pagamento" className="grid gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={method === m.id}
                onClick={() => setMethod(m.id)}
                className={`flex w-full items-center gap-4 rounded-xl p-3.5 text-left transition-[background-color,color] duration-150 ${
                  method === m.id ? "bg-surface-canvas text-on-surface" : "bg-white/7 text-white hover:bg-white/13"
                }`}
              >
                {m.icon}
                <span>
                  <span className="block font-bold text-lg">{m.title}</span>
                  <span className={`mt-1 block text-sm ${method === m.id ? "text-text-secondary" : "text-white/85"}`}>{m.desc}</span>
                </span>
              </button>
            ))}
          </div>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {method === "mcx" && (
                <motion.div key="mcx" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-[300px] rounded-2xl bg-surface-canvas p-7 text-on-surface shadow-[var(--shadow-float)] sm:p-9">
                  <h3 className="font-montserrat text-2xl font-extrabold tracking-tight">Multicaixa Express</h3>
                  <ol className="mt-5 grid gap-3 pl-5 text-lg marker:font-bold marker:text-primary">
                    <li>Escreves o número associado ao teu Multicaixa Express.</li>
                    <li>Aprovas a notificação com o teu PIN.</li>
                    <li>O passe fica ativo na hora.</li>
                  </ol>
                  <div className="mt-5.5 flex items-center justify-between gap-3 rounded-md bg-surface-container-low p-4 font-bold">
                    <span>Passe de Provas · Anatomia I</span>
                    <strong className="font-montserrat text-2xl text-primary">600 Kz</strong>
                  </div>
                </motion.div>
              )}

              {method === "enc" && (
                <motion.div key="enc" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-[300px] rounded-2xl bg-surface-canvas p-7 text-on-surface shadow-[var(--shadow-float)] sm:p-9">
                  <h3 className="font-montserrat text-2xl font-extrabold tracking-tight">Pede ao teu encarregado</h3>
                  <p className="mt-3 max-w-[36em] text-lg text-on-surface">
                    Geras uma mensagem com o que vais estudar. O teu encarregado paga no Multicaixa Express dele e tu
                    recebes o passe.
                  </p>
                  <p className="mt-5 flex items-center gap-2 font-bold text-text-secondary">
                    <Icon name="chat" size={18} />
                    Mensagem pronta para enviar pelo WhatsApp
                  </p>
                  <p key={retypeKey} className="mt-2.5 min-h-[150px] rounded-[18px] rounded-br-sm bg-primary-fixed p-4 text-on-primary-fixed whitespace-pre-wrap">
                    <span className="sr-only">{GUARDIAN_MESSAGE}</span>
                    <span aria-hidden="true">
                      {shown}
                      {!done && <span className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-pulse bg-current align-[-3px]" />}
                    </span>
                    <span className="mt-2 block text-right text-xs text-[color:var(--color-on-primary-fixed-variant)]">agora</span>
                  </p>
                  <div className="mt-4.5">
                    <Button3D variant="secondary" onClick={retype}>
                      Gerar a mensagem
                    </Button3D>
                  </div>
                </motion.div>
              )}

              {method === "turma" && (
                <motion.div key="turma" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-[300px] rounded-2xl bg-surface-canvas p-7 text-on-surface shadow-[var(--shadow-float)] sm:p-9">
                  <h3 className="font-montserrat text-2xl font-extrabold tracking-tight">Passe de Turma</h3>
                  <p className="mt-3 max-w-[36em] text-lg text-on-surface">
                    Funciona como uma kixikila: o delegado junta os colegas, recolhe os valores e compra um pacote
                    para a turma com desconto. O passe do delegado sai grátis.
                  </p>
                  <div className="mt-5.5 flex justify-between font-bold">
                    <span>Economia · 2.º ano A</span>
                    <span>9 de 15 colegas</span>
                  </div>
                  <div className="mt-2 h-3.5 overflow-hidden rounded-full bg-surface-container-high">
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.6 }} transition={{ duration: 0.6 }} style={{ transformOrigin: "left" }} className="h-full rounded-full bg-feedback-success" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
                    {CLASS_AVATARS.map((n, i) => (
                      <span key={n} className={i === 0 ? "rounded-full ring-2 ring-primary" : ""}>
                        <Avatar name={n} size="sm" />
                      </span>
                    ))}
                    <span className="grid size-7 place-items-center rounded-full bg-surface-container-low text-[11px] font-bold text-text-secondary">+6</span>
                  </div>
                </motion.div>
              )}

              {method === "vou" && (
                <motion.div key="vou" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-[300px] rounded-2xl bg-surface-canvas p-7 text-on-surface shadow-[var(--shadow-float)] sm:p-9">
                  <h3 className="font-montserrat text-2xl font-extrabold tracking-tight">Voucher na reprografia</h3>
                  <p className="mt-3 max-w-[36em] text-lg text-on-surface">
                    Compras o código numa reprografia ou associação de estudantes, escreves o código na app e o passe
                    fica ativo.
                  </p>
                  <div
                    role="img"
                    aria-label="Exemplo de voucher: Passe de Provas, 1 cadeira, 21 dias, 600 Kz"
                    className="mt-5.5 grid grid-cols-[1fr_128px] overflow-hidden rounded-[18px]"
                  >
                    <div className="bg-gradient-to-br from-[#ffe066] to-[#fed400] p-5 text-on-secondary-fixed">
                      <p className="font-bold">Kombinu · voucher</p>
                      <p className="mt-1.5 font-montserrat text-xl font-extrabold">Passe de Provas</p>
                      <p className="text-sm">1 cadeira · 21 dias</p>
                      <span className="mt-2 inline-block font-bold tracking-wider tabular-nums">KMB-7Q4H-92XT</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 border-l-[3px] border-dashed border-on-secondary-fixed bg-primary text-white">
                      <span className="font-montserrat text-3xl font-extrabold">600</span>
                      <span className="text-sm">Kz</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
