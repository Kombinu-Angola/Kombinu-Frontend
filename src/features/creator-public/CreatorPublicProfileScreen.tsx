import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime, formatInt, formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { CreatorPublicProfile, CreatorTab } from "./types";

const rating = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rating1 = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type CreatorPublicProfileScreenProps = { creator: CreatorPublicProfile; userName: string };

/** Vitrine pública do criador: autoridade académica, materiais e avaliações. */
export default function CreatorPublicProfileScreen({ creator, userName }: CreatorPublicProfileScreenProps) {
  const [tab, setTab] = useState<CreatorTab>("sebentas");
  const [following, setFollowing] = useState(false);
  const toast = useToast();

  const tabs: ReadonlyArray<{ value: CreatorTab; label: string }> = [
    { value: "sebentas", label: `Sebentas (${creator.materials.length})` },
    { value: "quizzes", label: `Quizzes (${creator.quizzes})` },
    { value: "metodologia", label: "Metodologia" },
    { value: "comentarios", label: `Comentários (${creator.stats.reviews})` },
  ];

  const stats = [
    { id: "students", label: "Estudantes ativos", value: formatInt(creator.stats.students), icon: "users" as const },
    { id: "rating", label: `${creator.stats.reviews} avaliações`, value: rating.format(creator.stats.rating), icon: "star" as const },
    { id: "materials", label: "Materiais publicados", value: String(creator.stats.materials), icon: "book" as const },
    { id: "pass", label: "Acerto médio nos quizzes", value: `${creator.stats.passRate}%`, icon: "target" as const },
  ];

  return (
    <AppShell active="sebentas" userName={userName} campus={creator.university}>
      <div className="mx-auto max-w-[1240px] px-4 py-6 md:px-6 lg:py-8">
        <a href="/v2/marketplace" className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary">
          <Icon name="arrow-left" size={16} />
          Voltar às sebentas
        </a>

        <header className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar name={creator.name} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">{creator.name}</h1>
                  {creator.verified && (
                    <>
                      <Icon name="seal" size={22} className="text-brand-sky-ink" />
                      <span className="sr-only">explicador verificado</span>
                    </>
                  )}
                  {creator.plan === "pro" && (
                    <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-overline text-surface-ink uppercase">
                      Criador Pro
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-body-md font-bold text-primary">
                  <Icon name="school" size={17} />
                  {creator.university} · {creator.faculty}
                </p>
                <p className="mt-2 max-w-[680px] text-body-md text-text-secondary">{creator.bio}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button3D
                variant={following ? "secondary" : "primary"}
                aria-pressed={following}
                onClick={() => setFollowing((v) => !v)}
                leadingIcon={<Icon name={following ? "check" : "plus"} size={18} />}
              >
                {following ? "A seguir" : "Seguir explicador"}
              </Button3D>
              <Button3D variant="ghost" onClick={() => toast.show("Mensagens diretas em breve.")} leadingIcon={<Icon name="comment" size={18} />}>
                Mensagem
              </Button3D>
              <button
                type="button"
                aria-label="Copiar a ligação do perfil"
                onClick={async () => {
                  await navigator.clipboard?.writeText(window.location.href);
                  toast.show("Ligação copiada.");
                }}
                className="flex size-11 items-center justify-center rounded-full border-2 border-border-cloud text-text-secondary hover:bg-surface-soft hover:text-primary"
              >
                <Icon name="share" size={19} />
              </button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-surface-soft p-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.id}>
                <dt className="text-overline text-text-tertiary uppercase">{s.label}</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 font-montserrat text-headline-h2 font-extrabold text-on-surface tabular-nums">
                  <Icon name={s.icon} size={20} className="text-primary" />
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div role="tablist" aria-label="Conteúdo do explicador" className="mb-5 flex gap-2 overflow-x-auto border-b-2 border-border-cloud">
              {tabs.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "-mb-0.5 min-h-12 border-b-[3px] px-3 whitespace-nowrap transition-[color,border-color] duration-150",
                    tab === t.value ? "border-brand-ocean font-bold text-primary" : "border-transparent text-text-secondary hover:text-on-surface",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {(tab === "sebentas" || tab === "quizzes") && (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {creator.materials.map((m) => (
                  <li key={m.id}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas transition-[translate,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay">
                      <span className="flex h-32 items-center justify-center bg-surface-soft">
                        <Asset3D name={m.cover} alt="" size={64} className="transition-[scale] duration-300 group-hover:scale-105" />
                      </span>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="text-overline text-text-tertiary uppercase">{m.subject}</p>
                        <h2 className="mt-1 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                          <a href={m.href} className="hover:text-primary">
                            {m.title}
                          </a>
                        </h2>
                        <p className="mt-2 flex items-center gap-1 text-caption text-text-secondary">
                          <Icon name="star" size={15} className="fill-feedback-streak text-feedback-streak" />
                          <strong className="text-on-surface tabular-nums">{rating1.format(m.rating)}</strong>
                          <span className="text-text-tertiary tabular-nums">· {formatInt(m.students)} estudantes</span>
                        </p>
                        <p className="mt-auto pt-3 text-body-lg font-bold tabular-nums">
                          {m.priceKz === 0 ? (
                            <span className="rounded-full bg-feedback-success px-2.5 text-surface-ink uppercase">Grátis</span>
                          ) : (
                            <span className="text-primary">{formatKz(m.priceKz)}</span>
                          )}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}

            {tab === "metodologia" && (
              <section aria-labelledby="method-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
                <h2 id="method-title" className="font-montserrat text-headline-h2 text-on-surface">
                  Como preparo os materiais
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {creator.methodology.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-md text-text-secondary">
                      <Icon name="check" size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tab === "comentarios" && (
              <ul className="flex flex-col gap-4">
                {creator.reviewList.map((r) => (
                  <li key={r.id} className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <Avatar name={r.student} />
                        <span>
                          <span className="block text-body-md font-bold text-on-surface">{r.student}</span>
                          <span className="block text-caption text-text-tertiary">{r.course}</span>
                        </span>
                      </span>
                      <p className="flex items-center gap-1">
                        <Icon name="star" size={16} className="fill-feedback-streak text-feedback-streak" />
                        <span className="font-bold text-on-surface tabular-nums">{r.rating}</span>
                        <span className="sr-only">de 5</span>
                      </p>
                    </div>
                    <p className="mt-3 text-body-md text-text-secondary">{r.text}</p>
                    <p className="mt-2 text-caption text-text-tertiary">{formatActivityTime(r.at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside aria-labelledby="sub-title" className="rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-5 shadow-clay lg:col-span-4 lg:sticky lg:top-28">
            <h2 id="sub-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Subscrever {creator.name.split(" ")[0]}
            </h2>
            <p className="mt-2 text-body-md text-text-secondary">
              Acesso a todas as sebentas e quizzes deste explicador enquanto a subscrição estiver ativa.
            </p>
            <p className="mt-4 font-montserrat text-headline-h1-mobile font-extrabold text-primary tabular-nums">
              {formatKz(creator.subscriptionKz)}
              <span className="ml-1 font-lato text-body-md font-medium text-text-secondary">/mês</span>
            </p>
            <Button3D
              size="lg"
              fullWidth
              className="mt-4"
              onClick={() => toast.show("Subscrição de explicadores em preparação.")}
              trailingIcon={<Icon name="arrow-right" size={20} />}
            >
              Subscrever
            </Button3D>
            <p className="mt-3 flex items-start gap-2 text-caption text-text-secondary">
              <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-feedback-success-ink" />
              Podes cancelar a qualquer momento; mantens o que já compraste à parte.
            </p>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
