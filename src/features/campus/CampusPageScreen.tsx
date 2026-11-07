import { AppShell } from "../../components/layout/AppShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { formatInt, formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { Asset3DName } from "../../lib/assets3d";

export type CampusTopStudent = { rank: number; name: string; course: string; xp: number; streakDays: number };

export type CampusMaterial = {
  id: string;
  title: string;
  subject: string;
  author: string;
  priceKz: number;
  rating: number;
  sizeKb: number;
  cover: Asset3DName;
  href: string;
};

export type CampusPage = {
  university: string;
  universityFull: string;
  faculty: string;
  campus: string;
  city: string;
  description: string;
  students: number;
  materials: number;
  division: string;
  divisionRank: number;
  leagueHref: string;
  topStudents: CampusTopStudent[];
  materialsList: CampusMaterial[];
};

const MEDAL = [
  "border-t-secondary-container bg-surface-canvas",
  "border-t-border-cloud-strong bg-surface-canvas",
  "border-t-feedback-streak bg-surface-canvas",
];

type CampusPageScreenProps = { page: CampusPage; userName: string };

/** Página do polo académico: prova social da faculdade e os materiais que lá circulam. */
export default function CampusPageScreen({ page, userName }: CampusPageScreenProps) {
  return (
    <AppShell active="trilhas" userName={userName} campus={`${page.university} · ${page.faculty}`}>
      <div className="mx-auto max-w-[1140px] px-4 py-6 md:px-6 lg:py-8">
        <section
          aria-labelledby="campus-title"
          className="rounded-3xl border-2 border-brand-ocean bg-surface-sky p-6 shadow-clay sm:p-8"
        >
          <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
            <a href="/v2/trilhas" className="hover:text-primary">
              Universidades
            </a>
            <span aria-hidden="true">/</span>
            <a href="/v2/trilhas" className="hover:text-primary">
              {page.universityFull}
            </a>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-bold text-primary">
              {page.faculty}
            </span>
          </nav>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <h1 id="campus-title" className="font-montserrat text-headline-h1-mobile text-balance text-primary sm:text-headline-h1">
                {page.faculty} — {page.university}
              </h1>
              <p className="mt-2 text-body-lg text-pretty text-text-secondary">{page.description}</p>

              <ul className="mt-5 flex flex-wrap gap-2.5">
                {[
                  { icon: "users" as const, text: `${formatInt(page.students)} estudantes ativos`, tone: "border-brand-ocean text-primary" },
                  { icon: "book" as const, text: `${page.materials} materiais validados`, tone: "border-feedback-success text-feedback-success-ink" },
                  {
                    icon: "trophy" as const,
                    text: `${page.divisionRank}.º lugar na ${page.division}`,
                    tone: "border-feedback-streak text-feedback-streak-ink",
                  },
                ].map((pill) => (
                  <li
                    key={pill.text}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border-2 bg-surface-canvas px-3.5 py-1.5 text-caption font-bold tabular-nums",
                      pill.tone,
                    )}
                  >
                    <Icon name={pill.icon} size={15} />
                    {pill.text}
                  </li>
                ))}
              </ul>
            </div>

            <LinkButton3D href={page.leagueHref} size="lg" className="shrink-0" trailingIcon={<Icon name="arrow-right" size={20} />}>
              Entrar na liga da {page.university}
            </LinkButton3D>
          </div>
        </section>

        <section aria-labelledby="top-title" className="mt-8 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-2 border-b-2 border-border-cloud pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 id="top-title" className="font-montserrat text-headline-h2 text-on-surface">
                Melhores da faculdade esta semana
              </h2>
              <p className="mt-0.5 text-caption text-text-secondary">XP acumulado na liga de Luanda.</p>
            </div>
            <a href={page.leagueHref} className="flex min-h-11 items-center gap-1 text-button text-primary uppercase hover:underline">
              Ver a classificação
              <Icon name="arrow-right" size={16} />
            </a>
          </div>

          <ol className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {page.topStudents.map((student) => (
              <li key={student.rank}>
                <article className={cn("relative flex h-full flex-col justify-between rounded-2xl border-2 border-t-4 border-border-cloud p-5", MEDAL[student.rank - 1])}>
                  <span className="absolute -top-3 right-4 rounded-full bg-surface-ink px-2.5 py-0.5 text-overline text-white uppercase tabular-nums">
                    {student.rank}.º lugar
                  </span>

                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} />
                    <div className="min-w-0">
                      <h3 className="truncate text-headline-h3 text-on-surface">{student.name}</h3>
                      <p className="text-caption text-text-secondary">{student.course}</p>
                    </div>
                  </div>

                  <p className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-surface-soft p-3">
                    <span className="text-caption text-text-secondary">XP da semana</span>
                    <span className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                      {formatInt(student.xp)}
                    </span>
                  </p>

                  <p className="mt-3 flex items-center gap-1.5 border-t-2 border-border-cloud pt-3 text-caption font-bold text-feedback-streak-ink tabular-nums">
                    <Icon name="flame" size={15} />
                    {student.streakDays} dias de ofensiva
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="materials-title" className="mt-8">
          <div className="mb-5">
            <h2 id="materials-title" className="font-montserrat text-headline-h2 text-on-surface">
              Materiais mais procurados nesta faculdade
            </h2>
            <p className="mt-0.5 text-body-md text-text-secondary">
              Preparados para leitura offline, com selo de verificação pedagógica.
            </p>
          </div>

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

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-border-cloud pt-3">
                    <p className="flex items-center gap-2 text-caption text-text-secondary tabular-nums">
                      <span className="flex items-center gap-1">
                        <Icon name="star" size={15} className="fill-feedback-streak text-feedback-streak" />
                        <strong className="text-on-surface">{material.rating.toLocaleString("pt-AO")}</strong>
                      </span>
                      <span className="text-text-tertiary">{Math.round(material.sizeKb / 102.4) / 10} MB</span>
                    </p>
                    <p className="font-bold tabular-nums">
                      {material.priceKz === 0 ? (
                        <span className="rounded-full bg-feedback-success px-2.5 py-0.5 text-overline text-surface-ink uppercase">
                          Grátis
                        </span>
                      ) : (
                        <span className="text-primary">{formatKz(material.priceKz)}</span>
                      )}
                    </p>
                  </div>

                  <LinkButton3D href={material.href} fullWidth className="mt-4" trailingIcon={<Icon name="arrow-right" size={18} />}>
                    Abrir
                    <span className="sr-only">: {material.title}</span>
                  </LinkButton3D>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
