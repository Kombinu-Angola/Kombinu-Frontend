import { Button3D } from "../../components/ui/Button3D";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import { useAlvosDoCriador } from "../../hooks/useTrilhas";
import type { AlvoDeTrilha } from "../../services/trilhaService";

type TrailTargetPickerProps = {
  /** `artigo` escolhe um conteúdo; `simulado` escolhe um conteúdo que já tem quiz. */
  kind: "artigo" | "simulado";
  onPick: (alvo: AlvoDeTrilha) => void;
  onClose: () => void;
};

/** Diálogo para escolher o conteúdo ou o simulado real que passa a ser um passo da trilha. */
export function TrailTargetPicker({ kind, onPick, onClose }: TrailTargetPickerProps) {
  const panelRef = useDialogBehavior<HTMLDivElement>(onClose);
  const { data, isLoading, isError } = useAlvosDoCriador(true);
  const opcoes = (data ?? []).filter((a) => (kind === "simulado" ? a.quizId !== null : true));
  const titulo = kind === "artigo" ? "Escolhe o artigo do teu estúdio" : "Escolhe o simulado do teu banco";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-ink/40 p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trail-picker-title"
        className="flex max-h-[80dvh] w-full max-w-[520px] flex-col gap-4 overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay"
      >
        <h2 id="trail-picker-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
          {titulo}
        </h2>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading && <p className="text-body-md text-text-secondary">A carregar os teus conteúdos…</p>}
          {isError && (
            <p role="alert" className="text-body-md text-feedback-error-ink">
              Não foi possível carregar os conteúdos. Tenta de novo.
            </p>
          )}
          {!isLoading && !isError && opcoes.length === 0 && (
            <p className="text-body-md text-text-secondary">
              {kind === "simulado"
                ? "Ainda não tens conteúdos com simulado. Gera um quiz num conteúdo e volta aqui."
                : "Ainda não tens conteúdos neste espaço. Publica um conteúdo e volta aqui."}
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {opcoes.map((alvo) => (
              <li key={alvo.conteudoId}>
                <button
                  type="button"
                  onClick={() => onPick(alvo)}
                  className="min-h-12 w-full rounded-xl border-2 border-border-cloud px-4 py-2 text-left text-body-md font-bold text-on-surface transition-colors hover:border-primary hover:bg-surface-sky"
                >
                  {alvo.titulo}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <Button3D variant="ghost" onClick={onClose}>
          Cancelar
        </Button3D>
      </div>
    </div>
  );
}
