import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useAuth } from "../../contexts/AuthContext";
import { useEstatisticasCriador, useListaMateriais } from "../../hooks/useV2Dados";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";

const data = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "short", year: "numeric" });

function formatarData(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : data.format(d);
}

/** Os materiais do criador no workspace activo, com os números reais de `/dashboard/creator/stats/`. */
export default function CreatorContentHubScreen() {
  const { usuario } = useAuth();
  const stats = useEstatisticasCriador();
  const lista = useListaMateriais({ criador: usuario?.id });
  const materiais = lista.data?.pages.flatMap((p) => p.itens) ?? [];

  return (
    <CreatorShell
      active="materiais"
      creatorName={usuario?.nome ?? ""}
      actions={
        <Button3D onClick={() => window.location.assign("/v2/estudio/criar")} leadingIcon={<Icon name="plus" size={18} />}>
          Novo material
        </Button3D>
      }
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="text-overline text-text-tertiary uppercase">Modo criador</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">Os meus materiais</h1>
        </header>

        <section aria-label="Resumo" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
            <p className="text-overline text-text-tertiary uppercase">Materiais</p>
            <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-on-surface tabular-nums">
              {stats.isPending ? "…" : stats.data ? formatInt(stats.data.materiais) : "—"}
            </p>
          </article>
          <article className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
            <p className="text-overline text-text-tertiary uppercase">Estudantes que fizeram simulados</p>
            <p className="mt-2 font-montserrat text-headline-h1-mobile font-extrabold text-on-surface tabular-nums">
              {stats.isPending ? "…" : stats.data ? formatInt(stats.data.estudantes) : "—"}
            </p>
          </article>
        </section>
        {stats.isError && (
          <p role="alert" className="-mt-4 mb-6 text-caption text-text-secondary">
            Não foi possível carregar o resumo.
          </p>
        )}

        {lista.isPending ? (
          <p role="status" className="text-body-md text-text-secondary">
            A carregar os materiais...
          </p>
        ) : lista.isError ? (
          <p role="alert" className="text-body-md text-text-secondary">
            Não foi possível carregar os materiais.
          </p>
        ) : materiais.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
            Ainda não publicaste materiais neste espaço.
          </p>
        ) : (
          <TableScroll label="Tabela dos meus materiais">
            <table className={table}>
              <caption className="sr-only">Materiais publicados neste espaço</caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Material</th>
                  <th scope="col" className={th}>Categoria</th>
                  <th scope="col" className={th}>Nível</th>
                  <th scope="col" className={th}>Simulado</th>
                  <th scope="col" className={th}>Publicado</th>
                </tr>
              </thead>
              <tbody>
                {materiais.map((m) => (
                  <tr key={m.id} className={tr}>
                    <th scope="row" className={cn(td, "font-normal")}>
                      <a href={`/v2/marketplace/${encodeURIComponent(m.id)}`} className="font-bold text-on-surface hover:text-primary">
                        {m.titulo}
                      </a>
                    </th>
                    <td className={td}>{m.categoriaRotulo}</td>
                    <td className={td}>{m.nivel}</td>
                    <td className={td}>{m.quizId ? "Sim" : "Não"}</td>
                    <td className={cn(td, "whitespace-nowrap")}>{formatarData(m.criadoEm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        )}
        {lista.hasNextPage && (
          <div className="mt-6 flex justify-center">
            <Button3D variant="secondary" disabled={lista.isFetchingNextPage} onClick={() => void lista.fetchNextPage()}>
              Ver mais
            </Button3D>
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
