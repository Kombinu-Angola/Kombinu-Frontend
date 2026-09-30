import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { describedBy, FieldShell, inputClasses } from "./Field";
import { Icon } from "./Icon";

type TagInputProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
  placeholder?: string;
  /** Nome no singular para as mensagens: "cadeira". */
  itemName?: string;
};

/** Lista de etiquetas (cadeiras). Enter ou vírgula adicionam; cada etiqueta tem botão de remover. */
export function TagInput({
  id,
  label,
  hint,
  error,
  required,
  values,
  onChange,
  max = 8,
  placeholder,
  itemName = "item",
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const listId = useId();
  const full = values.length >= max;

  function add() {
    const value = draft.trim().replace(/\s+/g, " ");
    if (!value) return;
    if (values.some((v) => v.toLocaleLowerCase("pt") === value.toLocaleLowerCase("pt"))) {
      setAnnouncement(`${value} já está na lista.`);
      return;
    }
    if (full) {
      setAnnouncement(`Pode adicionar até ${max} de cada vez.`);
      return;
    }
    onChange([...values, value]);
    setDraft("");
    setAnnouncement(`${value} adicionada. ${values.length + 1} de ${max}.`);
  }

  function remove(value: string) {
    onChange(values.filter((v) => v !== value));
    setAnnouncement(`${value} removida.`);
    document.getElementById(id)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add();
    }
  }

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      {values.length > 0 && (
        <ul id={listId} aria-label={`${itemName}s adicionadas`} className="flex flex-wrap gap-2">
          {values.map((value) => (
            <li
              key={value}
              className="inline-flex min-h-9 items-center gap-1 rounded-full bg-primary-fixed py-1 pr-1 pl-3 text-caption text-on-primary-fixed"
            >
              {value}
              <button
                type="button"
                onClick={() => remove(value)}
                aria-label={`Remover ${value}`}
                className="flex size-7 items-center justify-center rounded-full transition-[background-color] duration-150 hover:bg-white/70"
              >
                <Icon name="x" size={14} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={full}
          enterKeyHint="done"
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(describedBy(id, hint, error), values.length > 0 && listId) || undefined}
          className={inputClasses}
        />
        <button
          type="button"
          onClick={add}
          disabled={full || !draft.trim()}
          className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-xl border-2 border-brand-ocean px-4 text-button text-primary transition-[background-color] duration-150 hover:bg-surface-sky disabled:border-border-cloud disabled:text-text-tertiary"
        >
          <Icon name="plus" size={18} />
          Adicionar
        </button>
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </FieldShell>
  );
}
