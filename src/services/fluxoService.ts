import { FLUXO_MOCKS } from "../lib/fluxoFlags";

/**
 * Fluxo "Preparar a minha prova" (F7). O backend ainda não tem estes endpoints, por isso o serviço só
 * funciona com os dados simulados (`VITE_FLUXO_MOCKS=true`, só em desenvolvimento). Os ecrãs falam
 * sempre com este serviço: quando a API existir, troca-se a implementação aqui e nada mais muda.
 */

export type TargetGrade = "pass" | "good" | "excellence";
export type Depth = "direct" | "intermediate" | "exhaustive";
export type ModuleComponent = "diagrams" | "structured_text" | "flashcards";
export type JobStatus = "queued" | "processing" | "ready" | "failed";
export type Consentimento = "not_required" | "pending" | "granted";

export interface Subject {
  id: string;
  name: string;
  course: string;
}

export interface Quota {
  freeGenerationsLeft: number;
}

export interface GenerationJob {
  id: string;
  contentId: string;
  status: JobStatus;
  cacheHit: boolean;
  previewContentId?: string;
}

export interface CalibrationParams {
  /** `YYYY-MM-DD`. */
  examDate: string;
  targetGrade: TargetGrade;
  depth: Depth;
  components: ModuleComponent[];
}

export interface CreateJobInput {
  title: string;
  subjectId: string;
  description: string;
  file: File;
}

export interface Question {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface SebentaSection {
  heading: string;
  body: string;
  keyPoints?: string[];
}

export interface SebentaBlock {
  id: string;
  title: string;
  sections: SebentaSection[];
}

export interface PreviewContent {
  id: string;
  contentId: string;
  title: string;
  subjectName: string;
  block: SebentaBlock;
  questions: Question[];
  totalBlocks: number;
  totalQuestions: number;
  planDays: number;
}

export type PassPlanId = "subject" | "month" | "semester";

export interface PassPlan {
  id: PassPlanId;
  label: string;
  priceKz: number;
  detail: string;
  /** Só no modo simulado: os preços ainda não estão decididos. */
  exemplo?: boolean;
}

export type OrderStatus = "pending" | "awaiting_confirmation" | "paid" | "expired" | "failed";

export interface Order {
  id: string;
  contentId: string;
  planId: PassPlanId;
  amountKz: number;
  status: OrderStatus;
}

export interface GuardianLink {
  url: string;
  expiresAt: string;
}

export class FluxoIndisponivel extends Error {
  constructor() {
    super("Esta área ainda não está disponível.");
    this.name = "FluxoIndisponivel";
  }
}

/* ───────── Modo simulado ───────── */

const SUBJECTS: Subject[] = [
  { id: "s-bd", name: "Bases de Dados", course: "Engenharia Informática" },
  { id: "s-eda", name: "Estruturas de Dados", course: "Engenharia Informática" },
  { id: "s-dc", name: "Direito Constitucional", course: "Direito" },
  { id: "s-micro", name: "Microeconomia", course: "Economia" },
  { id: "s-macro", name: "Macroeconomia I", course: "Economia" },
];

interface JobRec {
  job: GenerationJob;
  title: string;
  subjectId: string;
  hash: string;
  /** Títulos com "falha" falham uma vez, para se ver a repetição sem gastar quota. */
  willFail: boolean;
  retried: boolean;
  readyAt: number;
  params?: CalibrationParams;
}

interface Db {
  freeUsed: number;
  hashes: string[];
  jobs: Record<string, JobRec>;
  orders: Record<string, OrderRec>;
}

const CHAVE_DB = "kombinu:mock:fluxo";
const CHAVE_CONSENT = "kombinu:mock:consentimento";

function lerDb(): Db {
  try {
    const bruto = localStorage.getItem(CHAVE_DB);
    if (bruto) return { orders: {}, ...(JSON.parse(bruto) as Db) };
  } catch {
    /* sem armazenamento: o modo simulado só vale nesta sessão */
  }
  return { freeUsed: 0, hashes: [], jobs: {}, orders: {} };
}

let memoria: Db | null = null;
const db = (): Db => (memoria ??= lerDb());

function gravar() {
  try {
    localStorage.setItem(CHAVE_DB, JSON.stringify(db()));
  } catch {
    /* idem */
  }
}

const esperar = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const novoId = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

function estado(rec: JobRec): GenerationJob {
  const pronto = Date.now() >= rec.readyAt;
  const status: JobStatus = !pronto ? "processing" : rec.willFail && !rec.retried ? "failed" : "ready";
  return { ...rec.job, status, previewContentId: status === "ready" ? `p-${rec.job.contentId}` : undefined };
}

function registo(id: string): JobRec {
  const rec = db().jobs[id];
  if (!rec) throw new Error("Tarefa não encontrada.");
  return rec;
}

interface OrderRec extends Order {
  /** Quando o pagamento simulado fica confirmado. */
  paidAt?: number;
}

const PLANOS: PassPlan[] = [
  { id: "subject", label: "Passe da cadeira", priceKz: 600, detail: "Esta sebenta e o simulado completo", exemplo: true },
  { id: "month", label: "30 dias", priceKz: 1500, detail: "Gerações ilimitadas durante 30 dias", exemplo: true },
  { id: "semester", label: "Semestre", priceKz: 2500, detail: "Todas as cadeiras até ao fim do semestre", exemplo: true },
];

const opcoes = (...t: string[]) => t.map((text, i) => ({ id: String.fromCharCode(97 + i), text }));

const PERGUNTAS: Record<string, Question[]> = {
  "s-bd": [
    { id: "q1", prompt: "Uma tabela com a coluna «Telefones» que guarda vários números na mesma célula viola que forma normal?", options: opcoes("1.ª Forma Normal", "2.ª Forma Normal", "3.ª Forma Normal", "BCNF"), correctOptionId: "a", explanation: "A 1FN exige valores atómicos: cada célula guarda um só valor." },
    { id: "q2", prompt: "A 2FN elimina que tipo de dependência?", options: opcoes("Transitivas", "Parciais da chave", "Multivalor", "Funcionais totais"), correctOptionId: "b", explanation: "A 2FN remove as dependências parciais: atributos que dependem só de parte da chave composta." },
    { id: "q3", prompt: "Qual é a sequência correta de normalização?", options: opcoes("3FN → 2FN → 1FN", "1FN → 2FN → 3FN", "2FN → 1FN → 3FN", "1FN → 3FN → 2FN"), correctOptionId: "b", explanation: "Cada forma normal assume a anterior: 1FN, depois 2FN, depois 3FN." },
  ],
  "s-dc": [
    { id: "q1", prompt: "A Constituição ocupa que posição na hierarquia das normas?", options: opcoes("Está ao nível das leis ordinárias", "É a norma suprema do ordenamento", "Está abaixo dos tratados", "Depende do Governo"), correctOptionId: "b", explanation: "A Constituição é a lei fundamental: todas as outras normas lhe devem conformidade." },
    { id: "q2", prompt: "Como se chama o controlo da conformidade das leis com a Constituição?", options: opcoes("Fiscalização da constitucionalidade", "Promulgação", "Referendo", "Veto político"), correctOptionId: "a", explanation: "É a fiscalização da constitucionalidade, feita pelo órgão competente." },
    { id: "q3", prompt: "Os direitos fundamentais vinculam…", options: opcoes("Só os particulares", "Só o Estado", "Entidades públicas e privadas", "Ninguém diretamente"), correctOptionId: "c", explanation: "Vinculam as entidades públicas e, nos termos da lei, as privadas." },
  ],
};

const PERGUNTAS_GENERICAS = (titulo: string): Question[] => [
  { id: "q1", prompt: `Exemplo 1 sobre «${titulo}»: qual é a ideia central do tema?`, options: opcoes("A definição do conceito", "Um detalhe secundário", "Uma exceção rara", "Nenhuma das anteriores"), correctOptionId: "a", explanation: "Pergunta de exemplo do modo de desenvolvimento." },
  { id: "q2", prompt: "Exemplo 2: o que costuma sair na prova?", options: opcoes("Só exercícios", "Definições e aplicação", "Só teoria histórica", "Nada disto"), correctOptionId: "b", explanation: "Pergunta de exemplo do modo de desenvolvimento." },
  { id: "q3", prompt: "Exemplo 3: qual é o melhor método de estudo?", options: opcoes("Reler uma vez", "Praticar com perguntas", "Decorar sem entender", "Estudar na véspera"), correctOptionId: "b", explanation: "Pergunta de exemplo do modo de desenvolvimento." },
];

function blocoDe(titulo: string): SebentaBlock {
  return {
    id: "blk-0",
    title: "1. Ideia central e conceitos-base",
    sections: [
      {
        heading: "O que tens de saber",
        body: `Este bloco resume o essencial de «${titulo}» (conteúdo de exemplo do modo de desenvolvimento). Começa pelas definições, porque são a base de todo o resto.`,
        keyPoints: ["Define cada termo com as tuas palavras", "Liga cada conceito a um exemplo concreto", "Marca o que aparece repetido no teu material"],
      },
      { heading: "Exemplo resolvido", body: "Aqui entraria um exemplo tirado do teu ficheiro, passo a passo, para veres o método aplicado." },
    ],
  };
}

function diasDePlano(dataProva?: string): number {
  if (!dataProva) return 14;
  const dias = Math.max(0, Math.round((new Date(`${dataProva}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86_400_000));
  return dias <= 3 ? Math.max(1, dias) : Math.min(21, Math.max(14, dias));
}

function previaDe(rec: JobRec): PreviewContent {
  const cadeira = SUBJECTS.find((x) => x.id === rec.subjectId);
  return {
    id: `p-${rec.job.contentId}`,
    contentId: rec.job.contentId,
    title: rec.title,
    subjectName: cadeira?.name ?? "Cadeira",
    block: blocoDe(rec.title),
    questions: PERGUNTAS[rec.subjectId] ?? PERGUNTAS_GENERICAS(rec.title),
    totalBlocks: 6,
    totalQuestions: 40,
    planDays: diasDePlano(rec.params?.examDate),
  };
}

/** Confirma os pagamentos simulados cujo tempo já passou. */
function assentar() {
  const agora = Date.now();
  for (const o of Object.values(db().orders)) {
    if (o.status === "awaiting_confirmation" && o.paidAt && agora >= o.paidAt) o.status = "paid";
  }
}

const semInterno = (o: OrderRec): Order => ({ id: o.id, contentId: o.contentId, planId: o.planId, amountKz: o.amountKz, status: o.status });

const apenasMock = () => {
  if (!FLUXO_MOCKS) throw new FluxoIndisponivel();
};

export const fluxoService = {
  /** Gerações grátis que restam (1 por mês). */
  async quota(): Promise<Quota> {
    apenasMock();
    await esperar();
    return { freeGenerationsLeft: Math.max(0, 1 - db().freeUsed) };
  },

  /** Cadeiras; as do curso do estudante vêm primeiro. */
  async subjects(curso?: string): Promise<Subject[]> {
    apenasMock();
    await esperar();
    if (!curso) return SUBJECTS;
    const igual = (s: Subject) => s.course.toLowerCase() === curso.toLowerCase();
    return [...SUBJECTS.filter(igual), ...SUBJECTS.filter((s) => !igual(s))];
  },

  /**
   * Autorização do encarregado (menores de 18). No modo simulado lê-se de
   * `localStorage["kombinu:mock:consentimento"]` ("pending" para ver o aviso).
   */
  async consentimento(): Promise<Consentimento> {
    apenasMock();
    try {
      const v = localStorage.getItem(CHAVE_CONSENT);
      return v === "pending" || v === "granted" ? v : "not_required";
    } catch {
      return "not_required";
    }
  },

  /** `POST /generation/jobs/` (202): começa a preparar a prévia. */
  async createJob(input: CreateJobInput): Promise<GenerationJob> {
    apenasMock();
    await esperar(400);
    const hash = `${input.file.name}:${input.file.size}`;
    const cacheHit = db().hashes.includes(hash);
    if (!cacheHit) db().hashes.push(hash);
    const job: GenerationJob = { id: novoId("j"), contentId: novoId("c"), status: "queued", cacheHit };
    db().jobs[job.id] = {
      job,
      title: input.title,
      subjectId: input.subjectId,
      hash,
      willFail: /falha/i.test(input.title),
      retried: false,
      readyAt: Date.now() + (cacheHit ? 2500 : 14000),
    };
    db().freeUsed += 1;
    gravar();
    return { ...job };
  },

  /** `GET /generation/jobs/{id}/`. */
  async job(id: string): Promise<GenerationJob> {
    apenasMock();
    await esperar(150);
    return estado(registo(id));
  },

  async setJobParams(id: string, params: CalibrationParams): Promise<GenerationJob> {
    apenasMock();
    await esperar();
    const rec = registo(id);
    rec.params = params;
    gravar();
    return estado(rec);
  },

  /** Repete uma tarefa falhada sem descontar da quota. */
  async retryJob(id: string): Promise<GenerationJob> {
    apenasMock();
    await esperar();
    const rec = registo(id);
    rec.retried = true;
    rec.readyAt = Date.now() + 6000;
    gravar();
    return estado(rec);
  },

  /** `GET /generation/previews/{id}/`: um bloco da sebenta e 3 perguntas sobre o ficheiro do estudante. */
  async preview(previewId: string): Promise<PreviewContent> {
    apenasMock();
    await esperar();
    const rec = Object.values(db().jobs).find((r) => `p-${r.job.contentId}` === previewId);
    if (!rec) throw new Error("Prévia não encontrada.");
    return previaDe(rec);
  },

  async plans(): Promise<PassPlan[]> {
    apenasMock();
    await esperar(150);
    return PLANOS;
  },

  async createOrder(input: { contentId: string; planId: PassPlanId }): Promise<Order> {
    apenasMock();
    await esperar();
    const plano = PLANOS.find((p) => p.id === input.planId)!;
    const existente = Object.values(db().orders).find((o) => o.contentId === input.contentId && o.status !== "expired" && o.status !== "failed");
    if (existente) {
      existente.planId = input.planId;
      existente.amountKz = plano.priceKz;
      gravar();
      return semInterno(existente);
    }
    const o: OrderRec = { id: novoId("o"), contentId: input.contentId, planId: input.planId, amountKz: plano.priceKz, status: "pending" };
    db().orders[o.id] = o;
    gravar();
    return semInterno(o);
  },

  async order(id: string): Promise<Order> {
    apenasMock();
    await esperar(250);
    assentar();
    const o = db().orders[id];
    if (!o) throw new Error("Pedido não encontrado.");
    gravar();
    return semInterno(o);
  },

  /** Multicaixa Express: o pedido fica a aguardar a confirmação na app do cliente (simulada ao fim de 4,5 s). */
  async payExpress(orderId: string, phone: string): Promise<Order> {
    apenasMock();
    await esperar();
    if (!/^9\d{8}$/.test(phone)) throw new Error("Número Multicaixa Express inválido.");
    const o = db().orders[orderId];
    if (!o) throw new Error("Pedido não encontrado.");
    o.status = "awaiting_confirmation";
    o.paidAt = Date.now() + 4500;
    gravar();
    return semInterno(o);
  },

  /** Vouchers de teste: `KMB-TESTE` paga logo; `KMB-MANUAL` fica a aguardar confirmação manual. */
  async redeemVoucher(orderId: string, codigo: string): Promise<Order> {
    apenasMock();
    await esperar();
    const c = codigo.trim().toUpperCase();
    if (c !== "KMB-TESTE" && c !== "KMB-MANUAL") throw new Error("Voucher inválido ou já usado.");
    const o = db().orders[orderId];
    if (!o) throw new Error("Pedido não encontrado.");
    if (c === "KMB-TESTE") o.status = "paid";
    else {
      o.status = "awaiting_confirmation";
      o.paidAt = Date.now() + 20_000;
    }
    gravar();
    return semInterno(o);
  },

  /** Link para o encarregado pagar sem criar conta. */
  async guardianLink(orderId: string): Promise<GuardianLink> {
    apenasMock();
    await esperar();
    return { url: `${location.origin}/encarregado/${orderId}`, expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString() };
  },
};
