import type { SVGProps } from "react";
import styles from "./passe.module.css";

export function KLogo({ className }: { className?: string }) {
  return (
    <svg className={`${styles.k} ${className ?? ""}`} viewBox="0 0 96.74 107.92" aria-hidden="true" focusable="false">
      <polygon className={styles["k-s"]} points="0.04 58.57 21.66 35.03 21.66 0.39 0.04 0.39" />
      <polygon
        className={styles["k-y"]}
        points="21.66 75.15 30.43 66.21 94.46 0.39 65.38 0.39 41.33 26.56 21.66 47.96 0.04 71.5 0.04 107.53 21.66 107.53"
      />
      <polygon className={styles["k-l"]} points="44.83 66.35 68.66 107.53 96.66 107.53 59.83 50.91" />
    </svg>
  );
}

/** The shared SVG gradient <defs>, rendered exactly once per page (referenced via url(#kg-*) across every illustration). */
export function PasseGradientDefs() {
  return (
    <svg className={styles.defs} width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="kg-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-blue-a"]} />
          <stop offset="1" className={styles["s-blue-b"]} />
        </linearGradient>
        <linearGradient id="kg-blues" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-blues-a"]} />
          <stop offset="1" className={styles["s-blues-b"]} />
        </linearGradient>
        <linearGradient id="kg-yel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-yel-a"]} />
          <stop offset="1" className={styles["s-yel-b"]} />
        </linearGradient>
        <linearGradient id="kg-yels" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-yels-a"]} />
          <stop offset="1" className={styles["s-yels-b"]} />
        </linearGradient>
        <linearGradient id="kg-wh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-wh-a"]} />
          <stop offset="1" className={styles["s-wh-b"]} />
        </linearGradient>
        <linearGradient id="kg-whs" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-whs-a"]} />
          <stop offset="1" className={styles["s-whs-b"]} />
        </linearGradient>
        <linearGradient id="kg-ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-ink-a"]} />
          <stop offset="1" className={styles["s-ink-b"]} />
        </linearGradient>
        <linearGradient id="kg-gl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-gl-a"]} />
          <stop offset="1" className={styles["s-gl-b"]} />
        </linearGradient>
        <linearGradient id="kg-gr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className={styles["s-gr-a"]} />
          <stop offset="1" className={styles["s-gr-b"]} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function cx(...parts: Array<string | false | undefined | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function Ic(props: SVGProps<SVGSVGElement> & { className?: string }) {
  const { className, children, ...rest } = props;
  return (
    <svg className={`${styles.ic} ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <Ic {...props}>
      <polyline points="4 12 10 18 20 6" />
    </Ic>
  );
}

export function IconPlus(props: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <Ic {...props}>
      <path d="M12 5v14M5 12h14" />
    </Ic>
  );
}
