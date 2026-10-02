import { Icon } from "./Icon";

const mbFormat = new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 1 });

/**
 * Selo de poupança de dados. Fica no fluxo da página (não fixo) para nunca
 * tapar botões focados em ecrãs pequenos (WCAG 2.4.11).
 */
export function DataSaverBadge({ megabytesToday }: { megabytesToday: number }) {
  return (
    <aside
      aria-label="Consumo de dados móveis"
      className="inline-flex items-center gap-2 rounded-full bg-surface-forest px-3.5 py-1.5 text-caption text-feedback-success"
    >
      <Icon name="signal" size={16} />
      <span className="tabular-nums">{mbFormat.format(megabytesToday)} MB usados hoje</span>
    </aside>
  );
}
