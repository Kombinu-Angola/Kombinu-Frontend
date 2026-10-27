import { motion } from "motion/react";
import { Avatar } from "../ui/Avatar";
import { cn } from "@/lib/utils";

const ROSTER = [
  { name: "Ana M.", xp: 840 },
  { name: "Délcio K.", xp: 790 },
  { name: "Yuri P.", xp: 742 },
  { name: "Telma S.", xp: 700 },
  { name: "Kiame J.", xp: 660 },
  { name: "Nádia L.", xp: 640 },
  { name: "Tu", xp: 625, isYou: true },
  { name: "Celso A.", xp: 590 },
] as const;

type PasseLeaguesProps = { xpBonus: number };

/** Liga Prata, semana 3 -- a posicao de "Tu" reage ao XP ganho no simulado do Hero. */
export function PasseLeagues({ xpBonus }: PasseLeaguesProps) {
  const ranked = ROSTER.map((p) => ({ ...p, xp: p.isYou ? p.xp + xpBonus : p.xp }))
    .sort((a, b) => b.xp - a.xp)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  const you = ranked.find((p) => p.isYou)!;
  const fifthPlaceXp = ranked[4].xp;
  const message =
    you.rank <= 5
      ? "Entraste nos 5 primeiros. Mantém o ritmo até domingo."
      : `Estás a ${fifthPlaceXp - you.xp + 1} XP dos 5 primeiros. Acerta no simulado lá em cima e vê o que muda.`;

  return (
    <section id="ligas" aria-labelledby="ligas-h" className="bg-surface-canvas py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-end sm:gap-16">
          <h2 id="ligas-h" className="font-montserrat text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Compete ao teu nível.
          </h2>
          <p className="max-w-[34em] text-lg text-on-surface">
            Cada liga junta 20 alunos com um desempenho parecido ao teu na semana anterior. Os 5 primeiros sobem de
            divisão ao domingo.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-montserrat text-xl font-extrabold tracking-tight">Liga Prata · semana 3</h3>
                <p className="mt-0.5 text-text-secondary">Fecha no domingo à meia-noite.</p>
              </div>
              <svg viewBox="0 0 200 230" aria-hidden="true" className="w-16 shrink-0">
                <ellipse cx={100} cy={220} rx={62} ry={7} fill="rgb(13 40 110 / 0.16)" />
                <rect x={48} y={172} width={104} height={32} rx={10} fill="#1a4aa8" />
                <rect x={74} y={158} width={52} height={16} rx={8} fill="#fed400" />
                <path d="M50 58 H32 Q20 58 20 72 Q22 100 54 106" fill="none" stroke="#b88600" strokeWidth={10} strokeLinecap="round" />
                <path d="M150 58 H168 Q180 58 180 72 Q178 100 146 106" fill="none" stroke="#b88600" strokeWidth={10} strokeLinecap="round" />
                <path d="M48 40 H152 V78 Q152 134 100 140 Q48 134 48 78 Z" fill="#fed400" />
                <polygon points="100 66 105.29 78.72 119.02 79.82 108.56 88.78 111.76 102.18 100 95 88.24 102.18 91.44 88.78 80.98 79.82 94.71 78.72" fill="#ffffff" opacity={0.92} />
              </svg>
            </div>

            <ul className="mt-5 grid gap-1.5">
              {ranked.map((p) => (
                <motion.li
                  layout
                  key={p.name}
                  transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                    p.rank <= 5 && "bg-surface-sky",
                    p.isYou && "ring-2 ring-primary",
                  )}
                >
                  <span className="w-6 text-right font-bold text-text-secondary tabular-nums">{p.rank}º</span>
                  <Avatar name={p.name} size="sm" />
                  <span className={cn("flex-1 font-bold", p.isYou ? "text-primary" : "text-on-surface")}>{p.name}</span>
                  <span className="font-bold text-text-secondary tabular-nums">{p.xp} XP</span>
                </motion.li>
              ))}
            </ul>

            <p className="mt-4 text-sm font-bold text-text-secondary">Os 5 primeiros sobem de divisão</p>
            <p aria-live="polite" className="mt-1.5 font-bold text-on-surface">
              {message}
            </p>
          </div>

          <div className="grid gap-8">
            <div>
              <h3 className="font-bold text-xl text-on-surface">Turma contra turma</h3>
              <p className="mt-1.5 text-on-surface">
                A XP da semana soma para a tua turma. Estudar em conjunto conta mais do que estudar contra.
              </p>
              <div className="mt-4">
                <div className="flex justify-between font-bold text-on-surface">
                  <span>2.º ano A · 56%</span>
                  <span>2.º ano B · 44%</span>
                </div>
                <div role="img" aria-label="2.º ano A com 56% da XP da semana, 2.º ano B com 44%" className="mt-2 flex h-3.5 overflow-hidden rounded-full">
                  <span className="h-full bg-brand-ocean" style={{ width: "56%" }} />
                  <span className="h-full bg-secondary-container" style={{ width: "44%" }} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl text-on-surface">Dois dias de folga por sprint</h3>
              <p className="mt-1.5 text-on-surface">
                Falhaste um dia nos 21 antes da prova? Usas um congelamento e a tua ofensiva continua.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-on-surface">As notas ficam contigo</h3>
              <p className="mt-1.5 text-on-surface">
                Na liga aparece só a XP da semana. Não há rankings públicos de universidades nem de notas.
              </p>
            </div>
            <p className="text-sm text-text-secondary">
              Ligas pequenas e equilibradas subiram 0,27 desvios-padrão nas notas dos alunos com mais dificuldades
              (Chen et al., Labour Economics, 2024).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
