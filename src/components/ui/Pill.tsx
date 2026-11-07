import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "sunbeam" | "ocean" | "sky" | "success";

const TONES: Record<Tone, string> = {
  sunbeam: "bg-secondary-fixed text-on-secondary-fixed-variant",
  ocean: "bg-primary-fixed text-on-primary-fixed",
  sky: "bg-surface-sky text-primary",
  success: "bg-feedback-success-soft text-feedback-success-ink",
};

type PillProps = {
  tone?: Tone;
  icon?: ReactNode;
  /** eyebrow = maiúsculas (secções); tag = minúsculas (etiquetas). */
  kind?: "eyebrow" | "tag";
  className?: string;
  children: ReactNode;
};

export function Pill({ tone = "ocean", icon, kind = "eyebrow", className, children }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        kind === "eyebrow" ? "text-overline uppercase" : "text-caption",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
