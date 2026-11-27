import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionCard } from "../../components/ui/SectionCard";
import { useDoMeuCurso } from "../../hooks/useDoMeuCurso";
import { hrefDaTrilha } from "../../services/trilhaService";

const MAXIMO = 3;

function LinhaLigacao({ href, titulo, legenda, children }: { href: string; titulo: string; legenda?: string; children?: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="flex min-h-16 items-center gap-4 rounded-2xl p-2 transition-[background-color] duration-150 hover:bg-surface-soft">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
          <Icon name="book" size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-md font-bold text-on-surface">{titulo}</span>
          {legenda && <span className="block text-caption text-text-secondary">{legenda}</span>}
          {children}
        </span>
      </a>
    </li>
  );
}

/**
 * «Do meu curso»: trilhas e simulados da cadeira que mais preocupa o estudante, neste espaço.
 * Só aparece com uma cadeira em foco; se a API falhar, também desaparece (o resto do painel não depende dela).
 */
export function DoMeuCurso() {
  const dados = useDoMeuCurso();
  if (dados.isPending || dados.isError || !dados.data) return null;
  const { cadeira, curso, trilhas, simulados } = dados.data;
  const vazio = trilhas.length === 0 && simulados.length === 0;

  return (
    <SectionCard title="Do meu curso" eyebrow={curso || undefined}>
      <p className="-mt-3 mb-4 text-body-md text-text-secondary">
        A cadeira que mais te preocupa: <span className="font-bold text-on-surface">{cadeira.nome}</span>.
      </p>
      {vazio ? (
        <p className="py-2 text-body-md text-text-secondary">Ainda não há trilhas nem simulados de {cadeira.nome} neste espaço.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {trilhas.length > 0 && (
            <div>
              <h3 className="text-overline text-text-tertiary uppercase">Trilhas</h3>
              <ul className="-mx-2 mt-1 flex flex-col">
                {trilhas.slice(0, MAXIMO).map((t) => (
                  <LinhaLigacao key={t.id} href={hrefDaTrilha(t.id)} titulo={t.titulo}>
                    <ProgressBar value={t.progressoPercentual} max={100} size="sm" label={`Progresso em ${t.titulo}`} valueText={`${t.progressoPercentual}%`} />
                  </LinhaLigacao>
                ))}
              </ul>
            </div>
          )}
          {simulados.length > 0 && (
            <div>
              <h3 className="text-overline text-text-tertiary uppercase">Simulados</h3>
              <ul className="-mx-2 mt-1 flex flex-col">
                {simulados.slice(0, MAXIMO).map((m) => (
                  <LinhaLigacao key={m.id} href={`/v2/desafio?quizId=${encodeURIComponent(m.quizId ?? "")}`} titulo={m.titulo} legenda={m.criadorNome} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
