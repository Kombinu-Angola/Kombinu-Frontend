import { motion } from "motion/react";
import { Icon } from "../ui/Icon";
import { Pill } from "../ui/Pill";
import { LinkButton3D } from "../ui/Button3D";

const MORE_NOTES = [
  { title: "Teoria Geral das Obrigações", meta: "Mapa mental + 25 questões · 0,2 MB" },
  { title: "Cálculo I · Limites e derivadas", meta: "30 exercícios resolvidos · 0,3 MB" },
] as const;

const RULES = [
  { k: "Só autoria estudantil.", v: "Slides e sebentas de professores ficam de fora (Lei n.º 15/14)." },
  { k: "Remoção em menos de 24 horas.", v: "Qualquer denúncia é analisada e o conteúdo sai no mesmo dia." },
  { k: "Sem trabalhos por encomenda.", v: "Ajudamos a estudar, não a entregar trabalhos feitos por outros." },
  { k: "Fechado durante as provas.", v: "Nos horários de exame não entram novos conteúdos." },
] as const;

/** Resumos de estudantes: a "sebenta" verificada, com incentivo de 14 dias de passe gratis por resumo aprovado. */
export function PasseNotes() {
  return (
    <section id="resumos" aria-labelledby="resumos-h" className="relative overflow-hidden bg-[var(--color-sun-pale)] py-20 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute top-0 right-0 size-[40vw] translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgb(255_216_58_/_0.4),transparent_70%)]" />

      <div className="relative z-10 mx-auto grid max-w-[1240px] grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="resumos-h" className="font-montserrat text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Partilha resumos, ganha passe.
          </h2>
          <p className="mt-5 max-w-[34em] text-lg text-on-surface">
            Na Kombinu só entram resumos, mapas mentais e resoluções escritos por estudantes, pelas próprias
            palavras. Na época de lançamento, cada resumo aprovado vale 14 dias de passe grátis.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <LinkButton3D href="#entrar" variant="secondary">
              Publicar um resumo
            </LinkButton3D>
            <p className="text-text-secondary">A equipa revê cada resumo antes de entrar.</p>
          </div>
        </div>

        <div>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6"
          >
            <svg viewBox="0 0 220 230" aria-hidden="true" className="w-20">
              <ellipse cx={112} cy={218} rx={80} ry={8} fill="rgb(13 40 110 / 0.16)" />
              <rect x={62} y={22} width={120} height={152} rx={14} transform="rotate(-9 122 98)" fill="#3d7bf0" />
              <rect x={56} y={30} width={120} height={152} rx={14} transform="rotate(6 116 106)" fill="#fed400" />
              <rect x={44} y={44} width={124} height={154} rx={14} fill="#ffffff" />
              <rect x={62} y={70} width={76} height={8} rx={4} fill="#c9d6ee" />
              <rect x={62} y={92} width={88} height={8} rx={4} fill="#c9d6ee" />
              <rect x={56} y={109} width={84} height={18} rx={5} fill="#ffe066" />
              <rect x={62} y={114} width={72} height={8} rx={4} fill="#7f95bf" />
              <rect x={62} y={138} width={80} height={8} rx={4} fill="#c9d6ee" />
              <rect x={62} y={160} width={56} height={8} rx={4} fill="#c9d6ee" />
              <circle cx={164} cy={190} r={22} fill="#58cc02" />
              <polyline points="154 190 161 197 175 183" fill="none" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="mt-3">
              <Pill tone="sky" kind="tag">
                medicina · uan
              </Pill>
            </div>
            <h3 className="mt-3 font-bold text-xl text-on-surface">Anatomia I · Sistema locomotor</h3>
            <p className="mt-1 text-text-secondary">Resumo por tópicos · 4 min de leitura</p>
            <ul className="mt-4 grid gap-2.5 text-on-surface">
              <li>
                O esqueleto adulto tem <mark className="bg-secondary-container px-1">206 ossos</mark>: 80 no esqueleto
                axial e 126 no apendicular.
              </li>
              <li>As articulações sinoviais, como o ombro, a anca e o joelho, são as que permitem mais movimento.</li>
              <li>Os músculos esqueléticos ligam-se aos ossos através de tendões.</li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-border-cloud pt-3.5 text-sm text-text-secondary">
              <span>40 questões · 0,3 MB</span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="shield" size={16} />
                Autoria de estudante verificada
              </span>
            </div>
          </motion.article>

          <ul className="mt-3.5 grid gap-1">
            {MORE_NOTES.map((n) => (
              <li key={n.title} className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-2.5 transition-transform duration-150 hover:translate-x-1.5">
                <strong className="font-bold text-on-surface">{n.title}</strong>
                <span className="text-sm text-text-secondary">{n.meta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dl className="relative z-10 mx-auto mt-14 grid max-w-[1240px] grid-cols-1 gap-x-12 gap-y-6 px-4 sm:px-6 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
        {RULES.map((r) => (
          <div key={r.k}>
            <dt className="font-bold text-on-surface">{r.k}</dt>
            <dd className="mt-1 text-on-surface">{r.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
