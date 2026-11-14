import type { Asset3DName } from "../../lib/assets3d";
import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { Material } from "../../services/materialService";

/** Capas geradas por categoria (3 ilustrações em cache em vez de fotografias por cartão). */
const COVERS: Record<string, { asset: Asset3DName; bg: string }> = {
  tecnologia: { asset: "cover-engenharia", bg: "from-feedback-gem/25 to-surface-soft" },
  negocios: { asset: "cover-economia", bg: "from-secondary-fixed to-surface-soft" },
  design: { asset: "cover-direito", bg: "from-primary-fixed to-surface-sky" },
};

/** Os conteúdos não têm preço no backend: todos aparecem como acesso livre. */
export function MaterialCard({ material: m }: { material: Material }) {
  const cover = COVERS[m.categoria] ?? COVERS.tecnologia;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas shadow-elevation-1 transition-[translate,box-shadow,border-color] duration-200 ease-out-quint has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-sky-ink hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay-hover">
      <div className={cn("relative flex h-36 items-center justify-center bg-gradient-to-br", cover.bg)}>
        <Asset3D name={cover.asset} alt="" size={80} className="transition-[scale] duration-300 ease-out-quint group-hover:scale-105" />
        <span className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-1.5">
          <span className="rounded-full bg-surface-canvas px-2.5 py-0.5 text-caption font-bold text-text-secondary">
            {m.categoriaRotulo}
          </span>
          {m.quizId && (
            <span className="rounded-full bg-surface-canvas px-2.5 py-0.5 text-caption font-bold text-primary">Com simulado</span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-3 font-montserrat text-headline-h3 leading-snug font-extrabold text-on-surface">
          <a href={`/v2/marketplace/${encodeURIComponent(m.id)}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            {m.titulo}
          </a>
        </h3>

        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar name={m.criadorNome} size="sm" />
            <span className="truncate text-body-md font-bold text-on-surface">{m.criadorNome}</span>
          </span>
          {m.nivel && (
            <span className="shrink-0 rounded-md bg-surface-soft px-2 py-0.5 text-caption font-bold text-text-secondary">{m.nivel}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t-2 border-border-cloud pt-3">
          <p className="text-caption text-text-tertiary tabular-nums">{m.duracao}</p>
          <p className="rounded-full bg-feedback-success px-2.5 text-body-lg font-bold text-surface-ink uppercase">Acesso livre</p>
        </div>
      </div>
    </article>
  );
}
