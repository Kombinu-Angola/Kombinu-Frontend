import styles from "./passe.module.css";
import { cx } from "./PasseShared";
import type { PassePayMethod, PasseLandingState } from "./usePasseLanding";

const PAY_BUTTONS: Array<{ id: PassePayMethod; title: string; desc: string; icon: React.ReactNode }> = [
  {
    id: "mcx",
    title: "Multicaixa Express",
    desc: "Pagas na hora com o teu número.",
    icon: (
      <g transform="rotate(-12 32 32)">
        <rect className={styles["f-blue-side"]} x="20" y="10" width="30" height="50" rx="8" />
        <rect className={styles["f-ink"]} x="16" y="6" width="30" height="50" rx="8" />
        <rect className={styles["f-blue"]} x="19.5" y="11" width="23" height="38" rx="4" />
        <circle className={styles["f-yellow-side"]} cx="31" cy="32" r="8" />
        <circle className={styles["f-yellow"]} cx="31" cy="30.5" r="8" />
      </g>
    ),
  },
  {
    id: "enc",
    title: "Pede ao teu encarregado",
    desc: "Envias um link pelo WhatsApp e ele paga.",
    icon: (
      <>
        <path className={styles["f-yellow-side"]} transform="translate(2 4)" d="M10 14 Q10 8 16 8 H48 Q54 8 54 14 V36 Q54 42 48 42 H28 L18 52 V42 H16 Q10 42 10 36 Z" />
        <path className={styles["f-yellow"]} d="M10 14 Q10 8 16 8 H48 Q54 8 54 14 V36 Q54 42 48 42 H28 L18 52 V42 H16 Q10 42 10 36 Z" />
        <circle className={styles["f-ink"]} cx="22" cy="25" r="3.2" />
        <circle className={styles["f-ink"]} cx="32" cy="25" r="3.2" />
        <circle className={styles["f-ink"]} cx="42" cy="25" r="3.2" />
      </>
    ),
  },
  {
    id: "turma",
    title: "Passe de Turma",
    desc: "O delegado compra para a turma com desconto.",
    icon: (
      <>
        <circle className={styles["f-blue"]} cx="18" cy="21" r="7" />
        <path className={styles["f-blue"]} d="M6 50 Q6 32 18 32 Q30 32 30 50 Z" />
        <circle className={styles["f-blue"]} cx="46" cy="21" r="7" />
        <path className={styles["f-blue"]} d="M34 50 Q34 32 46 32 Q58 32 58 50 Z" />
        <circle className={styles["f-yellow"]} cx="32" cy="27" r="9" />
        <path className={styles["f-yellow-side"]} d="M17 59 Q17 41 32 41 Q47 41 47 59 Z" />
        <path className={styles["f-yellow"]} d="M17 57 Q17 39 32 39 Q47 39 47 57 Z" />
      </>
    ),
  },
  {
    id: "vou",
    title: "Voucher na reprografia",
    desc: "Compras um código e pagas em dinheiro.",
    icon: (
      <>
        <path className={styles["f-yellow-side"]} transform="translate(2 4)" d="M6 16 H58 V27 Q52 27 52 33 Q52 39 58 39 V50 H6 V39 Q12 39 12 33 Q12 27 6 27 Z" />
        <path className={styles["f-yellow"]} d="M6 16 H58 V27 Q52 27 52 33 Q52 39 58 39 V50 H6 V39 Q12 39 12 33 Q12 27 6 27 Z" />
        <path className={styles["st-dash"]} d="M42 19 V47" />
        <rect className={styles["f-blue"]} x="16" y="24" width="18" height="5" rx="2.5" />
        <rect className={styles["f-blue"]} x="16" y="33" width="12" height="5" rx="2.5" />
      </>
    ),
  },
];

const AVATARS: Array<{ label: string; cls?: "is-del" | "is-empty" }> = [
  { label: "DL", cls: "is-del" },
  { label: "AM" },
  { label: "JK" },
  { label: "TS" },
  { label: "NP" },
  { label: "YC" },
  { label: "BM" },
  { label: "EF" },
  { label: "GQ" },
  { label: "+6", cls: "is-empty" },
];

export function PassePayment({ p }: { p: PasseLandingState }) {
  return (
    <section className={cx(styles.sec, styles.pay)} id="pagamento" aria-labelledby="pag-h">
      <div className={styles.ripples} aria-hidden="true">
        <div className={cx(styles.rp, styles["rp-y"])}>
          <span className={cx(styles.r, styles.ry, styles.py1)} />
          <span className={cx(styles.r, styles.ry, styles.py2)} />
          <span className={cx(styles.r, styles.ry, styles.py3)} />
          <span className={cx(styles.r, styles.ry, styles.py4)} />
        </div>
      </div>
      <div className={styles.wrap}>
        <div className={styles["sec-head"]}>
          <h2 className={cx(styles.h2, styles.rv)} id="pag-h">
            Paga mesmo sem conta no banco.
          </h2>
          <div className={cx(styles.rv, styles["rv-2"])}>
            <p className={styles.lead}>Só cerca de um em cada três adultos em Angola tem conta bancária. Por isso há quatro formas de ativar o teu passe.</p>
            <p className={styles.src}>Fonte: inquérito do INE (2022).</p>
          </div>
        </div>
        <div className={styles["pay-grid"]}>
          <div className={styles["pay-list"]} role="group" aria-label="Formas de pagamento">
            {PAY_BUTTONS.map((btn) => (
              <button
                key={btn.id}
                type="button"
                className={cx(styles["pay-btn"], p.pay === btn.id && styles["is-on"])}
                aria-pressed={p.pay === btn.id}
                onClick={() => p.pickPay(btn.id)}
              >
                <svg className={styles["ill-mini"]} viewBox="0 0 64 64" aria-hidden="true">
                  {btn.icon}
                </svg>
                <span>
                  <span className={styles["pay-t"]}>{btn.title}</span>
                  <span className={styles["pay-d"]}>{btn.desc}</span>
                </span>
              </button>
            ))}
          </div>

          <div aria-live="polite">
            {p.pay === "mcx" && (
              <div className={styles.pane}>
                <h3 className={styles["pane-t"]}>Multicaixa Express</h3>
                <ol className={styles.flow}>
                  <li>Escreves o número associado ao teu Multicaixa Express.</li>
                  <li>Aprovas a notificação com o teu PIN.</li>
                  <li>O passe fica ativo na hora.</li>
                </ol>
                <div className={styles.amount}>
                  <span>Passe de Provas · Anatomia I</span>
                  <strong>600 Kz</strong>
                </div>
              </div>
            )}
            {p.pay === "enc" && (
              <div className={styles.pane} ref={p.refs.typeElRef}>
                <h3 className={styles["pane-t"]}>Pede ao teu encarregado</h3>
                <p className={styles["pane-p"]}>
                  Geras uma mensagem com o que vais estudar. O teu encarregado paga no Multicaixa Express dele e tu recebes o passe.
                </p>
                <p className={styles["bubble-k"]}>
                  <svg className={styles.ic} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 5h16v11H9l-5 4z" />
                  </svg>
                  Mensagem pronta para enviar pelo WhatsApp
                </p>
                <p className={styles.bubble}>
                  <span className={styles["sr-only"]}>{p.msgFull}</span>
                  <span aria-hidden="true">
                    {p.typedText}
                    <span className={cx(styles.caret, !p.typing && styles["is-done"])} />
                  </span>
                  <span className={styles["bubble-meta"]} aria-hidden="true">
                    agora
                  </span>
                </p>
                <div className={styles["pane-actions"]}>
                  <button type="button" className={cx(styles["kb-btn"], styles["kb-btn--secondary"])} onClick={p.retype}>
                    Gerar a mensagem
                  </button>
                </div>
              </div>
            )}
            {p.pay === "turma" && (
              <div className={styles.pane}>
                <h3 className={styles["pane-t"]}>Passe de Turma</h3>
                <p className={styles["pane-p"]}>
                  Funciona como uma kixikila: o delegado junta os colegas, recolhe os valores e compra um pacote para a turma com
                  desconto. O passe do delegado sai grátis.
                </p>
                <div className={styles["class-row"]}>
                  <span>Economia · 2.º ano A</span>
                  <span>9 de 15 colegas</span>
                </div>
                <div className={styles["class-track"]}>
                  <div className={styles["class-fill"]} />
                </div>
                <div className={styles.avatars} aria-hidden="true">
                  {AVATARS.map((a, i) => (
                    <span key={i} className={cx(styles.av, a.cls && styles[a.cls])}>
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {p.pay === "vou" && (
              <div className={styles.pane}>
                <h3 className={styles["pane-t"]}>Voucher na reprografia</h3>
                <p className={styles["pane-p"]}>
                  Compras o código numa reprografia ou associação de estudantes, escreves o código na app e o passe fica ativo.
                </p>
                <div className={styles.voucher} role="img" aria-label="Exemplo de voucher: Passe de Provas, 1 cadeira, 21 dias, 600 Kz">
                  <div className={styles["voucher-main"]}>
                    <p className={styles["voucher-k"]}>Kombinu · voucher</p>
                    <p className={styles["voucher-n"]}>Passe de Provas</p>
                    <p className={styles["voucher-s"]}>1 cadeira · 21 dias</p>
                    <span className={styles["voucher-code"]}>KMB-7Q4H-92XT</span>
                  </div>
                  <div className={styles["voucher-stub"]}>
                    <span className={styles["voucher-p"]}>600</span>
                    <span className={styles["voucher-u"]}>Kz</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
