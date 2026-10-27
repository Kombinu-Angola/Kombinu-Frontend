import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Icon } from "../ui/Icon";
import { Button3D } from "../ui/Button3D";
import { useCountUp } from "../../hooks/useCountUp";

const fmtKz = (n: number) => new Intl.NumberFormat("pt-AO").format(n);
const EXPLICADOR_PER_SUBJECT = 20000;
const MULTI_PRICE = 2500;
const PASSE_PRICE = 600;

const TICKETS = [
  {
    id: "passe" as const,
    meta: "1 cadeira · 21 dias",
    name: "Passe de Provas",
    features: ["Simulados da cadeira com correção na hora", "Resumos escritos por estudantes", "Descarga para estudar offline", "2 congelamentos de ofensiva"],
    price: "600",
    per: "Duas corridas de candongueiro.",
  },
  {
    id: "kit" as const,
    meta: "1 cadeira · 30 dias",
    name: "Kit Completo",
    features: ["Tudo o que o Passe de Provas inclui", "Mapas mentais e resoluções passo a passo", "Banco de questões completo da cadeira", "A época inteira, 30 dias"],
    price: "1.500",
    per: "A época de uma cadeira.",
  },
  {
    id: "multi" as const,
    meta: "Várias cadeiras · semestre",
    name: "Multi-Disciplina",
    features: ["As cadeiras do teu semestre num só passe", "Cobre frequências e exames", "Liga de turma contra turma", "O melhor valor por cadeira"],
    price: "2.500",
    per: "Um só pagamento por semestre.",
  },
] as const;

function Candongueiro({ className }: { className?: string }) {
  return (
    <g className={className}>
      <path d="M8 106 V40 Q8 18 30 18 H206 Q222 18 232 30 L270 76 Q278 86 278 98 V106 Q278 116 268 116 H18 Q8 116 8 106 Z" fill="#ffffff" />
      <path d="M8 78 H262 L271 88 Q278 96 278 104 V106 Q278 116 268 116 H18 Q8 116 8 106 Z" fill="#3d7bf0" />
      <rect x={8} y={73} width={256} height={5} fill="#fed400" />
      <rect x={22} y={28} width={44} height={34} rx={7} fill="#b8d2fb" />
      <rect x={74} y={28} width={44} height={34} rx={7} fill="#b8d2fb" />
      <rect x={126} y={28} width={44} height={34} rx={7} fill="#b8d2fb" />
      <rect x={178} y={28} width={40} height={34} rx={7} fill="#b8d2fb" />
      <path d="M226 28 H230 Q236 28 240 34 L262 66 H226 Z" fill="#b8d2fb" />
      <rect x={266} y={88} width={10} height={9} rx={3} fill="#fed400" />
      <circle cx={70} cy={112} r={24} fill="#1a4aa8" />
      <circle cx={222} cy={112} r={24} fill="#1a4aa8" />
      <rect x={4} y={106} width={280} height={9} rx={4.5} fill="#1b2430" />
      <circle cx={70} cy={118} r={19} fill="#1b2430" />
      <circle cx={70} cy={118} r={8} fill="#d5dde9" />
      <circle cx={222} cy={118} r={19} fill="#1b2430" />
      <circle cx={222} cy={118} r={8} fill="#d5dde9" />
    </g>
  );
}

/** Preços em formato de bilhete, mais a calculadora que recomenda o passe certo para N cadeiras. */
export function PassePricing() {
  const [subjects, setSubjects] = useState(1);
  const anchorRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(anchorRef, { once: true, amount: 0.4 });
  const anchorValue = useCountUp(inView ? PASSE_PRICE : 15000, 1700);

  const total = subjects * PASSE_PRICE;
  const recommendPasse = total <= MULTI_PRICE;
  const recommended: "passe" | "multi" = recommendPasse ? "passe" : "multi";

  const mainLine = recommendPasse
    ? subjects === 1
      ? "Para 1 cadeira, um Passe de Provas fica em 600 Kz."
      : `Para ${subjects} cadeiras, ${subjects} Passes de Provas ficam em ${fmtKz(total)} Kz.`
    : `Com ${subjects} cadeiras, o Multi-Disciplina poupa-te ${fmtKz(total - MULTI_PRICE)} Kz face a ${subjects} passes.`;

  const diff = MULTI_PRICE - total;
  const extraLine =
    recommendPasse && diff > 0 && diff <= 600
      ? `Por mais ${fmtKz(diff)} Kz, o Multi-Disciplina cobre o semestre inteiro.`
      : `Com explicador, uma aula por cadeira custaria cerca de ${fmtKz(subjects * EXPLICADOR_PER_SUBJECT)} Kz.`;

  return (
    <section id="precos" aria-labelledby="precos-h" className="bg-surface-container py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-end sm:gap-16">
          <h2 id="precos-h" className="font-montserrat text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Desde o preço de duas corridas.
          </h2>
          <p className="max-w-[34em] text-lg text-on-surface">
            Pagas uma vez por época, só pelas cadeiras de que precisas. Quando o passe termina, não há cobranças
            automáticas.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:gap-16">
          <div className="grid gap-7">
            <div>
              <p className="font-bold text-text-secondary">Uma aula de explicador</p>
              <p className="mt-2.5 font-montserrat text-[clamp(32px,3.4vw,50px)] font-extrabold tracking-tight text-text-secondary tabular-nums">
                15.000–25.000 Kz
              </p>
            </div>
            <div ref={anchorRef}>
              <p className="font-bold text-on-surface">Um Passe de Provas de 21 dias</p>
              <p className="mt-2.5 font-montserrat text-[clamp(44px,5.4vw,80px)] leading-[0.95] font-extrabold tracking-tight text-primary tabular-nums">
                <span aria-hidden="true">{fmtKz(anchorValue)} Kz</span>
                <span className="sr-only">600 Kz</span>
              </p>
            </div>
          </div>
          <figure className="m-0">
            <svg viewBox="0 0 360 200" role="img" aria-label="Dois candongueiros azuis e brancos" className="w-full">
              <ellipse cx={185} cy={189} rx={165} ry={8} fill="rgb(13 40 110 / 0.16)" />
              <g transform="translate(8 50)">
                <Candongueiro />
              </g>
              <g transform="translate(118 14) scale(0.76)">
                <Candongueiro />
              </g>
            </svg>
            <figcaption className="mt-2.5 text-center text-lg text-on-surface">
              Duas corridas de candongueiro, a 300 Kz cada.
            </figcaption>
          </figure>
        </div>

        <p className="mt-7 max-w-[72ch] text-sm text-text-secondary">
          Explicações universitárias anunciadas em Luanda (2026). Corrida de candongueiro: 300 Kz (ANTT, julho de
          2025).
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-6 rounded-2xl bg-surface-ink p-6 text-white sm:gap-8">
          <p id="calc-label" className="font-bold text-lg">
            Quantas cadeiras tens este semestre?
          </p>
          <div role="group" aria-labelledby="calc-label" className="inline-flex items-center gap-1.5 rounded-full bg-white/12 p-1">
            <button
              type="button"
              aria-label="Menos uma cadeira"
              disabled={subjects <= 1}
              onClick={() => setSubjects((n) => Math.max(1, n - 1))}
              className="grid size-11 place-items-center rounded-full bg-surface-canvas text-surface-ink shadow-[0_3px_0_#9aa3ad] transition-opacity disabled:opacity-40"
            >
              <Icon name="minus" size={18} className="text-surface-ink" />
            </button>
            <span className="inline-block min-w-10 text-center font-montserrat text-2xl font-extrabold tabular-nums">{subjects}</span>
            <button
              type="button"
              aria-label="Mais uma cadeira"
              disabled={subjects >= 8}
              onClick={() => setSubjects((n) => Math.min(8, n + 1))}
              className="grid size-11 place-items-center rounded-full bg-surface-canvas text-surface-ink shadow-[0_3px_0_#9aa3ad] transition-opacity disabled:opacity-40"
            >
              <Icon name="plus" size={18} className="text-surface-ink" />
            </button>
          </div>
          <div aria-live="polite" className="min-w-[280px] flex-1">
            <p className="font-bold text-lg text-white">{mainLine}</p>
            <p className="mt-1 text-secondary-container">{extraLine}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {TICKETS.map((t) => {
            const isRec = t.id === recommended;
            return (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`grid grid-cols-1 overflow-hidden rounded-[20px] sm:grid-cols-[1fr_300px] ${
                  isRec ? "bg-gradient-to-br from-[#ffe066] via-[#fed400] to-[#f7c800] text-on-secondary-fixed" : "bg-surface-canvas text-on-surface"
                }`}
              >
                <div className="p-7 sm:p-8">
                  <p className={isRec ? "font-bold text-on-secondary-fixed" : "font-bold text-text-secondary"}>{t.meta}</p>
                  <h3 className="mt-1.5 font-montserrat text-[clamp(26px,2.4vw,34px)] font-extrabold tracking-tight">{t.name}</h3>
                  <ul className="mt-4.5 grid gap-1.5 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-lg">
                        <Icon name="check" size={18} strokeWidth={2.5} className={`mt-0.5 shrink-0 ${isRec ? "text-on-secondary-fixed" : "text-feedback-success-ink"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isRec && <p className="mt-4 font-bold">Recomendado para {subjects} cadeira{subjects > 1 ? "s" : ""}.</p>}
                </div>
                <div
                  className={`relative flex flex-col justify-center gap-1.5 border-l-[3px] border-dashed p-6 sm:p-7 ${
                    isRec ? "border-on-secondary-fixed bg-gradient-to-br from-[#2e6de6] via-brand-ocean to-[#12489e] text-white" : "border-surface-container"
                  }`}
                >
                  <p className="font-montserrat text-5xl font-extrabold tracking-tight tabular-nums">
                    {t.price}
                    <span className="ml-1.5 text-xl">Kz</span>
                  </p>
                  <p className={isRec ? "mb-2.5 text-white" : "mb-2.5 text-text-secondary"}>{t.per}</p>
                  <Button3D variant="secondary" fullWidth aria-label={`Escolher o ${t.name}`}>
                    Escolher
                  </Button3D>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-8 text-lg text-on-surface">
          Pagas com Multicaixa Express, voucher, Passe de Turma ou pelo teu encarregado.{" "}
          <a href="#pagamento" className="font-bold">
            Ver as formas de pagamento
          </a>
        </p>
      </div>
    </section>
  );
}
