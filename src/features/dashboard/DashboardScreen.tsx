import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAuth } from "../../contexts/AuthContext";
import { useCursosAprendiz, useEstatisticasAprendiz } from "../../hooks/useV2Dados";
import { formatInt } from "../../lib/format";
import { levelInfo } from "../../lib/levels";

const dataCurta = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "short" });

function formatarData(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dataCurta.format(d);
}

/** Painel do estudante com os números reais do workspace activo (`/dashboard/learner/*`). */
export default function DashboardScreen() {
  const { usuario } = useAuth();
  const stats = useEstatisticasAprendiz();
  const cursos = useCursosAprendiz();
  const nome = usuario?.nome ?? "";
  const primeiroNome = nome.split(/\s+/)[0] ?? "";

  const nivel = stats.data?.nivel ?? 1;
  const titulo = levelInfo((nivel - 1) * 100).title;

  return (
    <AppShell active="painel">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-4 py-8 md:px-6 lg:grid-cols-12 lg:gap-8 lg:py-12">
        <header className="border-b-2 border-border-cloud pb-4 lg:col-span-12">
          <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Olá{primeiroNome ? `, ${primeiroNome}` : ""}
          </h1>
          <p className="mt-1 text-body-lg text-text-secondary">O teu progresso neste espaço.</p>
        </header>

        <aside aria-label="O teu perfil" className="lg:col-span-4">
          <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay lg:p-6">
            <div className="flex items-center gap-4">
              <span className="relative">
                <Avatar name={nome} size="lg" />
                <span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full border-[3px] border-white bg-brand-ocean text-caption font-bold text-white tabular-nums">
                  <span className="sr-only">Nível </span>
                  {nivel}
                </span>
              </span>
              <div className="min-w-0">
                <p className="truncate font-montserrat text-headline-h3 font-extrabold text-on-surface">{nome}</p>
                <p className="text-caption text-text-secondary">
                  Nível {nivel} · {titulo}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-8 lg:col-span-8">
          <section aria-labelledby="stats-title">
            <h2 id="stats-title" className="sr-only">
              Resumo
            </h2>
            {stats.isPending ? (
              <p role="status" className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-6 text-center text-body-md text-text-secondary">
                A carregar o resumo...
              </p>
            ) : stats.isError || !stats.data ? (
              <p role="alert" className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-6 text-center text-body-md text-text-secondary">
                Não foi possível carregar o resumo. Tenta novamente dentro de instantes.
              </p>
            ) : (
              <dl className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col justify-between gap-2 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                  <dt className="text-overline text-text-tertiary uppercase">XP neste espaço</dt>
                  <dd className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums sm:text-headline-h2">
                    {formatInt(stats.data.pontos)}
                  </dd>
                </div>
                <div className="flex flex-col justify-between gap-2 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                  <dt className="text-overline text-text-tertiary uppercase">Cursos concluídos</dt>
                  <dd className="font-montserrat text-headline-h3 font-extrabold text-feedback-streak-ink tabular-nums sm:text-headline-h2">
                    {stats.data.cursosConcluidos}
                  </dd>
                </div>
                <div className="flex flex-col justify-between gap-2 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
                  <dt className="text-overline text-text-tertiary uppercase">Simulados feitos</dt>
                  <dd className="font-montserrat text-headline-h3 font-extrabold text-feedback-gem-ink tabular-nums sm:text-headline-h2">
                    {stats.data.simuladosFeitos}
                  </dd>
                </div>
              </dl>
            )}
          </section>

          <SectionCard title="Os teus cursos">
            {cursos.isPending ? (
              <p role="status" className="text-body-md text-text-secondary">
                A carregar os cursos...
              </p>
            ) : cursos.isError ? (
              <p role="alert" className="text-body-md text-text-secondary">
                Não foi possível carregar os cursos.
              </p>
            ) : (cursos.data ?? []).length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-body-md text-text-secondary">Ainda não fizeste nenhum simulado neste espaço.</p>
                <LinkButton3D href="/v2/marketplace" className="mt-4" trailingIcon={<Icon name="arrow-right" size={18} />}>
                  Explorar materiais
                </LinkButton3D>
              </div>
            ) : (
              <ul className="-mx-2 flex flex-col">
                {(cursos.data ?? []).map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/v2/marketplace/${encodeURIComponent(c.id)}`}
                      className="flex min-h-16 items-center gap-4 rounded-2xl p-2 transition-[background-color] duration-150 hover:bg-surface-soft"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                        <Icon name="book" size={22} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body-md font-bold text-on-surface">{c.titulo}</span>
                        <span className="block text-caption text-text-secondary">{formatarData(c.ultimoAcesso)}</span>
                        <ProgressBar value={c.progresso} max={100} size="sm" label={`Progresso em ${c.titulo}`} valueText={`${c.progresso}%`} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
