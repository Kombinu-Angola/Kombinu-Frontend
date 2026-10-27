import styles from "./passe.module.css";
import { cx } from "./PasseShared";

export function PasseNotes() {
  return (
    <section className={cx(styles.sec, styles["notes-sec"])} id="resumos" aria-labelledby="resumos-h">
      <div className={styles.ripples} aria-hidden="true">
        <div className={cx(styles.rp, styles["rp-n"])}>
          <span className={cx(styles.r, styles.n1)} />
          <span className={cx(styles.r, styles.n2)} />
          <span className={cx(styles.r, styles.n3)} />
          <span className={cx(styles.r, styles.n4)} />
        </div>
      </div>
      <div className={cx(styles.wrap, styles["notes-grid"])}>
        <div>
          <h2 className={cx(styles.h2, styles.rv)} id="resumos-h">
            Partilha resumos, ganha passe.
          </h2>
          <p className={cx(styles.lead, styles.rv, styles["rv-2"])}>
            Na Kombinu só entram resumos, mapas mentais e resoluções escritos por estudantes, pelas próprias palavras. Na época de
            lançamento, cada resumo aprovado vale 14 dias de passe grátis.
          </p>
          <div className={cx(styles["notes-cta"], styles.rv)}>
            <a className={cx(styles["kb-btn"], styles["kb-btn--secondary"])} href="#entrar">
              Publicar um resumo
            </a>
            <p>A equipa revê cada resumo antes de entrar.</p>
          </div>
        </div>
        <div>
          <article className={cx(styles.rs, styles.rv)}>
            <div className={cx(styles["ill-docs-box"], styles["ill-pop"])}>
              <svg className={styles.ill} viewBox="0 0 220 230" aria-hidden="true">
                <ellipse className={cx(styles.sh, styles["sh-4"])} cx="112" cy="218" rx="80" ry="8" />
                <g className={cx(styles.fl, styles["fl-4"])}>
                  <rect className={styles["f-blue"]} x="62" y="22" width="120" height="152" rx="14" transform="rotate(-9 122 98)" />
                  <rect className={styles["f-yellow"]} x="56" y="30" width="120" height="152" rx="14" transform="rotate(6 116 106)" />
                  <rect className={styles["f-white-side"]} x="44" y="56" width="124" height="154" rx="14" />
                  <rect className={styles["f-white"]} x="44" y="44" width="124" height="154" rx="14" />
                  <rect className={styles["f-line"]} x="62" y="70" width="76" height="8" rx="4" />
                  <rect className={styles["f-line"]} x="62" y="92" width="88" height="8" rx="4" />
                  <rect className={styles["f-mark"]} x="56" y="109" width="84" height="18" rx="5" />
                  <rect className={styles["f-line-d"]} x="62" y="114" width="72" height="8" rx="4" />
                  <rect className={styles["f-line"]} x="62" y="138" width="80" height="8" rx="4" />
                  <rect className={styles["f-line"]} x="62" y="160" width="56" height="8" rx="4" />
                  <circle className={styles["f-green-side"]} cx="164" cy="196" r="22" />
                  <circle className={styles["f-green"]} cx="164" cy="190" r="22" />
                  <polyline className={styles["st-w"]} points="154 190 161 197 175 183" />
                </g>
              </svg>
            </div>
            <span className={cx(styles["kb-badge"], styles["kb-badge--brand"])}>medicina · uan</span>
            <h3 className={styles["rs-t"]}>Anatomia I · Sistema locomotor</h3>
            <p className={styles["rs-meta"]}>Resumo por tópicos · 4 min de leitura</p>
            <ul className={styles["rs-body"]}>
              <li>
                O esqueleto adulto tem <mark>206 ossos</mark>: 80 no esqueleto axial e 126 no apendicular.
              </li>
              <li>As articulações sinoviais, como o ombro, a anca e o joelho, são as que permitem mais movimento.</li>
              <li>Os músculos esqueléticos ligam-se aos ossos através de tendões.</li>
            </ul>
            <div className={styles["rs-foot"]}>
              <span>40 questões · 0,3 MB</span>
              <span className={styles["rs-by"]}>
                <svg className={styles.ic} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
                </svg>
                Autoria de estudante verificada
              </span>
            </div>
          </article>
          <ul className={styles["rs-more"]}>
            <li className={styles.rv}>
              <strong>Teoria Geral das Obrigações</strong>
              <span>Mapa mental + 25 questões · 0,2 MB</span>
            </li>
            <li className={cx(styles.rv, styles["rv-2"])}>
              <strong>Cálculo I · Limites e derivadas</strong>
              <span>30 exercícios resolvidos · 0,3 MB</span>
            </li>
          </ul>
        </div>
        <div className={styles["rules-row"]}>
          <dl className={styles.rules}>
            <div className={styles.rv}>
              <dt>Só autoria estudantil.</dt>
              <dd>Slides e sebentas de professores ficam de fora (Lei n.º 15/14).</dd>
            </div>
            <div className={cx(styles.rv, styles["rv-2"])}>
              <dt>Remoção em menos de 24 horas.</dt>
              <dd>Qualquer denúncia é analisada e o conteúdo sai no mesmo dia.</dd>
            </div>
            <div className={cx(styles.rv, styles["rv-3"])}>
              <dt>Sem trabalhos por encomenda.</dt>
              <dd>Ajudamos a estudar, não a entregar trabalhos feitos por outros.</dd>
            </div>
            <div className={cx(styles.rv, styles["rv-4"])}>
              <dt>Fechado durante as provas.</dt>
              <dd>Nos horários de exame não entram novos conteúdos.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
