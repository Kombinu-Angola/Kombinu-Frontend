import type { CodigoErroLogin } from "../../services/authService";

/** Mensagem apresentada ao utilizador para cada falha de login. O 401 é sempre genérico por segurança. */
export const MENSAGENS_LOGIN: Record<CodigoErroLogin, string> = {
  credenciais: "Credenciais inválidas.",
  senha_temporaria_expirada:
    "A senha temporária expirou. Pede ao administrador da tua escola para a repor.",
  limite: "Demasiadas tentativas. Aguarda um momento e tenta de novo.",
  indisponivel: "Não foi possível entrar. Verifica a ligação e tenta de novo.",
};
