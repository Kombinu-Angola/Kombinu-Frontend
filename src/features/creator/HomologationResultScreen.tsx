import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D, LinkButton3D } from "../../components/ui/Button3D";
import { FileDropzone } from "../../components/ui/FileDropzone";
import { Icon } from "../../components/ui/Icon";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { useToast } from "../../components/ui/Toast";
import { MAX_UPLOAD_BYTES } from "./constants";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "long", year: "numeric" });

export type HomologationResult =
  | {
      status: "aprovado";
      protocol: string;
      decidedAt: string;
      creator: { name: string; university: string; faculty: string; specialty: string; phone: string };
    }
  | {
      status: "correcao";
      protocol: string;
      decidedAt: string;
      creator: { name: string; university: string; faculty: string; specialty: string; phone: string };
      /** Motivo escrito pelo auditor, tal como foi enviado. */
      feedback: string;
      /** O que o criador tem de reenviar. */
      required: string[];
    };

type HomologationResultScreenProps = {
  result: HomologationResult;
  studioHref: string;
  publicProfileHref: string;
  onResubmit?: (file: File) => void;
};

/** Resultado da homologação: o que o criador vê depois da auditoria decidir. */
export default function HomologationResultScreen({
  result,
  studioHref,
  publicProfileHref,
  onResubmit,
}: HomologationResultScreenProps) {
  const headingRef = useFocusOnMount();
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const phone = maskAOPhone(result.creator.phone);

  return (
    <CreatorShell active="publico" creatorName={result.creator.name}>
      <div className="mx-auto max-w-[760px] px-4 py-6 md:px-6 lg:py-10">
        <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-8">
          {result.status === "aprovado" ? (
            <>
              <header className="flex flex-col items-center text-center">
                <Asset3D name="badge-caloiro" alt="" size={96} priority className="mb-4 motion-safe:animate-pop-in" />
                <p className="inline-flex items-center gap-2 rounded-full bg-feedback-success-soft px-3.5 py-1 text-overline text-feedback-success-ink uppercase">
                  <Icon name="check" size={15} strokeWidth={3} />
                  Candidatura aprovada
                </p>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-3 max-w-xl font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
                >
                  És oficialmente um criador Kombinu
                </h1>
                <p className="mt-2.5 max-w-lg text-body-lg text-pretty text-text-secondary">
                  As tuas credenciais foram validadas pela equipa de auditoria. Os teus materiais já podem ser
                  publicados no marketplace.
                </p>
              </header>

              <section
                aria-labelledby="credential-title"
                className="mt-8 rounded-2xl border-2 border-feedback-success bg-surface-canvas p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-cloud pb-4">
                  <h2 id="credential-title" className="flex items-center gap-2 text-headline-h3 text-on-surface">
                    <Icon name="seal" size={22} className="text-feedback-success-ink" />
                    Credencial académica verificada
                  </h2>
                  <span className="rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase">
                    Selo ativo
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {[
                    { label: "Nome registado", value: result.creator.name },
                    { label: "Instituição", value: result.creator.university },
                    { label: "Faculdade e cadeira", value: `${result.creator.faculty} · ${result.creator.specialty}` },
                    { label: "Número Express validado", value: phone.visual, spoken: phone.spoken },
                  ].map((row) => (
                    <div key={row.label}>
                      <dt className="text-overline text-text-tertiary uppercase">{row.label}</dt>
                      <dd className="mt-0.5 text-body-md font-bold text-on-surface tabular-nums">
                        <span aria-hidden={row.spoken ? "true" : undefined}>{row.value}</span>
                        {row.spoken && <span className="sr-only">{row.spoken}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-border-cloud pt-4 text-caption text-text-tertiary tabular-nums">
                  <Icon name="shield" size={15} />
                  Protocolo {result.protocol} · homologado a {dateFormat.format(new Date(result.decidedAt))}
                </p>
              </section>

              <section aria-labelledby="next-title" className="mt-6 rounded-2xl bg-surface-sky p-5">
                <h2 id="next-title" className="flex items-center gap-2 text-headline-h3 text-primary">
                  <Icon name="target" size={20} />O que acontece agora
                </h2>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {[
                    "Os rascunhos guardados no estúdio já podem ser publicados com preço em Kwanzas.",
                    "Os estudantes da tua faculdade passam a ver os teus materiais no feed diário.",
                    "O teste de 1 Kz no teu Multicaixa Express corre nas próximas horas, para confirmar a titularidade.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-body-md text-text-secondary">
                      <Icon name="arrow-right" size={18} className="mt-0.5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <LinkButton3D href={studioHref} size="lg" fullWidth trailingIcon={<Icon name="arrow-right" size={20} />}>
                  Publicar a primeira sebenta
                </LinkButton3D>
                <LinkButton3D href={publicProfileHref} variant="ghost" fullWidth leadingIcon={<Icon name="eye" size={18} />}>
                  Ver o perfil público
                </LinkButton3D>
              </div>
            </>
          ) : (
            <>
              <header className="flex flex-col items-center text-center">
                <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary-fixed text-feedback-streak-ink">
                  <Icon name="alert" size={28} />
                </span>
                <p className="inline-flex items-center gap-2 rounded-full border-2 border-feedback-streak bg-surface-canvas px-3.5 py-1 text-overline text-feedback-streak-ink uppercase">
                  Falta corrigir um documento
                </p>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-3 max-w-xl font-montserrat text-headline-h1-mobile text-balance text-on-surface outline-none sm:text-headline-h1"
                >
                  A tua candidatura precisa de uma correção
                </h1>
                <p className="mt-2.5 max-w-lg text-body-lg text-pretty text-text-secondary">
                  Não é preciso recomeçar. Envia só o ficheiro corrigido e a candidatura volta à fila, com o mesmo
                  protocolo.
                </p>
              </header>

              <section aria-labelledby="feedback-title" className="mt-7 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-5">
                <h2 id="feedback-title" className="flex items-center gap-2 text-headline-h3 text-on-surface tabular-nums">
                  <Icon name="comment" size={20} className="text-feedback-streak-ink" />
                  Resposta da coordenação ({result.protocol})
                </h2>
                <blockquote className="mt-3 rounded-xl bg-surface-soft p-4 text-body-md text-on-surface italic">
                  {result.feedback}
                </blockquote>
                <p className="mt-3 text-caption text-text-tertiary tabular-nums">
                  Analisada a {dateFormat.format(new Date(result.decidedAt))}
                </p>
              </section>

              <section aria-labelledby="required-title" className="mt-5 rounded-2xl bg-surface-soft p-5">
                <h2 id="required-title" className="text-overline text-text-secondary uppercase">
                  O que tens de reenviar
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {result.required.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-body-md text-on-surface">
                      <Icon name="alert" size={17} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-6">
                <FileDropzone
                  id="resubmit-doc"
                  headingLevel="h2"
                  title="Documento corrigido"
                  description="Envia o ficheiro nítido, com a informação toda legível."
                  extensions={["pdf", "jpg", "jpeg", "png"]}
                  maxBytes={MAX_UPLOAD_BYTES}
                  buttonLabel="Escolher ficheiro"
                  required
                  file={file}
                  onChange={setFile}
                />
              </section>

              <Button3D
                size="lg"
                fullWidth
                className="mt-6"
                disabled={!file}
                onClick={() => {
                  if (file) onResubmit?.(file);
                  toast.show("Documento reenviado. A candidatura voltou à fila de homologação.");
                }}
                trailingIcon={<Icon name="arrow-right" size={20} />}
              >
                Reenviar para auditoria
              </Button3D>

              <p className="mt-4 text-center text-caption text-text-secondary">
                Enquanto isso, o estúdio continua aberto em modo rascunho: podes escrever, mas ainda não publicar.
              </p>
            </>
          )}
        </div>
      </div>
    </CreatorShell>
  );
}
