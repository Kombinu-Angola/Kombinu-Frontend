import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { trilhaService } from "../services/trilhaService";
import { useWorkspaceStore } from "../stores/workspaceStore";

/** As chaves incluem o workspace: trilhas do marketplace nunca se misturam com as da escola. */
const chaves = {
  tudo: (workspace: string) => ["trilhas", workspace] as const,
  lista: (workspace: string) => ["trilhas", workspace, "lista"] as const,
  detalhe: (workspace: string, id: string) => ["trilhas", workspace, "detalhe", id] as const,
};

/** Trilhas visíveis no workspace activo (publicadas, mais as do próprio criador). */
export function useListaTrilhas() {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useQuery({
    queryKey: chaves.lista(workspace),
    queryFn: trilhaService.listarTrilhas,
    enabled: usuario !== null,
  });
}

/** Uma trilha com o estado dos passos calculado para o utilizador autenticado. */
export function useTrilha(id: string | null | undefined) {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useQuery({
    queryKey: chaves.detalhe(workspace, id ?? ""),
    queryFn: () => trilhaService.obterTrilhaPorId(id as string),
    enabled: usuario !== null && Boolean(id),
    // Um 404 (trilha de outro contexto) não melhora ao repetir.
    retry: false,
  });
}

/** Conteúdos do criador do workspace activo, para escolher o alvo de um passo no compositor. */
export function useAlvosDoCriador(activo: boolean) {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useQuery({
    queryKey: ["trilhas", workspace, "alvos", usuario?.id ?? ""],
    queryFn: () => trilhaService.listarAlvos(usuario?.id as string),
    enabled: activo && usuario !== null,
  });
}

/** Acções sobre trilhas; refrescam a lista e os detalhes do workspace activo. */
export function useAccoesTrilhas() {
  const queryClient = useQueryClient();
  const workspace = useWorkspaceStore((s) => s.ativo);

  const refrescar = () => queryClient.invalidateQueries({ queryKey: chaves.tudo(workspace) });
  return {
    /** Invalida lista e detalhes do workspace activo (chamar depois de qualquer alteração). */
    refrescar,
    concluirItem: async (itemId: string) => {
      await trilhaService.concluirItemTrilha(itemId);
      await refrescar();
    },
  };
}
