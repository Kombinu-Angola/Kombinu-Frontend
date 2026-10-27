import styles from "./passe.module.css";
import { KLogo } from "./PasseShared";

export function PasseFooter() {
  return (
    <footer className={styles.ftr}>
      <div className={styles.wrap}>
        <div className={styles["ftr-top"]}>
          <div>
            <a className={styles.brand} href="#topo" aria-label="Kombinu, voltar ao início">
              <KLogo />
            </a>
            <p className={styles["ftr-tag"]}>Simulados e resumos de estudantes para passar nas frequências e exames em Angola.</p>
          </div>
          <div className={styles["ftr-nav"]}>
            <nav aria-label="Rodapé">
              <ul>
                <li>
                  <a href="#epocas">Épocas de provas</a>
                </li>
                <li>
                  <a href="#como">Como funciona</a>
                </li>
                <li>
                  <a href="#precos">Preços</a>
                </li>
                <li>
                  <a href="#pagamento">Pagamento</a>
                </li>
                <li>
                  <a href="#ligas">Ligas</a>
                </li>
                <li>
                  <a href="#resumos">Publicar um resumo</a>
                </li>
                <li>
                  <a href="#perguntas">Perguntas</a>
                </li>
              </ul>
            </nav>
            <nav className={styles["ftr-legal"]} aria-label="Informação legal">
              <ul>
                <li>
                  <a href="#termos">Termos de utilização</a>
                </li>
                <li>
                  <a href="#privacidade">Privacidade e dados (Lei n.º 22/11)</a>
                </li>
                <li>
                  <a href="#direitos">Direitos de autor e remoção</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className={styles["ftr-bot"]}>
          <span>© 2026 Kombinu Angola</span>
          <span>Elevando o aprendizado, superando barreiras.</span>
        </div>
      </div>
    </footer>
  );
}
