import { useMemo } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useAuth } from "../../contexts/AuthContext";
import { useListaTrilhas } from "../../hooks/useTrilhas";
import { useEstatisticasAprendiz, useListaMateriais } from "../../hooks/useV2Dados";
import { formatInt } from "../../lib/format";
import { levelInfo } from "../../lib/levels";
import { hrefDaTrilha, hrefDoItem, type Trilha } from "../../services/trilhaService";

function textoPassos(total: number) {
  return `${total} ${total === 1 ? "passo" : "passos"}`;
}

/** Feed de estudos do workspace activo: trilha em curso (ou a próxima a começar), trilhas publicadas e materiais recentes. */
export default function StudyFeedScreen() {
  const { usuario } = useAuth();
  const nome = usuario?.nome ?? "";
  const { data: trilhasTodas, isLoading, isError } = useListaTrilhas();
  const stats = useEstatisticasAprendiz();
  const recentes = useListaMateriais({});

  const publicadas = useMemo(() => (trilhasTodas ?? []).filter((t) => t.status === "published"), [trilhasTodas]);

  // Efeito Zeigarnik: a trilha começada e por acabar vem primeiro; senão, a primeira por começar.
  const destaque = useMemo<Trilha | undefined>(
    () =>
      publicadas.find((t) => t.progressoPercentual > 0 && t.progressoPercentual < 100) ??
      publicadas.find((t) => t.progressoPercentual === 0) ??
      publicadas[0],
    [publicadas],
  );
  const emCurso = destaque !== undefined && destaque.progressoPercentual > 0 && destaque.progressoPercentual < 100;
  const proximoItem = destaque?.itens.find((i) => !i.concluido);

  const nivel = stats.data?.nivel ?? 1;
  const lvl = levelInfo((nivel - 1) * 100);
  const materiaisRecentes = (recentes.data?.pages[0]?.itens ?? []).slice(0, 4);

  return (
    <AppShell active="trilhas">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-8">
        <div className="min-w-0">
          <section aria-labelledby="destaque-title" className="mb-8 rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-5 shadow-clay sm:p-7">
            {isLoading ? (
              <p role="status" className="text-body-md text-text-secondary">
                A carregar trilhas...
              </p>
            ) : isError ? (
              <p role="alert" className="text-body-md text-text-secondary">
                Não foi possível carregar as trilhas. Tenta novamente dentro de instantes.
              </p>
            ) : destaque ? (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-surface-sky px-3 py-1 text-overline text-primary uppercase">
                    {emCurso ? "Continua de onde paraste" : "Para começares"}
                  </span>
                  {destaque.disciplina && <span className="text-caption font-bold text-text-secondary">{destaque.disciplina}</span>}
                </div>
                <h1 id="destaque-title" className="font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
                  {destaque.titulo}
                </h1>
                {destaque.descricao && <p className="mt-2 text-body-md text-text-secondary">{destaque.descricao}</p>}

                <div className="mt-5">
                  <p className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-body-md">
                    <span className="font-bold text-on-surface tabular-nums">{Math.round(destaque.progressoPercentual)}% concluído</span>
                    <span className="font-bold text-primary tabular-nums">
                      {destaque.itensConcluidos}/{destaque.itens.length} {destaque.itens.length === 1 ? "passo" : "passos"}
                    </span>
                  </p>
                  <ProgressBar
                    value={destaque.itensConcluidos}
                    max={Math.max(destaque.itens.length, 1)}
                    tone="ocean"
                    label="Progresso na trilha"
                    valueText={`${destaque.itensConcluidos} de ${destaque.itens.length}`}
                  />
                </div>

                <div className="mt-5 flex justify-end border-t-2 border-border-cloud pt-4">
                  <LinkButton3D
                    href={proximoItem ? hrefDoItem(proximoItem, destaque.id) : hrefDaTrilha(destaque.id)}
                    size="lg"
                    trailingIcon={<Icon name="arrow-right" size={20} />}
                  >
                    {emCurso ? "Continuar trilha" : destaque.progressoPercentual === 100 ? "Rever trilha" : "Começar"}
                  </LinkButton3D>
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <h1 id="destaque-title" className="font-montserrat text-headline-h2 text-on-surface">
                  Ainda não há trilhas neste espaço
                </h1>
                <p className="mt-2 text-body-md text-text-secondary">Enquanto não publicam trilhas, podes estudar pelos materiais.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <LinkButton3D href="/v2/biblioteca-livre" trailingIcon={<Icon name="arrow-right" size={18} />}>
                    Biblioteca livre
                  </LinkButton3D>
                  <LinkButton3D href="/v2/marketplace" variant="secondary">
                    Marketplace
                  </LinkButton3D>
                </div>
              </div>
            )}
          </section>

          {publicadas.length > 0 && (
            <section aria-labelledby="api-trails-title" className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id="api-trails-title" className="font-montserrat text-headline-h2 text-on-surface">
                  Trilhas disponíveis
                </h2>
                <span className="text-caption font-bold text-text-tertiary tabular-nums">
                  {publicadas.length} {publicadas.length === 1 ? "trilha" : "trilhas"}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {publicadas.map((trilha) => (
                  <li
                    key={trilha.id}
                    className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 transition-[border-color,box-shadow] duration-200 hover:border-brand-ocean hover:shadow-elevation-1"
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="rounded-md bg-surface-sky px-2.5 py-0.5 text-caption font-bold text-primary">
                          {textoPassos(trilha.itens.length)}
                        </span>
                        <span className="text-caption font-bold text-on-surface tabular-nums">{Math.round(trilha.progressoPercentual)}%</span>
                      </div>
                      <h3 className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                        <a href={hrefDaTrilha(trilha.id)} className="hover:text-primary">
                          {trilha.titulo}
                        </a>
                      </h3>
                      {trilha.disciplina && <p className="mt-1 text-caption font-bold text-text-secondary">{trilha.disciplina}</p>}
                      {trilha.descricao && <p className="mt-1 line-clamp-2 text-body-md text-text-secondary">{trilha.descricao}</p>}
                    </div>
                    <div className="mt-4 pt-3">
                      <ProgressBar
                        value={trilha.itensConcluidos}
                        max={Math.max(trilha.itens.length, 1)}
                        tone="ocean"
                        label={`Progresso em ${trilha.titulo}`}
                        valueText={`${trilha.itensConcluidos} de ${trilha.itens.length}`}
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-caption text-text-tertiary tabular-nums">
                          {trilha.itensConcluidos}/{trilha.itens.length} concluídos
                        </span>
                        <a href={hrefDaTrilha(trilha.id)} className="inline-flex items-center gap-1 text-button text-primary uppercase hover:underline">
                          {trilha.progressoPercentual === 100 ? "Rever" : trilha.progressoPercentual > 0 ? "Continuar" : "Começar"}
                          <Icon name="arrow-right" size={15} />
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="recentes-title">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="recentes-title" className="font-montserrat text-headline-h2 text-on-surface">
                Materiais recentes
              </h2>
              <a href="/v2/marketplace" className="flex min-h-11 items-center gap-1 text-button text-primary uppercase hover:underline">
                Ver todos
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
            {recentes.isPending ? (
              <p role="status" className="text-body-md text-text-secondary">
                A carregar materiais...
              </p>
            ) : recentes.isError ? (
              <p role="alert" className="text-body-md text-text-secondary">
                Não foi possível carregar os materiais.
              </p>
            ) : materiaisRecentes.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
                Ainda não há materiais neste espaço.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {materiaisRecentes.map((m) => (
                  <li key={m.id}>
                    <a
                      href={`/v2/marketplace/${encodeURIComponent(m.id)}`}
                      className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 hover:border-brand-ocean"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-body-lg font-bold text-on-surface">{m.titulo}</span>
                        <span className="block truncate text-caption text-text-secondary">
                          {m.categoriaRotulo} · {m.criadorNome}
                        </span>
                      </span>
                      <Icon name="arrow-right" size={20} className="shrink-0 text-primary" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside aria-label="Painel do estudante" className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <section aria-labelledby="student-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
            <h2 id="student-title" className="sr-only">
              O teu progresso
            </h2>
            <div className="flex items-center gap-3.5">
              <span className="relative">
                <Avatar name={nome} size="lg" />
                <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-brand-ocean text-caption font-bold text-white tabular-nums">
                  <span className="sr-only">Nível </span>
                  {nivel}
                </span>
              </span>
              <div className="min-w-0">
                <p className="truncate font-montserrat text-headline-h3 font-extrabold text-on-surface">{nome}</p>
                <p className="text-caption font-bold text-primary">
                  Nível {nivel} — {lvl.title}
                </p>
              </div>
            </div>
            {stats.data && (
              <p className="mt-4 border-t-2 border-border-cloud pt-4 text-body-md text-text-secondary tabular-nums">
                <strong className="text-on-surface">{formatInt(stats.data.pontos)} XP</strong> neste espaço
              </p>
            )}
            <a href="/v2/classificacao" className="mt-2 flex min-h-11 items-center text-caption font-bold text-primary hover:underline">
              Ver a classificação
            </a>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
