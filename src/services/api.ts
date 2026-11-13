import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { obterHeaderWorkspace } from "@/stores/workspaceStore";
import { workspaceService } from "./workspaceService";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

/** Rota de refresh do backend (`POST /api/auth/token/refresh/`; `VITE_API_URL` termina em `/api`). */
const REFRESH_PATH = "/auth/token/refresh/";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Falha do refresh que prova que a sessão acabou (sem token, ou recusado pelo backend). */
class SessaoExpiradaError extends Error {}

/**
 * Um único refresh em voo, partilhado por todos os pedidos que receberam 401 ao mesmo
 * tempo. O backend limita o refresh (429 acima de 30/min por IP), por isso nunca se
 * dispara mais do que um pedido de cada vez.
 */
let refreshEmCurso: Promise<string> | null = null;

async function pedirNovoAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new SessaoExpiradaError("Sem refresh token");

  try {
    // axios "nu": não passa pelos interceptors de `api`, evita ciclos de refresh.
    const response = await axios.post(`${BASE_URL}${REFRESH_PATH}`, { refresh: refreshToken });
    const novoAccess: string = response.data.access;
    localStorage.setItem("accessToken", novoAccess);
    if (response.data.refresh) {
      localStorage.setItem("refreshToken", response.data.refresh);
    }
    return novoAccess;
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    // 400/401/403: o refresh token foi recusado. 429, 5xx ou falha de rede não
    // significam sessão inválida: o utilizador mantém a sessão e pode tentar de novo.
    if (status === 400 || status === 401 || status === 403) {
      throw new SessaoExpiradaError("Refresh token recusado");
    }
    throw err;
  }
}

function obterNovoAccessToken(): Promise<string> {
  if (!refreshEmCurso) {
    refreshEmCurso = pedirNovoAccessToken().finally(() => {
      refreshEmCurso = null;
    });
  }
  return refreshEmCurso;
}

function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("kombinu_usuario");
  workspaceService.limpar();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

/** Rota do ecrã de troca obrigatória de senha. */
export const ROTA_TROCA_SENHA = "/trocar-senha";

function exigirTrocaDeSenha() {
  try {
    const guardado = localStorage.getItem("kombinu_usuario");
    if (guardado) {
      const usuario = JSON.parse(guardado);
      localStorage.setItem("kombinu_usuario", JSON.stringify({ ...usuario, mustChangePassword: true }));
    }
  } catch {
    // Dados locais ilegíveis: o redireccionamento por si só chega para bloquear a navegação.
  }
  if (!window.location.pathname.endsWith(ROTA_TROCA_SENHA)) {
    window.location.assign(ROTA_TROCA_SENHA);
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** Rotas de autenticação não levam contexto de workspace. */
const isRotaAuth = (url: string | undefined) => (url ?? "").includes("/auth/");

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const workspace = isRotaAuth(config.url) ? null : obterHeaderWorkspace();
  if (workspace) {
    config.headers["X-Workspace"] = workspace;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    // Pedidos de autenticação não accionam o refresh: um 401 no login são
    // credenciais erradas, não sessão expirada.
    const url = originalRequest?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/institutional/login") ||
      url.includes("/auth/password/change") ||
      url.includes(REFRESH_PATH);

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const novoToken = await obterNovoAccessToken();
        originalRequest.headers.Authorization = `Bearer ${novoToken}`;
        return api(originalRequest);
      } catch (err) {
        if (err instanceof SessaoExpiradaError) forceLogout();
        return Promise.reject(err);
      }
    }

    // 403 `password_change_required`: troca de senha obrigatória pendente (conta institucional).
    // Marca o utilizador e leva-o ao ecrã de troca; sem aviso de "sem permissão".
    if (error.response?.status === 403 && error.response.data?.code === "password_change_required") {
      exigirTrocaDeSenha();
      return Promise.reject(error);
    }

    // 403 = sem permissão para este recurso, não sessão inválida: informa, não termina a sessão.
    if (error.response?.status === 403) {
      // `id` fixo: vários pedidos em paralelo com 403 mostram um único aviso.
      toast.error("Não tens permissão para aceder a este recurso.", { id: "erro-403" });
    }

    return Promise.reject(error);
  }
);
