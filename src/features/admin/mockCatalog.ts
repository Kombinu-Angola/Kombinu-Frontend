import type { CatalogInstitution } from "./catalogTypes";

export const CATALOG: CatalogInstitution[] = [
  {
    id: "uan",
    name: "Universidade Agostinho Neto",
    acronym: "UAN",
    kind: "Pública",
    city: "Luanda",
    faculties: [
      {
        id: "uan-economia",
        name: "Faculdade de Economia",
        subjects: [
          { id: "macro1", name: "Macroeconomia I", code: "ECO-201", year: "2.º", semester: "1.º", failureRate: 42, materials: 18, students: 540, critical: true },
          { id: "micro2", name: "Microeconomia II", code: "ECO-204", year: "2.º", semester: "2.º", failureRate: 31, materials: 11, students: 480, critical: true },
          { id: "conta1", name: "Contabilidade Geral I", code: "ECO-102", year: "1.º", semester: "1.º", failureRate: 18, materials: 22, students: 610, critical: false },
          { id: "estat", name: "Estatística Aplicada", code: "ECO-205", year: "2.º", semester: "2.º", failureRate: 27, materials: 9, students: 455, critical: false },
        ],
      },
      {
        id: "uan-engenharia",
        name: "Faculdade de Engenharia",
        subjects: [
          { id: "calc1", name: "Cálculo I", code: "ENG-101", year: "1.º", semester: "1.º", failureRate: 58, materials: 14, students: 720, critical: true },
          { id: "prog1", name: "Programação I", code: "ENG-104", year: "1.º", semester: "2.º", failureRate: 35, materials: 16, students: 690, critical: true },
        ],
      },
      {
        id: "uan-direito",
        name: "Faculdade de Direito",
        subjects: [
          { id: "dconst", name: "Direito Constitucional", code: "DIR-101", year: "1.º", semester: "1.º", failureRate: 29, materials: 20, students: 520, critical: false },
        ],
      },
    ],
  },
  {
    id: "ucan",
    name: "Universidade Católica de Angola",
    acronym: "UCAN",
    kind: "Privada",
    city: "Luanda (Palanca)",
    faculties: [
      {
        id: "ucan-direito",
        name: "Faculdade de Direito",
        subjects: [
          { id: "dfiscal", name: "Direito Fiscal", code: "DIR-305", year: "3.º", semester: "1.º", failureRate: 44, materials: 8, students: 260, critical: true },
          { id: "dobrig", name: "Direito das Obrigações", code: "DIR-202", year: "2.º", semester: "2.º", failureRate: 38, materials: 12, students: 310, critical: true },
        ],
      },
    ],
  },
  {
    id: "isaf",
    name: "Instituto Superior de Administração e Finanças",
    acronym: "ISAF",
    kind: "Privada",
    city: "Luanda (Talatona)",
    faculties: [
      {
        id: "isaf-financas",
        name: "Finanças e Contabilidade",
        subjects: [
          { id: "fpub", name: "Finanças Públicas", code: "FIN-301", year: "3.º", semester: "1.º", failureRate: 33, materials: 7, students: 180, critical: false },
        ],
      },
    ],
  },
  {
    id: "isptec",
    name: "Instituto Superior Politécnico de Tecnologias e Ciências",
    acronym: "ISPTEC",
    kind: "Privada de interesse público",
    city: "Luanda",
    faculties: [
      {
        id: "isptec-info",
        name: "Engenharia Informática",
        subjects: [
          { id: "bd2", name: "Bases de Dados II", code: "INF-302", year: "3.º", semester: "1.º", failureRate: 40, materials: 6, students: 150, critical: true },
        ],
      },
    ],
  },
];
