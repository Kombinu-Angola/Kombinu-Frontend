export type CatalogSubject = {
  id: string;
  name: string;
  code: string;
  year: string;
  semester: string;
  /** Percentagem de reprovação declarada pelos estudantes. */
  failureRate: number;
  materials: number;
  students: number;
  critical: boolean;
};

export type CatalogFaculty = { id: string; name: string; subjects: CatalogSubject[] };

export type CatalogInstitution = {
  id: string;
  name: string;
  acronym: string;
  kind: "Pública" | "Privada" | "Privada de interesse público";
  city: string;
  faculties: CatalogFaculty[];
};
