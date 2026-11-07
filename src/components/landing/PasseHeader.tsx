import styles from "./passe.module.css";
import { KLogo, cx } from "./PasseShared";

export function PasseHeader() {
  return (
    <header className={styles.hdr}>
      <div className={cx(styles.wrap, styles["hdr-in"])}>
        <a className={styles.brand} href="#topo" aria-label="Kombinu, voltar ao início">
          <KLogo />
        </a>
        <nav className={styles["hdr-nav"]} aria-label="Principal">
          <a href="#epocas">Épocas</a>
          <a href="#como">Como funciona</a>
          <a href="#precos">Preços</a>
          <a href="#pagamento">Pagamento</a>
          <a href="#perguntas">Perguntas</a>
        </nav>
        <div className={styles["hdr-act"]}>
          <a className={styles["hdr-login"]} href="#entrar">
            Entrar
          </a>
          <a className={cx(styles["kb-btn"], styles["kb-btn--primary"], styles["btn-sm"], styles["hdr-cta"])} href="#simulado">
            Começar grátis
          </a>
        </div>
      </div>
    </header>
  );
}
