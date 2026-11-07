import { Icon, type IconName } from "../../components/ui/Icon";
import { useActiveSection } from "../../hooks/useActiveSection";
import { cn } from "@/lib/utils";
import { tableOfContents } from "../content/blocks";
import type { ContentBlock } from "../content/blocks";

const KIND_ICON: Record<string, IconName> = { heading: "list", callout: "lightbulb", checkpoint: "bolt" };

/** Índice do artigo. Fixo no desktop; no telemóvel é um <details> recolhido. */
export function ArticleToc({ blocks }: { blocks: ContentBlock[] }) {
  const entries = tableOfContents(blocks);
  const active = useActiveSection(entries.map((e) => e.id));
  if (entries.length === 0) return null;

  const list = (
    <ul className="flex flex-col gap-1">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            aria-current={entry.id === active ? "location" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-2 rounded-lg px-3 text-body-md transition-[background-color,color] duration-150",
              entry.id === active
                ? "bg-surface-sky font-bold text-primary"
                : "text-text-secondary hover:bg-surface-soft hover:text-primary",
            )}
          >
            <Icon
              name={KIND_ICON[entry.kind]}
              size={16}
              className={cn("shrink-0", entry.kind === "checkpoint" && "text-feedback-streak-ink")}
            />
            {entry.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav aria-label="Índice do artigo" className="hidden lg:block">
        <div className="sticky top-28">
          <h2 className="mb-3 text-overline text-text-tertiary uppercase">Conteúdos</h2>
          {list}
        </div>
      </nav>
      <details className="rounded-2xl border-2 border-border-cloud bg-surface-canvas lg:hidden">
        <summary className="flex min-h-12 cursor-pointer items-center gap-2 px-4 text-body-md font-bold text-primary">
          <Icon name="list" size={18} />
          Índice do artigo
        </summary>
        <nav aria-label="Índice do artigo" className="border-t-2 border-border-cloud p-2">
          {list}
        </nav>
      </details>
    </>
  );
}
