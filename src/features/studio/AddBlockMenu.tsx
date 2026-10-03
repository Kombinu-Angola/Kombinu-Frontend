import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../../components/ui/Icon";
import type { BlockKind } from "./useDraft";

const ITEMS: Array<{ kind: BlockKind; label: string; icon: IconName; hint?: string }> = [
  { kind: "paragraph", label: "Texto / parágrafo", icon: "file" },
  { kind: "callout", label: "Destaque de conceito", icon: "lightbulb" },
  { kind: "takeaways", label: "Princípios-chave", icon: "list" },
  { kind: "quote", label: "Citação em destaque", icon: "comment" },
  { kind: "figure", label: "Infográfico ou imagem", icon: "image", hint: "leve" },
  { kind: "checkpoint", label: "Checkpoint / quiz", icon: "bolt", hint: "+20 XP" },
];

/** Menu de blocos. Abre com o botão "+", fecha com Escape ou clique fora, e devolve o foco. */
export function AddBlockMenu({ onAdd }: { onAdd: (kind: BlockKind) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 items-center gap-2 rounded-full border-2 border-dashed border-border-input px-5 text-button text-text-secondary uppercase transition-[border-color,color,background-color] duration-150 hover:border-brand-ocean hover:bg-surface-sky hover:text-primary"
      >
        <Icon name="plus" size={20} />
        Adicionar bloco
      </button>

      {open && (
        <ul
          role="menu"
          aria-label="Tipos de bloco"
          className="absolute bottom-full left-0 z-20 mb-2 w-72 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-2 shadow-clay"
        >
          {ITEMS.map((item) => (
            <li key={item.kind} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onAdd(item.kind);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-body-md text-on-surface transition-[background-color] duration-150 hover:bg-surface-soft"
              >
                <Icon name={item.icon} size={20} className="shrink-0 text-primary" />
                {item.label}
                {item.hint && (
                  <span className="ml-auto rounded-full bg-surface-forest px-2 py-0.5 text-overline text-feedback-success uppercase">
                    {item.hint}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
