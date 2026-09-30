import type { FormEvent } from "react";
import { ConsentCheckbox } from "../../components/ui/ConsentCheckbox";
import { FileDropzone } from "../../components/ui/FileDropzone";
import { Icon } from "../../components/ui/Icon";
import { Pill } from "../../components/ui/Pill";
import { MAX_UPLOAD_BYTES } from "./constants";
import { CreatorStepLayout, StepFooter } from "./CreatorStepLayout";
import type { FieldErrors, StepProps } from "./types";
import { useFieldErrors } from "../../hooks/useFieldErrors";

const ORDER = ["document-file", "authorship"];

/** Creator-02 — Comprovativo institucional, amostra e declaração de autoria. */
export function StepDocuments({ application: app, update, onNext, onBack }: StepProps) {
  const { errors, check, clear } = useFieldErrors(ORDER);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: FieldErrors = {};
    if (!app.documentFile) next["document-file"] = "Carregue um comprovativo institucional para continuar.";
    if (!app.authorshipAccepted) next.authorship = "Confirme a declaração de autoria para continuar.";
    if (check(next)) onNext();
  }

  return (
    <CreatorStepLayout
      step={1}
      onBack={onBack}
      backLabel="Voltar ao passo 1: dados e vínculo"
      eyebrow="Homologação de mérito académico"
      title="Comprovativo institucional e amostra do material"
      lead="Verificamos as credenciais de cada autor antes de autorizar vendas. Isto protege a sua propriedade intelectual e a confiança dos estudantes."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
        <section className="rounded-2xl border-2 border-border-cloud p-5 sm:p-6">
          <FileDropzone
            id="document-file"
            title="Documento de identificação académica"
            badge={<Pill tone="sky" kind="tag">obrigatório</Pill>}
            description="Cartão de estudante finalista, certificado de habilitações, declaração com notas ou cédula profissional. O nome tem de coincidir com o que indicou no passo 1."
            extensions={["pdf", "jpg", "jpeg", "png"]}
            maxBytes={MAX_UPLOAD_BYTES}
            buttonLabel="Escolher comprovativo"
            required
            file={app.documentFile}
            error={errors["document-file"]}
            onChange={(documentFile) => {
              update({ documentFile });
              clear("document-file");
            }}
            footnote={
              <p className="inline-flex items-center gap-1.5 text-caption text-feedback-success-ink">
                <Icon name="lock" size={14} />
                Envio encriptado · acesso restrito à equipa de auditoria
              </p>
            }
          />
        </section>

        <section className="rounded-2xl border-2 border-border-cloud p-5 sm:p-6">
          <FileDropzone
            id="sample-file"
            variant="compact"
            asset="studio-draft"
            title="Amostra de sebenta, resumo ou simulado"
            badge={<Pill tone="success" kind="tag">opcional · análise em até 4 h</Pill>}
            description="Envie 3 a 5 páginas do tipo de material que quer publicar. Com amostra, a auditoria passa de até 24 horas para até 4 horas."
            extensions={["pdf", "doc", "docx"]}
            maxBytes={MAX_UPLOAD_BYTES}
            buttonLabel="Anexar amostra"
            file={app.sampleFile}
            onChange={(sampleFile) => update({ sampleFile })}
          />
        </section>

        <ConsentCheckbox
          id="authorship"
          checked={app.authorshipAccepted}
          error={errors.authorship}
          onChange={(authorshipAccepted) => {
            update({ authorshipAccepted });
            clear("authorship");
          }}
          title="Declaro que sou o autor dos materiais que vou publicar"
        >
          Sob compromisso de honra, declaro que sou o autor original dos materiais ou que tenho autorização
          expressa para os compilar, nos termos da Lei n.º 15/14, de 31 de julho (Lei dos Direitos de Autor e
          Conexos). Reconheço que o plágio leva ao cancelamento do credenciamento, à exclusão da Kombinu e à
          retenção dos saldos provenientes de materiais fraudulentos.
        </ConsentCheckbox>

        <StepFooter
          note="Os documentos só são vistos pela equipa de auditoria e são tratados ao abrigo da Lei de Proteção de Dados Pessoais."
          submitLabel="Continuar para pagamentos"
        />
      </form>
    </CreatorStepLayout>
  );
}
