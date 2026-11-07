import styles from "./passe.module.css";
import { cx, IconCheck } from "./PasseShared";
import type { PasseLandingState } from "./usePasseLanding";

function Candongueiro({ className }: { className: string }) {
  return (
    <g className={className}>
      <g className={styles["van-body"]}>
        <path className={styles["f-white"]} d="M8 106 V40 Q8 18 30 18 H206 Q222 18 232 30 L270 76 Q278 86 278 98 V106 Q278 116 268 116 H18 Q8 116 8 106 Z" />
        <path className={styles["f-blue"]} d="M8 78 H262 L271 88 Q278 96 278 104 V106 Q278 116 268 116 H18 Q8 116 8 106 Z" />
        <rect className={styles["f-yellow"]} x="8" y="73" width="256" height="5" />
        <rect className={styles["f-glass"]} x="22" y="28" width="44" height="34" rx="7" />
        <rect className={styles["f-glass"]} x="74" y="28" width="44" height="34" rx="7" />
        <rect className={styles["f-glass"]} x="126" y="28" width="44" height="34" rx="7" />
        <rect className={styles["f-glass"]} x="178" y="28" width="40" height="34" rx="7" />
        <path className={styles["f-glass"]} d="M226 28 H230 Q236 28 240 34 L262 66 H226 Z" />
        <rect className={styles["f-yellow"]} x="266" y="88" width="10" height="9" rx="3" />
        <path className={styles["st-hl"]} d="M34 24 H198" />
        <circle className={styles["f-blue-side"]} cx="70" cy="112" r="24" />
        <circle className={styles["f-blue-side"]} cx="222" cy="112" r="24" />
        <rect className={styles["f-ink"]} x="4" y="106" width="280" height="9" rx="4.5" />
      </g>
      <g className={styles.wheel}>
        <circle className={styles["f-ink"]} cx="70" cy="118" r="19" />
        <circle className={styles["f-hub"]} cx="70" cy="118" r="8" />
        <path className={styles["st-spoke"]} d="M70 111 V125 M63 118 H77" />
      </g>
      <g className={styles.wheel}>
        <circle className={styles["f-ink"]} cx="222" cy="118" r="19" />
        <circle className={styles["f-hub"]} cx="222" cy="118" r="8" />
        <path className={styles["st-spoke"]} d="M222 111 V125 M215 118 H229" />
      </g>
    </g>
  );
}

const TICKETS: Array<{
  id: "passe" | "kit" | "multi";
  meta: string;
  name: string;
  rows: string[];
  price: string;
  per: string;
}> = [
  {
    id: "passe",
    meta: "1 cadeira · 21 dias",
    name: "Passe de Provas",
    rows: [
      "Simulados da cadeira com correção na hora",
      "Resumos escritos por estudantes",
      "Descarga para estudar offline",
      "2 congelamentos de ofensiva",
    ],
    price: "600",
    per: "Duas corridas de candongueiro.",
  },
  {
    id: "kit",
    meta: "1 cadeira · 30 dias",
    name: "Kit Completo",
    rows: ["Tudo o que o Passe de Provas inclui", "Mapas mentais e resoluções passo a passo", "Banco de questões completo da cadeira", "A época inteira, 30 dias"],
    price: "1.500",
    per: "A época de uma cadeira.",
  },
  {
    id: "multi",
    meta: "Várias cadeiras · semestre",
    name: "Multi-Disciplina",
    rows: ["As cadeiras do teu semestre num só passe", "Cobre frequências e exames", "Liga de turma contra turma", "O melhor valor por cadeira"],
    price: "2.500",
    per: "Um só pagamento por semestre.",
  },
];

export function PassePricing({ p }: { p: PasseLandingState }) {
  return (
    <section className={cx(styles.sec, styles["price-sec"])} id="precos" aria-labelledby="precos-h">
      <div className={styles.wrap}>
        <div className={styles["sec-head"]}>
          <h2 className={cx(styles.h2, styles.rv)} id="precos-h">
            Desde o preço de duas corridas.
          </h2>
          <p className={cx(styles.lead, styles.rv, styles["rv-2"])}>
            Pagas uma vez por época, só pelas cadeiras de que precisas. Quando o passe termina, não há cobranças automáticas.
          </p>
        </div>

        <div className={styles.anchor}>
          <div className={styles["an-list"]}>
            <div className={cx(styles["an-a"], styles.rv)}>
              <p className={styles["an-k"]}>Uma aula de explicador</p>
              <p className={styles["an-v"]}>15.000–25.000 Kz</p>
            </div>
            <div className={cx(styles["an-b"], styles.rv, styles["rv-2"])} ref={p.refs.anchorElRef}>
              <p className={styles["an-k"]}>Um Passe de Provas de 21 dias</p>
              <p className={styles["an-v"]}>
                <span aria-hidden="true">{p.anchorFmt} Kz</span>
                <span className={styles["sr-only"]}>600 Kz</span>
              </p>
            </div>
          </div>
          <figure className={styles["an-fig"]}>
            <svg className={styles.ill} viewBox="0 0 360 200" role="img" aria-label="Dois candongueiros azuis e brancos">
              <ellipse className={styles.sh} cx="185" cy="189" rx="165" ry="8" />
              <g transform="translate(118 14) scale(0.76)">
                <Candongueiro className={cx(styles["van-in"], styles["van-in-2"])} />
              </g>
              <g transform="translate(8 50)">
                <Candongueiro className={cx(styles["van-in"], styles["van-in-1"])} />
              </g>
            </svg>
            <figcaption>Duas corridas de candongueiro, a 300 Kz cada.</figcaption>
          </figure>
        </div>
        <p className={styles.src}>Explicações universitárias anunciadas em Luanda (2026). Corrida de candongueiro: 300 Kz (ANTT, julho de 2025).</p>

        <div className={styles.calc}>
          <p className={styles["calc-l"]} id="calc-l">
            Quantas cadeiras tens este semestre?
          </p>
          <div className={styles.stepper} role="group" aria-labelledby="calc-l">
            <button type="button" className={styles["step-btn"]} aria-label="Menos uma cadeira" aria-disabled={p.cadeiras <= 1} onClick={p.dec}>
              <svg className={styles.ic} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
              </svg>
            </button>
            <span className={cx(styles["step-n"], p.cadBump && styles.bump)}>{p.cadeiras}</span>
            <button type="button" className={styles["step-btn"]} aria-label="Mais uma cadeira" aria-disabled={p.cadeiras >= 8} onClick={p.inc}>
              <svg className={styles.ic} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          <div className={styles["calc-out"]} aria-live="polite">
            <p className={styles["calc-main"]}>{p.calcMain}</p>
            <p className={styles["calc-extra"]}>{p.calcExtra}</p>
          </div>
        </div>

        <div className={styles.tkts}>
          {TICKETS.map((t) => {
            const isRec = p.recommended === t.id;
            return (
              <article key={t.id} className={cx(styles.tkt, isRec && styles["is-rec"])}>
                <div className={styles["tkt-main"]}>
                  <p className={styles["tkt-meta"]}>{t.meta}</p>
                  <h3 className={styles["tkt-name"]}>{t.name}</h3>
                  <ul className={styles["tkt-list"]}>
                    {t.rows.map((row) => (
                      <li key={row}>
                        <IconCheck />
                        {row}
                      </li>
                    ))}
                  </ul>
                  {isRec && <p className={styles["tkt-rec"]}>{p.recLabel}</p>}
                </div>
                <div className={styles["tkt-stub"]}>
                  <p className={styles["tkt-price"]}>
                    {t.price}
                    <span>Kz</span>
                  </p>
                  <p className={styles["tkt-per"]}>{t.per}</p>
                  <button type="button" className={cx(styles["kb-btn"], styles["kb-btn--secondary"])} aria-label={`Escolher ${t.name}`}>
                    Escolher
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <p className={styles["pay-note"]}>
          Pagas com Multicaixa Express, voucher, Passe de Turma ou pelo teu encarregado. <a href="#pagamento">Ver as formas de pagamento</a>
        </p>
      </div>
    </section>
  );
}
