import { useRef, useState, type DragEvent, type ReactNode } from "react";
import type { Asset3DName } from "../../lib/assets3d";
import { cn } from "@/lib/utils";
import { Asset3D } from "./Asset3D";
import { describedBy, FieldError, hintId } from "./Field";
import { Icon } from "./Icon";

const mb = new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 1 });
export const formatMB = (bytes: number) => `${mb.format(bytes / (1024 * 1024))} MB`;

type FileDropzoneProps = {
  id: string;
  title: ReactNode;
  badge?: ReactNode;
  description: ReactNode;
  /** Extensões aceites, sem ponto: ["pdf", "png"]. */
  extensions: string[];
  maxBytes: number;
  buttonLabel: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
  variant?: "full" | "compact";
  asset?: Asset3DName;
  footnote?: ReactNode;
  /** Nível do título, para manter a hierarquia da página. */
  headingLevel?: "h2" | "h3";
};

function extensionOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Zona de envio: arrastar e largar é um extra — o botão (input nativo) é sempre a via principal,
 * por isso funciona com teclado, leitor de ecrã e toque (WCAG 2.5.7).
 * Valida formato e tamanho no cliente antes de gastar dados a enviar.
 */
export function FileDropzone({
  id,
  title,
  badge,
  description,
  extensions,
  maxBytes,
  buttonLabel,
  file,
  onChange,
  error,
  required,
  variant = "full",
  asset = "document-upload",
  footnote,
  headingLevel: Heading = "h2",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const [announcement, setAnnouncement] = useState("");
  const shownError = localError ?? error;
  const formats = extensions
    .filter((e) => !(e === "jpeg" && extensions.includes("jpg")))
    .map((e) => e.toUpperCase())
    .join(", ");

  function accept(candidate: File | undefined) {
    if (!candidate) return;
    if (!extensions.includes(extensionOf(candidate.name))) {
      setLocalError(`Formato não aceite. Use ${formats}.`);
      return;
    }
    if (candidate.size > maxBytes) {
      setLocalError(`O ficheiro tem ${formatMB(candidate.size)}. Carregue um ficheiro até ${formatMB(maxBytes)}.`);
      return;
    }
    setLocalError(undefined);
    onChange(candidate);
    setAnnouncement(`${candidate.name} adicionado.`);
  }

  function clear() {
    onChange(null);
    setAnnouncement("Ficheiro removido.");
    inputRef.current?.focus();
  }

  const dragHandlers = {
    onDragEnter: (e: DragEvent) => {
      e.preventDefault();
      dragDepth.current += 1;
      setDragging(true);
    },
    onDragOver: (e: DragEvent) => e.preventDefault(),
    onDragLeave: () => {
      dragDepth.current -= 1;
      if (dragDepth.current <= 0) setDragging(false);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      accept(e.dataTransfer.files[0]);
    },
  };

  const compact = variant === "compact";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Heading id={`${id}-title`} className="text-headline-h3 text-on-surface">
          {title}
          {required && <span className="sr-only"> (obrigatório)</span>}
        </Heading>
        {badge}
      </div>
      <p id={hintId(id)} className="-mt-1 text-body-md text-text-secondary">
        {description}
      </p>

      <div
        {...dragHandlers}
        className={cn(
          "rounded-2xl border-2 border-dashed transition-[border-color,background-color] duration-150",
          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
          dragging ? "border-brand-ocean bg-surface-sky" : "border-border-input bg-surface-soft hover:border-brand-ocean",
          shownError && !dragging && "border-feedback-error-ink",
          compact ? "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between" : "p-6 text-center sm:p-8",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={extensions.map((e) => `.${e}`).join(",")}
          className="sr-only"
          aria-labelledby={`${id}-title ${id}-button`}
          aria-describedby={describedBy(id, true, shownError)}
          aria-invalid={shownError ? true : undefined}
          required={required && !file}
          onChange={(e) => {
            accept(e.target.files?.[0]);
            e.target.value = ""; // permite escolher o mesmo ficheiro de novo
          }}
        />

        <div className={cn("flex items-center gap-3", !compact && "flex-col")}>
          <Asset3D name={asset} alt="" size={compact ? 40 : 56} />
          <div className={cn(!compact && "text-center")}>
            {!compact && (
              <p className="text-body-md font-bold text-on-surface">
                <span className="hidden sm:inline">Arraste o ficheiro para aqui ou use o botão</span>
                <span className="sm:hidden">Toque no botão para escolher o ficheiro</span>
              </p>
            )}
            <p className="text-caption text-text-tertiary">
              {formats} · até {formatMB(maxBytes)}
            </p>
          </div>
        </div>

        <label
          id={`${id}-button`}
          htmlFor={id}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-brand-ocean bg-surface-canvas px-5 text-button text-primary uppercase",
            "shadow-3d-neutral transition-[translate,box-shadow,background-color] duration-150 hover:bg-surface-sky active:translate-y-1 active:shadow-none",
            !compact && "mt-4",
          )}
        >
          <Icon name={compact ? "paperclip" : "upload"} size={18} />
          {file ? "Trocar ficheiro" : buttonLabel}
        </label>

        {footnote && !compact && <div className="mt-4">{footnote}</div>}
      </div>

      {file && (
        <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-feedback-success bg-surface-canvas p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-feedback-success-soft text-overline text-feedback-success-ink uppercase">
              {extensionOf(file.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-body-md font-bold text-on-surface">{file.name}</p>
              <p className="flex items-center gap-1 text-caption text-feedback-success-ink">
                <Icon name="check" size={14} strokeWidth={2.5} />
                {formatMB(file.size)} · pronto para enviar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            aria-label={`Remover ${file.name}`}
            className="min-h-11 shrink-0 rounded-full px-3 text-caption font-bold text-text-secondary transition-[color,background-color] duration-150 hover:bg-feedback-error-soft hover:text-feedback-error-ink"
          >
            Remover
          </button>
        </div>
      )}

      <FieldError id={id} error={shownError} />
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
