import { api } from "./api";
import { Usuario, RegisterData } from "../types";

const API_URL = "/auth";

export const authService = {
  async login(email: string, senha: string): Promise<Usuario> {
    const response = await api.post(`${API_URL}/login/`, {
      email,
      password: senha,
    });

    const data = response.data;

    const access = data.access_token || data.access;
    const refresh = data.refresh_token || data.refresh;

    if (!access) {
      throw new Error("Token de acesso não foi retornado pelo backend");
    }

    localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);

    const user = data.user || data;

    return {
      id: String(user.id),
      nome: user.first_name || user.email?.split("@")[0],
      email: user.email,
      tipo: user.user_type === "creator" ? "criador" : "aprendiz",
      pontos: 0,
      nivel: 1,
      dataCriacao: new Date(),
    };
  },

  async register(data: RegisterData): Promise<Usuario> {
    const userTypeMap = {
      criador: "creator",
      aprendiz: "learner",
    };

    await api.post(`${API_URL}/register/`, {
      email: data.email,
      password: data.senha,
      first_name: data.nome,
      user_type: userTypeMap[data.tipo],
    });

    return this.login(data.email, data.senha);
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },
};