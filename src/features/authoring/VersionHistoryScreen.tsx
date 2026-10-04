import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { ConsentCheckbox } from "../../components/ui/ConsentCheckbox";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { VersionEntry } from "./types";

const STATUS = {
  publicada: { label: "Publicada", className: "bg-surface-forest text-feedback-success" },
  rascunho: { label: "Rascunho", className: "bg-secondary-fixed text-on-secondary-fixed-variant" },
  arquivada: { label: "Arquivada", className: "border-2 border-border-cloud bg-surface-canvas text-text-secondary" },
} as const;

const CHANGE = {
  adicionado: { icon: "plus", tone: "text-feedback-success-ink", label: "Adicionado" },
  alterado: { icon: "edit", tone: "text-feedback-streak-ink", label: "Alterado" },
  removido: { icon: "trash", tone: "text-feedback-error-ink", label: "Removido" },
} as const;

type VersionHistoryScreenProps = { materialTitle: string; versions: VersionEntry[]; creatorName: string };

/** Histórico de versões: o que mudou, quem está em cada versão e como restaurar sem perder nada. */
export default function VersionHistoryScreen({ materialTitle, versions, creatorName }: VersionHistoryScreenProps) {
  const [selectedId, setSelectedId] = useState(versions[0].id);
  const [restoring, setRestoring] = useState<VersionEntry | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const toast = useToast();

  const selected = versions.find((v) => v.id === selectedId)!;
  const published = versions.find((v) => v.status === "publicada");

  return (
    <CreatorShell active="materiais" creatorName={creatorName}>
      <div className="mx-auto max-w-[1080px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href="/v2/estudio/materiais" className="hover:text-primary">
            Os meus materiais
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            Histórico de versões
          </span>
        </nav>

        <header className="mb-6">
          <h1 className="font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            {materialTitle}
          </h1>
          <p className="mt-1 text-body-md text-text-secondary tabular-nums">
            {versions.length} versões registadas.
            {published && ` A versão publicada é a ${published.label.toLowerCase()}, com ${published.readersOnVersion} estudantes a lê-la.`}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section aria-labelledby="list-title" className="lg:col-span-5">
            <h2 id="list-title" className="mb-3 text-overline text-text-tertiary uppercase">
              Versões
            </h2>
            <ol className="flex flex-col gap-3">
              {versions.map((version) => {
                const active = version.id === selectedId;
                return (
                  <li key={version.id}>
                    <button
                      type="button"
                      aria-current={active ? "true" : undefined}
                      onClick={() => setSelectedId(version.id)}
                      className={cn(
                        "w-full rounded-2xl border-2 p-4 text-left transition-[border-color,background-color] duration-150",
                        active ? "border-brand-ocean bg-surface-sky" : "border-border-cloud bg-surface-canvas hover:border-brand-ocean",
                      )}
                    >
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-headline-h3 text-on-surface">{version.label}</span>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-overline uppercase", STATUS[version.status].className)}>
                          {STATUS[version.status].label}
                        </span>
                      </span>
                      <span className="mt-1 block text-caption text-text-secondary">{version.summary}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-2 text-caption text-text-tertiary tabular-nums">
                        <Icon name="clock" size={13} />
                        {formatActivityTime(version.at)}
                        <span aria-hidden="true">·</span>
                        {version.author}
                        {version.readersOnVersion > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-bold text-primary">{version.readersOnVersion} leitores</span>
                          </>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="diff-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 lg:col-span-7 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-cloud pb-4">
              <div>
                <h2 id="diff-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                  O que mudou na {selected.label.toLowerCase()}
                </h2>
                <p className="text-caption text-text-secondary tabular-nums">
                  {formatActivityTime(selected.at)} · {selected.changes.length} alterações
                </p>
              </div>
              {selected.status !== "publicada" && (
                <Button3D variant="ghost" onClick={() => setRestoring(selected)} leadingIcon={<Icon name="refresh" size={18} />}>
                  Restaurar esta versão
                </Button3D>
              )}
            </div>

            <ul className="mt-4 flex flex-col gap-3">
              {selected.changes.map((change) => {
                const meta = CHANGE[change.kind];
                return (
                  <li key={change.text} className="flex items-start gap-3 rounded-xl bg-surface-soft p-3">
                    <span className={cn("mt-0.5 shrink-0", meta.tone)}>
                      <Icon name={meta.icon} size={18} />
                    </span>
                    <span>
                      <span className="block text-overline text-text-tertiary uppercase">{meta.label}</span>
                      <span className="block text-body-md text-on-surface">{change.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>

            {selected.readersOnVersion > 0 && (
              <p className="mt-5 flex items-start gap-2 rounded-2xl border-2 border-brand-ocean bg-surface-sky p-4 text-caption text-text-secondary tabular-nums">
                <Icon name="users" size={18} className="mt-0.5 shrink-0 text-primary" />
                {selected.readersOnVersion} estudantes estão nesta versão. Se restaurares outra, eles terminam esta
                antes de verem a mudança.
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2 border-t-2 border-border-cloud pt-4">
              <Button3D variant="ghost" onClick={() => (window.location.assign("/v2/estudio"))} leadingIcon={<Icon name="edit" size={18} />}>
                Abrir no estúdio
              </Button3D>
              <Button3D variant="ghost" onClick={() => toast.show("Rascunho criado a partir desta versão.")} leadingIcon={<Icon name="plus" size={18} />}>
                Criar rascunho a partir desta
              </Button3D>
            </div>
          </section>
        </div>
      </div>

      {restoring && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-surface-ink/60 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="restore-title" className="w-full max-w-md rounded-3xl bg-surface-canvas p-6 shadow-clay">
            <h2 id="restore-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Restaurar a {restoring.label.toLowerCase()}?
            </h2>
            <p className="mt-2 text-body-md text-text-secondary">
              O conteúdo atual não se perde: fica guardado como versão nova. Quem está a ler continua onde está até
              terminar.
            </p>

            <div className="mt-4">
              <ConsentCheckbox
                id="restore-consent"
                checked={confirmed}
                onChange={setConfirmed}
                title="Confirmo a reversão"
              >
                As alterações pedagógicas feitas depois desta versão deixam de estar publicadas, mas continuam
                guardadas no histórico.
              </ConsentCheckbox>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button3D
                variant="ghost"
                onClick={() => {
                  setRestoring(null);
                  setConfirmed(false);
                }}
              >
                Cancelar
              </Button3D>
              <Button3D
                disabled={!confirmed}
                onClick={() => {
                  toast.show(`${restoring.label} restaurada como nova versão.`);
                  setRestoring(null);
                  setConfirmed(false);
                }}
              >
                Restaurar
              </Button3D>
            </div>
          </div>
        </div>
      )}
    </CreatorShell>
  );
}
