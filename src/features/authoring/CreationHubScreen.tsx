import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { LinkButton3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon, type IconName } from "../../components/ui/Icon";
import { cn } from "@/lib/utils";

type Format = {
  id: string;
  icon: IconName;
  tone: string;
  badge: string;
  title: string;
  description: string;
  effort: string;
  weight: string;
  money: string;
  cta: string;
  href: string;
};

const FORMATS: Format[] = [
  {
    id: "artigo",
    icon: "book",
    tone: "bg-primary-fixed text-primary",
    badge: "Leitura com checkpoints",
    title: "Artigo ou sebenta modular",
    description:
      "Texto estruturado em blocos, com destaques, diagramas e checkpoints de fixação ao longo da leitura.",
    effort: "30 a 60 min a escrever",
    weight: "Menos de 1 MB por artigo",
    money: "Venda avulsa ou acesso livre",
    cta: "Escrever no estúdio",
    href: "/v2/estudio",
  },
  {
    id: "simulado",
    icon: "bolt",
    tone: "bg-secondary-fixed text-brand-sunbeam-ink",
    badge: "Procura alta em época de frequências",
    title: "Simulado de exame",
    description:
      "Entre 5 e 20 questões do teu banco, com cronómetro, XP para a liga e explicação por alternativa.",
    effort: "15 min, a partir do banco",
    weight: "Menos de 200 KB",
    money: "Maior volume de vendas por Express",
    cta: "Abrir compositor de simulado",
    href: "/v2/estudio/simulado",
  },
  {
    id: "trilha",
    icon: "target",
    tone: "bg-feedback-gem/20 text-feedback-gem-ink",
    badge: "Acompanha o semestre inteiro",
    title: "Trilha sequencial da cadeira",
    description:
      "Organiza artigos e simulados numa sequência com pré-requisitos, progresso por nó e exame final.",
    effort: "2 a 3 h a montar",
    weight: "Reutiliza o que já publicaste",
    money: "Fideliza o estudante ao longo do semestre",
    cta: "Abrir compositor de trilha",
    href: "/v2/estudio/trilha",
  },
  {
    id: "enquete",
    icon: "comment",
    tone: "bg-surface-forest text-feedback-success",
    badge: "Uma pergunta, dez segundos",
    title: "Micro-enquete",
    description:
      "Uma pergunta curta no fim de um material, para perceber o que ficou por explicar antes do exame.",
    effort: "5 min a preparar",
    weight: "Sem custo de dados relevante",
    money: "Não é vendável: serve para melhorar o que vendes",
    cta: "Preparar enquete",
    href: "/v2/estudio/enquete",
  },
];

const SUBJECTS = [
  { value: "macro1", label: "Macroeconomia I — UAN, Economia, 2.º ano" },
  { value: "macro2", label: "Macroeconomia II — UAN, Economia, 3.º ano" },
  { value: "estat", label: "Estatística Aplicada — UAN, Economia, 2.º ano" },
];

type CreationHubScreenProps = { creatorName: string; questionCount: number; draftCount: number };

/** Hub de criação: escolher o formato antes de abrir um editor. */
export default function CreationHubScreen({ creatorName, questionCount, draftCount }: CreationHubScreenProps) {
  const [subject, setSubject] = useState(SUBJECTS[0].value);

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
            Os quatro formatos partilham o mesmo banco de questões e os mesmos blocos. Podes começar por um e
            reaproveitar no seguinte.
          </p>
        </header>

        <section
          aria-labelledby="target-title"
          className="mb-7 flex flex-col justify-between gap-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 md:flex-row md:items-end"
        >
          <div className="md:max-w-md md:flex-1">
            <h2 id="target-title" className="sr-only">
              Cadeira de destino
            </h2>
            <SelectField
              id="target-subject"
              label="Para que cadeira"
              hint="Define a liga, o diagnóstico e os tópicos disponíveis."
              options={SUBJECTS}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <p className="flex flex-wrap gap-2">
            <a
              href="/v2/estudio/questoes"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-border-cloud bg-surface-canvas px-3.5 text-caption font-bold text-text-secondary transition-[border-color,color] duration-150 hover:border-brand-ocean hover:text-primary"
            >
              <Icon name="file" size={16} />
              {questionCount} questões no banco
            </a>
            <a
              href="/v2/estudio/materiais"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-border-cloud bg-surface-canvas px-3.5 text-caption font-bold text-text-secondary transition-[border-color,color] duration-150 hover:border-brand-ocean hover:text-primary"
            >
              <Icon name="edit" size={16} />
              {draftCount} rascunhos por terminar
            </a>
          </p>
        </section>

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

                <ul className="mt-4 flex flex-col gap-2 rounded-xl bg-surface-soft p-3.5">
                  {[
                    { icon: "clock" as const, text: format.effort, tone: "text-text-tertiary" },
                    { icon: "bolt" as const, text: format.weight, tone: "text-feedback-success-ink" },
                    { icon: "wallet" as const, text: format.money, tone: "text-text-tertiary" },
                  ].map((meta) => (
                    <li key={meta.text} className="flex items-start gap-2 text-caption text-text-secondary">
                      <Icon name={meta.icon} size={15} className={cn("mt-0.5 shrink-0", meta.tone)} />
                      {meta.text}
                    </li>
                  ))}
                </ul>
              </div>

              <LinkButton3D href={format.href} fullWidth className="mt-6" trailingIcon={<Icon name="arrow-right" size={18} />}>
                {format.cta}
              </LinkButton3D>
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
          <LinkButton3D href="/v2/estudio/importar" variant="secondary" className="shrink-0">
            Importar questões
          </LinkButton3D>
        </section>
      </div>
    </CreatorShell>
  );
}
