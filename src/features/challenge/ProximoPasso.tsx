import { Icon } from "../../components/ui/Icon";
import { LinkButton3D } from "../../components/ui/Button3D";
import { useListaMateriais } from "../../hooks/useV2Dados";

/**
 * Fim do simulado: em vez de um beco sem saída, propõe outro simulado do mesmo espaço e a classificação.
 * É uma sugestão simples (o seguinte na lista, que não é este): não afirma que seja «o próximo da trilha».
 * Se a lista falhar, só ficam as ligações fixas; nunca bloqueia o resultado.
 */
export function ProximoPasso({ quizIdActual }: { quizIdActual: string }) {
  const lista = useListaMateriais({ comQuiz: true });
  const itens = (lista.data?.pages.flatMap((p) => p.itens) ?? []).filter((m) => m.quizId);
  const i = itens.findIndex((m) => m.quizId === quizIdActual);
  const outro = itens.find((m, idx) => m.quizId !== quizIdActual && idx > i) ?? itens.find((m) => m.quizId !== quizIdActual);

  return (
    <section aria-labelledby="proximo-passo" className="mt-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay motion-safe:animate-panel-in motion-safe:[animation-delay:80ms] motion-safe:[animation-fill-mode:both] sm:p-6">
      <h2 id="proximo-passo" className="text-overline text-text-tertiary uppercase">
        O que fazer a seguir
      </h2>
      {outro ? (
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-caption text-text-secondary">Outro simulado para praticar</p>
            <p className="truncate font-montserrat text-headline-h3 font-extrabold text-on-surface">{outro.titulo}</p>
            <p className="text-caption text-text-secondary">
              {outro.categoriaRotulo} · {outro.criadorNome}
            </p>
          </div>
          <LinkButton3D href={`/v2/desafio?quizId=${encodeURIComponent(outro.quizId ?? "")}`} trailingIcon={<Icon name="arrow-right" size={18} />}>
            Fazer agora
          </LinkButton3D>
        </div>
      ) : (
        !lista.isPending && <p className="mt-3 text-body-md text-text-secondary">Não há mais simulados neste espaço por agora.</p>
      )}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t-2 border-border-cloud pt-3 text-body-md font-bold">
        <li>
          <a href="/v2/desafio" className="flex min-h-11 items-center text-primary hover:underline">
            Ver todos os simulados
          </a>
        </li>
        <li>
          <a href="/v2/classificacao" className="flex min-h-11 items-center text-primary hover:underline">
            Ver a classificação
          </a>
        </li>
      </ul>
    </section>
  );
}
