import { useEffect, useState, type ReactNode } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { Pill } from "../../components/ui/Pill";
import { useToast } from "../../components/ui/Toast";
import { mensagemErroEnquete } from "../../services/surveyService";
import { cn } from "@/lib/utils";
import type { SurveyListItem, SurveyState } from "./types";

const STATE_LABEL: Record<SurveyState, { label: string; tone: "sunbeam" | "success" | "sky" }> = {
  rascunho: { label: "Rascunho", tone: "sunbeam" },
  activa: { label: "Activa", tone: "success" },
  encerrada: { label: "Encerrada", tone: "sky" },
};

type SurveyListScreenProps = {
  userName: string;
  /** Escolhe a moldura (estúdio ou app). A gestão de cada enquete depende só de `item.isOwner`. */
  isCreator: boolean;
  items: SurveyListItem[];
  /** Enquete a destacar (por exemplo, vinda de uma notificação). */
  highlightId?: string | null;
  onVote: (id: string, optionId: string) => Promise<{ xp: number }>;
  onPublish: (id: string) => Promise<void>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
};

function SurveyCard({
  item,
  highlighted,
  onVote,
  onPublish,
}: {
  item: SurveyListItem;
  highlighted: boolean;
  onVote: SurveyListScreenProps["onVote"];
  onPublish: SurveyListScreenProps["onPublish"];
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const state = STATE_LABEL[item.state];
  const canVote = item.state === "activa" && !item.hasVoted;

  useEffect(() => {
    if (highlighted) document.getElementById(`enquete-${item.id}`)?.scrollIntoView({ block: "center" });
  }, [highlighted, item.id]);

  const votar = async () => {
    if (!choice || busy) return;
    setBusy(true);
    try {
      const { xp } = await onVote(item.id, choice);
      toast.show(xp > 0 ? `Resposta registada. Ganhaste ${xp} XP.` : "Resposta registada.");
    } catch (err) {
      toast.show(mensagemErroEnquete(err, "Não foi possível registar a resposta."), "error");
    } finally {
      setBusy(false);
    }
  };

  const publicar = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onPublish(item.id);
      toast.show("Enquete ativa.");
    } catch (err) {
      toast.show(mensagemErroEnquete(err, "Não foi possível ativar a enquete."), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li
      id={`enquete-${item.id}`}
      className={cn(
        "rounded-3xl border-2 bg-surface-canvas p-5 sm:p-6",
        highlighted ? "border-brand-ocean" : "border-border-cloud",
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Pill tone={state.tone} kind="tag">
          {state.label}
        </Pill>
        {(item.subject || item.faculty) && (
          <span className="text-caption text-text-secondary">{[item.subject, item.faculty].filter(Boolean).join(" · ")}</span>
        )}
      </div>
      <h2 className="font-montserrat text-headline-h3 font-extrabold text-on-surface">{item.question}</h2>

      {canVote ? (
        <fieldset className="mt-4 min-w-0 border-0 p-0">
          <legend className="sr-only">Opções de resposta</legend>
          <div className="flex flex-col gap-2.5">
            {item.options.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-2.5 text-body-md",
                  "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
                  choice === option.id
                    ? "border-brand-ocean bg-surface-sky text-on-surface"
                    : "border-border-cloud bg-surface-canvas text-on-surface hover:border-brand-ocean",
                )}
              >
                <input
                  type="radio"
                  name={`enquete-${item.id}`}
                  value={option.id}
                  checked={choice === option.id}
                  onChange={() => setChoice(option.id)}
                  className="size-4 accent-brand-ocean"
                />
                {option.label}
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button3D disabled={!choice || busy} onClick={() => void votar()}>
              {busy ? "A enviar…" : "Responder"}
            </Button3D>
          </div>
        </fieldset>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-body-md text-text-secondary">
          {item.state === "activa" && <Icon name="check" size={18} className="text-feedback-success-ink" />}
          {item.state === "activa" && "Já respondeste. Obrigado!"}
          {item.state === "encerrada" && "Esta enquete já não recebe respostas."}
          {item.state === "rascunho" && "Ainda só tu a vês. Ativa-a para começar a receber respostas."}
        </p>
      )}

      {item.isOwner && item.state !== "rascunho" && (
        <div className="mt-4 flex justify-end">
          <LinkButton3D variant="ghost" href={`/v2/estudio/enquete/resultados?id=${encodeURIComponent(item.id)}`}>
            Ver resultados
          </LinkButton3D>
        </div>
      )}
      {item.isOwner && item.state === "rascunho" && (
        <div className="mt-4 flex justify-end">
          <Button3D disabled={busy} onClick={() => void publicar()}>
            {busy ? "A ativar…" : "Ativar enquete"}
          </Button3D>
        </div>
      )}
    </li>
  );
}

/** Lista de enquetes do workspace activo: quem estuda responde, quem cria publica e acompanha. */
export default function SurveyListScreen({
  userName,
  isCreator,
  items,
  highlightId,
  onVote,
  onPublish,
  hasMore,
  onLoadMore,
  loadingMore,
}: SurveyListScreenProps) {
  const content: ReactNode = (
    <div className="mx-auto max-w-[760px] px-4 py-6 md:px-6 lg:py-8">
      <header className="mb-6">
        <p className="text-overline text-primary uppercase">Escuta rápida</p>
        <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">Enquetes</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Uma pergunta, dez segundos. As respostas são anónimas e ajudam quem cria a melhorar o que estudas.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 text-center">
          <p className="text-body-md text-text-secondary">Ainda não há enquetes por aqui.</p>
          {isCreator && (
            <LinkButton3D className="mt-4" href="/v2/estudio/enquete">
              Criar uma enquete
            </LinkButton3D>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <SurveyCard
              key={item.id}
              item={item}
              highlighted={item.id === highlightId}
              onVote={onVote}
              onPublish={onPublish}
            />
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button3D variant="ghost" disabled={loadingMore} onClick={onLoadMore}>
            {loadingMore ? "A carregar…" : "Ver mais"}
          </Button3D>
        </div>
      )}
    </div>
  );

  return isCreator ? (
    <CreatorShell active="materiais" creatorName={userName}>
      {content}
    </CreatorShell>
  ) : (
    <AppShell active="painel" userName={userName}>
      {content}
    </AppShell>
  );
}
