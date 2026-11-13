import { api } from "./api"; // <-- Usa a tua instância axios já autenticada (ou mantém axios se tiveres interceptor global)
import { API_BASE_URL } from "../utils/constants";

export type MemberRole = "student" | "teacher" | "admin";
export type MemberStatus = "active" | "inactive";

export interface SchoolMember {
  id: string;
  nome: string;
  email: string;
  numeroEstudante?: string;
  curso?: string;
  ano?: string;
  role: MemberRole;
  status: MemberStatus;
  ultimoAcesso?: string;
}

export interface BulkImportMemberRow {
  nome: string;
  email: string;
  numeroEstudante?: string;
  curso?: string;
  ano?: string;
}

export interface BulkImportResult {
  created: number;
  updated?: number;
  errors: Array<{ row?: number; email?: string; message: string }>;
}

export interface ListarMembrosParams {
  search?: string;
  status?: "all" | MemberStatus;
  role?: MemberRole;
}

// Evita /api/api/ caso API_BASE_URL já inclua /api
const cleanBase = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
const BASE_ENDPOINT = `${cleanBase}/api/tenancy/members`;

class MemberService {
  /** GET /api/tenancy/members/ */
  async listarMembros(params?: ListarMembrosParams): Promise<SchoolMember[]> {
    const query: Record<string, string> = {};
    if (params?.search?.trim()) query.search = params.search.trim();
    if (params?.status && params.status !== "all") {
      query.status = params.status;
      query.is_active = String(params.status === "active");
    }
    if (params?.role) query.role = params.role;

    const response = await api.get(`${BASE_ENDPOINT}/`, { params: query });
    const rawList = Array.isArray(response.data)
      ? response.data
      : response.data?.results || response.data?.members || [];

    return rawList.map((raw: any) => this.mapMemberFromApi(raw));
  }

  /** POST /api/tenancy/members/import/ */
  async importarEmLote(rows: BulkImportMemberRow[]): Promise<BulkImportResult> {
    const payload = rows.map((r) => ({
      name: r.nome,
      nome: r.nome,
      email: r.email,
      student_number: r.numeroEstudante,
      numero_estudante: r.numeroEstudante,
      course: r.curso,
      curso: r.curso,
      year: r.ano,
      ano: r.ano,
      role: "student",
    }));

    const response = await api.post(`${BASE_ENDPOINT}/import/`, {
      members: payload,
      items: payload,
    });

    const data = response.data || {};
    return {
      created: Number(data.created ?? data.imported ?? payload.length),
      updated: Number(data.updated ?? 0),
      errors: Array.isArray(data.errors) ? data.errors : [],
    };
  }

  /** Upload direto de ficheiro CSV caso o back-end aceite multipart */
  async importarCsvFile(file: File): Promise<BulkImportResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`${BASE_ENDPOINT}/import/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const data = response.data || {};
    return {
      created: Number(data.created ?? data.imported ?? 0),
      updated: Number(data.updated ?? 0),
      errors: Array.isArray(data.errors) ? data.errors : [],
    };
  }

  /** POST /api/tenancy/members/{id}/deactivate/ */
  async desactivarMembro(memberId: string): Promise<SchoolMember> {
    const response = await api.post(`${BASE_ENDPOINT}/${memberId}/deactivate/`);
    return this.mapMemberFromApi(response.data);
  }

  /** POST /api/tenancy/members/{id}/reactivate/ */
  async reactivarMembro(memberId: string): Promise<SchoolMember> {
    const response = await api.post(`${BASE_ENDPOINT}/${memberId}/reactivate/`);
    return this.mapMemberFromApi(response.data);
  }

  /** POST /api/tenancy/members/{id}/reset-password/ */
  async reporSenha(
    memberId: string,
  ): Promise<{ temporaryPassword?: string; detail?: string }> {
    const response = await api.post(
      `${BASE_ENDPOINT}/${memberId}/reset-password/`,
    );
    const data = response.data || {};
    return {
      temporaryPassword:
        data.temporary_password ?? data.temporaryPassword ?? data.password,
      detail: data.detail ?? data.message,
    };
  }

  /** Faz parsing de texto CSV/TSV colado ou lido de ficheiro */
  parseCsvText(rawText: string): BulkImportMemberRow[] {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return [];

    const separator = lines[0].includes(";") ? ";" : ",";
    const rows: BulkImportMemberRow[] = [];

    lines.forEach((line, index) => {
      const cols = line
        .split(separator)
        .map((c) => c.trim().replace(/^"|"$/g, ""));

      if (index === 0 && cols.some((c) => c.toLowerCase() === "email")) {
        return;
      }

      const emailIdx = cols.findIndex((c) => c.includes("@"));
      if (emailIdx === -1) return;

      const email = cols[emailIdx].toLowerCase();
      const nome =
        cols[emailIdx === 0 ? 1 : 0] ||
        email.split("@")[0].replace(/[._]/g, " ");
      const numeroEstudante = cols[2] || undefined;
      const curso = cols[3] || undefined;

      rows.push({ nome, email, numeroEstudante, curso });
    });

    return rows;
  }

  private mapMemberFromApi(raw: any): SchoolMember {
    const isActive =
      raw.is_active !== undefined
        ? Boolean(raw.is_active)
        : raw.status
          ? raw.status === "active"
          : true;

    return {
      id: String(raw.id),
      nome: raw.name || raw.full_name || raw.nome || raw.email || "Sem nome",
      email: raw.email || "",
      numeroEstudante:
        raw.student_number || raw.numero_estudante || raw.registration_number,
      curso: raw.course || raw.curso,
      ano: raw.year || raw.ano,
      role: raw.role || "student",
      status: isActive ? "active" : "inactive",
      ultimoAcesso: raw.last_login || raw.ultimo_acesso,
    };
  }
}

export const memberService = new MemberService();
