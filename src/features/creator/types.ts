export type PlanId = "free" | "pro";

export type CreatorApplication = {
  fullName: string;
  institution: string;
  institutionOther: string;
  affiliation: string;
  specialties: string[];
  documentFile: File | null;
  sampleFile: File | null;
  authorshipAccepted: boolean;
  /** Só dígitos: "923000302". */
  expressPhone: string;
  plan: PlanId | null;
};

export type SubmitReceipt = {
  protocol: string;
  /** Prazo previsto de auditoria, em horas (vem da API). */
  slaHours: number;
};

export type SubmitCreatorApplication = (
  application: CreatorApplication,
  onProgress: (percent: number) => void,
) => Promise<SubmitReceipt>;

export type { FieldErrors } from "../../hooks/useFieldErrors";

export type StepProps = {
  application: CreatorApplication;
  update: (patch: Partial<CreatorApplication>) => void;
  onNext: () => void;
  onBack: () => void;
};
