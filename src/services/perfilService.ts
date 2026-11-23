import { api } from "./api";
import { FLUXO_MOCKS } from "../lib/fluxoFlags";
import { hrefDaTrilha } from "./trilhaService";

/**
 * Perfil académico do estudante e onboarding (contrato do K1/K2/K4 do Anderson).
 * Os ecrãs só falam com este serviço: não sabem se os dados vêm da API ou do modo simulado.
 */

export type Intencao = "exam_prep" | "explore";
export type MinutosPorDia = 5 | 15 | 30 | 60;

export interface Instituicao {
  id: number;
  nome: string;
  sigla: string;
  provincia: string;
}

export interface Cadeira {
  id: number;
  nome: string;
  curso: string;
}

export interface PerfilEstudante {
  intent: Intencao | null;
  instituicao: Instituicao | null;
  instituicaoOutra: string;
  curso: string;
  ano: number | null;
  cadeiraFoco: Pick<Cadeira, "id" | "nome"> | null;
  minutosPorDia: MinutosPorDia | null;
  provincia: string;
  anoEntrada: number;
  onboardingConcluidoEm: string | null;
}

/** Campos que o onboarding grava (`PATCH /api/me/`); `concluir` marca `onboarding_completed_at`. */
export interface PerfilPatch {
  intent?: Intencao;
  instituicaoId?: number | null;
  instituicaoOutra?: string;
  curso?: string;
  ano?: number | null;
  cadeiraFocoId?: number | null;
  minutosPorDia?: MinutosPorDia;
  provincia?: string;
  concluir?: boolean;
}

/** As 21 províncias (divisão de 2024). */
export const PROVINCIAS: ReadonlyArray<{ id: string; nome: string }> = [
  ["bengo", "Bengo"], ["benguela", "Benguela"], ["bie", "Bié"], ["cabinda", "Cabinda"], ["cuando", "Cuando"],
  ["cuanza_norte", "Cuanza Norte"], ["cuanza_sul", "Cuanza Sul"], ["cubango", "Cubango"], ["cunene", "Cunene"],
  ["huambo", "Huambo"], ["huila", "Huíla"], ["icolo_e_bengo", "Icolo e Bengo"], ["luanda", "Luanda"],
  ["lunda_norte", "Lunda Norte"], ["lunda_sul", "Lunda Sul"], ["malanje", "Malanje"], ["moxico", "Moxico"],
  ["moxico_leste", "Moxico Leste"], ["namibe", "Namibe"], ["uige", "Uíge"], ["zaire", "Zaire"],
].map(([id, nome]) => ({ id, nome }));

/* ───────── API real ───────── */

interface RawPerfil {
  intent?: Intencao | null;
  instituicao?: Instituicao | null;
  instituicao_outra?: string | null;
  curso?: string | null;
  ano?: number | null;
  cadeira_foco?: { id: number; nome: string } | null;
  minutos_por_dia?: number | null;
  provincia?: string | null;
  ano_entrada?: number | null;
  onboarding_completed_at?: string | null;
}

const MINUTOS: ReadonlyArray<number> = [5, 15, 30, 60];

function mapear(raw: RawPerfil): PerfilEstudante {
  return {
    intent: raw.intent ?? null,
    instituicao: raw.instituicao ?? null,
    instituicaoOutra: raw.instituicao_outra ?? "",
    curso: raw.curso ?? "",
    ano: raw.ano ?? null,
    cadeiraFoco: raw.cadeira_foco ?? null,
    minutosPorDia: raw.minutos_por_dia && MINUTOS.includes(raw.minutos_por_dia) ? (raw.minutos_por_dia as MinutosPorDia) : null,
    provincia: raw.provincia ?? "",
    anoEntrada: raw.ano_entrada ?? new Date().getFullYear(),
    onboardingConcluidoEm: raw.onboarding_completed_at ?? null,
  };
}

function corpo(p: PerfilPatch): Record<string, unknown> {
  const c: Record<string, unknown> = {};
  if (p.intent !== undefined) c.intent = p.intent;
  if (p.instituicaoId !== undefined) c.instituicao = p.instituicaoId;
  if (p.instituicaoOutra !== undefined) c.instituicao_outra = p.instituicaoOutra;
  if (p.curso !== undefined) c.curso = p.curso;
  if (p.ano !== undefined) c.ano = p.ano;
  if (p.cadeiraFocoId !== undefined) c.cadeira_foco = p.cadeiraFocoId;
  if (p.minutosPorDia !== undefined) c.minutos_por_dia = p.minutosPorDia;
  if (p.provincia !== undefined) c.provincia = p.provincia;
  if (p.concluir) c.concluir = true;
  return c;
}

function lista<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  const r = (data as { results?: T[] } | null)?.results;
  return Array.isArray(r) ? r : [];
}

/* ───────── Modo simulado (só desenvolvimento, com VITE_FLUXO_MOCKS=true) ───────── */

const MOCK_INSTITUICOES: Instituicao[] = [
  { id: 1, nome: "Universidade Agostinho Neto", sigla: "UAN", provincia: "luanda" },
  { id: 2, nome: "Universidade Católica de Angola", sigla: "UCAN", provincia: "luanda" },
  { id: 3, nome: "Universidade Katyavala Bwila", sigla: "UKB", provincia: "benguela" },
];

const MOCK_CADEIRAS: Cadeira[] = [
  { id: 1, nome: "Direito Constitucional", curso: "Direito" },
  { id: 2, nome: "Introdução ao Direito", curso: "Direito" },
  { id: 3, nome: "Direito Civil I", curso: "Direito" },
  { id: 4, nome: "Estruturas de Dados", curso: "Engenharia Informática" },
  { id: 5, nome: "Programação Orientada a Objectos", curso: "Engenharia Informática" },
  { id: 6, nome: "Microeconomia", curso: "Economia" },
  { id: 7, nome: "Macroeconomia I", curso: "Economia" },
];

const chaveMock = (uid: string) => `kombinu:mock:perfil:${uid}`;

function perfilMockVazio(): PerfilEstudante {
  return {
    intent: null, instituicao: null, instituicaoOutra: "", curso: "", ano: null, cadeiraFoco: null,
    minutosPorDia: null, provincia: "", anoEntrada: new Date().getFullYear(), onboardingConcluidoEm: null,
  };
}

function lerMock(uid: string): PerfilEstudante {
  try {
    const bruto = localStorage.getItem(chaveMock(uid));
    return bruto ? { ...perfilMockVazio(), ...(JSON.parse(bruto) as PerfilEstudante) } : perfilMockVazio();
  } catch {
    return perfilMockVazio();
  }
}

function gravarMock(uid: string, p: PerfilEstudante) {
  try {
    localStorage.setItem(chaveMock(uid), JSON.stringify(p));
  } catch {
    /* sem armazenamento: o modo simulado só vale nesta sessão */
  }
}

const esperar = (ms = 150) => new Promise((r) => setTimeout(r, ms));

/* ───────── Primeira trilha ───────── */

export interface ProximoPasso {
  tipo: "trilha" | "simulado";
  titulo: string;
  href: string;
  /** Só no modo simulado: o ecrã avisa que é um exemplo. */
  exemplo?: boolean;
}

export const perfilService = {
  /** `GET /api/me/`. */
  async obter(uid: string): Promise<PerfilEstudante> {
    if (FLUXO_MOCKS) {
      await esperar();
      return lerMock(uid);
    }
    const { data } = await api.get<RawPerfil>("/me/");
    return mapear(data);
  },

  /** `PATCH /api/me/`: todos os campos são opcionais; `concluir` grava `onboarding_completed_at`. */
  async actualizar(uid: string, patch: PerfilPatch): Promise<PerfilEstudante> {
    if (FLUXO_MOCKS) {
      await esperar();
      const atual = lerMock(uid);
      const inst = patch.instituicaoId !== undefined ? (MOCK_INSTITUICOES.find((i) => i.id === patch.instituicaoId) ?? null) : atual.instituicao;
      const cad = patch.cadeiraFocoId !== undefined ? (MOCK_CADEIRAS.find((c) => c.id === patch.cadeiraFocoId) ?? null) : atual.cadeiraFoco;
      const novo: PerfilEstudante = {
        ...atual,
        intent: patch.intent ?? atual.intent,
        instituicao: inst,
        instituicaoOutra: patch.instituicaoOutra ?? atual.instituicaoOutra,
        curso: patch.curso ?? atual.curso,
        ano: patch.ano !== undefined ? patch.ano : atual.ano,
        cadeiraFoco: cad ? { id: cad.id, nome: cad.nome } : null,
        minutosPorDia: patch.minutosPorDia ?? atual.minutosPorDia,
        provincia: inst ? inst.provincia : (patch.provincia ?? atual.provincia),
        onboardingConcluidoEm: patch.concluir ? new Date().toISOString() : atual.onboardingConcluidoEm,
      };
      gravarMock(uid, novo);
      return novo;
    }
    const { data } = await api.patch<RawPerfil>("/me/", corpo(patch));
    return mapear(data);
  },

  /** `GET /api/instituicoes/`. */
  async instituicoes(): Promise<Instituicao[]> {
    if (FLUXO_MOCKS) return MOCK_INSTITUICOES;
    const { data } = await api.get("/instituicoes/");
    return lista<Instituicao>(data);
  },

  /** `GET /api/cadeiras/?curso=`; sem curso devolve o catálogo todo (para sugerir cursos). */
  async cadeiras(curso?: string): Promise<Cadeira[]> {
    if (FLUXO_MOCKS) return curso ? MOCK_CADEIRAS.filter((c) => c.curso.toLowerCase() === curso.trim().toLowerCase()) : MOCK_CADEIRAS;
    const { data } = await api.get("/cadeiras/", { params: curso ? { curso: curso.trim() } : undefined });
    return lista<Cadeira>(data);
  },

  /**
   * Primeiro passo de estudo da cadeira: uma trilha publicada (`GET /trilhas/?cadeira=`, K4) ou, se não
   * houver, um simulado dela (`GET /quizzes/?cadeira=`, K2). Devolve `null` se não há nada ou a API falha.
   */
  async primeiroPasso(cadeiraId: number): Promise<ProximoPasso | null> {
    if (FLUXO_MOCKS) {
      const nome = MOCK_CADEIRAS.find((c) => c.id === cadeiraId)?.nome ?? "a tua cadeira";
      return { tipo: "trilha", titulo: `Primeira trilha de ${nome}`, href: "/v2/trilhas", exemplo: true };
    }
    try {
      const trilhas = await api.get("/trilhas/", { params: { cadeira: cadeiraId } });
      const t = lista<{ id: string | number; title?: string; titulo?: string }>(trilhas.data)[0];
      if (t) return { tipo: "trilha", titulo: t.title ?? t.titulo ?? "Trilha", href: hrefDaTrilha(String(t.id)) };
      const quizzes = await api.get("/quizzes/", { params: { cadeira: cadeiraId } });
      const q = lista<{ id: string | number; title?: string; titulo?: string }>(quizzes.data)[0];
      if (q) return { tipo: "simulado", titulo: q.title ?? q.titulo ?? "Simulado", href: `/v2/desafio?quizId=${encodeURIComponent(String(q.id))}` };
    } catch {
      /* sem trilha ou simulado: o ecrã final propõe explorar */
    }
    return null;
  },
};
