import type { Usuario } from "@/types";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { papelNoWorkspace } from "./workspaceInicial";

export const ROTA_TROCA_SENHA = "/trocar-senha";

/**
 * Ecrã inicial de cada papel, no desenho `/v2`. Dentro de uma escola manda o papel nela
 * (admin gere os membros, professor vai ao estúdio, estudante ao painel); no marketplace
 * manda o tipo da conta (criador ao estúdio, aprendiz ao painel).
 */
export function destinoPorPapel(
  usuario: Pick<Usuario, "tipo" | "memberships">,
  workspaceAtivo: string = useWorkspaceStore.getState().ativo,
): string {
  const papel = papelNoWorkspace(usuario.memberships, workspaceAtivo);
  if (papel === "admin") return "/v2/admin/membros";
  if (papel === "teacher") return "/v2/estudio/materiais";
  if (papel === "student") return "/v2/painel";
  if (usuario.tipo === "criador") return "/v2/estudio/materiais";
  if (usuario.tipo === "admin") return "/dashboard/admin";
  return "/v2/painel";
}

/**
 * Aceita só caminhos internos: o `from` vem do estado do router, mas nunca se confia
 * nele para sair da aplicação (`//host`, `https:`...) nem para voltar ao próprio login.
 */
function caminhoSeguro(from: unknown): string | null {
  if (typeof from !== "object" || from === null) return null;
  const { pathname, search } = from as { pathname?: unknown; search?: unknown };
  if (typeof pathname !== "string" || !pathname.startsWith("/") || pathname.startsWith("//")) return null;
  if (pathname === "/login" || pathname === "/register" || pathname === ROTA_TROCA_SENHA) return null;
  return pathname + (typeof search === "string" && search.startsWith("?") ? search : "");
}

/**
 * Destino depois de autenticar: a troca de senha obrigatória vem sempre primeiro;
 * depois o `from` guardado pelo `ProtectedRoute`, se existir; senão o ecrã do papel.
 */
export function destinoPosLogin(usuario: Usuario, from?: unknown): string {
  if (usuario.mustChangePassword) return ROTA_TROCA_SENHA;
  return caminhoSeguro(from) ?? destinoPorPapel(usuario);
}
