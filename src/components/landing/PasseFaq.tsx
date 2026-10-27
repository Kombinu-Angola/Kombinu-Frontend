import styles from "./passe.module.css";
import { cx, IconPlus } from "./PasseShared";
import type { PasseLandingState } from "./usePasseLanding";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Tenho de pagar todos os meses?",
    a: "Não. Pagas uma vez por passe. Quando os dias do passe acabam, o acesso termina e não há nenhuma cobrança automática.",
  },
  {
    q: "Não tenho conta no banco. Consigo pagar?",
    a: "Sim. Podes comprar um voucher numa reprografia ou associação de estudantes, pedir ao teu encarregado que pague pelo link que lhe envias no WhatsApp, ou entrar no Passe de Turma do teu delegado.",
  },
  {
    q: "Quantos dados gasta?",
    a: "Cada simulado ocupa cerca de 0,3 MB e a app abre pela primeira vez com menos de 1 MB. Depois de descarregares a cadeira, estudas sem rede.",
  },
  {
    q: "Como entro na minha conta?",
    a: "Com o teu número de telemóvel. Recebes um código de 6 dígitos no WhatsApp e não precisas de palavra-passe.",
  },
  {
    q: "Os resumos são legais?",
    a: "Só publicamos resumos, mapas mentais e resoluções escritos por estudantes, pelas próprias palavras. Slides e sebentas de professores não entram. Retiramos qualquer conteúdo denunciado em menos de 24 horas e não fazemos trabalhos por encomenda.",
  },
  {
    q: "Quem vê as minhas notas?",
    a: "Só tu. As notas e o desempenho são privados por defeito; na liga aparece apenas a XP da semana. Mensagens de marketing só chegam com a tua autorização e, se tens menos de 18 anos, pedimos o consentimento do teu encarregado.",
  },
];

export function PasseFaq({ p }: { p: PasseLandingState }) {
  return (
    <section className={styles.sec} id="perguntas" aria-labelledby="faq-h">
      <div className={cx(styles.wrap, styles["faq-grid"])}>
        <div>
          <h2 className={cx(styles.h2, styles.rv)} id="faq-h">
            Perguntas antes de comprar.
          </h2>
          <p className={cx(styles.lead, styles.rv, styles["rv-2"])}>Não encontras a tua dúvida? Escreve-nos pelo WhatsApp depois de entrares.</p>
        </div>
        <div className={styles["faq-list"]}>
          {FAQS.map((item, i) => {
            const open = p.faq === i;
            return (
              <div key={item.q} className={cx(styles["faq-item"], open && styles["is-open"])}>
                <h3 className={styles["faq-q"]}>
                  <button
                    type="button"
                    className={styles["faq-btn"]}
                    aria-expanded={open}
                    aria-controls={`faq-a${i}`}
                    onClick={() => p.toggleFaq(i)}
                  >
                    {item.q}
                    <span className={styles["faq-ico"]} aria-hidden="true">
                      <IconPlus />
                    </span>
                  </button>
                </h3>
                <div className={styles["faq-a"]} id={`faq-a${i}`}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
