import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { surveyService } from "../services/surveyService";
import { useWorkspaceStore } from "../stores/workspaceStore";
import type { SurveyDraft } from "../features/survey/types";

/** As chaves incluem o workspace: enquetes do marketplace nunca se misturam com as da escola. */
const chaves = {
  tudo: (workspace: string) => ["enquetes", workspace] as const,
  lista: (workspace: string) => ["enquetes", workspace, "lista"] as const,
  resultados: (workspace: string, id: string) => ["enquetes", workspace, "resultados", id] as const,
};

/** Lista paginada (20 por página) das enquetes do workspace activo, da mais recente para a mais antiga. */
export function useListaEnquetes() {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useInfiniteQuery({
    queryKey: chaves.lista(workspace),
    queryFn: ({ pageParam }) => surveyService.listar(pageParam),
    initialPageParam: 1,
    getNextPageParam: (ultima) => ultima.proxima,
    enabled: usuario !== null,
  });
}

/** Resultados agregados de uma enquete (só o criador; os restantes recebem 403). */
export function useResultadosEnquete(id: string | null) {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useQuery({
    queryKey: chaves.resultados(workspace, id ?? ""),
    queryFn: () => surveyService.resultados(id as string),
    enabled: usuario !== null && id !== null,
    // Um 403 não melhora ao repetir.
    retry: false,
  });
}

/** Acções sobre enquetes; refrescam a lista e os resultados do workspace activo. */
export function useAccoesEnquetes() {
  const queryClient = useQueryClient();
  const workspace = useWorkspaceStore((s) => s.ativo);

  const refrescar = () => queryClient.invalidateQueries({ queryKey: chaves.tudo(workspace) });

  return {
    criar: async (draft: SurveyDraft) => {
      const enquete = await surveyService.criar(draft);
      await refrescar();
      return enquete;
    },
    publicar: async (id: string) => {
      const enquete = await surveyService.publicar(id);
      await refrescar();
      return enquete;
    },
    fechar: async (id: string) => {
      const enquete = await surveyService.fechar(id);
      await refrescar();
      return enquete;
    },
    votar: async (id: string, optionId: string) => {
      const voto = await surveyService.votar(id, optionId);
      await refrescar();
      return voto;
    },
  };
}
