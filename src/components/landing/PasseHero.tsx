import { Fragment } from "react";
import styles from "./passe.module.css";
import { cx } from "./PasseShared";
import type { PasseLandingState } from "./usePasseLanding";

const WORDS = [
  "Domina", "a", "tua", "cadeira", "mais", "difícil", "em", "5", "minutos", "por", "dia", "sem", "gastar", "o", "teu", "saldo",
];

const OPTIONS: Array<[string, string, string]> = [
  ["a", "A", "Entra mais dinheiro em circulação"],
  ["b", "B", "O crédito fica mais caro e a inflação abranda"],
  ["c", "C", "O Kwanza desvaloriza de imediato"],
  ["d", "D", "As empresas passam a investir mais"],
];

export function PasseHero({ p }: { p: PasseLandingState }) {
  const { answered, right, answer, CORRECT } = p;

  return (
    <section className={cx(styles.hero)} id="topo" aria-labelledby="hero-h" ref={p.refs.heroRef as React.RefObject<HTMLElement>}>
      <div className={styles.ripples} aria-hidden="true">
        <div className={cx(styles.rp, styles["rp-b"])}>
          <span className={cx(styles.r, styles.b1)} />
          <span className={cx(styles.r, styles.b2)} />
          <span className={cx(styles.r, styles.b3)} />
          <span className={cx(styles.r, styles.b4)} />
          <span className={cx(styles.r, styles.b5)} />
        </div>
        <div className={cx(styles.rp, styles["rp-y"])}>
          <span className={cx(styles.r, styles.ry, styles.y1)} />
          <span className={cx(styles.r, styles.ry, styles.y2)} />
          <span className={cx(styles.r, styles.ry, styles.y3)} />
          <span className={cx(styles.r, styles.ry, styles.y4)} />
        </div>
      </div>

      <div className={cx(styles.wrap, styles["hero-grid"])}>
        <div className={styles["hero-copy"]}>
          <h1 className={styles.h1} id="hero-h">
            {WORDS.map((word, i) => (
              <Fragment key={i}>
                <span className={cx(styles.w, styles[`d${i + 1}`])}>
                  <span>{word}</span>
                </span>
                {i < WORDS.length - 1 && " "}
              </Fragment>
            ))}
          </h1>
          <p className={cx(styles["hero-sub"], styles.in, styles["in-1"])}>
            Simulados com correção na hora e resumos escritos por estudantes, num Passe de Provas de 21 dias{" "}
            <strong>desde 600 Kz por cadeira</strong>: o preço de duas corridas de candongueiro.
          </p>
          <div className={cx(styles.inst, styles.in, styles["in-2"])} role="group" aria-labelledby="inst-l">
            <p className={styles["inst-l"]} id="inst-l">
              Onde estudas?
            </p>
            <div className={styles.chips}>
              {p.insts.map((it) => (
                <button
                  key={it.label}
                  type="button"
                  className={cx(styles.chip, it.on && styles["is-on"])}
                  aria-pressed={it.on}
                  onClick={() => p.setInst(it.label)}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </div>
          <div className={cx(styles["cta-row"], styles.in, styles["in-3"])}>
            <button
              type="button"
              className={cx(styles["kb-btn"], styles["kb-btn--primary"], styles["btn-sun"])}
              onClick={p.goQuiz}
            >
              Resolver 1 simulado grátis
            </button>
            <a className={cx(styles["kb-btn"], styles["kb-btn--secondary"])} href="#precos">
              Ver preços
            </a>
          </div>
          <p className={cx(styles["hero-note"], styles.in, styles["in-4"])}>
            O primeiro simulado não pede conta. Depois entras com o teu número de WhatsApp.
          </p>
        </div>

        <div className={styles["quiz-wrap"]}>
          <div className={styles["quiz-stage"]}>
            <div
              className={cx(styles.quiz, p.quizNudge && styles["is-nudge"])}
              id="simulado"
              ref={p.refs.quizRef}
            >
              <h2 className={styles["sr-only"]}>Experimenta um simulado</h2>
              <div className={styles["q-top"]}>
                <span className={cx(styles["kb-badge"], styles["kb-badge--brand"])}>{p.instTag}</span>
                <p className={styles.tm}>
                  <svg className={styles["tm-ring"]} viewBox="0 0 36 36" aria-hidden="true">
                    <circle className={styles["tm-bg"]} cx="18" cy="18" r="15" />
                    <circle className={styles["tm-arc"]} cx="18" cy="18" r="15" />
                  </svg>
                  <span className={styles["tm-t"]}>
                    <span className={styles["tm-l"]}>{p.sessLabel}</span>
                    <span className={styles["tm-v"]}>{p.secsFmt}</span>
                  </span>
                </p>
              </div>
              <div className={styles.prog}>
                <div className={styles["prog-row"]}>
                  <span>Progresso em Economia I</span>
                  <span className={styles["prog-val"]}>{p.progress}%</span>
                </div>
                <div
                  className={styles["prog-track"]}
                  role="progressbar"
                  aria-label="Progresso em Economia I"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={p.progress}
                >
                  <div className={cx(styles["prog-fill"], styles[p.progress === 32 ? "p32" : "p20"])} />
                </div>
                <p className={styles["prog-note"]}>Começas nos 20%: o teu diagnóstico já conta.</p>
              </div>
              <p className={styles["q-count"]}>Pergunta 3 de 10</p>
              <p className={styles["q-text"]} id="q-text">
                Quando o BNA sobe a taxa básica de juro, o que se espera a seguir?
              </p>
              <div className={styles.opts} role="group" aria-labelledby="q-text">
                {OPTIONS.map(([id, key, text]) => {
                  let cls = "";
                  if (answered) {
                    if (id === CORRECT) cls = styles["is-correct"];
                    else if (id === answer) cls = styles["is-wrong"];
                    else cls = styles["is-dim"];
                  }
                  return (
                    <button
                      key={id}
                      type="button"
                      className={cx(styles.opt, cls)}
                      aria-pressed={answer === id}
                      aria-disabled={answered}
                      onClick={() => p.setAnswer(id as "a" | "b" | "c" | "d")}
                    >
                      <span className={styles["opt-key"]} aria-hidden="true">
                        {key}
                      </span>
                      <span className={styles["opt-txt"]}>{text}</span>
                      <span className={styles["opt-ico"]} aria-hidden="true">
                        <svg className={cx(styles.ic, styles["ico-ok"])} viewBox="0 0 24 24">
                          <polyline points="4 12 10 18 20 6" />
                        </svg>
                        <svg className={cx(styles.ic, styles["ico-no"])} viewBox="0 0 24 24">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {answered && (
                  <div className={cx(styles.fb, styles[right ? "is-right" : "is-wrong"])}>
                    <p className={styles["fb-title"]}>{right ? "Certo. +40 XP para a tua liga." : "Quase. A resposta certa é a B."}</p>
                    <p className={styles["fb-text"]}>
                      Juros mais altos encarecem o crédito e travam a procura, por isso os preços sobem mais devagar.
                    </p>
                    <button type="button" className={styles["fb-retry"]} onClick={p.resetQuiz}>
                      Tentar de novo
                    </button>
                  </div>
                )}
              </div>
              {right && (
                <span className={styles["xp-pop"]} aria-hidden="true">
                  +40 XP
                </span>
              )}
              <div className={styles["q-foot"]}>
                <span>
                  <svg className={cx(styles.ic, styles.flame)} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3c1 3 5 5.2 5 10a5 5 0 0 1-10 0c0-2.2 1-3.7 2-4.7 0 2 1 3.2 2 3.2 0-3-1-5.5 1-8.5z" />
                  </svg>
                  Ofensiva de 3 dias
                </span>
                <span>
                  <svg className={cx(styles.ic, styles.snow)} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5" />
                  </svg>
                  2 congelamentos guardados
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
