import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useListaMateriais, useSimulado } from "../../hooks/useV2Dados";
import { quizService, type QuizResult } from "../../services/quizService";
import { QuizOption } from "../quiz/QuizOption";

const LETRAS = "ABCDEFGHIJ";

function mensagemErro(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: unknown } | undefined;
    if (typeof data?.error === "string") return data.error;
  }
  return "Não foi possível enviar as respostas. Tenta novamente.";
}

function Escolher() {
  const lista = useListaMateriais({ comQuiz: true });
  const itens = lista.data?.pages.flatMap((p) => p.itens) ?? [];

  return (
    <AppShell active="simulados">
      <div className="mx-auto max-w-[860px] px-4 py-8 md:px-6">
        <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">Simulados</h1>
        <p className="mt-1 text-body-lg text-text-secondary">Escolhe um material com simulado para praticar.</p>
        {lista.isPending ? (
          <p role="status" className="mt-6 text-body-md text-text-secondary">
            A carregar simulados...
          </p>
        ) : lista.isError ? (
          <p role="alert" className="mt-6 text-body-md text-text-secondary">
            Não foi possível carregar os simulados.
          </p>
        ) : itens.length === 0 ? (
          <p className="mt-6 rounded-3xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
            Ainda não há simulados neste espaço.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {itens.map((m) => (
              <li key={m.id}>
                <a
                  href={`/v2/desafio?quizId=${encodeURIComponent(m.quizId ?? "")}`}
                  className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 hover:border-brand-ocean"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-body-lg font-bold text-on-surface">{m.titulo}</span>
                    <span className="block text-caption text-text-secondary">
                      {m.categoriaRotulo} · {m.criadorNome}
                    </span>
                  </span>
                  <Icon name="arrow-right" size={20} className="shrink-0 text-primary" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {lista.hasNextPage && (
          <div className="mt-6 flex justify-center">
            <Button3D variant="secondary" disabled={lista.isFetchingNextPage} onClick={() => void lista.fetchNextPage()}>
              Ver mais
            </Button3D>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/** Simulado real: perguntas do backend, correcção e XP calculados pelo servidor. */
export default function SimuladoFlow({ quizId }: { quizId: string | null }) {
  if (!quizId) return <Escolher />;
  return <Simulado quizId={quizId} />;
}

function Simulado({ quizId }: { quizId: string }) {
  const { data: quiz, isPending, isError } = useSimulado(quizId);
  const queryClient = useQueryClient();
  const [posicao, setPosicao] = useState(-1);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<QuizResult | null>(null);

  const perguntas = useMemo(() => quiz?.questions ?? [], [quiz]);

  if (isPending) {
    return (
      <AppShell active="simulados">
        <p role="status" className="px-4 py-16 text-center text-body-lg text-text-secondary">
          A carregar o simulado...
        </p>
      </AppShell>
    );
  }
  if (isError || !quiz || perguntas.length === 0) {
    return (
      <AppShell active="simulados">
        <div className="px-4 py-16 text-center">
          <p role="alert" className="text-body-lg text-text-secondary">
            Não encontrámos este simulado neste espaço.
          </p>
          <a href="/v2/desafio" className="mt-4 inline-block font-bold text-primary underline">
            Ver simulados
          </a>
        </div>
      </AppShell>
    );
  }

  if (resultado) {
    const certas = resultado.correctAnswers;
    const total = resultado.totalQuestions;
    const detalhe = new Map((resultado.details ?? []).map((d) => [d.question_id, d]));
    return (
      <AppShell active="simulados">
        <div className="mx-auto max-w-[760px] px-4 py-8 md:px-6">
          <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">Simulado concluído</h1>
          <p className="mt-3 text-body-lg text-text-secondary">
            Acertaste <strong className="text-on-surface tabular-nums">{certas} de {total}</strong>.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-1.5 text-overline text-on-secondary-fixed-variant uppercase tabular-nums">
            <Icon name="bolt" size={16} />+{resultado["xp earned"]} XP
          </p>
          {resultado["xp earned"] === 0 && (
            <p className="mt-2 text-caption text-text-tertiary">O XP só é atribuído na primeira tentativa.</p>
          )}
          <ol className="mt-6 flex flex-col gap-3">
            {perguntas.map((p, i) => {
              const d = detalhe.get(p.id);
              const certa = d?.correct ?? false;
              const correcta = p.options.find((o) => o.id === d?.correct_option_id);
              return (
                <li key={p.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                  <p className="flex items-start gap-2 text-body-md font-bold text-on-surface">
                    <Icon name={certa ? "check" : "x"} size={18} className={certa ? "text-feedback-success-ink" : "text-feedback-error"} />
                    <span>
                      {i + 1}. {p.text}
                      <span className="sr-only">{certa ? " — certa" : " — errada"}</span>
                    </span>
                  </p>
                  {!certa && correcta && <p className="mt-1 text-caption text-text-secondary">Resposta certa: {correcta.text}</p>}
                </li>
              );
            })}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button3D
              onClick={() => {
                setResultado(null);
                setRespostas({});
                setPosicao(-1);
              }}
            >
              Tentar de novo
            </Button3D>
            <LinkButton3D href="/v2/painel" variant="secondary">
              Ir ao painel
            </LinkButton3D>
          </div>
        </div>
      </AppShell>
    );
  }

  if (posicao < 0) {
    return (
      <AppShell active="simulados">
        <div className="mx-auto max-w-[760px] px-4 py-8 md:px-6">
          <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">{quiz.title}</h1>
          {quiz.description && <p className="mt-2 text-body-lg text-text-secondary">{quiz.description}</p>}
          <p className="mt-4 text-body-md text-text-secondary tabular-nums">
            {perguntas.length} {perguntas.length === 1 ? "pergunta" : "perguntas"} · 10 XP por resposta certa (só na primeira tentativa)
          </p>
          <Button3D size="lg" className="mt-6" onClick={() => setPosicao(0)} trailingIcon={<Icon name="arrow-right" size={20} />}>
            Começar
          </Button3D>
        </div>
      </AppShell>
    );
  }

  const pergunta = perguntas[posicao];
  const ultima = posicao === perguntas.length - 1;
  const respondida = Boolean(respostas[pergunta.id]);

  async function enviar() {
    setEnviando(true);
    setErro(null);
    try {
      const r = await quizService.submitQuiz(quizId, respostas);
      setResultado(r);
      void queryClient.invalidateQueries({ queryKey: ["painel"] });
    } catch (err) {
      setErro(mensagemErro(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AppShell active="simulados">
      <div className="mx-auto max-w-[760px] px-4 py-8 md:px-6">
        <p className="text-overline text-text-tertiary uppercase tabular-nums">
          Pergunta {posicao + 1} de {perguntas.length}
        </p>
        <fieldset className="mt-3">
          <legend className="font-montserrat text-headline-h2 text-on-surface">{pergunta.text}</legend>
          <div className="mt-5 flex flex-col gap-3">
            {pergunta.options.map((o, i) => (
              <QuizOption
                key={o.id}
                name={`pergunta-${pergunta.id}`}
                option={{ id: o.id, label: LETRAS[i] ?? String(i + 1), text: o.text }}
                state={respostas[pergunta.id] === o.id ? "selected" : "idle"}
                checked={respostas[pergunta.id] === o.id}
                disabled={enviando}
                onSelect={(id) => setRespostas((r) => ({ ...r, [pergunta.id]: id }))}
              />
            ))}
          </div>
        </fieldset>
        {erro && (
          <p role="alert" className="mt-4 text-body-md text-feedback-error">
            {erro}
          </p>
        )}
        <div className="mt-6 flex justify-between gap-3">
          <Button3D variant="secondary" disabled={posicao === 0 || enviando} onClick={() => setPosicao((p) => p - 1)}>
            Anterior
          </Button3D>
          {ultima ? (
            <Button3D disabled={Object.keys(respostas).length === 0 || enviando} onClick={() => void enviar()}>
              {enviando ? "A enviar..." : "Terminar"}
            </Button3D>
          ) : (
            <Button3D disabled={!respondida} onClick={() => setPosicao((p) => p + 1)}>
              Seguinte
            </Button3D>
          )}
        </div>
      </div>
    </AppShell>
  );
}
