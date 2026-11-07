import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { AddBlockMenu } from "./AddBlockMenu";
import { BlockEditor } from "./BlockEditor";
import { StudioPreview } from "./StudioPreview";
import { useDraft, useSavedLabel, type Draft } from "./useDraft";
import { PricingModal } from "../creator-content/PricingModal";

type StudioScreenProps = {
  initialDraft: Draft;
  authorName: string;
  courseName: string;
  /** Mantido para compatibilidade; a saída passou para a gaveta do modo criador. */
  onExit?: () => void;
  onSave?: (draft: Draft) => Promise<void>;
  onPublish?: (draft: Draft) => void;
};

/** Creator Studio: editor de blocos com guardar automático e pré-visualização. */
export default function StudioScreen({
  initialDraft,
  authorName,
  courseName,
  onSave,
  onPublish,
}: StudioScreenProps) {
  const { draft, dispatch, savedAt, saving } = useDraft(initialDraft, onSave);
  const savedLabel = useSavedLabel(savedAt, saving);
  const [preview, setPreview] = useState(false);
  const [pricing, setPricing] = useState(false);

  const incomplete = [
    !draft.title.trim() && "um título",
    draft.blocks.length === 0 && "pelo menos um bloco",
    draft.blocks.some((b) => b.type === "checkpoint" && (!b.question.trim() || b.options.some((o) => !o.text.trim()))) &&
      "os checkpoints preenchidos",
  ].filter(Boolean) as string[];

  if (preview) return <StudioPreview draft={draft} authorName={authorName} onBack={() => setPreview(false)} />;

  return (
    <CreatorShell
      active="estudio"
      creatorName={authorName}
      actions={
        <>
          <Button3D variant="ghost" onClick={() => setPreview(true)} leadingIcon={<Icon name="eye" size={18} />}>
            Ver como aluno
          </Button3D>
          <Button3D
            onClick={() => setPricing(true)}
            disabled={incomplete.length > 0}
            aria-describedby={incomplete.length > 0 ? "publish-hint" : undefined}
          >
            Publicar
          </Button3D>
        </>
      }
    >
      <div className="mx-auto w-full max-w-[820px] flex-1 px-4 py-8 md:px-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-cloud pb-4">
          <h1 className="font-montserrat text-headline-h2 text-on-surface">Rascunho em {courseName}</h1>
          <p role="status" className="flex items-center gap-1.5 text-caption text-text-tertiary">
            <Icon name="cloud" size={16} />
            {savedLabel}
          </p>
        </header>

        <div className="mb-8">
          <label htmlFor="draft-title" className="sr-only">
            Título do resumo
          </label>
          <input
            id="draft-title"
            value={draft.title}
            onChange={(e) => dispatch({ type: "field", field: "title", value: e.target.value })}
            placeholder="Título do resumo ou aula…"
            className="w-full rounded-xl border-2 border-transparent bg-transparent p-2 font-montserrat text-headline-h1-mobile font-extrabold text-on-surface placeholder:text-text-tertiary hover:border-border-cloud focus-visible:border-brand-sky-ink sm:text-display-l"
          />
          <label htmlFor="draft-subtitle" className="sr-only">
            Subtítulo
          </label>
          <input
            id="draft-subtitle"
            value={draft.subtitle}
            onChange={(e) => dispatch({ type: "field", field: "subtitle", value: e.target.value })}
            placeholder="Subtítulo descritivo…"
            className="mt-2 w-full rounded-xl border-2 border-transparent bg-transparent p-2 font-montserrat text-headline-h3 text-text-secondary placeholder:text-text-tertiary hover:border-border-cloud focus-visible:border-brand-sky-ink"
          />
        </div>

        <div className="flex flex-col gap-2">
          {draft.blocks.map((block, i) => (
            <BlockEditor
              key={block.id}
              block={block}
              index={i}
              total={draft.blocks.length}
              onChange={(updated) => dispatch({ type: "update", block: updated })}
              onRemove={() => dispatch({ type: "remove", id: block.id })}
              onMove={(direction) => dispatch({ type: "move", id: block.id, direction })}
            />
          ))}
        </div>

        <div className="mt-6">
          <AddBlockMenu onAdd={(kind) => dispatch({ type: "add", kind })} />
        </div>

        {incomplete.length > 0 && (
          <p id="publish-hint" className="mt-8 flex items-start gap-2 text-body-md text-text-secondary">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
            Para publicares, falta {incomplete.join(", ")}.
          </p>
        )}
      </div>

      {pricing && (
        <PricingModal
          plan="pro"
          mode="publicar"
          material={{
            id: "draft",
            title: draft.title || "Sem título",
            subject: courseName,
            university: "UAN",
            year: "—",
            pages: Math.max(1, Math.round(draft.blocks.length / 2)),
            quizzes: draft.blocks.filter((b) => b.type === "checkpoint").length,
            sizeKb: 120 + draft.blocks.length * 18,
            priceKz: 0,
            visibility: "publico",
            sales: 0,
            rating: null,
            reviews: 0,
            status: "rascunho",
            updatedAt: new Date().toISOString(),
            studioHref: "/v2/estudio",
          }}
          onClose={() => setPricing(false)}
          onConfirm={() => {
            setPricing(false);
            onPublish?.(draft);
            window.location.assign("/v2/estudio/materiais");
          }}
        />
      )}
    </CreatorShell>
  );
}
