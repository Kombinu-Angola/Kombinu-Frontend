import styles from "./passe.module.css";
import { cx, KLogo } from "./PasseShared";
import type { PasseLandingState } from "./usePasseLanding";

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

export function PasseHowItWorks({ p }: { p: PasseLandingState }) {
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
              <p className={styles["step-d"]}>Entras com o número de WhatsApp e pagas como preferires: Express, voucher ou encarregado.</p>
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
              <p className={styles["login-sub"]}>Sem palavra-passe para decorar.</p>
            </div>
          </div>
          <div className={styles["kb-input"]}>
            <label className={styles["kb-input__label"]} htmlFor="tel">
              Número de telemóvel
            </label>
            <input id="tel" className={styles["kb-input__field"]} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="9XX XXX XXX" aria-describedby="tel-msg" />
            <div className={styles["kb-input__msg"]} id="tel-msg">
              Recebes um código de 6 dígitos no WhatsApp.
            </div>
          </div>
          <button
            type="button"
            className={cx(styles["kb-btn"], styles["kb-btn--primary"], styles["kb-btn--block"])}
            onClick={p.sendOtp}
          >
            {p.otpSent ? "Código enviado" : "Receber código no WhatsApp"}
          </button>
          <div className={cx(styles.otp, p.otpSent && styles["is-sent"])} role="group" aria-label="Código de 6 dígitos">
            {["4", "8", "2", "9", "1", "3"].map((digit, i) => (
              <div className={styles["otp-c"]} key={i}>
                {p.otpSent && <span className={styles["otp-d"]}>{digit}</span>}
                {i === 0 && !p.otpSent && <span className={styles["otp-caret"]} />}
              </div>
            ))}
          </div>
          <div aria-live="polite">
            {p.otpSent && (
              <p className={styles["otp-msg"]}>
                <svg className={styles.ic} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5h16v11H9l-5 4z" />
                </svg>
                <span>O teu código Kombinu é 482 913. Não o partilhes com ninguém.</span>
              </p>
            )}
          </div>
          <p className={styles["login-note"]}>
            O código chega pelo WhatsApp, que é mais rápido e mais barato do que o SMS internacional. Se falhar, enviamos por SMS local.
          </p>
        </div>
      </div>
    </section>
  );
}
