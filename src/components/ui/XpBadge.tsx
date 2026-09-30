import { useCountUp } from "../../hooks/useCountUp";
import { Asset3D } from "./Asset3D";

const xpFormat = new Intl.NumberFormat("pt-AO");

/** Pílula de XP com contagem animada. O leitor de ecrã recebe só o valor final. */
export function XpBadge({ xp, label = "em jogo" }: { xp: number; label?: string }) {
  const shown = useCountUp(xp);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-sunbeam/60 bg-secondary-fixed/40 py-1 pr-3.5 pl-1.5">
      <Asset3D name="xp-bolt" alt="" size={24} priority />
      <span className="text-overline uppercase text-on-secondary-fixed-variant tabular-nums">
        <span aria-hidden="true">+{xpFormat.format(shown)} XP {label}</span>
        <span className="sr-only">{xpFormat.format(xp)} pontos de experiência {label}</span>
      </span>
    </span>
  );
}
