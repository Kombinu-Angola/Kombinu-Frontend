import axios from "axios";
import { api } from "./api";
import type { Membership, Usuario, RegisterData } from "@/types";
import { workspaceService } from "./workspaceService";

const API_URL = "/auth";

const userTypeMap: Record<RegisterData["tipo"], string> = {
  criador: "creator",
  aprendiz: "learner",
};

const PAPEIS: ReadonlyArray<Membership["papel"]> = ["student", "teacher", "admin"];

export type CodigoErroLogin = "credenciais" | "senha_temporaria_expirada" | "limite" | "indisponivel";

/** Falha de login já traduzida; `codigo` decide a mensagem mostrada ao utilizador. */
export class ErroLogin extends Error {
  readonly codigo: CodigoErroLogin;
  /** Só no `limite`: segundos até poder tentar de novo (do `Retry-After` ou do texto do backend). */
  readonly esperaSegundos?: number;

  constructor(codigo: CodigoErroLogin, esperaSegundos?: number) {
    super(codigo);
    this.codigo = codigo;
    this.esperaSegundos = esperaSegundos;
  }
}

export type ErrosTrocaSenha = { senhaAtual?: string[]; novaSenha?: string[] };

/** Falha de validação da troca de senha, com os erros do backend por campo. */
export class ErroTrocaSenha extends Error {
  readonly erros: ErrosTrocaSenha;

  constructor(erros: ErrosTrocaSenha) {
    super("Troca de senha recusada");
    this.erros = erros;
  }
}

export type CamposRegisto = Partial<Record<"nome" | "email" | "senha" | "geral", string>>;

/** Registo recusado pelo backend: traz a mensagem de cada campo, já em português. */
export class ErroRegisto extends Error {
  readonly campos: CamposRegisto;

  constructor(campos: CamposRegisto) {
    super(Object.values(campos)[0] ?? "Registo recusado");
    this.campos = campos;
  }
}

const TRADUCOES_REGISTO: ReadonlyArray<[RegExp, string]> = [
  [/valid email/i, "Introduz um e-mail válido."],
  [/already exists|already registered|j[áa] (existe|est[áa] registado)/i, "Este e-mail já está registado."],
  [/may not be blank|is required|n[ãa]o pode ficar em branco/i, "Preenche este campo."],
  [/password.*(short|common|entirely numeric)/i, "Escolhe uma palavra-passe mais forte (pelo menos 8 caracteres, não demasiado comum)."],
];

/** Primeira mensagem de um campo do DRF (lista de textos ou texto), com as mensagens em inglês traduzidas. */
function mensagemDoCampo(valor: unknown): string | undefined {
  const bruto = Array.isArray(valor) ? valor.find((v): v is string => typeof v === "string") : typeof valor === "string" ? valor : undefined;
  if (!bruto) return undefined;
  return TRADUCOES_REGISTO.find(([re]) => re.test(bruto))?.[1] ?? bruto;
}

function traduzirErroRegisto(err: unknown): unknown {
  if (!axios.isAxiosError(err)) return err;
  const estado = err.response?.status;
  if (!err.response) return new ErroRegisto({ geral: "Não foi possível contactar o servidor. Verifica a ligação e tenta outra vez." });
  if (estado === 429) return new ErroRegisto({ geral: mensagemDoCampo(err.response.data?.detail) ?? "Demasiadas tentativas. Tenta novamente daqui a pouco." });
  if (estado && estado >= 500) return new ErroRegisto({ geral: "O servidor não respondeu. Tenta novamente dentro de instantes." });
  const d = err.response.data ?? {};
  const campos: CamposRegisto = {
    nome: mensagemDoCampo(d.first_name),
    email: mensagemDoCampo(d.email),
    senha: mensagemDoCampo(d.password),
    geral: mensagemDoCampo(d.non_field_errors) ?? mensagemDoCampo(d.ano_nascimento) ?? mensagemDoCampo(d.aceita_termos) ?? mensagemDoCampo(d.detail),
  };
  const preenchidos = Object.fromEntries(Object.entries(campos).filter(([, v]) => v)) as CamposRegisto;
  return new ErroRegisto(Object.keys(preenchidos).length ? preenchidos : { geral: "Não foi possível criar a conta. Verifica os dados e tenta outra vez." });
}

function traduzirErroLogin(err: unknown): ErroLogin {
  if (err instanceof ErroLogin) return err;
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      // O backend responde sempre com o mesmo 401 genérico; o código só aparece se o contrato o diferenciar.
      const expirada = err.response.data?.code === "temp_password_expired";
      return new ErroLogin(expirada ? "senha_temporaria_expirada" : "credenciais");
    }
    if (err.response?.status === 429) {
      // `Retry-After` só chega ao browser se o backend o expuser por CORS; o texto "dentro de N segundos" serve de reserva.
      const cabecalho = Number(err.response.headers?.["retry-after"]);
      const doTexto = Number(String(err.response.data?.detail ?? "").match(/(\d+)\s*segundo/i)?.[1]);
      const espera = [cabecalho, doTexto].find((n) => Number.isFinite(n) && n > 0);
      return new ErroLogin("limite", espera);
    }
  }
  return new ErroLogin("indisponivel");
}

const listaDeTextos = (valor: unknown): string[] | undefined =>
  Array.isArray(valor) ? valor.filter((v): v is string => typeof v === "string") : undefined;

/** As memberships vêm do backend (não confiável): descarta entradas malformadas. */
function mapearMemberships(raw: unknown): Membership[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((m): Membership[] => {
    const id = m?.organizacao_id;
    const papel = m?.role;
    if (typeof id !== "string" || !id || !PAPEIS.includes(papel)) return [];
    return [{ organizacaoId: id, nome: String(m.name ?? ""), codigo: String(m.code ?? ""), papel }];
  });
}

const texto = (valor: unknown): string | undefined => (typeof valor === "string" && valor ? valor : undefined);
const numero = (valor: unknown, omissao: number): number =>
  typeof valor === "number" && Number.isFinite(valor) ? valor : omissao;

/** Guarda os tokens e devolve o utilizador de uma resposta de login (email ou institucional). */
function processarLogin(data: Record<string, unknown>): Usuario {
  const access = texto(data.access_token) ?? texto(data.access);
  const refresh = texto(data.refresh_token) ?? texto(data.refresh);

  if (!access) {
    throw new Error("Token de acesso não foi retornado pelo backend");
  }

  localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);

  const user = (data.user ?? data) as Record<string, unknown>;

  const memberships = mapearMemberships(user.memberships);
  workspaceService.sincronizarMemberships(memberships);
  workspaceService.activarWorkspaceInicial(memberships);

  const email = texto(user.email) ?? null;

  return {
    id: String(user.id),
    nome: texto(user.nome) ?? texto(user.first_name) ?? email?.split("@")[0] ?? "Utilizador",
    email,
    memberships,
    mustChangePassword: user.must_change_password === true,
    tipo: user.user_type === "creator" ? "criador" : "aprendiz",
    pontos: numero(user.pontos, 0),
    nivel: numero(user.nivel, 1),
    dataCriacao: new Date(),
  };
}

export const authService = {
  async login(email: string, senha: string): Promise<Usuario> {
    try {
      const response = await api.post(`${API_URL}/login/`, {
        email,
        password: senha,
      });
      return processarLogin(response.data);
    } catch (err) {
      throw traduzirErroLogin(err);
    }
  },

  /** Login institucional: `codigoEscola` é o código curto da escola, não o UUID da organização. */
  async loginInstitucional(codigoEscola: string, codigoAluno: string, senha: string): Promise<Usuario> {
    try {
      const response = await api.post(`${API_URL}/institutional/login/`, {
        school_code: codigoEscola.trim(),
        student_code: codigoAluno.trim(),
        password: senha,
      });
      const usuario = processarLogin(response.data);
      workspaceService.activarEscolaPorCodigo(codigoEscola);
      return usuario;
    } catch (err) {
      throw traduzirErroLogin(err);
    }
  },

  /**
   * Troca a senha da conta autenticada. O backend devolve tokens novos e invalida os
   * anteriores, por isso os tokens guardados são substituídos antes de qualquer outro pedido.
   */
  async trocarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    try {
      const { data } = await api.post(`${API_URL}/password/change/`, {
        current_password: senhaAtual,
        new_password: novaSenha,
      });
      const access = data?.access_token;
      const refresh = data?.refresh_token;
      if (typeof access !== "string" || typeof refresh !== "string") {
        throw new Error("Tokens em falta na resposta da troca de senha");
      }
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const dados = err.response.data;
        throw new ErroTrocaSenha({
          senhaAtual: listaDeTextos(dados?.current_password),
          novaSenha: listaDeTextos(dados?.new_password),
        });
      }
      throw err;
    }
  },

  async register(data: RegisterData): Promise<Usuario> {
    try {
      await api.post(`${API_URL}/register/`, {
        email: data.email,
        password: data.senha,
        first_name: data.nome,
        user_type: userTypeMap[data.tipo],
        ano_nascimento: data.anoNascimento,
        aceita_termos: data.aceitaTermos,
        marketing_opt_in: data.marketingOptIn ?? false,
      });
    } catch (err) {
      throw traduzirErroRegisto(err);
    }

    return this.login(data.email, data.senha);
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    workspaceService.limpar();
  },

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },
};
