import { Asset3D } from "../../components/ui/Asset3D";
import { Icon } from "../../components/ui/Icon";
import { CheckpointBlock } from "./CheckpointBlock";
import type { ContentBlock } from "./blocks";

type BlockRendererProps = {
  blocks: ContentBlock[];
  /** "preview": o criador vê o conteúdo como aluno, mas sem ganhar XP. */
  mode?: "read" | "preview";
  onCheckpointAnswer?: (blockId: string, correct: boolean, xp: number) => void;
};

/** Desenha os blocos de um artigo. Usado no leitor e na pré-visualização do estúdio. */
export function BlockRenderer({ blocks, mode = "read", onCheckpointAnswer }: BlockRendererProps) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={block.id} className="text-body-lg leading-relaxed text-on-surface">
                {block.text}
              </p>
            );

          case "heading":
            return (
              <h2
                key={block.id}
                id={block.id}
                className="mt-4 scroll-mt-28 font-montserrat text-headline-h2 text-on-surface"
              >
                {block.text}
              </h2>
            );

          case "callout":
            return (
              <aside
                key={block.id}
                id={block.id}
                aria-labelledby={`${block.id}-title`}
                className="scroll-mt-28 rounded-2xl border-2 border-l-8 border-brand-sky-ink bg-surface-sky p-5 sm:p-6"
              >
                <h2 id={`${block.id}-title`} className="mb-2 flex items-center gap-2 text-headline-h3 text-primary">
                  <Icon name="lightbulb" size={20} />
                  {block.title}
                </h2>
                <p className="text-body-md text-on-surface">{block.text}</p>
              </aside>
            );

          case "figure":
            return (
              <figure key={block.id} className="my-2">
                <div className="flex h-56 items-center justify-center rounded-2xl border-2 border-border-cloud bg-surface-soft">
                  <Asset3D name={block.asset} alt={block.alt} size={140} />
                </div>
                <figcaption className="mt-2 text-center text-caption text-text-tertiary">{block.caption}</figcaption>
              </figure>
            );

          case "takeaways":
            return (
              <section
                key={block.id}
                id={block.id}
                aria-labelledby={`${block.id}-title`}
                className="scroll-mt-28 rounded-2xl border-2 border-primary-fixed bg-surface-sky p-5 sm:p-6"
              >
                <h2 id={`${block.id}-title`} className="mb-3 flex items-center gap-2 text-headline-h3 text-primary">
                  <Icon name="lightbulb" size={20} />
                  {block.title}
                </h2>
                <ol className="list-decimal space-y-2.5 pl-5 text-body-md text-on-surface marker:font-bold marker:text-primary">
                  {block.items.map((item) => (
                    <li key={item.term}>
                      <strong className="font-bold">{item.term}:</strong> {item.text}
                    </li>
                  ))}
                </ol>
              </section>
            );

          case "quote":
            return (
              <figure key={block.id} className="my-2 border-l-8 border-brand-ocean pl-5">
                <blockquote className="text-body-lg text-pretty text-on-surface italic">{block.text}</blockquote>
                {block.source && (
                  <figcaption className="mt-2 text-caption text-text-tertiary">— {block.source}</figcaption>
                )}
              </figure>
            );

          case "flow":
            return (
              <figure
                key={block.id}
                id={block.id}
                className="scroll-mt-28 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6"
              >
                <p className="text-overline text-primary uppercase">Diagrama</p>
                <h3 className="mb-4 text-headline-h3 text-on-surface">{block.title}</h3>
                <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {block.steps.map((step, i) => (
                    <li
                      key={step.title}
                      className="relative flex flex-col rounded-xl border-2 border-border-cloud bg-surface-soft p-4"
                    >
                      <span className="mb-2 flex items-center justify-between gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-brand-ocean text-caption font-bold text-white tabular-nums">
                          {i + 1}
                        </span>
                        <span className="text-overline text-text-tertiary uppercase">{step.label}</span>
                      </span>
                      <span className="text-body-md font-bold text-on-surface">{step.title}</span>
                      <span className="mt-0.5 text-caption text-text-secondary">{step.text}</span>
                    </li>
                  ))}
                </ol>
                <figcaption className="mt-3 text-center text-caption text-text-tertiary">{block.caption}</figcaption>
              </figure>
            );

          case "checkpoint":
            return (
              <CheckpointBlock
                key={block.id}
                block={block}
                mode={mode}
                onAnswer={(correct) => onCheckpointAnswer?.(block.id, correct, block.xp)}
              />
            );
        }
      })}
    </div>
  );
}
