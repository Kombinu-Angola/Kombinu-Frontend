import { cn } from "@/lib/utils";

const PIECES = [
  { left: "8%", color: "bg-secondary-container", delay: "0ms", rotate: "rotate-12", shape: "size-3 rounded-sm" },
  { left: "18%", color: "bg-brand-ocean", delay: "80ms", rotate: "-rotate-12", shape: "h-4 w-2 rounded-full" },
  { left: "30%", color: "bg-feedback-gem", delay: "160ms", rotate: "rotate-45", shape: "size-2.5 rounded-sm" },
  { left: "70%", color: "bg-secondary-container", delay: "40ms", rotate: "-rotate-45", shape: "size-3 rounded-full" },
  { left: "82%", color: "bg-brand-ocean", delay: "120ms", rotate: "rotate-12", shape: "h-4 w-2 rounded-full" },
  { left: "92%", color: "bg-feedback-gem", delay: "200ms", rotate: "-rotate-12", shape: "size-2.5 rounded-sm" },
];

/**
 * Confete em CSS puro (0 bytes de imagem) que cai UMA vez ao entrar.
 * Com movimento reduzido não é mostrado — a celebração fica no título e nas recompensas.
 */
export function ConfettiBurst() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden motion-reduce:hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={cn("absolute top-0 animate-confetti-fall opacity-0", p.color, p.rotate, p.shape)}
          style={{ left: p.left, animationDelay: p.delay }}
        />
      ))}
    </div>
  );
}
