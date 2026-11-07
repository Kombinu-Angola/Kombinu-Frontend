export type ApplicationDocument = { id: string; name: string; sizeKb: number; ok: boolean; note?: string };

export type CreatorApplicationRow = {
  protocol: string;
  submittedAt: string;
  /** Prazo prometido ao criador: 4 h com amostra, 24 h sem. */
  slaHours: 4 | 24;
  candidate: { name: string; specialty: string };
  university: string;
  faculty: string;
  affiliation: "Docente titular" | "Explicador independente" | "Monitor académico" | "Estudante finalista";
  phone: string;
  documents: ApplicationDocument[];
  sampleIncluded: boolean;
  criteria: Array<{ id: string; title: string; detail: string; prechecked: boolean }>;
};
