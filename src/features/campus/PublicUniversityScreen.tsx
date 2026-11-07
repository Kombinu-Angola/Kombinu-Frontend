import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { formatInt, formatKz, formatSize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { CampusPage } from "./CampusPageScreen";

const MEDAL = ["bg-secondary-container text-surface-ink", "bg-surface-container-highest text-on-surface", "bg-feedback-streak text-surface-ink"];

type PublicUniversityScreenProps = { page: CampusPage; signUpHref: string; signInHref: string };

/** Página pública do polo: a porta de entrada para quem chega de fora, sem sessão iniciada. */
export default function PublicUniversityScreen({ page, signUpHref, signInHref }: PublicUniversityScreenProps) {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-brand-ocean px-4 py-2 text-button text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar para o conteúdo
      </a>

      <header className="sticky top-0 z-40 border-b-2 border-border-cloud bg-surface-canvas">
        <div className="mx-auto flex min-h-16 max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-2 md:px-6">
          <span className="flex items-center gap-3">
            <a href="/v2" className="font-montserrat text-headline-h2 font-extrabold text-primary">
              Kombinu
            </a>
            <span className="hidden items-center gap-1.5 rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase sm:inline-flex">
              <Icon name="bolt" size={13} />
              Estuda com menos de 5 MB por hora
            </span>
          </span>

          <nav aria-label="Entrada" className="flex items-center gap-2">
            <a
              href={signInHref}
              className="flex min-h-11 items-center rounded-full px-4 text-button text-text-secondary uppercase hover:text-primary"
            >
              Entrar
            </a>
            <LinkButton3D href={signUpHref}>Começar grátis</LinkButton3D>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 lg:py-10">
        <nav aria-label="Caminho" className="mb-4 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href="/v2" className="hover:text-primary">
            Universidades angolanas
          </a>
          <span aria-hidden="true">/</span>
          <a href="/v2" className="hover:text-primary">
            {page.universityFull}
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            {page.faculty}
          </span>
        </nav>

        <section
          aria-labelledby="hero-title"
          className="flex flex-col justify-between gap-6 rounded-3xl border-2 border-brand-ocean bg-surface-sky p-6 shadow-clay sm:p-8 lg:flex-row lg:items-center"
        >
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-canvas px-3 py-1 text-overline text-primary uppercase">
              <Icon name="seal" size={14} />
              Polo universitário
            </p>
            <h1 id="hero-title" className="mt-3 font-montserrat text-headline-h1-mobile text-balance text-primary sm:text-display-l">
              {page.faculty} — {page.university}
            </h1>
            <p className="mt-3 max-w-2xl text-body-lg text-pretty text-text-secondary">{page.description}</p>

            <ul className="mt-5 flex flex-wrap gap-2.5">
              {[
                { icon: "users" as const, text: `${formatInt(page.students)} estudantes ativos` },
                { icon: "book" as const, text: `${page.materials} materiais validados` },
                { icon: "trophy" as const, text: `${page.divisionRank}.º lugar na ${page.division}` },
              ].map((pill) => (
                <li
                  key={pill.text}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-border-cloud bg-surface-canvas px-3.5 py-1.5 text-caption font-bold text-text-secondary tabular-nums"
                >
                  <Icon name={pill.icon} size={15} className="text-primary" />
                  {pill.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0">
            <LinkButton3D href={signUpHref} size="lg" trailingIcon={<Icon name="arrow-right" size={20} />}>
              Juntar-me aos estudantes da {page.university}
            </LinkButton3D>
            <p className="mt-2 text-center text-caption text-text-secondary">Grátis, com entrada por SMS.</p>
          </div>
        </section>

        <section aria-labelledby="top-title" className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 id="top-title" className="font-montserrat text-headline-h2 text-on-surface">
                Melhores estudantes desta faculdade
              </h2>
              <p className="text-caption text-text-secondary">Classificação da semana, por XP acumulado.</p>
            </div>
          </div>

          <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {page.topStudents.map((student) => (
              <li key={student.rank}>
                <article className="flex h-full flex-col gap-3 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
                  <p className="flex items-center justify-between gap-2">
                    <span className={cn("flex size-9 items-center justify-center rounded-full text-caption font-bold tabular-nums", MEDAL[student.rank - 1])}>
                      {student.rank}
                      <span className="sr-only">.º lugar</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-caption font-bold text-feedback-streak-ink tabular-nums">
                      <Icon name="flame" size={14} />
                      {student.streakDays} dias
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <Avatar name={student.name} />
                    <span className="min-w-0">
                      <span className="block truncate text-headline-h3 text-on-surface">{student.name}</span>
                      <span className="block text-caption text-text-tertiary">{student.course}</span>
                    </span>
                  </p>

                  <p className="mt-auto flex items-baseline justify-between gap-2 rounded-xl bg-surface-soft p-3">
                    <span className="text-caption text-text-secondary">XP da semana</span>
                    <span className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                      {formatInt(student.xp)}
                    </span>
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="materials-title" className="mt-10">
          <h2 id="materials-title" className="font-montserrat text-headline-h2 text-on-surface">
            Materiais mais procurados
          </h2>
          <p className="mt-0.5 mb-5 text-body-md text-text-secondary">
            Preparados para leitura offline, com verificação pedagógica.
          </p>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {page.materialsList.map((material) => (
              <li key={material.id}>
                <article className="flex h-full flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 transition-[translate,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay">
                  <div>
                    <span className="flex h-28 items-center justify-center rounded-2xl bg-surface-soft">
                      <Asset3D name={material.cover} alt="" size={56} />
                    </span>
                    <p className="mt-4 text-overline text-text-tertiary uppercase">{material.subject}</p>
                    <h3 className="mt-1 font-montserrat text-headline-h3 leading-snug font-extrabold text-on-surface">
                      {material.title}
                    </h3>
                    <p className="mt-1.5 text-caption text-text-secondary">{material.author}</p>
                  </div>

                  <div className="mt-4 border-t-2 border-border-cloud pt-3">
                    <p className="flex flex-wrap items-center justify-between gap-2 text-caption text-text-secondary tabular-nums">
                      <span className="flex items-center gap-1">
                        <Icon name="star" size={15} className="fill-feedback-streak text-feedback-streak" />
                        <strong className="text-on-surface">{material.rating.toLocaleString("pt-AO")}</strong>
                      </span>
                      <span>{formatSize(material.sizeKb)}</span>
                      <strong className={material.priceKz === 0 ? "text-feedback-success-ink" : "text-primary"}>
                        {material.priceKz === 0 ? "Grátis" : formatKz(material.priceKz)}
                      </strong>
                    </p>
                    <LinkButton3D href={signUpHref} fullWidth className="mt-3" trailingIcon={<Icon name="arrow-right" size={18} />}>
                      Aceder
                      <span className="sr-only">: {material.title}</span>
                    </LinkButton3D>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="cta-title"
          className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-brand-ocean p-8 text-center text-white"
        >
          <h2 id="cta-title" className="font-montserrat text-headline-h1-mobile text-balance sm:text-headline-h1">
            Estudas ou ensinas na {page.faculty}?
          </h2>
          <p className="max-w-xl text-body-lg text-pretty text-white">
            Entra com o teu número, escolhe a cadeira crítica e começa pelo diagnóstico. Quem ensina pode publicar e
            receber por Multicaixa Express.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <LinkButton3D href={signUpHref} size="lg" className="bg-surface-canvas text-primary shadow-none hover:brightness-95">
              Começar como estudante
            </LinkButton3D>
            <LinkButton3D
              href={signUpHref}
              size="lg"
              className="border-2 border-white bg-transparent text-white shadow-none hover:bg-white/10"
            >
              Quero publicar material
            </LinkButton3D>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t-2 border-border-cloud bg-surface-canvas py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 text-caption text-text-secondary md:flex-row md:px-6">
          <p className="font-montserrat text-headline-h3 font-extrabold text-primary">Kombinu</p>
          <nav aria-label="Rodapé" className="flex flex-wrap justify-center gap-5">
            {["Sobre nós", "Termos de uso", "Privacidade", "Ajuda"].map((item) => (
              <a key={item} href="/v2" className="hover:text-primary">
                {item}
              </a>
            ))}
          </nav>
          <p className="tabular-nums">© 2026 Kombinu · Luanda, Angola</p>
        </div>
      </footer>
    </div>
  );
}
