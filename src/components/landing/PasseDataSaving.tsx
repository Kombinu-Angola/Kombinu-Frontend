import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Icon } from "../ui/Icon";
import { Switch } from "../ui/Switch";
import { useCountUp } from "../../hooks/useCountUp";

const SUBJECTS = [
  { name: "Anatomia I", meta: "12 simulados", size: "3,6 MB" },
  { name: "Bioquímica", meta: "8 simulados", size: "2,4 MB" },
  { name: "Histologia", meta: "3 simulados", size: "0,9 MB" },
] as const;

const numberFmt = new Intl.NumberFormat("pt-AO");

/** Poupança de dados: a app foi feita para 3G/4G e pacotes pequenos. */
export function PasseDataSaving() {
  const [offline, setOffline] = useState(true);
  const statRef = useRef<HTMLLIElement>(null);
  const inView = useInView(statRef, { once: true, amount: 0.35 });
  const sims = useCountUp(inView ? 3000 : 0, 1500);

  return (
    <section id="saldo" aria-labelledby="saldo-h" className="relative overflow-hidden bg-brand-ocean py-20 text-white sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute bottom-0 left-0 size-[55vw] -translate-x-1/3 translate-y-1/3 rounded-full opacity-50" style={{ background: "radial-gradient(closest-side, transparent 55%, rgb(12 38 120 / 0.5))" }} />

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-end sm:gap-16">
          <h2 id="saldo-h" className="font-montserrat text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
            Estuda com o saldo que tens.
          </h2>
          <p className="max-w-[34em] text-lg text-white">
            A Kombinu foi feita para redes 3G e 4G e pacotes pequenos. Descarregas a cadeira no Wi-Fi da faculdade e
            resolves os simulados sem rede, no candongueiro ou na fila.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="flex items-baseline gap-1 font-montserrat text-[clamp(90px,17vw,200px)] font-extrabold tracking-tight text-secondary-container tabular-nums">
              0,3<span className="text-[0.3em] tracking-tight">MB</span>
            </p>
            <p className="-mt-2 font-bold text-xl text-white sm:text-2xl">é quanto ocupa um simulado descarregado.</p>
            <ul className="mt-10 grid gap-3">
              <li ref={statRef} className="text-lg text-white">
                Com 1 GB fazes mais de{" "}
                <strong className="text-white underline underline-offset-5 decoration-3 decoration-secondary-container tabular-nums">
                  {numberFmt.format(sims)}
                </strong>{" "}
                simulados.
              </li>
              <li className="text-lg text-white">A app abre pela primeira vez com menos de 1 MB.</li>
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-surface-canvas p-6 text-on-surface shadow-[var(--shadow-float)]"
          >
            <div className="flex flex-wrap items-center gap-4">
              <svg viewBox="0 0 220 190" aria-hidden="true" className="w-23 shrink-0">
                <ellipse cx={114} cy={180} rx={78} ry={7} fill="rgb(13 40 110 / 0.16)" />
                <path d="M62 136 Q26 136 26 104 Q26 76 56 72 Q62 36 100 36 Q132 36 144 64 Q152 58 164 58 Q194 58 198 90 Q216 96 216 116 Q216 136 192 136 Z" fill="#ffffff" />
                <ellipse cx={88} cy={54} rx={24} ry={7} fill="#ffffff" opacity={0.55} />
                <path d="M100 74 H124 V106 H142 L112 140 L82 106 H100 Z" fill="#fed400" />
              </svg>
              <div className="min-w-[160px] flex-1">
                <h3 className="font-bold text-lg">Descarregado neste telemóvel</h3>
                <p aria-live="polite" className="mt-1 text-text-secondary">
                  {offline ? "Ligado: estudas estas cadeiras sem rede." : "Desligado: precisas de rede para abrir os simulados."}
                </p>
              </div>
              <Switch id="passe-offline" checked={offline} onChange={setOffline} label="Modo offline" tone="ocean" />
            </div>

            <ul className="mt-4.5 grid gap-2">
              {SUBJECTS.map((s) => (
                <li key={s.name} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 rounded-xl bg-surface-soft p-4">
                  <span>
                    <span className="block font-bold">{s.name}</span>
                    <span className="mt-0.5 block text-sm text-text-secondary">{s.meta}</span>
                  </span>
                  <span className="self-center font-bold tabular-nums">{s.size}</span>
                  <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                      className="block h-full w-full rounded-full bg-feedback-success"
                    />
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4.5 flex flex-wrap items-center justify-between gap-3 font-bold">
              <span>Total: 6,9 MB</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-forest px-3.5 py-1.5 text-caption text-feedback-success">
                <Icon name="signal" size={16} />
                Poupança de dados · 0,3 MB por simulado
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
