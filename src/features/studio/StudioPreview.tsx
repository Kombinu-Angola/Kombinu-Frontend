import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { BlockRenderer } from "../content/BlockRenderer";
import { ArticleToc } from "../reading/ArticleToc";
import type { Draft } from "./useDraft";

type StudioPreviewProps = { draft: Draft; authorName: string; onBack: () => void };

/** Pré-visualização: o criador vê o rascunho como o estudante o vai ver. Sem XP. */
export function StudioPreview({ draft, authorName, onBack }: StudioPreviewProps) {
  const headingRef = useFocusOnMount();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 border-b-2 border-border-cloud bg-surface-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-button text-primary transition-[background-color] duration-150 hover:bg-surface-soft"
          >
            <Icon name="arrow-left" size={20} />
            Voltar ao estúdio
          </button>
          <p className="hidden items-center gap-2 text-caption font-bold text-text-secondary sm:flex">
            <Icon name="eye" size={18} />
            Pré-visualização — nada é guardado nem dá XP
          </p>
          <Button3D variant="secondary" onClick={onBack}>
            Continuar a editar
          </Button3D>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-1 gap-8 px-4 py-8 md:px-6 lg:grid-cols-[220px_minmax(0,740px)] lg:py-12">
        <ArticleToc blocks={draft.blocks} />

        <article className="min-w-0">
          <header className="mb-8 border-b-2 border-border-cloud pb-6">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mb-3 font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
            >
              {draft.title || "Sem título"}
            </h1>
            {draft.subtitle && <p className="mb-5 text-body-lg text-text-secondary">{draft.subtitle}</p>}
            <p className="flex items-center gap-3">
              <Avatar name={authorName} />
              <span>
                <span className="block text-body-md font-bold text-on-surface">{authorName}</span>
                <span className="block text-caption text-text-tertiary">Rascunho · hoje</span>
              </span>
            </p>
          </header>

          {draft.blocks.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
              Ainda não há blocos para mostrar.
            </p>
          ) : (
            <BlockRenderer blocks={draft.blocks} mode="preview" />
          )}
        </article>
      </main>
    </div>
  );
}
