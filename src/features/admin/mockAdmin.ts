import type { CampusRow, FlashChallengeDraft, Kpi, LeagueSettings, Payout, StudentRow, Submission, Transaction } from "./types";
import type { SeriesPoint } from "../../components/charts/AreaChart";

export const EXECUTIVE_KPIS: Kpi[] = [
  {
    id: "dau",
    label: "Rácio DAU / MAU",
    value: "38,4%",
    trend: { value: 4.2, label: "este mês" },
    note: "Meta anual: acima de 35%",
    progress: { value: 38.4, max: 50 },
  },
  {
    id: "gmv",
    label: "GMV total de vendas",
    value: "4.850.000 Kz",
    note: "Comissões: 1.455.000 Kz (30%) · ticket médio 1.850 Kz",
  },
  {
    id: "quizzes",
    label: "Quizzes resolvidos",
    value: "142.890",
    note: "+18.500 esta semana · taxa média de acerto 74%",
  },
  {
    id: "students",
    label: "Estudantes ativos",
    value: "3.420",
    note: "UAN 45% · UCAN 30% · ISAF 25%",
  },
];

/** Consumo médio por estudante ao longo do dia (MB/h). */
export const TRAFFIC_24H: SeriesPoint[] = [
  { label: "00:00", value: 0.82 },
  { label: "04:00", value: 0.74 },
  { label: "08:00", value: 1.46 },
  { label: "12:00", value: 1.38 },
  { label: "16:00", value: 2.18 },
  { label: "20:00", value: 1.64 },
  { label: "23:59", value: 1.1 },
];

export const CAMPUSES: CampusRow[] = [
  { id: "uan", short: "UAN", name: "Universidade Agostinho Neto", campus: "Campus Universitário", district: "Camama, Luanda", students: 1539, topSubjects: ["Macroeconomia I", "Direito Constitucional"], retention: 88.4, gmvKz: 2180000, status: "ativo" },
  { id: "ucan", short: "UCAN", name: "Universidade Católica de Angola", campus: "Polo Palanca", district: "Kilamba Kiaxi", students: 1026, topSubjects: ["Direito Civil", "Contabilidade Geral"], retention: 84.1, gmvKz: 1520000, status: "ativo" },
  { id: "isaf", short: "ISAF", name: "Inst. Sup. de Administração e Finanças", campus: "Polo Luanda Centro", district: "Ingombota", students: 855, topSubjects: ["Finanças Públicas", "Gestão Bancária"], retention: 81.2, gmvKz: 1150000, status: "ativo" },
  { id: "ugs", short: "UGS", name: "Universidade Gregório Semedo", campus: "Campus Talatona", district: "Luanda Sul", students: 412, topSubjects: ["Introdução ao Direito", "Algoritmos I"], retention: 76.5, gmvKz: 480000, status: "crescimento" },
];

export const STUDENTS: StudentRow[] = [
  {
    id: "kn-84920",
    name: "Orlando Fortuna",
    handle: "@orlandofortuna",
    university: "UAN",
    course: "Engenharia Informática",
    phone: "923456789",
    xp: 2450,
    plan: "pro",
    joinedAt: "2026-08-12",
    verified: true,
    status: "ativo",
    detail: {
      streakDays: 6,
      bestStreak: 19,
      quizzes: 48,
      accuracy: 88,
      gems: 120,
      league: "Liga Diamante",
      purchases: [
        { id: "mcx-9018", title: "Sebenta: Macroeconomia II", at: "2026-10-20", amountKz: 1500 },
        { id: "mcx-8842", title: "Baralho: Direito Constitucional", at: "2026-10-15", amountKz: 2000 },
        { id: "mcx-7911", title: "Pack de quizzes: Estatística I", at: "2026-10-02", amountKz: 1000 },
      ],
    },
  },
  {
    id: "kn-71204",
    name: "Teresa Bento",
    handle: "@tbento_uan",
    university: "UAN",
    course: "Economia e Finanças",
    phone: "912345678",
    xp: 4820,
    plan: "pro",
    joinedAt: "2026-03-05",
    verified: true,
    status: "ativo",
    detail: { streakDays: 21, bestStreak: 34, quizzes: 96, accuracy: 92, gems: 340, league: "Liga Diamante", purchases: [] },
  },
  {
    id: "kn-66310",
    name: "Mateus Kiala",
    handle: "@mateuskiala_ao",
    university: "UCAN",
    course: "Direito",
    phone: "945678123",
    xp: 1150,
    plan: "free",
    joinedAt: "2026-09-18",
    verified: false,
    status: "ativo",
    detail: { streakDays: 3, bestStreak: 8, quizzes: 22, accuracy: 71, gems: 40, league: "Liga Bronze", purchases: [] },
  },
  {
    id: "kn-59117",
    name: "Esperança Manuel",
    handle: "@esperanca_m",
    university: "ISAF",
    course: "Gestão Bancária",
    phone: "931890456",
    xp: 3200,
    plan: "pro",
    joinedAt: "2026-01-22",
    verified: true,
    status: "ativo",
    detail: { streakDays: 12, bestStreak: 25, quizzes: 64, accuracy: 85, gems: 210, league: "Liga Ouro", purchases: [] },
  },
  {
    id: "kn-48002",
    name: "João Domingos",
    handle: "@jdomingos_ugs",
    university: "UGS",
    course: "Engenharia Civil",
    phone: "928112334",
    xp: 890,
    plan: "free",
    joinedAt: "2026-10-14",
    verified: false,
    status: "suspenso",
    detail: { streakDays: 0, bestStreak: 5, quizzes: 14, accuracy: 63, gems: 15, league: "Liga Bronze", purchases: [] },
  },
];

export const SUBMISSION: Submission = {
  id: "kb-8891",
  title: "Sebenta: Cálculo Diferencial e Integral I — módulo de limites",
  author: "Teresa Bento",
  authorPlan: "Criador Pro",
  university: "UAN",
  faculty: "Faculdade de Engenharia",
  submittedHoursAgo: 4,
  sizeKb: 320,
  pages: 18,
  queueLength: 14,
  excerpt:
    "O conceito de limite é a base da análise matemática. Dizemos que o limite de f(x) quando x tende para a é L se, para todo o épsilon maior que zero, existir um delta maior que zero tal que…",
  quiz: {
    question: "Qual é o valor do limite de sen(x)/x quando x tende para 0?",
    options: ["0", "1", "Não existe"],
    correctIndex: 1,
  },
  criteria: [
    { id: "curriculo", title: "Conformidade com o plano curricular angolano", detail: "Compatível com as diretrizes para o 1.º ano de engenharias.", prechecked: true },
    { id: "plagio", title: "Ausência de plágio ou cópia não autorizada", detail: "Verificação automática indica 98,4% de originalidade (a confirmar por amostragem).", prechecked: true },
    { id: "data-lean", title: "Otimização data-lean (menos de 500 KB no total)", detail: "Ativos gráficos otimizados: 320 KB.", prechecked: true },
    { id: "gabarito", title: "Gabarito e justificação pedagógica em todos os quizzes", detail: "Falta a explicação da questão 4, sobre limites trigonométricos.", prechecked: false },
  ],
};

export const TRANSACTIONS: Transaction[] = [
  { id: "TX-89421", at: "14:32", phone: "923 ••• 112", item: "Sebenta: Finanças Públicas", grossKz: 2000, creatorNetKz: 1400, status: "sucesso" },
  { id: "TX-89420", at: "14:30", phone: "941 ••• 884", item: "Simulado: exame da Ordem", grossKz: 4500, creatorNetKz: 3150, status: "sucesso" },
  { id: "TX-89419", at: "14:28", phone: "912 ••• 556", item: "Curso intensivo: Cálculo II", grossKz: 10000, creatorNetKz: 7000, status: "sucesso" },
  { id: "TX-89418", at: "14:25", phone: "939 ••• 331", item: "Subscrição Criador Pro (mensal)", grossKz: 5000, creatorNetKz: null, status: "sucesso" },
  { id: "TX-89417", at: "14:20", phone: "991 ••• 772", item: "Resumo: Direito Penal I", grossKz: 1500, creatorNetKz: 1050, status: "pendente" },
];

export const PAYOUTS: Payout[] = [
  { id: "PO-1201", creator: "Teresa Bento", phone: "912 ••• 678", amountKz: 420000, requestedAt: "2026-09-21", materials: 12 },
  { id: "PO-1202", creator: "Mateus Silva", phone: "923 ••• 145", amountKz: 310000, requestedAt: "2026-09-21", materials: 8 },
  { id: "PO-1203", creator: "Ana Costa", phone: "934 ••• 902", amountKz: 268000, requestedAt: "2026-09-22", materials: 6 },
  { id: "PO-1204", creator: "Paulo Ferraz", phone: "945 ••• 330", amountKz: 192000, requestedAt: "2026-09-22", materials: 5 },
];

export const DIFFICULTY = [
  { id: "macro", subject: "Macroeconomia I", university: "UAN", difficulty: 88, responses: 6200, gap: true },
  { id: "obrig", subject: "Direito das Obrigações", university: "UCAN", difficulty: 82, responses: 4800, gap: false },
  { id: "algebra", subject: "Álgebra Linear", university: "ISAF", difficulty: 79, responses: 3200, gap: false },
];

export const FORMAT_PREFERENCE = [
  { label: "Micro-learning gamificado", value: 84 },
  { label: "Slides tradicionais", value: 16 },
];

export const NPS = [
  { id: "ucan", label: "Universidade Católica de Angola", score: 74 },
  { id: "uan", label: "Universidade Agostinho Neto", score: 68 },
  { id: "isaf", label: "Inst. Sup. de Administração e Finanças", score: 62 },
];

export const ZERO_MATCH = [
  { id: "auditoria", term: "Sebenta de Auditoria Fiscal, 3.º ano", searches: 1420 },
  { id: "petrolifero", term: "Simulado de Direito Petrolífero", searches: 980 },
  { id: "inferencial", term: "Resumo de Estatística Inferencial", searches: 850 },
];

export const LEAGUE_SETTINGS: LeagueSettings = {
  season: "1.º semestre de 2026",
  promotionPct: 10,
  relegationPct: 30,
  xpMultiplier: 1.5,
  weekendBoost: true,
};

export const CHALLENGE_DRAFT: FlashChallengeDraft = {
  startsAt: "2026-10-05T08:00",
  question: "Que protocolo de comunicação otimiza a entrega de dados em redes móveis de baixa largura de banda?",
  correct: "MQTT sobre WebSockets com compressão gzip",
  distractors: ["Sondagem periódica em HTTP/1.1", "XML-RPC direto"],
  reward: "Passe Pro de 1 mês (acesso offline ilimitado)",
};

export const LIVE_CHALLENGE = { hoursLeft: 14, minutesLeft: 22, participants: 340, campuses: "Luanda e Benguela" };
