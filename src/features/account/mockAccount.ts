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

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const SESSIONS = [
  {
    id: "s1",
    device: "Samsung Galaxy A14",
    kind: "telemovel" as const,
    app: "Kombinu na Web (PWA)",
    location: "Luanda",
    network: "Unitel",
    maskedIp: "197.218.•••.•••",
    lastActiveAt: hoursAgo(0),
    current: true,
  },
  {
    id: "s2",
    device: "Chrome no Windows 11",
    kind: "computador" as const,
    app: "Kombinu na Web",
    location: "Luanda",
    network: "Wi-Fi UAN Central",
    maskedIp: "197.218.•••.•••",
    lastActiveAt: hoursAgo(20),
  },
  {
    id: "s3",
    device: "Tecno Spark 10 Pro",
    kind: "telemovel" as const,
    app: "Kombinu na Web (PWA)",
    location: "Talatona, Luanda",
    network: "Africell",
    maskedIp: "41.223.•••.•••",
    lastActiveAt: hoursAgo(312),
  },
];
