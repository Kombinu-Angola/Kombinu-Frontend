import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useMaterial } from "../../hooks/useV2Dados";

const dataLonga = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "long", year: "numeric" });

/** Só aceita endereços http(s): o backend guarda URLs livres e não se confia no esquema. */
function urlSegura(valor: string): string | null {
  try {
    const u = new URL(valor);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

function Estado({ children, alerta }: { children: React.ReactNode; alerta?: boolean }) {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 text-center">
      <p role={alerta ? "alert" : "status"} className="text-body-lg text-text-secondary">
        {children}
      </p>
      <a href="/v2/marketplace" className="mt-4 inline-block font-bold text-primary underline">
        Voltar aos materiais
      </a>
    </div>
  );
}

/** Detalhe e leitura de um conteúdo real (`GET /contents/{id}/`). */
export default function MaterialDetailScreen({ id }: { id: string | null }) {
  const { data: m, isPending, isError } = useMaterial(id);

  if (!id) {
    return (
      <AppShell active="sebentas">
        <Estado>Escolhe um material para ler.</Estado>
      </AppShell>
    );
  }
  if (isPending) {
    return (
      <AppShell active="sebentas">
        <Estado>A carregar o material...</Estado>
      </AppShell>
    );
  }
  if (isError || !m) {
    return (
      <AppShell active="sebentas">
        <Estado alerta>Não encontrámos este material neste espaço.</Estado>
      </AppShell>
    );
  }

  const criado = new Date(m.criadoEm);
  const miniatura = m.miniatura ? urlSegura(m.miniatura) : null;
  const video = m.videoUrl ? urlSegura(m.videoUrl) : null;
  const paragrafos = m.texto.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <AppShell active="sebentas">
      <article className="mx-auto max-w-[860px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-5 flex flex-wrap items-center gap-2 border-b-2 border-border-cloud pb-4 text-caption text-text-secondary">
          <a href="/v2/marketplace" className="hover:text-primary">
            Materiais
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            {m.categoriaRotulo}
          </span>
        </nav>

        <header>
          <p className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary-fixed px-3 py-1 text-overline text-on-primary-fixed uppercase">{m.categoriaRotulo}</span>
            {m.nivel && <span className="rounded-full bg-surface-soft px-3 py-1 text-overline text-text-secondary uppercase">{m.nivel}</span>}
            {m.duracao && <span className="text-caption text-text-tertiary">{m.duracao}</span>}
          </p>
          <h1 className="mt-3 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">{m.titulo}</h1>
          <p className="mt-4 flex items-center gap-3">
            <Avatar name={m.criadorNome} />
            <span>
              <span className="block text-body-md font-bold text-on-surface">{m.criadorNome}</span>
              {!Number.isNaN(criado.getTime()) && (
                <time dateTime={m.criadoEm} className="block text-caption text-text-tertiary">
                  {dataLonga.format(criado)}
                </time>
              )}
            </span>
          </p>
        </header>

        {miniatura && (
          <img src={miniatura} alt={`Capa de ${m.titulo}`} referrerPolicy="no-referrer" loading="lazy" className="mt-6 max-h-80 w-full rounded-3xl object-cover" />
        )}

        {m.descricao && <p className="mt-6 text-body-lg text-pretty text-text-secondary">{m.descricao}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          {m.quizId && (
            <LinkButton3D href={`/v2/desafio?quizId=${encodeURIComponent(m.quizId)}`} trailingIcon={<Icon name="arrow-right" size={18} />}>
              Fazer o simulado
            </LinkButton3D>
          )}
          {video && (
            <a
              href={video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-border-cloud px-5 text-button text-primary uppercase hover:bg-surface-soft"
            >
              <Icon name="arrow-right" size={18} />
              Ver o vídeo
              <span className="sr-only"> (abre noutro separador)</span>
            </a>
          )}
        </div>

        {paragrafos.length > 0 && (
          <section aria-label="Conteúdo" className="mt-8 flex flex-col gap-4 border-t-2 border-border-cloud pt-6">
            {paragrafos.map((p, i) => (
              <p key={i} className="text-body-lg text-pretty whitespace-pre-line text-on-surface">
                {p}
              </p>
            ))}
          </section>
        )}

        {m.etiquetas.length > 0 && (
          <ul aria-label="Etiquetas" className="mt-8 flex flex-wrap gap-2">
            {m.etiquetas.map((t) => (
              <li key={t} className="rounded-full bg-surface-soft px-3 py-1 text-caption font-bold text-text-secondary">
                {t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </AppShell>
  );
}
