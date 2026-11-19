import { useId, useRef, useState, type DragEvent } from "react";
import { AlertIcon, FileIcon, UploadIcon, XIcon } from "@/components/fluxo/icons";

const TIPOS: Record<string, string> = {
  "application/pdf": "PDF",
  "text/plain": "TXT",
  "text/markdown": "MD",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
};
const EXTENSOES = [".pdf", ".txt", ".md", ".jpg", ".jpeg", ".png", ".webp"];
const MAX_MB = 20;

function validarFicheiro(f: File): string | undefined {
  const ext = f.name.includes(".") ? f.name.slice(f.name.lastIndexOf(".")).toLowerCase() : "";
  if (!(f.type in TIPOS) && !EXTENSOES.includes(ext)) return "Formato não suportado. Usa PDF, TXT, MD ou uma imagem (JPG, PNG).";
  if (f.size > MAX_MB * 1024 * 1024) return `O ficheiro tem mais de ${MAX_MB} MB. Divide-o ou comprime-o primeiro.`;
  if (f.size === 0) return "O ficheiro está vazio.";
  return undefined;
}

const tamanho = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} kB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

type Props = { ficheiro: File | null; onFicheiro: (f: File | null) => void; erro?: string; onErro: (msg?: string) => void };

/** Ficheiro da matéria: arrastar e largar ou escolher. Só vive em memória até ser enviado. */
export function FileDropzone({ ficheiro, onFicheiro, erro, onErro }: Props) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [sobre, setSobre] = useState(false);

  function aceitar(f: File | undefined) {
    if (!f) return;
    const e = validarFicheiro(f);
    onErro(e);
    onFicheiro(e ? null : f);
  }

  function aoLargar(e: DragEvent) {
    e.preventDefault();
    setSobre(false);
    aceitar(e.dataTransfer.files[0]);
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.8rem] font-bold tracking-[0.06em] uppercase">Ficheiro da matéria</label>
        <span className="text-xs font-medium text-neutral-600">PDF, TXT, MD, imagem · até {MAX_MB} MB</span>
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        className="sr-only"
        accept={[...Object.keys(TIPOS), ...EXTENSOES].join(",")}
        aria-describedby={erro ? `${id}-erro` : undefined}
        aria-invalid={erro ? true : undefined}
        onChange={(e) => {
          aceitar(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {ficheiro ? (
        <div className="flex items-center gap-3.5 rounded-2xl bg-kombinu-blue-soft p-4 ring-2 ring-kombinu-blue ring-inset">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-kombinu-blue text-white"><FileIcon className="size-6" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display font-bold" title={ficheiro.name}>{ficheiro.name}</span>
            <span className="text-sm text-neutral-600">{tamanho(ficheiro.size)} · pronto para enviar</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onFicheiro(null);
              input.current?.focus();
            }}
            aria-label={`Remover ${ficheiro.name}`}
            className="grid size-11 shrink-0 place-items-center rounded-xl text-neutral-600 hover:bg-white hover:text-kombinu-ink focus-ring"
          >
            <XIcon className="size-5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setSobre(true);
          }}
          onDragLeave={() => setSobre(false)}
          onDrop={aoLargar}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-[background-color,border-color] duration-150 ${
            erro ? "border-kombinu-danger bg-kombinu-danger-soft" : sobre ? "border-kombinu-blue bg-kombinu-blue-soft" : "border-neutral-300 bg-kombinu-surface hover:border-kombinu-blue/50"
          }`}
        >
          <span className="grid size-12 place-items-center rounded-full bg-white text-kombinu-blue shadow-sm"><UploadIcon className="size-6" /></span>
          <span className="font-display font-bold">Escolher ficheiro</span>
          <span className="max-w-[30ch] text-sm text-neutral-600">A sebenta, os slides do professor ou uma foto dos teus apontamentos.</span>
        </label>
      )}
      {erro && (
        <p id={`${id}-erro`} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-700 motion-safe:animate-fade-in">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {erro}
        </p>
      )}
    </div>
  );
}
