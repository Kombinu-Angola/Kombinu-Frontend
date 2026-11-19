import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AlertIcon, FileIcon, UploadIcon, XIcon } from "@/components/fluxo/icons";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function formatarTamanho(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

const ERRO = "mt-2 flex items-start gap-1.5 text-sm font-medium text-red-700 motion-safe:animate-fade-in";

/** Escolha de ficheiro com o aspecto dos campos do fluxo. O ficheiro só vive em memória até ser enviado. */
export function ArquivoCampo({
  label, dica, aceita, ficheiro, onChange, erro,
}: {
  label: string;
  dica: string;
  /** Valor do atributo `accept` (ex.: ".pdf,.jpg,.png"). */
  aceita: string;
  ficheiro: File | null;
  onChange: (f: File | null) => void;
  erro?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const mostrado = aviso ?? erro ?? undefined;

  function escolher(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      setAviso(`O ficheiro tem ${formatarTamanho(f.size)}. O máximo é 10 MB.`);
      return;
    }
    setAviso(null);
    onChange(f);
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.8rem] font-bold tracking-[0.06em] uppercase">{label}</label>
      <input
        ref={input}
        id={id}
        type="file"
        accept={aceita}
        aria-invalid={mostrado ? true : undefined}
        aria-describedby={mostrado ? `${id}-erro` : `${id}-dica`}
        className="sr-only"
        onChange={(e) => {
          escolher(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {ficheiro ? (
        <div className="flex items-center gap-3 rounded-2xl bg-kombinu-surface p-3 pl-4">
          <FileIcon className="size-5 shrink-0 text-kombinu-blue" />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold">{ficheiro.name}</span>
            <span className="block text-sm text-neutral-600">{formatarTamanho(ficheiro.size)}</span>
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remover ${ficheiro.name}`}
            className="grid size-11 shrink-0 place-items-center rounded-xl text-neutral-600 hover:bg-white hover:text-kombinu-ink focus-ring"
          >
            <XIcon className="size-5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`flex min-h-24 w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed bg-white px-4 py-4 text-center hover:bg-neutral-50 focus-ring ${mostrado ? "border-red-600" : "border-neutral-300"}`}
        >
          <UploadIcon className="size-6 text-kombinu-blue" />
          <span className="font-bold">Escolher ficheiro</span>
        </button>
      )}
      {!mostrado && <p id={`${id}-dica`} className="mt-2 text-sm font-medium text-neutral-600">{dica}</p>}
      {mostrado && (
        <p id={`${id}-erro`} className={ERRO}>
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {mostrado}
        </p>
      )}
    </div>
  );
}

/** Lista de cadeiras em etiquetas: Enter ou vírgula adicionam, o X remove. */
export function CadeirasCampo({
  valor, onChange, erro, max = 8,
}: {
  valor: string[];
  onChange: (v: string[]) => void;
  erro?: string;
  max?: number;
}) {
  const id = useId();
  const [texto, setTexto] = useState("");

  function adicionar() {
    const t = texto.trim().replace(/,$/, "").trim();
    if (!t || valor.length >= max || valor.some((v) => v.toLowerCase() === t.toLowerCase())) {
      setTexto("");
      return;
    }
    onChange([...valor, t.slice(0, 80)]);
    setTexto("");
  }

  function aoTecla(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      adicionar();
    } else if (e.key === "Backspace" && !texto && valor.length) {
      onChange(valor.slice(0, -1));
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.8rem] font-bold tracking-[0.06em] uppercase">Cadeiras que queres ensinar</label>
      <div className={`flex min-h-14 flex-wrap items-center gap-2 rounded-2xl bg-kombinu-surface px-3 py-2 ring-inset ${erro ? "ring-2 ring-red-600" : "focus-within:ring-2 focus-within:ring-kombinu-blue"}`}>
        {valor.map((c) => (
          <span key={c} className="inline-flex items-center gap-1 rounded-full bg-white py-1 pr-1 pl-3 text-sm font-bold ring-1 ring-neutral-200">
            {c}
            <button
              type="button"
              onClick={() => onChange(valor.filter((v) => v !== c))}
              aria-label={`Remover ${c}`}
              className="grid size-8 place-items-center rounded-full text-neutral-600 hover:bg-kombinu-surface focus-ring"
            >
              <XIcon className="size-4" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={texto}
          maxLength={80}
          disabled={valor.length >= max}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={aoTecla}
          onBlur={adicionar}
          aria-invalid={erro ? true : undefined}
          aria-describedby={`${id}-dica`}
          placeholder={valor.length ? "Outra cadeira" : "Ex.: Macroeconomia I"}
          className="h-10 min-w-[10rem] flex-1 bg-transparent text-base outline-none placeholder:text-neutral-500"
        />
      </div>
      {!erro && <p id={`${id}-dica`} className="mt-2 text-sm font-medium text-neutral-600">Escreve e carrega em Enter. Até {max} cadeiras.</p>}
      {erro && (
        <p id={`${id}-dica`} className={ERRO}>
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {erro}
        </p>
      )}
    </div>
  );
}
