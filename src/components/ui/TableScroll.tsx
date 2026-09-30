import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tableWrap } from "./table";

/**
 * Contentor de tabela com scroll horizontal. É focável e anunciado como região,
 * para quem navega por teclado conseguir deslocá-la (WCAG 2.1.1).
 */
export function TableScroll({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cn(tableWrap, className)}>
      {children}
    </div>
  );
}
