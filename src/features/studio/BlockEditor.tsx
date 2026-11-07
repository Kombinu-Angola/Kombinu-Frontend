import { Icon } from "../../components/ui/Icon";
import type { ContentBlock } from "../content/blocks";
import { QuizBuilder } from "./QuizBuilder";

const KIND_LABEL: Record<ContentBlock["type"], string> = {
  paragraph: "Parágrafo",
  heading: "Título de secção",
  callout: "Destaque",
  figure: "Imagem",
  takeaways: "Princípios-chave",
  quote: "Citação",
  flow: "Diagrama de fluxo",
  checkpoint: "Checkpoint",
};

type BlockEditorProps = {
  block: ContentBlock;
  index: number;
  total: number;
  onChange: (block: ContentBlock) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
};

const textareaClass =
  "w-full min-h-24 field-sizing-content resize-none rounded-xl border-2 border-transparent bg-transparent p-3 text-body-lg leading-relaxed text-on-surface placeholder:text-text-tertiary hover:border-border-cloud focus-visible:border-brand-sky-ink focus-visible:bg-surface-canvas";

/** Um bloco do rascunho, com a sua barra de ações (mover e remover). */
export function BlockEditor({ block, index, total, onChange, onRemove, onMove }: BlockEditorProps) {
  const label = `${KIND_LABEL[block.type]} ${index + 1} de ${total}`;

  return (
    <section aria-label={label} className="group rounded-2xl border-2 border-transparent p-2 hover:border-border-cloud">
      <div className="mb-1 flex items-center justify-between gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
        <span className="text-overline text-text-tertiary uppercase">{KIND_LABEL[block.type]}</span>
        <span className="flex">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => onMove(direction)}
              disabled={direction === -1 ? index === 0 : index === total - 1}
              aria-label={`Mover ${KIND_LABEL[block.type].toLowerCase()} para ${direction === -1 ? "cima" : "baixo"}`}
              className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon name="arrow-right" size={18} className={direction === -1 ? "-rotate-90" : "rotate-90"} />
            </button>
          ))}
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${label.toLowerCase()}`}
            className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-feedback-error-soft hover:text-feedback-error-ink"
          >
            <Icon name="trash" size={18} />
          </button>
        </span>
      </div>

      {block.type === "paragraph" && (
        <>
          <label htmlFor={block.id} className="sr-only">
            {label}
          </label>
          <textarea
            id={block.id}
            rows={2}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Escreve o teu parágrafo…"
            className={textareaClass}
          />
        </>
      )}

      {block.type === "heading" && (
        <>
          <label htmlFor={block.id} className="sr-only">
            {label}
          </label>
          <input
            id={block.id}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Título da secção"
            className="w-full rounded-xl border-2 border-transparent bg-transparent p-3 font-montserrat text-headline-h2 text-on-surface placeholder:text-text-tertiary hover:border-border-cloud focus-visible:border-brand-sky-ink"
          />
        </>
      )}

      {block.type === "callout" && (
        <div className="rounded-2xl border-2 border-l-8 border-brand-sky-ink bg-surface-sky p-4">
          <label htmlFor={`${block.id}-t`} className="sr-only">
            Título do destaque
          </label>
          <input
            id={`${block.id}-t`}
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="Título do destaque"
            className="mb-2 w-full bg-transparent text-headline-h3 text-primary placeholder:text-text-tertiary focus-visible:outline-none"
          />
          <label htmlFor={block.id} className="sr-only">
            Texto do destaque
          </label>
          <textarea
            id={block.id}
            rows={2}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Explica o conceito em poucas linhas."
            className="w-full field-sizing-content resize-none bg-transparent text-body-md text-on-surface placeholder:text-text-tertiary focus-visible:outline-none"
          />
        </div>
      )}

      {block.type === "figure" && (
        <div className="grid gap-3 rounded-2xl border-2 border-dashed border-border-input p-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${block.id}-alt`} className="mb-1.5 block text-body-md font-bold text-on-surface">
              Descrição da imagem
              <span className="ml-1 font-medium text-text-tertiary">(lida por quem não a vê)</span>
            </label>
            <input
              id={`${block.id}-alt`}
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              className="min-h-11 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-3 text-body-md text-on-surface"
            />
          </div>
          <div>
            <label htmlFor={`${block.id}-cap`} className="mb-1.5 block text-body-md font-bold text-on-surface">
              Legenda
            </label>
            <input
              id={`${block.id}-cap`}
              value={block.caption}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              className="min-h-11 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-3 text-body-md text-on-surface"
            />
          </div>
        </div>
      )}

      {block.type === "quote" && (
        <div className="border-l-8 border-brand-ocean pl-4">
          <label htmlFor={block.id} className="sr-only">
            Texto da citação
          </label>
          <textarea
            id={block.id}
            rows={2}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Frase que resume a ideia central…"
            className="field-sizing-content w-full resize-none bg-transparent text-body-lg text-on-surface italic placeholder:text-text-tertiary focus-visible:outline-none"
          />
          <label htmlFor={`${block.id}-src`} className="sr-only">
            Fonte da citação
          </label>
          <input
            id={`${block.id}-src`}
            value={block.source ?? ""}
            onChange={(e) => onChange({ ...block, source: e.target.value })}
            placeholder="Fonte (opcional)"
            className="w-full bg-transparent text-caption text-text-tertiary focus-visible:outline-none"
          />
        </div>
      )}

      {block.type === "takeaways" && (
        <div className="rounded-2xl border-2 border-primary-fixed bg-surface-sky p-4">
          <label htmlFor={`${block.id}-t`} className="sr-only">
            Título dos princípios-chave
          </label>
          <input
            id={`${block.id}-t`}
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            className="mb-3 w-full bg-transparent text-headline-h3 text-primary focus-visible:outline-none"
          />
          <ol className="flex flex-col gap-2">
            {block.items.map((item, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
                <label htmlFor={`${block.id}-term-${i}`} className="sr-only">
                  Termo {i + 1}
                </label>
                <input
                  id={`${block.id}-term-${i}`}
                  value={item.term}
                  placeholder={`Termo ${i + 1}`}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      items: block.items.map((it, j) => (j === i ? { ...it, term: e.target.value } : it)),
                    })
                  }
                  className="min-h-11 rounded-xl border-2 border-border-input bg-surface-canvas px-3 text-body-md font-bold text-on-surface"
                />
                <label htmlFor={`${block.id}-text-${i}`} className="sr-only">
                  Explicação {i + 1}
                </label>
                <input
                  id={`${block.id}-text-${i}`}
                  value={item.text}
                  placeholder="Explicação em uma linha"
                  onChange={(e) =>
                    onChange({
                      ...block,
                      items: block.items.map((it, j) => (j === i ? { ...it, text: e.target.value } : it)),
                    })
                  }
                  className="min-h-11 rounded-xl border-2 border-border-input bg-surface-canvas px-3 text-body-md text-on-surface"
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => onChange({ ...block, items: [...block.items, { term: "", text: "" }] })}
            className="mt-2 flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button text-primary uppercase hover:bg-surface-canvas"
          >
            <Icon name="plus" size={18} />
            Adicionar princípio
          </button>
        </div>
      )}

      {block.type === "flow" && (
        <p className="rounded-xl border-2 border-dashed border-border-input p-4 text-caption text-text-secondary">
          Diagrama de fluxo com {block.steps.length} passos. A edição dos passos ainda não está no estúdio: por agora,
          estes diagramas são criados pela equipa pedagógica.
        </p>
      )}

      {block.type === "checkpoint" && <QuizBuilder block={block} onChange={onChange} />}
    </section>
  );
}
