import axios from "axios";
import { api } from "./api";
import type {
  Survey,
  SurveyDraft,
  SurveyKind,
  SurveyListItem,
  SurveyOption,
  SurveyResult,
  SurveyState,
  SurveyTrigger,
} from "../features/survey/types";

type RawOption = { id?: unknown; label?: unknown; value?: unknown };

type RawSurvey = {
  id: string;
  decision?: string;
  kind: string;
  question: string;
  options?: RawOption[];
  faculty?: string;
  subject?: string;
  trigger: string;
  sampleTarget?: number;
  segmentSize?: number | null;
  state: string;
  closedAt?: string | null;
  hasVoted?: boolean;
};

type RawResult = {
  question: string;
  decision?: string;
  subject?: string;
  closedAt?: string | null;
  answers?: number;
  dismissed?: number;
  shown?: number;
  distribution?: Array<{ label: string; value: number }>;
  byYear?: Array<{ year: string; answers: number; topChoice: string; share: number }>;
};

export type PaginaEnquetes = {
  itens: SurveyListItem[];
  total: number;
  /** Próxima página (1-based), ou `null` na última. */
  proxima: number | null;
};

const KINDS: ReadonlyArray<SurveyKind> = ["escala", "escolha", "binaria"];
const TRIGGERS: ReadonlyArray<SurveyTrigger> = ["fim-simulado", "fim-leitura", "fim-modulo"];
const STATES: ReadonlyArray<SurveyState> = ["rascunho", "activa", "encerrada"];

const numero = (valor: unknown, omissao: number): number =>
  typeof valor === "number" && Number.isFinite(valor) ? valor : omissao;

/** As respostas vêm do backend (não confiáveis): valores fora do contrato caem em padrões seguros. */
function opcoes(raw: RawOption[] | undefined): SurveyOption[] {
  return (Array.isArray(raw) ? raw : []).map((o) => ({
    id: String(o.id ?? ""),
    label: String(o.label ?? ""),
    value: typeof o.value === "number" ? o.value : null,
  }));
}

const tipo = (v: string): SurveyKind => (KINDS.includes(v as SurveyKind) ? (v as SurveyKind) : "escolha");
const gatilho = (v: string): SurveyTrigger => (TRIGGERS.includes(v as SurveyTrigger) ? (v as SurveyTrigger) : "fim-simulado");
const estado = (v: string): SurveyState => (STATES.includes(v as SurveyState) ? (v as SurveyState) : "rascunho");

function mapearCriador(raw: RawSurvey): Survey {
  return {
    id: String(raw.id),
    decision: String(raw.decision ?? ""),
    kind: tipo(raw.kind),
    question: String(raw.question ?? ""),
    options: opcoes(raw.options),
    faculty: String(raw.faculty ?? ""),
    subject: String(raw.subject ?? ""),
    trigger: gatilho(raw.trigger),
    sampleTarget: numero(raw.sampleTarget, 0),
    segmentSize: numero(raw.segmentSize, 0),
    state: estado(raw.state),
    closedAt: raw.closedAt ?? null,
  };
}

function mapearVotante(raw: RawSurvey): SurveyListItem {
  return {
    id: String(raw.id),
    kind: tipo(raw.kind),
    question: String(raw.question ?? ""),
    faculty: String(raw.faculty ?? ""),
    subject: String(raw.subject ?? ""),
    trigger: gatilho(raw.trigger),
    state: estado(raw.state),
    options: opcoes(raw.options),
    hasVoted: raw.hasVoted === true,
  };
}

/**
 * Mensagem de uma falha de enquete. As regras de negócio (já votaste, enquete não activa)
 * chegam em `{ error }` com 409; sem permissão chega `{ detail }` com 403.
 */
export function mensagemErroEnquete(err: unknown, omissao: string): string {
  if (!axios.isAxiosError(err)) return omissao;
  const data = err.response?.data as { error?: unknown; detail?: unknown } | undefined;
  if (typeof data?.error === "string") return data.error;
  if (err.response?.status === 403 && typeof data?.detail === "string") return data.detail;
  return omissao;
}

export const surveyService = {
  /** Enquetes activas e encerradas do workspace activo, mais os rascunhos do próprio criador (20 por página). */
  async listar(pagina = 1): Promise<PaginaEnquetes> {
    const { data } = await api.get<{ count?: number; next?: string | null; results?: RawSurvey[] }>("/enquetes/", {
      params: { page: pagina },
    });
    const itens = Array.isArray(data?.results) ? data.results.map(mapearVotante) : [];
    return { itens, total: numero(data?.count, itens.length), proxima: data?.next ? pagina + 1 : null };
  },

  /** Cria um rascunho (`state: rascunho`); a API não tem edição: para alterar, cria-se outro. */
  async criar(draft: SurveyDraft): Promise<Survey> {
    const { data } = await api.post<RawSurvey>("/enquetes/", {
      decision: draft.decision.trim(),
      kind: draft.kind,
      question: draft.question.trim(),
      options: draft.options.map((o) => o.trim()),
      faculty: draft.faculty,
      subject: draft.subject,
      trigger: draft.trigger,
      sampleTarget: draft.sampleTarget,
      segmentSize: draft.segmentSize,
    });
    return mapearCriador(data);
  },

  /** Rascunho -> activa. Só o criador. */
  async publicar(id: string): Promise<Survey> {
    const { data } = await api.post<RawSurvey>(`/enquetes/${encodeURIComponent(id)}/publish/`);
    return mapearCriador(data);
  },

  /** Activa -> encerrada. Só o criador. */
  async fechar(id: string): Promise<Survey> {
    const { data } = await api.post<RawSurvey>(`/enquetes/${encodeURIComponent(id)}/close/`);
    return mapearCriador(data);
  },

  /** Regista o voto e devolve o XP ganho. 409 se já votou ou se a enquete não está activa. */
  async votar(id: string, optionId: string): Promise<{ xp: number }> {
    const { data } = await api.post<{ xpEarned?: number }>(`/enquetes/${encodeURIComponent(id)}/vote/`, { optionId });
    return { xp: numero(data?.xpEarned, 0) };
  },

  /** Resultados agregados, sem identidades. Só o criador (403 para os restantes). */
  async resultados(id: string): Promise<SurveyResult> {
    const { data } = await api.get<RawResult>(`/enquetes/${encodeURIComponent(id)}/results/`);
    return {
      question: String(data.question ?? ""),
      decision: String(data.decision ?? ""),
      subject: String(data.subject ?? ""),
      closedAt: data.closedAt ?? null,
      answers: numero(data.answers, 0),
      dismissed: numero(data.dismissed, 0),
      shown: numero(data.shown, 0),
      distribution: Array.isArray(data.distribution)
        ? data.distribution.map((d) => ({ label: String(d.label), value: numero(d.value, 0) }))
        : [],
      byYear: Array.isArray(data.byYear)
        ? data.byYear.map((y) => ({
            year: String(y.year),
            answers: numero(y.answers, 0),
            topChoice: String(y.topChoice),
            share: numero(y.share, 0),
          }))
        : [],
    };
  },
};
