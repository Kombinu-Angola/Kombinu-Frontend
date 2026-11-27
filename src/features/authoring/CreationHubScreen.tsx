import { CreatorShell } from "../../components/layout/CreatorShell";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { cn } from "@/lib/utils";

type Format = {
  id: string;
  icon: IconName;
  tone: string;
  badge: string;
  title: string;
  description: string;
  cta: string;
  /** Sem `href` o formato ainda não tem ecrã: mostra «Em breve» em vez de um botão que leva a outro «Em breve». */
  href?: string;
};

const FORMATS: Format[] = [
  {
    id: "artigo",
    icon: "book",
    tone: "bg-primary-fixed text-primary",
    badge: "Texto, vídeo ou quiz",
    title: "Artigo ou sebenta",
    description: "Escreve o texto, junta um vídeo ou monta um quiz com perguntas de escolha múltipla.",
    cta: "Escrever no estúdio",
    // Enquanto o compositor novo não existe, o formulário de criação é o `/courses/create`.
    href: "/courses/create",
  },
  {
    id: "simulado",
    icon: "bolt",
    tone: "bg-secondary-fixed text-brand-sunbeam-ink",
    badge: "Em breve",
    title: "Simulado de exame",
    description: "Um compositor só para simulados. Por agora, junta um quiz ao teu artigo.",
    cta: "Abrir compositor de simulado",
  },
  {
    id: "trilha",
    icon: "target",
    tone: "bg-feedback-gem/20 text-feedback-gem-ink",
    badge: "Em breve",
    title: "Trilha de estudo",
    description: "Junta artigos e simulados numa sequência de estudo.",
    cta: "Abrir compositor de trilha",
  },
  {
    id: "enquete",
    icon: "comment",
    tone: "bg-surface-forest text-feedback-success",
    badge: "Pergunta rápida",
    title: "Micro-enquete",
    description: "Uma pergunta curta para os estudantes responderem.",
    cta: "Preparar enquete",
    href: "/v2/estudio/enquete",
  },
];

type CreationHubScreenProps = { creatorName: string };

/** Hub de criação: escolher o formato antes de abrir um editor. */
export default function CreationHubScreen({ creatorName }: CreationHubScreenProps) {
  return (
    <CreatorShell active="materiais" creatorName={creatorName}>
      <div className="mx-auto max-w-[1080px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href="/v2/estudio/materiais" className="hover:text-primary">
            Os meus materiais
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            Criar conteúdo
          </span>
        </nav>

        <header className="mb-6">
          <h1 className="font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            O que queres criar?
          </h1>
          <p className="mt-1 max-w-2xl text-body-md text-text-secondary">
            Por agora podes escrever artigos e preparar enquetes. O compositor de simulados, as trilhas e a importação
            chegam em breve.
          </p>
        </header>

        <section aria-label="Formatos disponíveis" className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {FORMATS.map((format) => (
            <article
              key={format.id}
              className="flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 transition-[translate,border-color,box-shadow] duration-200 ease-out-quint hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay"
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", format.tone)}>
                    <Icon name={format.icon} size={24} />
                  </span>
                  <span className="rounded-full bg-surface-soft px-2.5 py-1 text-overline text-text-secondary uppercase">
                    {format.badge}
                  </span>
                </div>

                <h2 className="font-montserrat text-headline-h2 text-on-surface">{format.title}</h2>
                <p className="mt-2 text-body-md text-text-secondary">{format.description}</p>

              </div>

              {format.href ? (
                <LinkButton3D href={format.href} fullWidth className="mt-6" trailingIcon={<Icon name="arrow-right" size={18} />}>
                  {format.cta}
                </LinkButton3D>
              ) : (
                <p className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-surface-soft px-4 text-button text-text-secondary uppercase">
                  <Icon name="clock" size={18} />
                  Em breve
                </p>
              )}
            </article>
          ))}
        </section>

        <section className="mt-7 flex flex-col items-start justify-between gap-4 rounded-2xl bg-surface-soft p-5 md:flex-row md:items-center">
          <p className="flex items-start gap-3">
            <Icon name="download" size={22} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <span className="block text-body-md font-bold text-on-surface">Já tens provas antigas em Word ou Excel?</span>
              <span className="block text-caption text-text-secondary">
                Importa o ficheiro e as questões entram direto no banco, prontas a usar em qualquer simulado.
              </span>
            </span>
          </p>
          <p className="flex min-h-12 shrink-0 items-center gap-2 rounded-2xl bg-surface-canvas px-4 text-button text-text-secondary uppercase">
            <Icon name="clock" size={18} />
            Em breve
          </p>
        </section>
      </div>
    </CreatorShell>
  );
}
