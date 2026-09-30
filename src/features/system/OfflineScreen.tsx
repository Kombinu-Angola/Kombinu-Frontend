import { useEffect, useState, type ReactNode } from "react";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { formatSize } from "../../lib/format";
import { cn } from "@/lib/utils";

export function StateShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-4 py-8">
      <header className="mb-6">
        <a href="/v2/trilhas" className="font-montserrat text-headline-h2 font-extrabold text-primary">
          Kombinu
        </a>
      </header>
      <main id="conteudo" className="w-full max-w-[640px]">
        {children}
      </main>
    </div>
  );
}

type OfflineScreenProps = {
  offlineItems: number;
  cachedKb: number;
  pendingAnswers: number;
  streakDays: number;
  libraryHref: string;
};

/** Sem ligação: diz o que continua a funcionar antes de pedir para tentar de novo. */
export function OfflineScreen({ offlineItems, cachedKb, pendingAnswers, streakDays, libraryHref }: OfflineScreenProps) {
  const headingRef = useFocusOnMount();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <StateShell>
      <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 text-center shadow-clay sm:p-8">
        <Asset3D name="kombi-offline" alt="" size={112} priority className="mx-auto mb-4" />

        <p className="inline-flex items-center gap-2 rounded-full border-2 border-feedback-streak bg-surface-canvas px-3.5 py-1 text-overline text-feedback-streak-ink uppercase">
          <Icon name="signal" size={15} />
          Sem ligação à internet
        </p>

        <h1 ref={headingRef} tabIndex={-1} className="mt-3 font-montserrat text-headline-h1-mobile text-on-surface outline-none">
          Continua a estudar offline
        </h1>
        <p className="mx-auto mt-2 max-w-md text-body-md text-pretty text-text-secondary">
          O teu progresso está guardado no telemóvel. Nada se perde enquanto a rede não voltar.
        </p>

        <ul className="mt-6 flex flex-col gap-3 rounded-2xl bg-surface-soft p-4 text-left sm:p-5">
          {[
            {
              icon: "check" as const,
              tone: "text-feedback-success-ink",
              text: `Tens ${offlineItems} sebentas descarregadas, prontas a ler.`,
            },
            {
              icon: "refresh" as const,
              tone: "text-primary",
              text:
                pendingAnswers > 0
                  ? `${pendingAnswers} respostas ficam em fila e sincronizam assim que a rede voltar.`
                  : "Não há nada por sincronizar.",
            },
            {
              icon: "flame" as const,
              tone: "text-feedback-streak-ink",
              text: `A tua ofensiva de ${streakDays} dias conta na mesma: o que fizeres offline é registado.`,
            },
          ].map((row) => (
            <li key={row.text} className="flex items-start gap-2.5 text-body-md text-on-surface">
              <Icon name={row.icon} size={20} className={cn("mt-0.5 shrink-0", row.tone)} />
              {row.text}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-3">
          <LinkButton3D href={libraryHref} size="lg" fullWidth trailingIcon={<Icon name="arrow-right" size={20} />}>
            Abrir as minhas sebentas
          </LinkButton3D>
          <Button3D
            variant="ghost"
            fullWidth
            onClick={() => {
              setChecking(true);
              window.setTimeout(() => {
                setOnline(navigator.onLine);
                setChecking(false);
              }, 1200);
            }}
            leadingIcon={<Icon name="refresh" size={18} />}
          >
            {checking ? "A verificar a ligação…" : "Tentar de novo"}
          </Button3D>
        </div>

        <p role="status" className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t-2 border-border-cloud pt-4 text-caption text-text-tertiary tabular-nums">
          <span className="flex items-center gap-1">
            <Icon name="cloud" size={14} />
            {formatSize(cachedKb)} guardados no telemóvel
          </span>
          <span aria-hidden="true">·</span>
          <span className={cn("flex items-center gap-1 font-bold", online ? "text-feedback-success-ink" : "text-text-tertiary")}>
            <span className={cn("size-2 rounded-full", online ? "bg-feedback-success" : "bg-border-cloud-strong")} />
            {online ? "Rede detetada: já podes voltar" : "À espera de rede"}
          </span>
        </p>
      </div>
    </StateShell>
  );
}

