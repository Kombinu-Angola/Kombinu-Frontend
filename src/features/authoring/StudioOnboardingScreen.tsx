import { CreatorShell } from "../../components/layout/CreatorShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { cn } from "@/lib/utils";

export type StudioStep = { id: string; label: string; detail: string; done: boolean; href: string };

export type StudioTemplate = {
  id: string;
  icon: IconName;
  tone: string;
  title: string;
  description: string;
  blocks: string;
  minutes: number;
  href: string;
};

const TEMPLATES: StudioTemplate[] = [
  {
    id: "resumo",
    icon: "book",
    tone: "bg-primary-fixed text-primary",
    title: "Resumo editorial de 5 minutos",
    description: "Introdução, três conceitos-chave, um diagrama e dois checkpoints. O formato que mais se vende.",
    blocks: "8 blocos pré-montados",
    minutes: 25,
    href: "/v2/estudio",
  },
  {
    id: "simulado",
    icon: "bolt",
    tone: "bg-secondary-fixed text-brand-sunbeam-ink",
    title: "Simulado de 10 questões",
    description: "Estrutura de frequência, com distribuição por tópico já sugerida a partir do peso no exame.",
    blocks: "10 lugares de questão",
    minutes: 15,
    href: "/v2/estudio/simulado",
  },
  {
    id: "sebenta",
    icon: "target",
    tone: "bg-feedback-gem/20 text-feedback-gem-ink",
    title: "Sebenta modular da cadeira",
    description: "Quatro módulos ligados, com checkpoint no fim de cada um e exame final.",
    blocks: "4 módulos e 1 exame",
    minutes: 120,
    href: "/v2/estudio/trilha",
  },
];

type StudioOnboardingScreenProps = { creatorName: string; university: string; steps: StudioStep[] };

/** Primeira entrada no estúdio: caminho até à primeira venda e modelos para não começar do zero. */
export default function StudioOnboardingScreen({ creatorName, university, steps }: StudioOnboardingScreenProps) {
  const done = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);

  return (
    <CreatorShell active="estudio" creatorName={creatorName}>
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-6 lg:py-10">
        <header className="mb-8 flex flex-col items-center gap-4 rounded-3xl border-2 border-feedback-success bg-surface-canvas p-6 text-center shadow-clay sm:p-8">
          <Asset3D name="badge-caloiro" alt="" size={88} priority />
          <p className="inline-flex items-center gap-2 rounded-full bg-surface-forest px-3.5 py-1 text-overline text-feedback-success uppercase">
            <Icon name="seal" size={15} />
            Criador homologado · {university}
          </p>
          <h1 className="font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            Bem-vindo ao estúdio, {creatorName.split(" ")[0]}
          </h1>
          <p className="max-w-xl text-body-lg text-pretty text-text-secondary">
            Os estudantes da tua faculdade já procuram material das tuas cadeiras. Começa por um modelo: é mais rápido
            do que partir de uma página em branco.
          </p>
        </header>

        <section aria-labelledby="steps-title" className="mb-8 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 id="steps-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Caminho até à primeira venda
            </h2>
            <span className="text-caption font-bold text-primary tabular-nums">
              {done} de {steps.length} concluídos
            </span>
          </div>

          <ProgressBar
            value={done}
            max={steps.length}
            label="Progresso até à primeira venda"
            valueText={`${done} de ${steps.length} passos concluídos`}
          />

          <ol className="mt-5 flex flex-col gap-3">
            {steps.map((step, index) => {
              const isNext = step.id === next?.id;
              return (
                <li key={step.id}>
                  <article
                    className={cn(
                      "flex flex-col items-start justify-between gap-3 rounded-2xl border-2 p-4 sm:flex-row sm:items-center",
                      step.done
                        ? "border-border-cloud bg-surface-soft"
                        : isNext
                          ? "border-brand-ocean bg-surface-canvas shadow-elevation-1"
                          : "border-dashed border-border-input bg-surface-canvas",
                    )}
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-bold tabular-nums",
                          step.done ? "bg-feedback-success text-surface-ink" : isNext ? "bg-brand-ocean text-white" : "border-2 border-border-input text-text-tertiary",
                        )}
                      >
                        {step.done ? <Icon name="check" size={18} strokeWidth={3} /> : index + 1}
                      </span>
                      <div>
                        <p className={cn("text-body-md font-bold", step.done ? "text-text-secondary" : "text-on-surface")}>
                          {step.label}
                        </p>
                        <p className="text-caption text-text-tertiary">{step.detail}</p>
                      </div>
                    </div>

                    {!step.done && (
                      <LinkButton3D
                        href={step.href}
                        variant={isNext ? "primary" : "ghost"}
                        className="shrink-0"
                        trailingIcon={<Icon name="arrow-right" size={18} />}
                      >
                        {isNext ? "Começar" : "Abrir"}
                        <span className="sr-only">: {step.label}</span>
                      </LinkButton3D>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="templates-title">
          <h2 id="templates-title" className="mb-1 font-montserrat text-headline-h2 text-on-surface">
            Escolhe um modelo para começar
          </h2>
          <p className="mb-5 text-body-md text-text-secondary">
            Cada modelo abre já com a estrutura montada. Podes mudar tudo depois.
          </p>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TEMPLATES.map((template) => (
              <li key={template.id}>
                <article className="flex h-full flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 transition-[translate,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay">
                  <div>
                    <span className={cn("flex size-12 items-center justify-center rounded-xl", template.tone)}>
                      <Icon name={template.icon} size={24} />
                    </span>
                    <h3 className="mt-4 font-montserrat text-headline-h3 font-extrabold text-on-surface">{template.title}</h3>
                    <p className="mt-2 text-caption text-text-secondary">{template.description}</p>
                    <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-caption text-text-tertiary tabular-nums">
                      <span className="flex items-center gap-1">
                        <Icon name="file" size={14} />
                        {template.blocks}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="clock" size={14} />
                        cerca de {template.minutes} min
                      </span>
                    </p>
                  </div>
                  <LinkButton3D href={template.href} fullWidth className="mt-5" trailingIcon={<Icon name="arrow-right" size={18} />}>
                    Usar este modelo
                  </LinkButton3D>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7 flex flex-col items-start justify-between gap-4 rounded-2xl bg-surface-soft p-5 md:flex-row md:items-center">
          <p className="text-body-md text-text-secondary">
            Preferes partir do zero ou trazer o que já tens?
          </p>
          <div className="flex flex-wrap gap-2">
            <LinkButton3D href="/v2/estudio" variant="ghost">
              Abrir estúdio em branco
            </LinkButton3D>
            <LinkButton3D href="/v2/estudio/importar" variant="secondary" leadingIcon={<Icon name="download" size={18} />}>
              Importar prova antiga
            </LinkButton3D>
          </div>
        </section>
      </div>
    </CreatorShell>
  );
}
