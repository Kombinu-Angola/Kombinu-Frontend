import styles from "./passe.module.css";
import { cx } from "./PasseShared";
import type { PasseLandingState } from "./usePasseLanding";

const ROWS: Array<[string, string, string, number]> = [
  ["Anatomia I", "12 simulados", "3,6 MB", 100],
  ["Bioquímica", "8 simulados", "2,4 MB", 67],
  ["Histologia", "3 simulados", "0,9 MB", 25],
];

export function PasseDataSaving({ p }: { p: PasseLandingState }) {
  return (
    <section className={cx(styles.sec, styles.saldo)} id="saldo" aria-labelledby="saldo-h">
      <div className={styles.ripples} aria-hidden="true">
        <div className={cx(styles.rp, styles["rp-a"])}>
          <span className={cx(styles.r, styles.sa1)} />
          <span className={cx(styles.r, styles.sa2)} />
          <span className={cx(styles.r, styles.sa3)} />
          <span className={cx(styles.r, styles.sa4)} />
        </div>
      </div>
      <div className={styles.wrap}>
        <div className={styles["sec-head"]}>
          <h2 className={cx(styles.h2, styles.rv)} id="saldo-h">
            Estuda com o saldo que tens.
          </h2>
          <p className={cx(styles.lead, styles.rv, styles["rv-2"])}>
            A Kombinu foi feita para redes 3G e 4G e pacotes pequenos. Descarregas a cadeira no Wi-Fi da faculdade e resolves os
            simulados sem rede, no candongueiro ou na fila.
          </p>
        </div>
        <div className={styles["saldo-grid"]}>
          <div>
            <p className={styles.mb}>
              <span>0,3</span>
              <span className={styles["mb-u"]}>MB</span>
            </p>
            <p className={cx(styles["mb-cap"], styles.rv)}>é quanto ocupa um simulado descarregado.</p>
            <ul className={styles["mb-lines"]}>
              <li className={cx(styles.rv, styles["rv-2"])} ref={p.refs.simsElRef}>
                Com 1 GB fazes mais de <strong>{p.simsFmt}</strong> simulados.
              </li>
              <li className={cx(styles.rv, styles["rv-3"])}>A app abre pela primeira vez com menos de 1 MB.</li>
            </ul>
          </div>
          <div className={cx(styles.dl, styles.rv)}>
            <div className={styles["dl-head"]}>
              <div className={cx(styles["ill-cloud-box"], styles["ill-pop"])}>
                <svg className={styles.ill} viewBox="0 0 220 190" aria-hidden="true">
                  <ellipse className={cx(styles.sh, styles["sh-2"])} cx="114" cy="180" rx="78" ry="7" />
                  <g className={cx(styles.fl, styles["fl-2"])}>
                    <path
                      className={styles["f-white-side"]}
                      transform="translate(0 10)"
                      d="M62 136 Q26 136 26 104 Q26 76 56 72 Q62 36 100 36 Q132 36 144 64 Q152 58 164 58 Q194 58 198 90 Q216 96 216 116 Q216 136 192 136 Z"
                    />
                    <path
                      className={styles["f-white"]}
                      d="M62 136 Q26 136 26 104 Q26 76 56 72 Q62 36 100 36 Q132 36 144 64 Q152 58 164 58 Q194 58 198 90 Q216 96 216 116 Q216 136 192 136 Z"
                    />
                    <ellipse className={styles.hl} cx="88" cy="54" rx="24" ry="7" />
                    <path className={styles["f-yellow-side"]} transform="translate(0 7)" d="M100 74 H124 V106 H142 L112 140 L82 106 H100 Z" />
                    <path className={styles["f-yellow"]} d="M100 74 H124 V106 H142 L112 140 L82 106 H100 Z" />
                  </g>
                </svg>
              </div>
              <div className={styles["dl-headtxt"]}>
                <h3 className={styles["dl-title"]}>Descarregado neste telemóvel</h3>
                <p className={styles["dl-state"]} aria-live="polite">
                  {p.offline ? "Ligado: estudas estas cadeiras sem rede." : "Desligado: precisas de rede para abrir os simulados."}
                </p>
              </div>
              <button
                type="button"
                className={cx(styles.sw, p.offline && styles["is-on"])}
                role="switch"
                aria-checked={p.offline}
                onClick={p.toggleOffline}
              >
                <span>Modo offline</span>
                <span className={styles["sw-k"]} aria-hidden="true" />
              </button>
            </div>
            <ul className={styles["dl-list"]}>
              {ROWS.map(([name, meta, size, pct]) => (
                <li className={styles["dl-row"]} key={name}>
                  <span>
                    <span className={styles["dl-n"]}>{name}</span>
                    <span className={styles["dl-m"]}>{meta}</span>
                  </span>
                  <span className={styles["dl-s"]}>{size}</span>
                  <span className={styles["dl-bar"]}>
                    <span className={styles["dl-fill"]} style={{ width: `${pct}%` }} />
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles["dl-foot"]}>
              <span>Total: 6,9 MB</span>
              <div className={styles["kb-saver"]}>
                <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 1.5 14 4v4.2c0 3.2-2.3 5.4-6 6.3-3.7-.9-6-3.1-6-6.3V4l6-2.5Z" fill="currentColor" />
                </svg>
                <span>Poupança de dados</span>
                <span className={styles["kb-saver__value"]}>0,3 MB por simulado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
