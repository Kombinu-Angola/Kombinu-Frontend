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
}

const CHAVE_DB = "kombinu:mock:fluxo";
const CHAVE_CONSENT = "kombinu:mock:consentimento";

function lerDb(): Db {
  try {
    const bruto = localStorage.getItem(CHAVE_DB);
    if (bruto) return JSON.parse(bruto) as Db;
  } catch {
    /* sem armazenamento: o modo simulado só vale nesta sessão */
  }
  return { freeUsed: 0, hashes: [], jobs: {} };
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
};
