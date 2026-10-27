import styles from "./passe.module.css";
import { cx } from "./PasseShared";

export function PasseFinalCta() {
  return (
    <section className={cx(styles.sec, styles.final)} aria-labelledby="final-h">
      <div className={styles.ripples} aria-hidden="true">
        <div className={cx(styles.rp, styles["rp-b"])}>
          <span className={cx(styles.r, styles.f1)} />
          <span className={cx(styles.r, styles.f2)} />
          <span className={cx(styles.r, styles.f3)} />
          <span className={cx(styles.r, styles.f4)} />
        </div>
        <div className={cx(styles.rp, styles["rp-y"])}>
          <span className={cx(styles.r, styles.ry, styles.fy1)} />
          <span className={cx(styles.r, styles.ry, styles.fy2)} />
          <span className={cx(styles.r, styles.ry, styles.fy3)} />
          <span className={cx(styles.r, styles.ry, styles.fy4)} />
        </div>
      </div>
      <div className={styles.wrap}>
        <div className={styles["final-in"]}>
          <h2 className={cx(styles.h2, styles.rv)} id="final-h">
            A próxima prova não espera.
          </h2>
          <p className={cx(styles.lead, styles.rv, styles["rv-2"])}>Resolve um simulado grátis agora. Em 5 minutos sabes onde estás e o que te falta.</p>
          <div className={cx(styles["cta-row"], styles.rv, styles["rv-3"])}>
            <a className={cx(styles["kb-btn"], styles["kb-btn--primary"], styles["btn-sun"])} href="#simulado">
              Resolver 1 simulado grátis
            </a>
          </div>
          <p className={cx(styles["final-note"], styles.rv, styles["rv-4"])}>Sem criar conta e sem cartão. O simulado ocupa 0,3 MB.</p>
        </div>
      </div>
    </section>
  );
}
