import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { Asset3D } from "../../components/ui/Asset3D";
import { LinkButton3D } from "../../components/ui/Button3D";
import { DataSaverBadge } from "../../components/ui/DataSaverBadge";
import { Icon } from "../../components/ui/Icon";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { StatusTimeline, type TimelineItem } from "../../components/ui/StatusTimeline";
import { INSTITUTIONS, PLANS } from "./constants";
import type { CreatorApplication, SubmitReceipt } from "./types";

export type CreatorLinks = { studio: string; home: string; support: string };

type CreatorConfirmationScreenProps = {
  application: CreatorApplication;
  receipt: SubmitReceipt;
  links: CreatorLinks;
};

/** Creator-04 — Candidatura submetida: protocolo, estado da auditoria e acesso ao estúdio em rascunho. */
export function CreatorConfirmationScreen({ application: app, receipt, links }: CreatorConfirmationScreenProps) {
  const headingRef = useFocusOnMount();

  const institution =
    app.institution === "other"
      ? app.institutionOther
      : (INSTITUTIONS.find((i) => i.value === app.institution)?.label ?? app.institution);
  const phone = maskAOPhone(app.expressPhone);
  const plan = PLANS.find((p) => p.id === app.plan);

  const timeline: TimelineItem[] = [
    {
      id: "affiliation",
      title: "Vínculo e cadeiras registados",
      detail: `${institution} · ${app.specialties.join(", ")}`,
      status: "done",
    },
    {
      id: "payout",
      title: "Número Multicaixa Express registado",
      detail: (
        <>
          <span aria-hidden="true" className="tabular-nums">
            {phone.visual}
          </span>
          <span className="sr-only">{phone.spoken}</span>
          {plan && ` · ${plan.name}`}
        </>
      ),
      status: "done",
    },
    {
      id: "audit",
      title: "Auditoria documental e verificação anti-plágio",
      detail: app.sampleFile
        ? "Validamos o comprovativo e comparamos a sua amostra com a base de sebentas universitárias."
        : "Validamos o comprovativo institucional. Os materiais passam pela verificação anti-plágio antes de cada publicação.",
      status: "active",
    },
    {
      id: "publish",
      title: "Publicação no marketplace",
      detail: "Os seus materiais ficam visíveis para os estudantes logo após a aprovação.",
      status: "pending",
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-background px-4 py-6 sm:px-6 sm:py-10">
      <main
        id="conteudo"
        className="w-full max-w-[740px] rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-10"
      >
        <header className="mb-8 flex items-center justify-between gap-3 border-b border-border-cloud pb-5">
          <span className="flex items-center gap-2 text-overline text-primary uppercase">
            <Icon name="shield" size={18} />
            Credenciamento oficial
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-feedback-success-soft px-3 py-1 text-caption font-bold text-feedback-success-ink">
            <Icon name="check" size={14} strokeWidth={3} />3 de 3 passos concluídos
          </span>
        </header>

        <section className="flex flex-col items-center text-center">
          <div className="relative mb-5 flex size-28 items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-primary-fixed motion-safe:animate-pulse-ring"
            />
            <Asset3D name="shield-verified" alt="" size={88} priority className="relative motion-safe:animate-pop-in" />
          </div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
          >
            Candidatura submetida para homologação
          </h1>
          <p className="mt-3 max-w-[560px] text-body-lg text-pretty text-text-secondary">
            A nossa equipa pedagógica está a validar as suas credenciais para lhe atribuir o selo de criador
            verificado.
          </p>
        </section>

        <section aria-labelledby="audit-title" className="mt-8 rounded-2xl border-2 border-border-cloud p-4 sm:p-6">
          <h2 id="audit-title" className="sr-only">
            Estado da auditoria
          </h2>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border-cloud pb-4">
            <div>
              <p className="text-overline text-text-tertiary uppercase">Protocolo</p>
              <p className="text-body-lg font-bold tracking-wide text-on-surface tabular-nums select-all">
                {receipt.protocol}
              </p>
            </div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-brand-sunbeam bg-surface-canvas px-3 py-1.5 text-caption font-bold text-brand-sunbeam-ink">
              <Icon name="clock" size={16} />
              Resposta em até {receipt.slaHours} horas
            </p>
          </div>
          <StatusTimeline items={timeline} />
        </section>

        <section
          aria-labelledby="studio-title"
          className="mt-6 flex flex-col gap-4 rounded-2xl bg-surface-forest p-5 text-white sm:flex-row sm:items-start sm:p-6"
        >
          <Asset3D name="studio-draft" alt="" size={64} surface="dark" className="shrink-0" />
          <div>
            <h2 id="studio-title" className="font-montserrat text-headline-h3 font-extrabold">
              Enquanto espera, comece a criar
            </h2>
            <p className="mt-2 text-body-md text-white/85">
              O seu Estúdio de Criação já está aberto em modo rascunho. Pode escrever a primeira sebenta,
              importar notas ou experimentar o gerador de quizzes. Tudo fica publicado assim que o perfil for
              aprovado.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-caption font-bold text-feedback-success">
              <li className="flex items-center gap-1.5">
                <Icon name="edit" size={16} />
                Editor modular
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="sparkle" size={16} />
                Quizzes com IA
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="cloud" size={16} />
                Rascunhos guardados na nuvem
              </li>
            </ul>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3">
          <LinkButton3D
            href={links.studio}
            size="lg"
            fullWidth
            trailingIcon={<Icon name="arrow-right" size={20} />}
          >
            Abrir o estúdio
          </LinkButton3D>
          <LinkButton3D href={links.home} variant="ghost" fullWidth>
            Voltar ao início
          </LinkButton3D>
        </div>

        <footer className="mt-7 border-t border-border-cloud pt-4 text-center">
          <a
            href={links.support}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-brand-sky-ink underline-offset-4 hover:underline"
          >
            <Icon name="chat" size={16} />
            Dúvidas sobre a homologação? Fale com a coordenação académica pelo WhatsApp
            <Icon name="external" size={14} />
            <span className="sr-only">(abre numa nova janela)</span>
          </a>
        </footer>
      </main>
      <DataSaverBadge megabytesToday={1.2} />
    </div>
  );
}
