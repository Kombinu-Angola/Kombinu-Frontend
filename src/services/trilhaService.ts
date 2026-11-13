import axios from "axios";
import { api } from "./api";

/** Estado de uma trilha, derivado de `isPublished` e `archivedAt`. */
export type TrilhaStatus = "draft" | "published" | "archived";
export type TrilhaItemKind = "conteudo" | "quiz" | "enquete";
export type TrilhaItemEstado = "concluido" | "ativo" | "bloqueado";

export interface TrilhaItem {
  id: string;
  kind: TrilhaItemKind;
  /** UUID do conteúdo, quiz ou enquete. */
  targetId: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  minutos: number;
  xp: number;
  estado: TrilhaItemEstado;
  estrelas?: number;
  concluido: boolean;
}

export interface Trilha {
  id: string;
  titulo: string;
  /** `headline` do backend. */
  descricao: string;
  disciplina: string;
  ano: string;
  semestre: string;
  sequencial: boolean;
  status: TrilhaStatus;
  itens: TrilhaItem[];
  exameFinal: { titulo: string; minutos: number; xp: number; quizId: string } | null;
  progressoPercentual: number;
  itensConcluidos: number;
}

export interface CriarTrilhaPayload {
  titulo: string;
  descricao?: string;
  disciplina?: string;
  ano?: string;
  semestre?: string;
  sequencial?: boolean;
  exameFinalId?: string | null;
}

export interface AdicionarItemTrilhaPayload {
  kind: TrilhaItemKind;
  targetId: string;
  titulo?: string;
  descricao?: string;
  minutos?: number;
  xp?: number;
}

type RawNode = {
  id: string;
  order: number;
  title: string;
  summary?: string;
  minutes?: number;
  xp?: number;
  status: string;
  stars?: number;
  kind: string;
  targetId: string;
};

type RawTrilha = {
  id: string;
  subject?: string;
  title?: string;
  headline?: string;
  year?: string;
  semester?: string;
  nodes?: RawNode[];
  finalExam?: { title: string; minutes: number; xp: number; quizId: string } | null;
  progress?: { completed?: number; total?: number; percent?: number };
  isSequential?: boolean;
  isPublished?: boolean;
  archivedAt?: string | null;
};

const KINDS: ReadonlyArray<TrilhaItemKind> = ["conteudo", "quiz", "enquete"];
const ESTADOS: ReadonlyArray<TrilhaItemEstado> = ["concluido", "ativo", "bloqueado"];

const numero = (valor: unknown, omissao: number): number =>
  typeof valor === "number" && Number.isFinite(valor) ? valor : omissao;

/** O backend não é confiável: tudo o que sai do contrato cai num valor seguro. */
function mapearItem(raw: RawNode): TrilhaItem {
  const kind = KINDS.includes(raw.kind as TrilhaItemKind) ? (raw.kind as TrilhaItemKind) : "conteudo";
  const estado = ESTADOS.includes(raw.status as TrilhaItemEstado) ? (raw.status as TrilhaItemEstado) : "bloqueado";
  return {
    id: String(raw.id),
    kind,
    targetId: String(raw.targetId ?? ""),
    titulo: String(raw.title ?? ""),
    descricao: raw.summary ? String(raw.summary) : undefined,
    ordem: numero(raw.order, 0),
    minutos: numero(raw.minutes, 0),
    xp: numero(raw.xp, 0),
    estado,
    estrelas: typeof raw.stars === "number" ? raw.stars : undefined,
    concluido: estado === "concluido",
  };
}

function mapearTrilha(raw: RawTrilha): Trilha {
  const itens = (Array.isArray(raw.nodes) ? raw.nodes.map(mapearItem) : []).sort((a, b) => a.ordem - b.ordem);
  const status: TrilhaStatus = raw.archivedAt ? "archived" : raw.isPublished ? "published" : "draft";
  return {
    id: String(raw.id),
    titulo: String(raw.title ?? ""),
    descricao: String(raw.headline ?? ""),
    disciplina: String(raw.subject ?? ""),
    ano: String(raw.year ?? ""),
    semestre: String(raw.semester ?? ""),
    sequencial: raw.isSequential !== false,
    status,
    itens,
    exameFinal: raw.finalExam
      ? {
          titulo: String(raw.finalExam.title ?? ""),
          minutos: numero(raw.finalExam.minutes, 0),
          xp: numero(raw.finalExam.xp, 0),
          quizId: String(raw.finalExam.quizId ?? ""),
        }
      : null,
    progressoPercentual: numero(raw.progress?.percent, 0),
    itensConcluidos: numero(raw.progress?.completed, itens.filter((i) => i.concluido).length),
  };
}

/** Corpo de escrita (`TrilhaWriteSerializer`); só envia o que foi indicado. */
function corpoTrilha(p: Partial<CriarTrilhaPayload>) {
  return {
    ...(p.titulo !== undefined && { title: p.titulo }),
    ...(p.descricao !== undefined && { headline: p.descricao }),
    ...(p.disciplina !== undefined && { subject: p.disciplina }),
    ...(p.ano !== undefined && { year: p.ano }),
    ...(p.semestre !== undefined && { semester: p.semestre }),
    ...(p.sequencial !== undefined && { isSequential: p.sequencial }),
    ...(p.exameFinalId !== undefined && { finalExamId: p.exameFinalId }),
  };
}

/**
 * Rota do SPA de um passo (o backend só devolve `kind` + `targetId`). As rotas /v2 ainda não
 * têm `:id`, por isso o alvo e o contexto da trilha seguem em query string.
 */
export function hrefDoItem(item: Pick<TrilhaItem, "id" | "kind" | "targetId">, trilhaId: string): string {
  const contexto = `trilhaId=${encodeURIComponent(trilhaId)}&itemId=${encodeURIComponent(item.id)}`;
  if (item.kind === "quiz") return `/v2/desafio?id=${encodeURIComponent(item.targetId)}&${contexto}`;
  if (item.kind === "enquete") return `/v2/trilha?id=${encodeURIComponent(trilhaId)}`;
  return `/v2/cadeira?${contexto}`;
}

/** Rota do mapa de uma trilha. */
export const hrefDaTrilha = (trilhaId: string): string => `/v2/trilha?id=${encodeURIComponent(trilhaId)}`;

/** Mensagem legível de um erro da API (`{error}`, `{detail}` ou erros por campo). */
export function mensagemErroTrilha(err: unknown, omissao: string): string {
  if (!axios.isAxiosError(err)) return omissao;
  const dados = err.response?.data;
  if (typeof dados?.error === "string") return dados.error;
  if (typeof dados?.detail === "string") return dados.detail;
  if (dados && typeof dados === "object") {
    const primeira = Object.values(dados).find((v) => Array.isArray(v) && typeof v[0] === "string");
    if (Array.isArray(primeira)) return String(primeira[0]);
  }
  return omissao;
}

/** Conteúdo do criador que pode ser passo de uma trilha (artigo) ou ter um quiz (simulado). */
export interface AlvoDeTrilha {
  /** UUID do conteúdo (passo `conteudo`). */
  conteudoId: string;
  titulo: string;
  /** UUID do quiz do conteúdo (passo `quiz`), se existir. */
  quizId: string | null;
}

/**
 * Trilhas de aprendizagem. Tudo passa por `api`, que envia o token e o `X-Workspace` do
 * contexto activo; o backend filtra por workspace. Sem cache local: o estado vive no
 * react-query (ver `hooks/useTrilhas.ts`), com o workspace nas chaves.
 */
export const trilhaService = {
  /** Trilhas publicadas e visíveis no workspace, mais as do próprio criador. */
  async listarTrilhas(): Promise<Trilha[]> {
    const lista: Trilha[] = [];
    let pagina = 1;
    // Percorre as páginas (20 por página): o feed precisa da lista completa.
    for (;;) {
      const { data } = await api.get<{ results?: RawTrilha[]; next?: string | null } | RawTrilha[]>("/trilhas/", {
        params: { page: pagina },
      });
      const resultados = Array.isArray(data) ? data : (data?.results ?? []);
      lista.push(...resultados.map(mapearTrilha));
      if (Array.isArray(data) || !data?.next || pagina >= 10) break;
      pagina += 1;
    }
    return lista;
  },

  async obterTrilhaPorId(id: string): Promise<Trilha> {
    const { data } = await api.get<RawTrilha>(`/trilhas/${encodeURIComponent(id)}/`);
    return mapearTrilha(data);
  },

  /** Só itens de conteúdo se concluem à mão; quiz e enquete concluem-se sozinhos (409 se o passo anterior falta). */
  async concluirItemTrilha(itemId: string): Promise<void> {
    await api.post(`/trilhas/items/${encodeURIComponent(itemId)}/complete/`);
  },

  async criarTrilha(payload: CriarTrilhaPayload): Promise<Trilha> {
    const { data } = await api.post<RawTrilha>("/trilhas/", corpoTrilha(payload));
    return mapearTrilha(data);
  },

  async editarTrilha(id: string, payload: Partial<CriarTrilhaPayload>): Promise<Trilha> {
    const { data } = await api.patch<RawTrilha>(`/trilhas/${encodeURIComponent(id)}/`, corpoTrilha(payload));
    return mapearTrilha(data);
  },

  /** 409 se já há alunos com progresso: arquivar em vez de apagar. */
  async apagarTrilha(id: string): Promise<void> {
    await api.delete(`/trilhas/${encodeURIComponent(id)}/`);
  },

  async publicarTrilha(id: string): Promise<Trilha> {
    const { data } = await api.post<RawTrilha>(`/trilhas/${encodeURIComponent(id)}/publish/`);
    return mapearTrilha(data);
  },

  async arquivarTrilha(id: string): Promise<Trilha> {
    const { data } = await api.post<RawTrilha>(`/trilhas/${encodeURIComponent(id)}/archive/`);
    return mapearTrilha(data);
  },

  async desarquivarTrilha(id: string): Promise<Trilha> {
    const { data } = await api.post<RawTrilha>(`/trilhas/${encodeURIComponent(id)}/unarchive/`);
    return mapearTrilha(data);
  },

  /** Devolve a trilha completa já com o novo passo (o backend responde com a trilha). */
  async adicionarItem(trilhaId: string, payload: AdicionarItemTrilhaPayload): Promise<Trilha> {
    const { data } = await api.post<RawTrilha>(`/trilhas/${encodeURIComponent(trilhaId)}/items/`, {
      kind: payload.kind,
      targetId: payload.targetId,
      ...(payload.titulo && { titleOverride: payload.titulo }),
      ...(payload.descricao !== undefined && { summary: payload.descricao }),
      ...(payload.minutos !== undefined && { minutes: payload.minutos }),
      ...(payload.xp !== undefined && { xpReward: payload.xp }),
    });
    return mapearTrilha(data);
  },

  /** Só metadados do passo; para mudar o alvo remove-se o passo e adiciona-se outro. */
  async editarItem(
    trilhaId: string,
    itemId: string,
    payload: Pick<AdicionarItemTrilhaPayload, "titulo" | "descricao" | "minutos" | "xp">,
  ): Promise<void> {
    await api.patch(`/trilhas/${encodeURIComponent(trilhaId)}/items/${encodeURIComponent(itemId)}/`, {
      ...(payload.titulo !== undefined && { titleOverride: payload.titulo }),
      ...(payload.descricao !== undefined && { summary: payload.descricao }),
      ...(payload.minutos !== undefined && { minutes: payload.minutos }),
      ...(payload.xp !== undefined && { xpReward: payload.xp }),
    });
  },

  /** 409 se o passo já tem progresso de alunos. */
  async removerItem(trilhaId: string, itemId: string): Promise<void> {
    await api.delete(`/trilhas/${encodeURIComponent(trilhaId)}/items/${encodeURIComponent(itemId)}/`);
  },

  /** Envia todos os passos da trilha, cada um uma vez, pela nova ordem. */
  async reordenarItens(trilhaId: string, itemIds: string[]): Promise<Trilha> {
    const { data } = await api.post<RawTrilha>(`/trilhas/${encodeURIComponent(trilhaId)}/items/reorder/`, {
      itemIds,
    });
    return mapearTrilha(data);
  },

  /**
   * Conteúdos do criador no workspace activo, para escolher o alvo de um passo. O backend não
   * tem listagem de quizzes: cada conteúdo traz o `quiz_id` do seu quiz (ou nenhum).
   */
  async listarAlvos(criadorId: string): Promise<AlvoDeTrilha[]> {
    const { data } = await api.get<
      { results?: { id: string; title?: string; quiz_id?: string | null }[] } | { id: string; title?: string; quiz_id?: string | null }[]
    >("/contents/", { params: { creator: criadorId } });
    const lista = Array.isArray(data) ? data : (data?.results ?? []);
    return lista.map((c) => ({
      conteudoId: String(c.id),
      titulo: String(c.title ?? "Sem título"),
      quizId: c.quiz_id ? String(c.quiz_id) : null,
    }));
  },
};
