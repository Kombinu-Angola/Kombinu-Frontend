import { useState } from "react";
import { CreatorConfirmationScreen, type CreatorLinks } from "./CreatorConfirmationScreen";
import { StepCredentials } from "./StepCredentials";
import { StepDocuments } from "./StepDocuments";
import { StepMonetization } from "./StepMonetization";
import type { CreatorApplication, SubmitCreatorApplication, SubmitReceipt } from "./types";

const INITIAL: CreatorApplication = {
  fullName: "",
  institution: "UAN",
  institutionOther: "",
  affiliation: "finalist",
  specialties: [],
  documentFile: null,
  sampleFile: null,
  authorshipAccepted: false,
  expressPhone: "",
  plan: null,
};

type Submission = { status: "idle" | "submitting" | "error"; progress: number };

type CreatorApplicationFlowProps = {
  /** Sair do fluxo (voltar à escolha de perfil). */
  onExit: () => void;
  submit: SubmitCreatorApplication;
  links: CreatorLinks;
};

/**
 * Credenciamento de criador (Creator-01 a 04). O estado vive aqui, por isso voltar
 * atrás nunca apaga o que foi preenchido (WCAG 3.3.7). Os ficheiros só sobem no fim.
 */
export default function CreatorApplicationFlow({ onExit, submit, links }: CreatorApplicationFlowProps) {
  const [step, setStep] = useState(0);
  const [application, setApplication] = useState(INITIAL);
  const [submission, setSubmission] = useState<Submission>({ status: "idle", progress: 0 });
  const [receipt, setReceipt] = useState<SubmitReceipt | null>(null);

  const update = (patch: Partial<CreatorApplication>) => setApplication((prev) => ({ ...prev, ...patch }));
  const back = () => (step === 0 ? onExit() : setStep((s) => s - 1));

  async function handleSubmit() {
    setSubmission({ status: "submitting", progress: 0 });
    try {
      const result = await submit(application, (progress) => setSubmission((s) => ({ ...s, progress })));
      setReceipt(result);
      setSubmission({ status: "idle", progress: 100 });
    } catch {
      setSubmission({ status: "error", progress: 0 });
    }
  }

  if (receipt) return <CreatorConfirmationScreen application={application} receipt={receipt} links={links} />;

  const common = { application, update, onBack: back };

  switch (step) {
    case 0:
      return <StepCredentials {...common} onNext={() => setStep(1)} />;
    case 1:
      return <StepDocuments {...common} onNext={() => setStep(2)} />;
    default:
      return (
        <StepMonetization
          {...common}
          onNext={handleSubmit}
          submitting={submission.status === "submitting"}
          progress={submission.progress}
          submitError={
            submission.status === "error"
              ? "Não foi possível enviar a candidatura. Verifique a ligação à internet e submeta de novo — os dados preenchidos continuam guardados."
              : undefined
          }
        />
      );
  }
}
