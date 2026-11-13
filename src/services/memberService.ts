import axios from "axios";
import { api } from "./api";

export type MemberRole = "student" | "teacher" | "admin";
export type MemberStatus = "active" | "inactive";

export interface SchoolMember {
  /** UUID da pertença (membership), usado nas acções. */
  id: string;
  /** Número de aluno atribuído pela escola. */
  numeroEstudante: string;
  nome: string;
  /** `null` nas contas que só entram pelo login institucional. */
  email: string | null;
  curso?: string;
  faculdade?: string;
  ano?: string;
  role: MemberRole;
  status: MemberStatus;
  /** A conta ainda tem a senha temporária. */
  senhaTemporaria: boolean;
}

/** Linha de importação (`student_code` é o único campo obrigatório). */
export interface BulkImportMemberRow {
  numeroEstudante: string;
  nome?: string;
  apelido?: string;
  curso?: string;
  faculdade?: string;
  ano?: string;
  email?: string;
}

export interface ContaProvisionada {
  numeroEstudante: string;
  nome: string;
  email: string | null;
  /** Só existe nesta resposta: não é guardada nem pode ser recuperada. */
  senhaTemporaria: string;
  expiraEm: string;
}

export interface ErroLinhaImportacao {
  /** Linha a contar a partir de 1 (linha de dados, sem cabeçalho). */
  linha: number;
  numeroEstudante: string;
  mensagens: string[];
}

export interface ResultadoValidacao {
  linhas: number;
  erros: ErroLinhaImportacao[];
}

export interface ResultadoImportacao {
  criadas: number;
  contas: ContaProvisionada[];
}

export interface ListarMembrosParams {
  search?: string;
  status?: "all" | MemberStatus;
  role?: MemberRole;
}

export interface SenhaReposta {
  numeroEstudante: string | null;
  senhaTemporaria: string;
  expiraEm: string;
}

type RawMember = {
  id: string;
  student_code?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  role?: string;
  academic_year?: string;
  faculty?: string;
  course?: string;
  is_active?: boolean;
  must_change_password?: boolean;
};

type RawRowError = { row?: number; student_code?: string; errors?: Record<string, string[]> };

const PAPEIS: ReadonlyArray<MemberRole> = ["student", "teacher", "admin"];

/** Importação recusada pelo backend: nada foi criado e as linhas com erro vêm identificadas. */
export class ErroImportacao extends Error {
  readonly erros: ErroLinhaImportacao[];

  constructor(erros: ErroLinhaImportacao[]) {
    super("Importação recusada");
    this.erros = erros;
  }
}

const texto = (valor: unknown): string => (typeof valor === "string" ? valor : "");

function mapearErros(raw: unknown): ErroLinhaImportacao[] {
  if (!Array.isArray(raw)) return [];
  return (raw as RawRowError[]).map((e) => ({
    linha: (typeof e.row === "number" ? e.row : 0) + 1,
    numeroEstudante: texto(e.student_code),
    mensagens: Object.entries(e.errors ?? {}).flatMap(([campo, msgs]) =>
      (Array.isArray(msgs) ? msgs : []).map((m) => `${campo}: ${String(m)}`),
    ),
  }));
}

/** O backend não é confiável: valores fora do contrato caem em padrões seguros. */
function mapearMembro(raw: RawMember): SchoolMember {
  const codigo = texto(raw.student_code);
  const nome = [texto(raw.first_name), texto(raw.last_name)].filter(Boolean).join(" ") || codigo || "Sem nome";
  return {
    id: String(raw.id),
    numeroEstudante: codigo,
    nome,
    email: raw.email ? String(raw.email) : null,
    curso: raw.course || undefined,
    faculdade: raw.faculty || undefined,
    ano: raw.academic_year || undefined,
    role: PAPEIS.includes(raw.role as MemberRole) ? (raw.role as MemberRole) : "student",
    status: raw.is_active === false ? "inactive" : "active",
    senhaTemporaria: raw.must_change_password === true,
  };
}

function corpoLinha(r: BulkImportMemberRow) {
  return {
    student_code: r.numeroEstudante,
    first_name: r.nome ?? "",
    last_name: r.apelido ?? "",
    role: "student",
    academic_year: r.ano ?? "",
    faculty: r.faculdade ?? "",
    course: r.curso ?? "",
    ...(r.email ? { email: r.email } : {}),
  };
}

/** Mensagem legível de um erro da API (`{error}` ou `{detail}`). */
export function mensagemErroMembros(err: unknown, omissao: string): string {
  if (!axios.isAxiosError(err)) return omissao;
  const dados = err.response?.data;
  if (typeof dados?.error === "string") return dados.error;
  if (typeof dados?.detail === "string") return dados.detail;
  return omissao;
}

/**
 * Gestão de membros da escola (só admin da organização activa). Tudo passa por `api`, que
 * envia o token e o `X-Workspace`; o backend valida o papel de admin e isola por organização.
 */
export const memberService = {
  /** Membros da organização activa (todas as páginas, 20 por página). */
  async listarMembros(params?: ListarMembrosParams): Promise<SchoolMember[]> {
    const filtros: Record<string, string> = {};
    if (params?.search?.trim()) filtros.search = params.search.trim();
    if (params?.status && params.status !== "all") filtros.is_active = String(params.status === "active");
    if (params?.role) filtros.role = params.role;

    const lista: SchoolMember[] = [];
    for (let pagina = 1; pagina <= 50; pagina += 1) {
      const { data } = await api.get<{ results?: RawMember[]; next?: string | null } | RawMember[]>(
        "/tenancy/members/",
        { params: { ...filtros, page: pagina } },
      );
      const resultados = Array.isArray(data) ? data : (data?.results ?? []);
      lista.push(...resultados.map(mapearMembro));
      if (Array.isArray(data) || !data?.next) break;
    }
    return lista;
  },

  /** Só valida (dry-run): devolve os erros por linha sem criar nada. */
  async validarLote(rows: BulkImportMemberRow[]): Promise<ResultadoValidacao> {
    try {
      const { data } = await api.post("/tenancy/members/bulk/", { dry_run: true, rows: rows.map(corpoLinha) });
      return { linhas: Number(data?.rows ?? rows.length), erros: mapearErros(data?.errors) };
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400 && Array.isArray(err.response.data?.errors)) {
        return { linhas: rows.length, erros: mapearErros(err.response.data.errors) };
      }
      throw err;
    }
  },

  /** Tudo ou nada: se uma linha falhar, nada é criado e lança `ErroImportacao`. */
  async importarEmLote(rows: BulkImportMemberRow[]): Promise<ResultadoImportacao> {
    try {
      const { data } = await api.post("/tenancy/members/bulk/", { dry_run: false, rows: rows.map(corpoLinha) });
      const contas = Array.isArray(data?.accounts) ? data.accounts : [];
      return {
        criadas: Number(data?.created ?? contas.length),
        contas: contas.map(
          (c: { student_code?: string; first_name?: string; last_name?: string; email?: string | null; temporary_password?: string; expires_at?: string }): ContaProvisionada => ({
            numeroEstudante: texto(c.student_code),
            nome: [texto(c.first_name), texto(c.last_name)].filter(Boolean).join(" ") || texto(c.student_code),
            email: c.email ? String(c.email) : null,
            senhaTemporaria: texto(c.temporary_password),
            expiraEm: texto(c.expires_at),
          }),
        ),
      };
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400 && Array.isArray(err.response.data?.errors)) {
        throw new ErroImportacao(mapearErros(err.response.data.errors));
      }
      throw err;
    }
  },

  async desactivarMembro(membroId: string): Promise<SchoolMember> {
    const { data } = await api.post<RawMember>(`/tenancy/members/${encodeURIComponent(membroId)}/deactivate/`);
    return mapearMembro(data);
  },

  async reactivarMembro(membroId: string): Promise<SchoolMember> {
    const { data } = await api.post<RawMember>(`/tenancy/members/${encodeURIComponent(membroId)}/reactivate/`);
    return mapearMembro(data);
  },

  /** Gera uma senha temporária nova (7 dias) e revoga as sessões da conta; só aparece nesta resposta. */
  async reporSenha(membroId: string): Promise<SenhaReposta> {
    const { data } = await api.post(`/tenancy/members/${encodeURIComponent(membroId)}/reset-password/`);
    return {
      numeroEstudante: data?.student_code ? String(data.student_code) : null,
      senhaTemporaria: texto(data?.temporary_password),
      expiraEm: texto(data?.expires_at),
    };
  },

  /**
   * Lê CSV/TSV colado ou carregado. Colunas, por ordem (cabeçalho opcional; `;` ou `,`):
   * número de aluno; nome; apelido; curso; faculdade; ano académico; email (opcional).
   */
  parseCsvText(rawText: string): BulkImportMemberRow[] {
    const linhas = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (linhas.length === 0) return [];

    const separador = linhas[0].includes(";") ? ";" : ",";
    const rows: BulkImportMemberRow[] = [];

    linhas.forEach((linha, indice) => {
      const cols = linha.split(separador).map((c) => c.trim().replace(/^"|"$/g, ""));
      const primeira = cols[0]?.toLowerCase() ?? "";
      if (indice === 0 && /(numero|número|codigo|código|student)/.test(primeira)) return;
      if (!cols[0]) return;

      rows.push({
        numeroEstudante: cols[0],
        nome: cols[1] || undefined,
        apelido: cols[2] || undefined,
        curso: cols[3] || undefined,
        faculdade: cols[4] || undefined,
        ano: cols[5] || undefined,
        email: cols[6]?.includes("@") ? cols[6].toLowerCase() : undefined,
      });
    });

    return rows;
  },
};
