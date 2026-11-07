import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: ReactNode;
  /** Link ou ação no canto do cabeçalho. */
  action?: ReactNode;
  eyebrow?: ReactNode;
  headingLevel?: "h2" | "h3";
  className?: string;
  children: ReactNode;
};

/** Superfície "clay" do design system: raio 24px, borda cloud 2px, sombra difusa. */
export function SectionCard({ title, action, eyebrow, headingLevel: H = "h2", className, children }: SectionCardProps) {
  const id = useId();
  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={cn("rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-6", className)}
    >
      {(title || action || eyebrow) && (
        <header className="mb-5 flex items-start justify-between gap-3">
          <div>
            {eyebrow && <p className="mb-1 text-overline text-text-tertiary uppercase">{eyebrow}</p>}
            {title && (
              <H id={id} className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                {title}
              </H>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
