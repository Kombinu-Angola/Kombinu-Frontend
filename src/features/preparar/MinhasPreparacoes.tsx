import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FlowLayout } from "@/components/fluxo/flow";
import { Alert, Badge, Spinner } from "@/components/fluxo/feedback";
import { CheckIcon, ClockIcon, FileIcon, LockIcon, PenIcon, PlayIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { fluxoService, type MaterialItem, type MaterialStatus } from "../../services/fluxoService";
import { FolhaDecisao } from "./FolhaDecisao";

const ESTADO: Record<MaterialStatus, { rotulo: string; tom: "neutral" | "blue" | "yellow" | "green"; icone: ReactNode }> = {
  preparing: { rotulo: "A preparar", tom: "blue", icone: <Spinner className="size-3" /> },
  failed: { rotulo: "A preparar", tom: "yellow", icone: <Spinner className="size-3" /> },
  locked: { rotulo: "Desbloqueia ao pagar", tom: "neutral", icone: <LockIcon className="size-3.5" /> },
  unlocked: { rotulo: "Desbloqueado", tom: "green", icone: <CheckIcon className="size-3.5" strokeWidth={3} /> },
  pending_review: { rotulo: "Pendente de revisão", tom: "yellow", icone: <ClockIcon className="size-3.5" /> },
};

const BOTAO = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 font-display text-sm font-bold focus-ring";

/** "As minhas preparações": tudo o que o estudante preparou. Privado, e nunca dá 403: o que geraste está aqui. */
export default function MinhasPreparacoes() {
  const [params] = useSearchParams();
  const destaque = params.get("novo");
  const qc = useQueryClient();
  const lista = useQuery({
    queryKey: ["fluxo", "materiais"],
    queryFn: fluxoService.materials,
    refetchInterval: (q) => (q.state.data?.some((m) => m.status === "preparing" || m.status === "failed") ? 4000 : false),
  });
  const [pagar, setPagar] = useState<MaterialItem>();
  const refDestaque = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (destaque && lista.data) refDestaque.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [destaque, lista.data]);

  return (
    <FlowLayout width="wide" back={{ href: "/v2/painel", label: "Voltar ao painel" }}>
      <p className="mb-4 rounded-xl bg-kombinu-yellow-soft px-3 py-2 text-sm font-medium text-neutral-700">
        Modo de desenvolvimento: dados de exemplo, guardados só neste dispositivo.
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ScreenTitle subtitle="Privadas por defeito. Só tu as vês.">As minhas preparações</ScreenTitle>
        <Link to="/v2/preparar" className={`${BOTAO} bg-kombinu-blue text-white hover:bg-kombinu-blue-dark`}>
          <PenIcon className="size-4" /> Nova preparação
        </Link>
      </div>

      {destaque && (
        <div className="mt-6">
          <Alert tone="success" title="Guardado">A prévia continua aqui. Desbloqueia o resto quando quiseres.</Alert>
        </div>
      )}

      <div className="mt-6" aria-busy={lista.isPending}>
        {lista.isError && <Alert tone="danger" title="Não conseguimos carregar">Tenta outra vez dentro de instantes.</Alert>}
        {lista.isPending && (
          <div className="grid gap-3">
            {[0, 1].map((i) => <span key={i} className="h-32 animate-pulse rounded-2xl bg-kombinu-surface" />)}
          </div>
        )}
        {lista.data?.length === 0 && (
          <div className="rounded-[28px] bg-kombinu-surface p-8 text-center">
            <p className="font-display text-lg font-bold">Ainda não preparaste nada</p>
            <p className="mx-auto mt-2 max-w-[36ch] text-neutral-600">Carrega a matéria de uma prova e recebe uma sebenta e um simulado feitos para ti.</p>
            <Link to="/v2/preparar" className={`${BOTAO} mt-5 bg-kombinu-blue text-white hover:bg-kombinu-blue-dark`}>Preparar a minha prova</Link>
          </div>
        )}
        <ul className="grid gap-3">
          {lista.data?.map((m) => {
            const e = ESTADO[m.status];
            const novo = m.id === destaque;
            return (
              <li key={m.id} ref={novo ? refDestaque : undefined} className={`rounded-2xl bg-white p-4 ring-inset sm:p-5 ${novo ? "ring-2 ring-kombinu-blue" : "ring-1 ring-neutral-200"}`}>
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-kombinu-surface text-kombinu-blue">
                    {m.status === "locked" ? <LockIcon className="size-5" /> : <FileIcon className="size-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display font-bold">{m.title}</h2>
                      <Badge tone={e.tom} icon={e.icone}>{e.rotulo}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">
                      {m.subjectName} · {new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "short" }).format(new Date(m.createdAt))}
                    </p>
                    {(m.status === "preparing" || m.status === "failed") && (
                      <p className="mt-2 text-sm text-neutral-600">
                        {m.status === "failed" ? "Houve um atraso do nosso lado. Estamos a repetir sem gastar a tua quota." : "Podes voltar mais tarde: fica aqui quando estiver pronto."}
                      </p>
                    )}
                  </div>
                </div>

                {m.status !== "preparing" && m.status !== "failed" && (
                  <div className="mt-4 flex flex-wrap gap-2 sm:pl-16">
                    {m.status === "locked" ? (
                      <>
                        {m.previewContentId && (
                          <Link to={`/v2/preparar/previa?id=${encodeURIComponent(m.previewContentId)}`} className={`${BOTAO} bg-kombinu-surface text-kombinu-ink hover:bg-neutral-200`}>
                            <PlayIcon className="size-4" /> Jogar prévia
                          </Link>
                        )}
                        <button type="button" onClick={() => setPagar(m)} className={`${BOTAO} bg-kombinu-blue text-white hover:bg-kombinu-blue-dark`}>
                          <LockIcon className="size-4" /> Desbloquear
                        </button>
                      </>
                    ) : (
                      <Link to={`/v2/preparar/modulo/${encodeURIComponent(m.id)}`} className={`${BOTAO} bg-kombinu-blue text-white hover:bg-kombinu-blue-dark`}>Abrir módulo</Link>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {pagar && (
        <FolhaDoMaterial
          material={pagar}
          onClose={() => {
            setPagar(undefined);
            void qc.invalidateQueries({ queryKey: ["fluxo", "materiais"] });
          }}
        />
      )}
    </FlowLayout>
  );
}

/** Abre a folha de decisão com o resumo real do módulo (blocos, perguntas e dias), nunca com números fixos. */
function FolhaDoMaterial({ material, onClose }: { material: MaterialItem; onClose: () => void }) {
  const modulo = useQuery({ queryKey: ["fluxo", "modulo", material.id], queryFn: () => fluxoService.module(material.id) });
  if (!modulo.data) return null;
  const m = modulo.data;
  return (
    <FolhaDecisao
      open
      emPreparacoes
      onClose={onClose}
      contentId={material.id}
      resumo={{ title: m.title, subjectName: m.subjectName, totalBlocks: m.blocks.length, totalQuestions: m.questions.length, planDays: m.plan.length }}
    />
  );
}
