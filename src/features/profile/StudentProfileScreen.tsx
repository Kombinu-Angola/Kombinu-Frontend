import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../contexts/AuthContext";
import { useEstatisticasAprendiz } from "../../hooks/useV2Dados";
import { formatInt } from "../../lib/format";
import { levelInfo } from "../../lib/levels";

const PAPEIS: Record<string, string> = { student: "Estudante", teacher: "Professor", admin: "Administrador" };

/** Perfil do utilizador autenticado: nome, escolas e números reais (nível = XP // 100 + 1, calculado pelo backend). */
export default function StudentProfileScreen() {
  const { usuario } = useAuth();
  const stats = useEstatisticasAprendiz();
  const nome = usuario?.nome ?? "";
  const nivel = stats.data?.nivel ?? usuario?.nivel ?? 1;
  const memberships = usuario?.memberships ?? [];

  return (
    <AppShell active="painel">
      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-6 lg:py-8">
        <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-8">
          <header className="flex flex-col gap-5 border-b-2 border-border-cloud pb-8 sm:flex-row sm:items-center">
            <Avatar name={nome} size="lg" />
            <div className="min-w-0">
              <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">{nome}</h1>
              {usuario?.email && <p className="mt-1 truncate text-body-md text-text-secondary">{usuario.email}</p>}
              <p className="mt-1 text-body-md font-bold text-brand-sky-ink">
                {usuario?.tipo === "criador" ? "Criador" : "Estudante"} · Nível {nivel} · {levelInfo((nivel - 1) * 100).title}
              </p>
            </div>
          </header>

          <section aria-labelledby="perfil-numeros" className="mt-6">
            <h2 id="perfil-numeros" className="sr-only">
              Números
            </h2>
            {stats.isPending ? (
              <p role="status" className="text-body-md text-text-secondary">
                A carregar...
              </p>
            ) : stats.isError || !stats.data ? (
              <p role="alert" className="text-body-md text-text-secondary">
                Não foi possível carregar os teus números.
              </p>
            ) : (
              <dl className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border-2 border-border-cloud p-4">
                  <dt className="text-overline text-text-tertiary uppercase">XP neste espaço</dt>
                  <dd className="font-montserrat text-headline-h2 font-extrabold text-primary tabular-nums">{formatInt(stats.data.pontos)}</dd>
                </div>
                <div className="rounded-2xl border-2 border-border-cloud p-4">
                  <dt className="text-overline text-text-tertiary uppercase">Cursos concluídos</dt>
                  <dd className="font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums">{stats.data.cursosConcluidos}</dd>
                </div>
                <div className="rounded-2xl border-2 border-border-cloud p-4">
                  <dt className="text-overline text-text-tertiary uppercase">Simulados feitos</dt>
                  <dd className="font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums">{stats.data.simuladosFeitos}</dd>
                </div>
              </dl>
            )}
          </section>

          {memberships.length > 0 && (
            <section aria-labelledby="perfil-escolas" className="mt-8">
              <h2 id="perfil-escolas" className="mb-3 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                As tuas escolas
              </h2>
              <ul className="flex flex-col gap-2">
                {memberships.map((m) => (
                  <li key={m.organizacaoId} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border-cloud p-3">
                    <span className="truncate text-body-md font-bold text-on-surface">{m.nome}</span>
                    <span className="shrink-0 rounded-full bg-surface-soft px-3 py-1 text-caption font-bold text-text-secondary">
                      {PAPEIS[m.papel] ?? m.papel}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <LinkButton3D href="/v2/painel" variant="secondary" className="mt-8" trailingIcon={<Icon name="arrow-right" size={18} />}>
            Ir ao painel
          </LinkButton3D>
        </div>
      </div>
    </AppShell>
  );
}
