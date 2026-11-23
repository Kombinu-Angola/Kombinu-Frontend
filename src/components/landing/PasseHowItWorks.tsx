import { Link } from "react-router-dom";
import styles from "./passe.module.css";
import { cx, KLogo } from "./PasseShared";

type TrailState = "done" | "current" | "locked";

/** Ported 1:1 from ds/kombinu/components/bundle.js's GeometricTrail: zig-zag 45° diagonals joined by 90° verticals. */
function GeometricTrail({ steps, label }: { steps: TrailState[]; label: string }) {
  const pitch = 96;
  const dx = 20;
  const r = 16;
  const cx0 = 64;
  const w = 128;
  const pts = steps.map((s, i) => ({ x: cx0 + (i % 2 ? dx : -dx), y: 32 + i * pitch, s }));
  const segs: { d: string; done: boolean }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const d = `M${a.x} ${a.y + r}V${a.y + 24}L${b.x} ${a.y + 24 + 2 * dx}V${b.y - r}`;
    segs.push({ d, done: a.s === "done" });
  }
  const height = 32 + (steps.length - 1) * pitch + 32;
  return (
    <svg className={styles["kb-trail"]} width={w} height={height} viewBox={`0 0 ${w} ${height}`} role="img" aria-label={label}>
      {segs.map((s, i) => (
        <path key={`s${i}`} d={s.d} className={cx(styles["kb-trail__seg"], s.done && styles["is-done"])} />
      ))}
      {pts.map((n, i) => (
        <g key={`n${i}`} className={cx(styles["kb-trail__node"], styles[`is-${n.s}`])}>
          <circle cx={n.x} cy={n.y} r={r} />
          {n.s === "done" && <path d={`M${n.x - 6} ${n.y}l4 4 8-8`} className={styles["kb-trail__tick"]} />}
          {n.s === "current" && <circle cx={n.x} cy={n.y} r={5} className={styles["kb-trail__dot"]} />}
        </g>
      ))}
    </svg>
  );
}

export function PasseHowItWorks() {
  return (
    <section className={styles.sec} id="como" aria-labelledby="como-h">
      <div className={cx(styles.wrap, styles["how-grid"])}>
        <div className={styles["how-text"]}>
          <h2 className={cx(styles.h2, styles.rv)} id="como-h">
            Três passos até à prova.
          </h2>
          <div className={styles.steps}>
            <div className={styles["trail-col"]} aria-hidden="true">
              <GeometricTrail steps={["done", "done", "current"]} label="Escolher, ativar, treinar" />
            </div>
            <div className={cx(styles.step, styles.rv)}>
              <h3 className={styles["step-t"]}>Escolhe a cadeira</h3>
              <p className={styles["step-d"]}>Filtra pela instituição, ano e tópico. Cada simulado mostra as questões e os MB que gasta.</p>
            </div>
            <div className={cx(styles.step, styles.rv, styles["rv-2"])}>
              <h3 className={styles["step-t"]}>Ativa o passe</h3>
              <p className={styles["step-d"]}>Entras com o teu e-mail ou com o código da tua escola e pagas como preferires: Express, voucher ou encarregado.</p>
            </div>
            <div className={cx(styles.step, styles.rv, styles["rv-3"])}>
              <h3 className={styles["step-t"]}>Treina 5 minutos por dia</h3>
              <p className={styles["step-d"]}>Resolves com correção na hora e descarregas tudo para estudar sem rede.</p>
            </div>
          </div>
        </div>

        <div className={cx(styles.login, styles.rv)} id="entrar">
          <div className={styles["login-head"]}>
            <KLogo />
            <div>
              <h3 className={styles["login-t"]}>Entrar na Kombinu</h3>
              <p className={styles["login-sub"]}>Com o teu e-mail ou com o código da tua escola.</p>
            </div>
          </div>
          <Link to="/register" className={cx(styles["kb-btn"], styles["kb-btn--primary"], styles["kb-btn--block"])}>
            Criar conta
          </Link>
          <Link to="/login" className={cx(styles["kb-btn"], styles["kb-btn--secondary"], styles["kb-btn--block"])}>
            Entrar
          </Link>
          <p className={styles["login-note"]}>
            Se a tua escola já está na Kombinu, usa o separador «Escola» ao entrar.
          </p>
        </div>
      </div>
    </section>
  );
}
