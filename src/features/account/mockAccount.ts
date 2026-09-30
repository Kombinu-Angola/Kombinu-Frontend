import type { StudentAccount } from "./types";

export const MOCK_ACCOUNT: StudentAccount = {
  name: "João Kiala",
  university: "UAN",
  faculty: "Faculdade de Economia (Campus Luanda)",
  course: "Licenciatura em Economia",
  year: "2",
  criticalSubject: "Macroeconomia I",
  affiliationVerified: true,
  dailyGoal: "15",
  formats: ["text", "quizzes"],
  reminder: "2000",
  notifications: { streak: true, newMaterials: true, leagues: false },
  phone: "923891024",
  institutionalEmail: "joao.kiala@uan.ao",
  emailVerified: true,
  dataSaver: true,
};

export const FACULTIES = [
  { value: "economia", label: "Faculdade de Economia (Campus Luanda)" },
  { value: "engenharia", label: "Faculdade de Engenharia (Campus Luanda)" },
  { value: "direito", label: "Faculdade de Direito (Campus Luanda)" },
  { value: "medicina", label: "Faculdade de Medicina" },
];

export const YEARS = [
  { value: "1", label: "1.º ano" },
  { value: "2", label: "2.º ano" },
  { value: "3", label: "3.º ano" },
  { value: "4", label: "4.º ano" },
  { value: "pos", label: "Pós-graduação" },
];

export const SUBJECTS = [
  { value: "Macroeconomia I", label: "Macroeconomia I" },
  { value: "Microeconomia II", label: "Microeconomia II" },
  { value: "Econometria", label: "Econometria" },
  { value: "Contabilidade Nacional", label: "Contabilidade Nacional" },
];
