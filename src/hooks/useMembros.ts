import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { memberService } from "../services/memberService";
import { useWorkspaceStore, WORKSPACE_MARKETPLACE } from "../stores/workspaceStore";

/** As chaves incluem o workspace: membros de uma escola nunca se misturam com os de outra. */
const chaves = {
  tudo: (workspace: string) => ["membros", workspace] as const,
  lista: (workspace: string) => ["membros", workspace, "lista"] as const,
};

/** Estudantes da escola activa. Só corre dentro de um workspace escolar (no marketplace não há membros). */
export function useListaMembros() {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useQuery({
    queryKey: chaves.lista(workspace),
    queryFn: () => memberService.listarMembros({ role: "student" }),
    enabled: usuario !== null && workspace !== WORKSPACE_MARKETPLACE,
    // Um 403 (sem papel de admin) não melhora ao repetir.
    retry: false,
  });
}

/** Invalida a lista de membros do workspace activo depois de uma alteração. */
export function useRefrescarMembros() {
  const queryClient = useQueryClient();
  const workspace = useWorkspaceStore((s) => s.ativo);
  return () => queryClient.invalidateQueries({ queryKey: chaves.tudo(workspace) });
}
