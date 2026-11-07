import styles from "./passe.module.css";
import { cx } from "./PasseShared";
import type { PasseLandingState } from "./usePasseLanding";

const MONTHS: Array<[string, string | undefined]> = [
  ["out", "2026"],
  ["nov", undefined],
  ["dez", undefined],
  ["jan", "2027"],
  ["fev", undefined],
  ["mar", undefined],
  ["abr", undefined],
  ["mai", undefined],
  ["jun", undefined],
  ["jul", undefined],
  ["ago", undefined],
  ["set", undefined],
];

export function PasseCalendar({ p }: { p: PasseLandingState }) {
  return (
    <section className={cx(styles.sec, styles["cal-sec"])} id="epocas" aria-labelledby="cal-h">
      <div className={styles.wrap}>
        <div className={styles["cal-head"]}>
          <div className={cx(styles["ill-cal-box"], styles["ill-pop"])}>
            <svg className={styles.ill} viewBox="0 0 220 220" role="img" aria-label="Calendário com 21 dias">
              <ellipse className={styles.sh} cx="110" cy="208" rx="80" ry="8" />
              <g className={styles.fl}>
                <rect className={styles["f-white-side"]} x="30" y="46" width="160" height="150" rx="26" />
                <rect className={styles["f-white"]} x="30" y="34" width="160" height="150" rx="26" />
                <path className={styles["f-blue"]} d="M30 60 Q30 34 56 34 H164 Q190 34 190 60 V84 H30 Z" />
                <rect className={styles["f-yellow-side"]} x="67" y="21" width="18" height="40" rx="9" />
                <rect className={styles["f-yellow"]} x="64" y="17" width="18" height="38" rx="9" />
                <rect className={styles["f-yellow-side"]} x="137" y="21" width="18" height="40" rx="9" />
                <rect className={styles["f-yellow"]} x="134" y="17" width="18" height="38" rx="9" />
                <ellipse className={styles.hl} cx="110" cy="46" rx="18" ry="4" />
                <text className={styles["ill-num"]} x="110" y="150">21</text>
                <text className={styles["ill-cap"]} x="110" y="172">dias</text>
                <circle className={styles["f-green-side"]} cx="180" cy="178" r="22" />
                <circle className={styles["f-green"]} cx="180" cy="172" r="22" />
                <polyline className={styles["st-w"]} points="170 172 177 179 191 165" />
              </g>
            </svg>
          </div>
          <h2 className={cx(styles.h2, styles.rv)} id="cal-h">
            Paga a época, não o mês.
          </h2>
          <p className={cx(styles.lead, styles.rv, styles["rv-2"])}>
            As provas em Angola acontecem em janelas fixas. Ativas o passe 14 a 21 dias antes da tua prova e ele termina sozinho, sem
            renovações automáticas.
          </p>
        </div>

        <div
          className={styles["cal-scroll"]}
          role="region"
          aria-label="Épocas de provas de outubro de 2026 a setembro de 2027"
          tabIndex={0}
        >
          <div className={styles.cal}>
            {MONTHS.map(([name, year]) => (
              <div className={styles["cal-m"]} key={name}>
                {name}
                {year && <small>{year}</small>}
              </div>
            ))}
            {MONTHS.map((_, i) => (
              <div className={styles["cal-c"]} key={i} />
            ))}
            <div className={cx(styles.win, styles.w1, p.winNow.w1 && styles["is-now"])}>
              <span className={styles["now-tag"]}>agora</span>
              <span className={styles["win-t"]}>1.ª frequência</span>
              <span className={styles["win-s"]}>out – nov · 1.º semestre</span>
            </div>
            <div className={cx(styles.win, styles.w2, p.winNow.w2 && styles["is-now"])}>
              <span className={styles["now-tag"]}>agora</span>
              <span className={styles["win-t"]}>2.ª frequência e exames</span>
              <span className={styles["win-s"]}>jan – fev · 1.º semestre</span>
            </div>
            <div className={cx(styles.win, styles.w3, p.winNow.w3 && styles["is-now"])}>
              <span className={styles["now-tag"]}>agora</span>
              <span className={styles["win-t"]}>Exames finais e nacionais</span>
              <span className={styles["win-s"]}>jun – jul · o maior pico</span>
            </div>
            <div className={cx(styles.win, styles.w4, p.winNow.w4 && styles["is-now"])}>
              <span className={styles["now-tag"]}>agora</span>
              <span className={styles["win-t"]}>Exames de acesso</span>
              <span className={styles["win-s"]}>ago – set · 12.ª e 13.ª classe</span>
            </div>
            <div className={cx(styles.today, styles[`m${p.todayM}`], styles[`q${p.todayQ}`])} aria-hidden="true">
              <span className={styles["today-line"]} />
              <span className={styles["today-pill"]}>{p.todayLabel}</span>
            </div>
          </div>
        </div>

        <dl className={styles["cal-notes"]}>
          <div className={styles.rv}>
            <dt>Compra perto da prova.</dt>
            <dd>O passe de 21 dias cobre a preparação e o dia do teste.</dd>
          </div>
          <div className={cx(styles.rv, styles["rv-2"])}>
            <dt>Acaba sozinho.</dt>
            <dd>Não há renovação nem débito no mês seguinte.</dd>
          </div>
          <div className={cx(styles.rv, styles["rv-3"])}>
            <dt>Finalistas do secundário.</dt>
            <dd>O Pack Exames de Acesso abre no fim de agosto.</dd>
          </div>
        </dl>
        <p className={styles.src}>
          Janelas segundo os Decretos Executivos n.º 643/25 (MESCTI) e n.º 686/25 (MED). Confirma as datas da tua faculdade.
        </p>
      </div>
    </section>
  );
}
