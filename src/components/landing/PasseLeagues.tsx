import styles from "./passe.module.css";
import { cx } from "./PasseShared";
import type { PasseLandingState } from "./usePasseLanding";

export function PasseLeagues({ p }: { p: PasseLandingState }) {
  return (
    <section className={cx(styles.sec, styles["lg-sec"])} id="ligas" aria-labelledby="ligas-h">
      <div className={styles.wrap}>
        <div className={styles["sec-head"]}>
          <h2 className={cx(styles.h2, styles.rv)} id="ligas-h">
            Compete ao teu nível.
          </h2>
          <p className={cx(styles.lead, styles.rv, styles["rv-2"])}>
            Cada liga junta 20 alunos com um desempenho parecido ao teu na semana anterior. Os 5 primeiros sobem de divisão ao domingo.
          </p>
        </div>
        <div className={styles["lg-grid"]}>
          <div className={cx(styles.league, styles.rv)}>
            <div className={styles["lg-head"]}>
              <div>
                <h3 className={styles["lg-title"]}>Liga Prata · semana 3</h3>
                <p className={styles["lg-sub"]}>Fecha no domingo à meia-noite.</p>
              </div>
              <div className={cx(styles["ill-trophy-box"], styles["ill-pop"])}>
                <svg className={styles.ill} viewBox="0 0 200 230" aria-hidden="true">
                  <ellipse className={cx(styles.sh, styles["sh-3"])} cx="100" cy="220" rx="62" ry="7" />
                  <g className={cx(styles.fl, styles["fl-3"])}>
                    <rect className={styles["f-blue-side"]} x="48" y="182" width="104" height="32" rx="10" />
                    <rect className={styles["f-blue"]} x="48" y="172" width="104" height="30" rx="10" />
                    <rect className={styles["f-yellow"]} x="78" y="183" width="44" height="8" rx="4" />
                    <rect className={styles["f-yellow-side"]} x="88" y="128" width="24" height="46" rx="6" />
                    <rect className={styles["f-yellow"]} x="74" y="158" width="52" height="16" rx="8" />
                    <path className={styles["st-y"]} d="M50 58 H32 Q20 58 20 72 Q22 100 54 106" />
                    <path className={styles["st-y"]} d="M150 58 H168 Q180 58 180 72 Q178 100 146 106" />
                    <path className={styles["f-yellow"]} d="M48 40 H152 V78 Q152 134 100 140 Q48 134 48 78 Z" />
                    <ellipse className={styles["f-yellow-side"]} cx="100" cy="40" rx="52" ry="11" />
                    <polygon
                      className={styles["f-star"]}
                      points="100 66 105.29 78.72 119.02 79.82 108.56 88.78 111.76 102.18 100 95 88.24 102.18 91.44 88.78 80.98 79.82 94.71 78.72"
                    />
                    <path className={styles["st-hl"]} d="M62 58 Q60 94 80 122" />
                  </g>
                </svg>
              </div>
            </div>
            <div className={styles["lg-rows"]}>
              <div className={styles["lg-zone"]} aria-hidden="true" />
              <ol className={styles["sr-only"]}>
                {p.leagueSorted.map((row) => (
                  <li key={row.name}>
                    {row.rank} {row.name}, {row.xp}
                  </li>
                ))}
              </ol>
              {p.league.map((row) => (
                <div
                  key={row.id}
                  className={cx(styles["lg-row"], styles[`r${row.rankN}`], row.isTu && styles["is-tu"])}
                  aria-hidden="true"
                >
                  <span className={styles["lg-rank"]}>{row.rank}</span>
                  <span className={styles["lg-av"]}>{row.ini}</span>
                  <span className={styles["lg-name"]}>{row.name}</span>
                  <span className={styles["lg-xp"]}>{row.xp}</span>
                </div>
              ))}
            </div>
            <p className={styles["lg-legend"]}>Os 5 primeiros sobem de divisão</p>
            <p className={styles["lg-msg"]} aria-live="polite">
              {p.leagueMsg}
            </p>
          </div>
          <div className={styles["lg-points"]}>
            <div className={cx(styles["lg-pt"], styles.rv)}>
              <h3 className={styles["lg-pt-t"]}>Turma contra turma</h3>
              <p>A XP da semana soma para a tua turma. Estudar em conjunto conta mais do que estudar contra.</p>
              <div className={styles.tug}>
                <div className={styles["tug-l"]}>
                  <span className={styles.ta}>2.º ano A · 56%</span>
                  <span className={styles.tb}>2.º ano B · 44%</span>
                </div>
                <div className={styles["tug-bar"]} role="img" aria-label="2.º ano A com 56% da XP da semana, 2.º ano B com 44%">
                  <span className={styles["tug-a"]} />
                  <span className={styles["tug-b"]} />
                </div>
              </div>
            </div>
            <div className={cx(styles["lg-pt"], styles.rv, styles["rv-2"])}>
              <h3 className={styles["lg-pt-t"]}>Dois dias de folga por sprint</h3>
              <p>Falhaste um dia nos 21 antes da prova? Usas um congelamento e a tua ofensiva continua.</p>
            </div>
            <div className={cx(styles["lg-pt"], styles.rv, styles["rv-3"])}>
              <h3 className={styles["lg-pt-t"]}>As notas ficam contigo</h3>
              <p>Na liga aparece só a XP da semana. Não há rankings públicos de universidades nem de notas.</p>
            </div>
            <p className={cx(styles.src, styles.rv, styles["rv-4"])}>
              Ligas pequenas e equilibradas subiram 0,27 desvios-padrão nas notas dos alunos com mais dificuldades (Chen et al., Labour
              Economics, 2024).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
