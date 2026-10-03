import { cn } from "@/lib/utils";

const TONES = [
  "bg-primary-fixed text-on-primary-fixed",
  "bg-secondary-fixed text-on-secondary-fixed-variant",
  "bg-feedback-success text-surface-ink",
  "bg-surface-sky text-primary",
];

const SIZES = { sm: "size-7 text-[11px]", md: "size-10 text-caption", lg: "size-20 text-headline-h2" } as const;

function initials(name: string) {
  const parts = name.replace(/\./g, "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

type AvatarProps = { name: string; size?: keyof typeof SIZES; className?: string };

/**
 * Avatar por iniciais: 0 bytes de rede (fotos custam ~30–100 KB cada).
 * Decorativo — o nome aparece sempre em texto ao lado.
 */
export function Avatar({ name, size = "md", className }: AvatarProps) {
  const tone = TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold ring-2 ring-white",
        tone,
        SIZES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
