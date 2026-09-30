import type { Asset3DName } from "../../lib/assets3d";
import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { Icon } from "../../components/ui/Icon";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { Area, Material } from "./types";

/**
 * Capas geradas por área em vez de fotografias: 4 ilustrações reutilizadas (em cache)
 * em vez de ~80 KB de foto por cartão.
 */
const COVERS: Record<Area, { asset: Asset3DName; bg: string; label: string }> = {
  direito: { asset: "cover-direito", bg: "from-primary-fixed to-surface-sky", label: "Direito" },
  economia: { asset: "cover-economia", bg: "from-secondary-fixed to-surface-soft", label: "Economia" },
  engenharia: { asset: "cover-engenharia", bg: "from-feedback-gem/25 to-surface-soft", label: "Engenharia" },
  saude: { asset: "cover-saude", bg: "from-feedback-error-soft to-surface-soft", label: "Saúde" },
};

export const AREA_LABEL = (area: Area) => COVERS[area].label;

const rating = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Cartão de material. O cartão inteiro é clicável através do link no título
 * (pseudo-elemento), para haver um único alvo de tabulação por cartão.
 */
export function MaterialCard({ material: m }: { material: Material }) {
  const cover = COVERS[m.area];
  const free = m.priceKz === 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas shadow-elevation-1 transition-[translate,box-shadow,border-color] duration-200 ease-out-quint has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-sky-ink hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay-hover">
      <div className={cn("relative flex h-36 items-center justify-center bg-gradient-to-br", cover.bg)}>
        <Asset3D
          name={cover.asset}
          alt=""
          size={80}
          className="transition-[scale] duration-300 ease-out-quint group-hover:scale-105"
        />
        <span className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-1.5">
          <span className="rounded-full bg-surface-canvas px-2.5 py-0.5 text-caption font-bold text-text-secondary">
            {m.kind}
          </span>
          {m.bestseller && (
            <span className="rounded-full bg-feedback-streak px-2.5 py-0.5 text-overline text-surface-ink uppercase">
              Mais vendido
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-3 font-montserrat text-headline-h3 leading-snug font-extrabold text-on-surface">
          <a href={m.href} className="outline-none after:absolute after:inset-0 after:content-['']">
            {m.title}
          </a>
        </h3>

        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar name={m.author} size="sm" />
            <span className="truncate text-body-md font-bold text-on-surface">{m.author}</span>
          </span>
          <span className="shrink-0 rounded-md bg-surface-soft px-2 py-0.5 text-caption font-bold text-text-secondary">
            {m.university}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t-2 border-border-cloud pt-3">
          <p className="flex items-center gap-1">
            <Icon name="star" size={18} className="fill-feedback-streak text-feedback-streak" />
            <span className="text-body-md font-bold text-on-surface tabular-nums">{rating.format(m.rating)}</span>
            <span className="text-caption text-text-tertiary tabular-nums">({m.reviews})</span>
            <span className="sr-only">
              Avaliação {rating.format(m.rating)} de 5, {m.reviews} avaliações
            </span>
          </p>
          <p
            className={cn(
              "text-body-lg font-bold tabular-nums",
              free ? "rounded-full bg-feedback-success px-2.5 text-surface-ink uppercase" : "text-primary",
            )}
          >
            {free ? "Grátis" : formatKz(m.priceKz)}
          </p>
        </div>
      </div>
    </article>
  );
}
