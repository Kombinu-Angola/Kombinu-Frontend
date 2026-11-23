import { useEffect, useRef, type ReactNode } from "react";

/** Marca em texto (kombinu.) com o ponto amarelo. */
export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className={`font-display leading-none font-extrabold tracking-tight text-kombinu-blue ${size === "md" ? "text-[2rem]" : "text-2xl"}`}>
      kombinu<span className="text-kombinu-yellow" aria-hidden="true">.</span>
    </span>
  );
}

/** Título do ecrã: recebe o foco ao montar para o leitor de ecrã anunciar a mudança de página. */
export function ScreenTitle({ children, subtitle, align = "left", eyebrow }: { children: ReactNode; subtitle?: ReactNode; align?: "left" | "center"; eyebrow?: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);
  return (
    <header className={align === "center" ? "text-center" : ""}>
      {eyebrow && <div className={`mb-3 flex ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</div>}
      <h1 ref={ref} tabIndex={-1} className="font-display text-[1.75rem] leading-[1.15] font-bold tracking-tight text-balance outline-none sm:text-[2rem]">
        {children}
      </h1>
      {subtitle && (
        <p className={`mt-3 text-[0.98rem] leading-relaxed font-medium text-pretty text-neutral-600 ${align === "center" ? "mx-auto max-w-[40ch]" : "max-w-[48ch]"}`}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
