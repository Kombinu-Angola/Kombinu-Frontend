import { useEffect, useState } from "react";

/**
 * Secção visível no ecrã, para destacar o índice durante a leitura.
 * Usa IntersectionObserver (sem ouvir o scroll, sem trabalho por frame).
 */
export function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = useState<string>();
  const key = ids.join("|");

  useEffect(() => {
    const targets = key
      .split("|")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
