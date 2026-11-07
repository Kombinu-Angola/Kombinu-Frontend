import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

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
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    const isAuthEndpoint = url.includes("/auth/login") || url.includes(REFRESH_PATH);

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

    // 403 = sem permissão para este recurso, não sessão inválida: informa, não termina a sessão.
    if (error.response?.status === 403) {
      toast.error("Não tens permissão para aceder a este recurso.");
    }

    return Promise.reject(error);
  }
);
