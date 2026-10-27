import { motion } from "motion/react";

const MONTHS = [
  { short: "out", year: "2026" },
  { short: "nov" },
  { short: "dez" },
  { short: "jan", year: "2027" },
  { short: "fev" },
  { short: "mar" },
  { short: "abr" },
  { short: "mai" },
  { short: "jun" },
  { short: "jul" },
  { short: "ago" },
  { short: "set" },
] as const;

const WINDOWS = [
  { id: "w1", col: "col-span-2 col-start-1", tone: "bg-gradient-to-br from-[#ffe066] to-[#f5c400] text-on-secondary-fixed", title: "1.ª frequência", sub: "out – nov · 1.º semestre", isNow: (mi: number) => mi <= 1 },
  { id: "w2", col: "col-span-2 col-start-4", tone: "bg-gradient-to-br from-[#2e6de6] to-brand-ocean text-white", title: "2.ª frequência e exames", sub: "jan – fev · 1.º semestre", isNow: (mi: number) => mi === 3 || mi === 4 },
  { id: "w3", col: "col-span-2 col-start-9", tone: "bg-gradient-to-br from-brand-ocean to-primary text-white", title: "Exames finais e nacionais", sub: "jun – jul · o maior pico", isNow: (mi: number) => mi === 8 || mi === 9 },
  { id: "w4", col: "col-span-2 col-start-11", tone: "bg-gradient-to-br from-[#dcefff] to-[#c8e6ff] text-[#001e2e]", title: "Exames de acesso", sub: "ago – set · 12.ª e 13.ª classe", isNow: (mi: number) => mi >= 10 },
] as const;

const MONTH_ABBREV = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function todayMarker() {
  const now = new Date();
  const mi = (now.getMonth() - 9 + 12) % 12; // outubro = 0
  const quarter = Math.min(3, Math.floor((now.getDate() - 1) / 7.75));
  const leftPct = [14, 38, 62, 86][quarter];
  const label = `Hoje, ${now.getDate()} ${MONTH_ABBREV[now.getMonth()]}`;
  return { mi, leftPct, label };
}

/** Épocas de provas: janela de 21 dias, com o marcador "hoje" calculado a partir do relógio real. */
export function PasseCalendar() {
  const { mi, leftPct, label } = todayMarker();

  return (
    <section id="epocas" aria-labelledby="cal-h" className="bg-surface-canvas py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-end gap-5 sm:grid-cols-[180px_1.2fr_0.8fr] sm:gap-12">
          <svg viewBox="0 0 220 220" role="img" aria-label="Calendário com 21 dias" className="mx-auto w-28 sm:mx-0 sm:w-[180px]">
            <ellipse cx={110} cy={208} rx={80} ry={8} fill="rgb(13 40 110 / 0.16)" />
            <rect x={30} y={46} width={160} height={150} rx={26} fill="#a9bbe0" />
            <rect x={30} y={34} width={160} height={150} rx={26} fill="#ffffff" />
            <path d="M30 60 Q30 34 56 34 H164 Q190 34 190 60 V84 H30 Z" fill="#3d7bf0" />
            <rect x={67} y={21} width={18} height={40} rx={9} fill="#b88600" />
            <rect x={64} y={17} width={18} height={38} rx={9} fill="#fed400" />
            <rect x={137} y={21} width={18} height={40} rx={9} fill="#b88600" />
            <rect x={134} y={17} width={18} height={38} rx={9} fill="#fed400" />
            <ellipse cx={110} cy={46} rx={18} ry={4} fill="#ffffff" opacity={0.55} />
            <text x={110} y={150} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={58} fill="var(--color-primary)">21</text>
            <text x={110} y={172} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={700} fontSize={16} fill="var(--color-text-secondary)">dias</text>
            <circle cx={180} cy={178} r={22} fill="#2f7a05" />
            <circle cx={180} cy={172} r={22} fill="#58cc02" />
            <polyline points="170 172 177 179 191 165" fill="none" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 id="cal-h" className="font-montserrat text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Paga a época, não o mês.
          </h2>
          <p className="max-w-[34em] text-lg text-on-surface">
            As provas em Angola acontecem em janelas fixas. Ativas o passe 14 a 21 dias antes da tua prova e ele
            termina sozinho, sem renovações automáticas.
          </p>
        </div>

        <div
          role="region"
          aria-label="Épocas de provas de outubro de 2026 a setembro de 2027"
          tabIndex={0}
          className="mt-10 overflow-x-auto pb-3"
        >
          <div className="grid min-w-[880px] grid-cols-12" style={{ gridTemplateRows: "auto minmax(132px, auto) 48px" }}>
            {MONTHS.map((m) => (
              <div key={m.short} className="border-l-2 border-border-cloud py-0 pb-3 pl-2.5 font-bold text-on-surface">
                {m.short}
                {m.year && <small className="mt-1 block font-medium text-text-secondary">{m.year}</small>}
              </div>
            ))}

            {MONTHS.map((_, i) => (
              <div key={i} className={i % 2 === 0 ? "col-span-1 row-start-2 border-l-2 border-border-cloud bg-surface-container-low" : "col-span-1 row-start-2 border-l-2 border-border-cloud bg-surface-soft"} />
            ))}

            {WINDOWS.map((w) => (
              <div
                key={w.id}
                className={`relative z-[1] row-start-2 ${w.col} m-2.5 flex flex-col justify-between gap-2 overflow-hidden rounded-2xl p-3.5 ${w.tone}`}
              >
                {w.isNow(mi) && (
                  <span className="self-start rounded-full bg-surface-ink px-2.5 py-1 text-caption font-bold text-white">agora</span>
                )}
                <span className="font-montserrat text-lg font-extrabold tracking-tight">{w.title}</span>
                <span className="text-sm font-medium">{w.sub}</span>
              </div>
            ))}

            <div className="relative row-start-2 row-span-2 pointer-events-none" style={{ gridColumn: mi + 1 }} aria-hidden="true">
              <span
                className="absolute top-0 bottom-[34px] w-[3px] -translate-x-1/2 rounded-full bg-surface-ink"
                style={{ left: `${leftPct}%` }}
              />
              <span
                className="absolute bottom-0 -translate-x-1/2 rounded-full bg-surface-ink px-2.5 py-1.5 text-caption font-bold text-white whitespace-nowrap"
                style={{ left: `${leftPct}%` }}
              >
                {label}
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-x-12 gap-y-6 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
          {[
            { k: "Compra perto da prova.", v: "O passe de 21 dias cobre a preparação e o dia do teste." },
            { k: "Acaba sozinho.", v: "Não há renovação nem débito no mês seguinte." },
            { k: "Finalistas do secundário.", v: "O Pack Exames de Acesso abre no fim de agosto." },
          ].map((note) => (
            <motion.div key={note.k} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <dt className="font-bold text-lg text-on-surface">{note.k}</dt>
              <dd className="mt-1.5 text-on-surface">{note.v}</dd>
            </motion.div>
          ))}
        </dl>

        <p className="mt-7 max-w-[72ch] text-sm text-text-secondary">
          Janelas segundo os Decretos Executivos n.º 643/25 (MESCTI) e n.º 686/25 (MED). Confirma as datas da tua
          faculdade.
        </p>
      </div>
    </section>
  );
}
