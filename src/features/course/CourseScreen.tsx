import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { Course } from "./types";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "short" });

type CourseScreenProps = { course: Course; userName: string };

/** Página da cadeira: publicação em destaque, próximos módulos e barra lateral de contexto. */
export default function CourseScreen({ course, userName }: CourseScreenProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const likes = course.hero.likes + (liked ? 1 : 0);

  return (
    <AppShell active="trilhas" userName={userName} campus="UAN · Economia">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-8 md:px-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:py-12">
        <div className="min-w-0">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-border-cloud pb-5">
            <div className="flex items-center gap-3">
              <Avatar name={course.author.name} />
              <div>
                <p className="flex items-center gap-1 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                  {course.author.name}
                  {course.author.verified && (
                    <>
                      <Icon name="seal" size={16} className="text-brand-sky-ink" />
                      <span className="sr-only">Autor verificado</span>
                    </>
                  )}
                </p>
                <p className="text-caption text-text-tertiary">
                  {course.author.role} ·{" "}
                  <time dateTime={course.publishedAt}>{dateFormat.format(new Date(course.publishedAt))}</time>
                </p>
              </div>
            </div>
            <Button3D
              variant={subscribed ? "secondary" : "primary"}
              aria-pressed={subscribed}
              onClick={() => setSubscribed((v) => !v)}
            >
              {subscribed ? "Cadeira seguida" : "Seguir cadeira"}
            </Button3D>
          </header>

          <article className="mb-12">
            <a href={course.hero.href} className="group block">
              <div className="mb-6 flex h-56 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-fixed to-surface-sky sm:h-72">
                <Asset3D
                  name={course.hero.asset}
                  alt=""
                  size={120}
                  priority
                  className="transition-[scale] duration-300 ease-out-quint group-hover:scale-105"
                />
              </div>
              <h1 className="mb-4 font-montserrat text-headline-h1-mobile text-balance text-on-surface group-hover:text-primary sm:text-headline-h1">
                {course.hero.title}
              </h1>
            </a>
            <p className="mb-5 text-body-lg text-text-secondary">{course.hero.summary}</p>

            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-surface-soft px-3 py-1 text-overline text-text-secondary uppercase">
                {course.hero.minutes} min de leitura
              </span>
              <span className="rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase tabular-nums">
                Quiz incluído · +{course.hero.quizXp} XP
              </span>
            </div>

            <footer className="flex items-center gap-2 border-y-2 border-border-cloud py-2">
              <button
                type="button"
                aria-pressed={liked}
                onClick={() => setLiked((v) => !v)}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-full px-3 text-body-md transition-[color,background-color] duration-150 hover:bg-surface-soft",
                  liked ? "font-bold text-feedback-error-ink" : "text-text-secondary",
                )}
              >
                <Icon name="heart" size={20} className={liked ? "fill-feedback-error" : undefined} />
                <span className="tabular-nums">{formatInt(likes)}</span>
                <span className="sr-only">gostos</span>
              </button>
              <a
                href={`${course.hero.href}#comentarios`}
                className="flex min-h-11 items-center gap-2 rounded-full px-3 text-body-md text-text-secondary transition-[background-color] duration-150 hover:bg-surface-soft"
              >
                <Icon name="comment" size={20} />
                <span className="tabular-nums">{formatInt(course.hero.comments)}</span>
                <span className="sr-only">comentários</span>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(course.hero.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex min-h-11 items-center gap-2 rounded-full px-3 text-body-md text-text-secondary transition-[background-color] duration-150 hover:bg-surface-soft"
              >
                <Icon name="share" size={20} />
                <span className="sr-only">Partilhar (abre numa nova janela)</span>
              </a>
            </footer>
          </article>

          <section aria-labelledby="modules-title">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 id="modules-title" className="font-montserrat text-headline-h2 text-on-surface">
                Próximos módulos
              </h2>
              <a href="/v2/trilha" className="flex min-h-11 items-center gap-1 text-button text-primary uppercase hover:underline">
                Ver a trilha completa
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
            <ul className="flex flex-col gap-4">
              {course.modules.map((m) => (
                <li key={m.id}>
                  <a
                    href={m.href}
                    className="group flex gap-4 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-4 transition-[translate,box-shadow,border-color] duration-200 ease-out-quint hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay-hover"
                  >
                    <span className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                      <span>
                        <span className="mb-1 block font-montserrat text-headline-h3 font-extrabold text-on-surface group-hover:text-primary">
                          {m.title}
                        </span>
                        <span className="block text-body-md text-text-secondary">{m.summary}</span>
                      </span>
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-overline text-text-tertiary uppercase tabular-nums">
                          {m.minutes} min de leitura
                        </span>
                        <span className="flex items-center gap-1 text-button text-primary uppercase">
                          Ler e praticar
                          <Icon name="arrow-right" size={16} />
                        </span>
                      </span>
                    </span>
                    <span className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-surface-soft">
                      <Asset3D name={m.asset} alt="" size={64} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-label="Contexto" className="hidden flex-col gap-8 xl:flex">
          <section aria-labelledby="mycourses-title">
            <h2 id="mycourses-title" className="mb-3 text-overline text-text-tertiary uppercase">
              As minhas cadeiras
            </h2>
            <ul className="flex flex-col gap-1">
              {course.myCourses.map((c) => (
                <li key={c.id}>
                  <a
                    href="/v2/marketplace"
                    aria-current={c.active ? "true" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-3 text-body-md transition-[background-color] duration-150 hover:bg-surface-soft",
                      c.active ? "bg-surface-sky font-bold text-primary" : "text-text-secondary",
                    )}
                  >
                    <Avatar name={c.name} size="sm" />
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="suggested-title">
            <h2 id="suggested-title" className="mb-3 text-overline text-text-tertiary uppercase">
              Recomendado para ti
            </h2>
            <ul className="flex flex-col gap-3">
              {course.suggestedAuthors.map((a) => {
                const isFollowing = following.includes(a.id);
                return (
                  <li key={a.id} className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Avatar name={a.name} />
                      <span className="min-w-0">
                        <span className="block truncate text-body-md font-bold text-on-surface">{a.name}</span>
                        <span className="block text-caption text-text-tertiary">{a.subject}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-pressed={isFollowing}
                      onClick={() =>
                        setFollowing((prev) => (prev.includes(a.id) ? prev.filter((id) => id !== a.id) : [...prev, a.id]))
                      }
                      className={cn(
                        "min-h-11 shrink-0 rounded-full border-2 px-4 text-button uppercase transition-[background-color,color] duration-150",
                        isFollowing
                          ? "border-border-cloud bg-surface-soft text-text-secondary"
                          : "border-brand-ocean text-primary hover:bg-surface-sky",
                      )}
                    >
                      {isFollowing ? "A seguir" : "Seguir"}
                      <span className="sr-only"> {a.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
